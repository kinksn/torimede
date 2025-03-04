import { db } from "@/lib/db";
import { handleDaoError } from "@/lib/api/daoUtil";
import {
  getPostByPostIdInputSchema,
  getPostByPostIdOutputSchema,
  postIdSchema,
  PostId,
} from "@/app/api/post/model";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY!,
  },
});

export const getPostByPostId = async ({ postId }: { postId: PostId }) =>
  handleDaoError(
    {
      errorMessage: "database error by getPostByPostId",
    },
    async () => {
      const parsedPostId = getPostByPostIdInputSchema.parse(postId);
      const query = {
        where: {
          id: parsedPostId,
        },
        include: {
          images: true,
        },
      };
      const data = await db.post.findFirst(query);
      const parsedData = getPostByPostIdOutputSchema.parse(data);
      return parsedData;
    }
  );

const deleteImageFromS3 = async (imageUrl: string) => {
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

export const deletePostByPostId = async ({ postId }: { postId: PostId }) =>
  handleDaoError(
    {
      errorMessage: "database error by deletePostByPostId",
    },
    async () => {
      const post = await getPostByPostId({ postId });
      const { images } = post;

      if (images.length > 0) {
        await Promise.all(images.map((image) => deleteImageFromS3(image.url)));
      }

      const parsedPostId = postIdSchema.parse(postId);
      const query = {
        where: {
          id: parsedPostId,
        },
      };
      await db.post.delete(query);
    }
  );
