import { db } from "@/lib/db";
import {
  getUserPostsSchema,
  getUserProfileSchema,
  UpdateUserImage,
  UpdateUserIsFirstLogin,
  UpdateUserName,
  UpdateUserUploadProfileImage,
  UserId,
} from "@/app/api/user/model";
import { unique } from "@/lib/util/unique";
import { Post } from "@prisma/client";
import { handleDaoError } from "@/lib/api/daoUtil";

type ParsedMededPost = {
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
      const data = await db.user.findUnique({
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
        include: {
          images: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (!data) {
        throw new Error(USER_NOTFOUND_MESSAGE);
      }

      return getUserPostsSchema.parse(data);
    }
  );

export const getUserMededPostsByUserId = async ({ userId }: InputUserId) =>
  handleDaoError(
    { errorMessage: "database error by getUserMededPostsByUserId" },
    async () => {
      const data = await db.mede.findMany({
        where: {
          userId,
        },
        include: {
          post: {
            include: {
              images: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (!data) {
        throw new Error(USER_NOTFOUND_MESSAGE);
      }

      return unique(
        getUserPostsSchema.parse(data.map((post: ParsedMededPost) => post.post))
      );
    }
  );

export const updateUserName = async ({ name, userId }: UpdateUserName) =>
  handleDaoError(
    { errorMessage: "database error by updateUserName" },
    async () => {
      const data = await db.user.update({
        where: {
          id: userId,
        },
        data: {
          name,
        },
      });

      if (!data) {
        throw new Error("failed to update user name in the database");
      }
    }
  );

export const updateUserUploadProfileImage = async ({
  uploadProfileImage,
  userId,
}: UpdateUserUploadProfileImage) =>
  handleDaoError(
    { errorMessage: "database error by updateUserUploadProfileImage" },
    async () => {
      const data = await db.user.update({
        where: {
          id: userId,
        },
        data: {
          uploadProfileImage,
        },
      });

      if (!data) {
        throw new Error(
          "failed to update user upload profile image in the database"
        );
      }
    }
  );

export const updateUserImage = async ({ image, userId }: UpdateUserImage) =>
  handleDaoError(
    { errorMessage: "database error by updateUserImage" },
    async () => {
      const data = await db.user.update({
        where: {
          id: userId,
        },
        data: {
          image,
        },
      });

      if (!data) {
        throw new Error("failed to update user image in the database");
      }
    }
  );

export const updateUserIsFirstLogin = async ({
  isFirstLogin,
  userId,
}: UpdateUserIsFirstLogin) =>
  handleDaoError(
    { errorMessage: "database error by updateUserIsFirstLogin" },
    async () => {
      const data = await db.user.update({
        where: {
          id: userId,
        },
        data: {
          isFirstLogin,
        },
      });

      if (!data) {
        throw new Error("failed to update user isFirstLogin in the database");
      }
    }
  );
