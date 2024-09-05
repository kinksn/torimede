import { db } from "@/lib/db";
import {
  getUserPostsSchema,
  getUserProfileSchema,
  UserId,
} from "@/app/api/user/model";
import { unique } from "@/lib/util/unique";
import { Post } from "@prisma/client";
import { handleDaoError } from "@/lib/api/daoUtil";

type ParsedCutedPost = {
  id: string;
  postId: string;
  createdAt: Date;
  post: Post;
};

type InputUserId = {
  userId: UserId;
};

export const USER_NOTFOUND_MESSAGE = "user not found";

export const getUserProfileByUserId = async ({ userId }: InputUserId) =>
  handleDaoError(
    { errorMessage: "database error by getUserProfileByUserId" },
    async () => {
      const data = await db.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!data) {
        throw new Error(USER_NOTFOUND_MESSAGE);
      }

      return getUserProfileSchema.parse(data);
    }
  );

export const getUserPostsByUserId = async ({ userId }: InputUserId) =>
  handleDaoError(
    { errorMessage: "database error by getUserPostsByUserId" },
    async () => {
      const data = await db.post.findMany({
        where: {
          userId,
        },
      });

      if (!data) {
        throw new Error(USER_NOTFOUND_MESSAGE);
      }

      return getUserPostsSchema.parse(data);
    }
  );

export const getUserCutedPostsByUserId = async ({ userId }: InputUserId) =>
  handleDaoError(
    { errorMessage: "database error by getUserCutedPostsByUserId" },
    async () => {
      const data = await db.cute.findMany({
        where: {
          post: {
            userId, // CuteされたPostのuserIdでフィルタ
          },
        },
        include: {
          post: true,
        },
      });

      if (!data) {
        throw new Error(USER_NOTFOUND_MESSAGE);
      }

      return unique(
        getUserPostsSchema.parse(data.map((post: ParsedCutedPost) => post.post))
      );
    }
  );
