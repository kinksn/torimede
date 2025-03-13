import crypto from "crypto";
import {
  S3Client,
  DeleteObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

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

export async function uploadFileToS3(fileBuffer: Buffer, fileType: string) {
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

export const deleteImageFromS3 = async (imageUrl: string) => {
  const imageKey = imageUrl.split("/").pop();
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: imageKey,
  };
  const command = new DeleteObjectCommand(params);
  try {
    await s3Client.send(command);
  } catch (error) {
    console.error("An error occurred while deleting an image from S3:", error);
    throw new Error("Failed to delete image");
  }
};
