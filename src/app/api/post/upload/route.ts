import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";

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

const allowedFileTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"];

async function uploadFileToS3(fileBuffer: Buffer, fileType: string) {
  const uniqueFileName = generateHash(fileBuffer);
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

    if (!allowedFileTypes.includes(fileType)) {
      return NextResponse.json(
        { error: "File type not allowed." },
        { status: 400 }
      );
    }

    const fileUrl = await uploadFileToS3(fileBuffer, fileType);

    return NextResponse.json({ success: true, fileUrl });
  } catch (error) {
    return NextResponse.json(
      { error: `Upload could not be completed: ${error}` },
      { status: 500 }
    );
  }
}
