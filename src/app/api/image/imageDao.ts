import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/lib/aws/s3Client";
import { generateUniqueFileName } from "@/lib/aws/utils";

export async function uploadFileToS3(fileBuffer: Buffer, fileType: string) {
  const uniqueFileName = generateUniqueFileName(fileType);
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
