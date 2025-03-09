import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";
import {
  ACCEPT_IMAGE_TYPES,
  MAX_IMAGE_SIZE,
} from "@/app/api/post/upload/model";
import { processImage } from "@/app/api/post/upload/imageProcessor";

const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY!,
  },
});

// ファイルバッファからハッシュを生成しそれをファイル名として使用する
// これにより、同じファイル内容から同じUUIDが生成される
const generateHash = (buffer: Buffer) => {
  return crypto.createHash("sha256").update(buffer).digest("hex");
};

const generateUniqueFileName = (buffer: Buffer, fileType: string) => {
  const hash = generateHash(buffer);
  const timestamp = Date.now();
  const extension = fileType.split("/")[1];
  return `${hash}-${timestamp}-${extension}`;
};

async function uploadFileToS3(fileBuffer: Buffer, fileType: string) {
  const uniqueFileName = generateUniqueFileName(fileBuffer, fileType);
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: uniqueFileName,
    Body: fileBuffer,
    ContentType: fileType,
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);
  return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${uniqueFileName}`;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { error: "File is required and must be a valid file." },
        { status: 400 }
      );
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileType = file.type;

    if (!ACCEPT_IMAGE_TYPES.includes(fileType)) {
      return NextResponse.json(
        { error: "File type not allowed." },
        { status: 400 }
      );
    }

    if (fileBuffer.length > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { error: "File size limit exceeded." },
        { status: 400 }
      );
    }

    // 画像圧縮処理
    const { buffer: processedBuffer, mimeType: processedType } =
      await processImage(fileBuffer, fileType);

    const fileUrl = await uploadFileToS3(processedBuffer, processedType);

    return NextResponse.json({ success: true, fileUrl });
  } catch (error) {
    return NextResponse.json(
      { error: `Upload could not be completed: ${error}` },
      { status: 500 }
    );
  }
}
