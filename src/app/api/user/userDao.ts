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
import { getPostsSelectMedesOutputSchema } from "@/app/api/post/model";
import { KIRA_POST_MEDE_COUNT_THRESHOLD } from "@/lib/constants/limits";

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

export const getKiraPostsByUserId = async ({ userId }: InputUserId) =>
  handleDaoError(
    { errorMessage: "database error by getKiraPostsByUserId" },
    async () => {
      // TODO: Prismaのバージョンを上げれば_countを指定して、
      const data = await db.post.findMany({
        where: {
          userId,
        },
        include: {
          images: true,
          medes: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (!data) {
        throw new Error(USER_NOTFOUND_MESSAGE);
      }

      const parsedData = getPostsSelectMedesOutputSchema.parse(data);
      const filterdData = parsedData.filter(
        (post) => post.medes.length >= KIRA_POST_MEDE_COUNT_THRESHOLD
      );

      return getUserPostsSchema.parse(filterdData);
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

const JST_HOURS_OFFSET = 9;
export const getUserDailyPostCount = async ({ userId }: InputUserId) =>
  handleDaoError(
    { errorMessage: "database error by getUserDailyPostCount" },
    async () => {
      const jstNow = new Date();
      jstNow.setHours(jstNow.getHours() + JST_HOURS_OFFSET);

      // 日本時間での当日の0時0分0秒を計算
      const jstToday = new Date(
        jstNow.getFullYear(),
        jstNow.getMonth(),
        jstNow.getDate(),
        0,
        0,
        0
      );

      // 日本時間の0時0分0秒をUTCに戻す（DBクエリ用）
      const utcStartOfJstDay = new Date(jstToday);
      utcStartOfJstDay.setHours(utcStartOfJstDay.getHours() - JST_HOURS_OFFSET);

      // 当日（日本時間基準）の投稿数をカウント
      const count = await db.post.count({
        where: {
          userId,
          createdAt: {
            gte: utcStartOfJstDay,
          },
        },
      });

      return count;
    }
  );
