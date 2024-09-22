import { db } from "@/lib/db";
import { handleDaoError } from "@/lib/api/daoUtil";
import {
  getPostByPostIdInputSchema,
  getPostByPostIdOutputSchema,
  PostId,
} from "@/app/api/post/model";

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
      };
      const data = await db.post.findFirst(query);
      return getPostByPostIdOutputSchema.parse(data);
    }
  );
