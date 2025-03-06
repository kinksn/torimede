import { db } from "@/lib/db";
import { handleDaoError } from "@/lib/api/daoUtil";
import {
  CreateMede,
  getUserMedeCountForPostSchema,
} from "@/app/api/mede/[postId]/model";
import { PostId } from "@/app/api/post/model";
import { UserId } from "@/app/api/user/model";

export const createManyMede = async ({
  postId,
  userId,
  medeCount,
}: CreateMede) =>
  handleDaoError(
    { errorMessage: "database error by createManyMede" },
    async () => {
      const query = Array.from({ length: medeCount }, () => ({
        postId,
        userId,
      }));

      const data = await db.mede.createMany({
        data: query,
      });

      if (!data || data.count === 0) {
        throw new Error("failed to add medes in the database");
      }
    }
  );

export const getUserMedeCountForPost = async ({
  postId,
  userId,
}: {
  postId: PostId;
  userId: UserId;
}) =>
  handleDaoError(
    { errorMessage: "database error by getUserMedeCountForPost" },
    async () => {
      const query = {
        where: {
          postId,
          userId,
        },
      };

      const data = await db.mede.count(query);

      return getUserMedeCountForPostSchema.parse(data);
    }
  );
