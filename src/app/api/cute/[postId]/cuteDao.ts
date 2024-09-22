import { db } from "@/lib/db";
import { handleDaoError } from "@/lib/api/daoUtil";
import {
  CreateCute,
  getCuteCountByPostIdOutputSchema,
  getCuteCountByUserIdOutputSchema,
} from "@/app/api/cute/[postId]/model";
import { PostId } from "@/app/api/post/model";
import { PrismaClient } from "@prisma/client";
import { UserId } from "@/app/api/user/model";

export const createManyCute = async ({
  postId,
  userId,
  cuteCount,
}: CreateCute) =>
  handleDaoError(
    { errorMessage: "database error by createManyCute" },
    async () => {
      const query = Array.from({ length: cuteCount }, () => ({
        postId,
        userId,
      }));

      const data = await db.$transaction(async (prisma: PrismaClient) => {
        return await prisma.cute.createMany({
          data: query,
        });
      });

      if (!data || data.count === 0) {
        throw new Error("failed to add cutes in the database");
      }
    }
  );

export const getCuteCountByPostId = async ({ postId }: { postId: PostId }) =>
  handleDaoError(
    { errorMessage: "database error by getCuteCountByPostId" },
    async () => {
      const query = {
        where: {
          postId,
        },
      };

      const data = await db.cute.count(query);

      return getCuteCountByPostIdOutputSchema.parse(data);
    }
  );

export const getCuteCountByUserId = async ({
  postId,
  userId,
}: {
  postId: PostId;
  userId: UserId;
}) =>
  handleDaoError(
    { errorMessage: "database error by getCuteCountByPostId" },
    async () => {
      const query = {
        where: {
          postId,
          userId,
        },
      };

      const data = await db.cute.count(query);

      return getCuteCountByUserIdOutputSchema.parse(data);
    }
  );
