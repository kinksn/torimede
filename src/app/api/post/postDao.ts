import { db } from "@/lib/db";
import { handleDaoError } from "@/lib/api/daoUtil";
import {
  getPostByPostIdInputSchema,
  getPostByPostIdOutputSchema,
  postIdSchema,
  PostId,
} from "@/app/api/post/model";
import { deleteImageFromS3 } from "@/app/api/upload/image/imageDao";

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
