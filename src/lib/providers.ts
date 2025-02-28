// lib/providers.ts
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "@/lib/db";
import GoogleProvider from "next-auth/providers/google";
import LINE from "@auth/core/providers/line";
import Twitter from "@auth/core/providers/twitter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const providers = [
  GoogleProvider({
    clientId: process.env.GOOGLE_ID!,
    clientSecret: process.env.GOOGLE_SECRET!,
    // profile: async (profile) => {
    //   // サインイン時のプロファイル処理
    //   const user = await db.user.findUnique({
    //     where: { email: profile.email },
    //   });

    //   if (!user) {
    //     return {
    //       id: profile.sub,
    //       name: profile.name,
    //       email: profile.email,
    //       image: profile.picture,
    //       oAuthProfileImage: profile.picture,
    //       isFirstLogin: true,
    //       isAdmin: false,
    //     };
    //   }

    //   // OAuth画像の更新処理
    //   if (user && user.oAuthProfileImage !== profile.picture) {
    //     try {
    //       await db.user.update({
    //         where: { email: profile.email },
    //         data: { oAuthProfileImage: profile.picture },
    //       });
    //     } catch (error) {
    //       console.error("Failed to update oAuthProfileImage:", error);
    //     }
    //   }

    //   return {
    //     id: profile.sub,
    //     name: user.name || profile.name,
    //     email: profile.email,
    //     image: user.image || profile.picture,
    //     oAuthProfileImage: user.oAuthProfileImage || profile.picture,
    //     isFirstLogin: user.isFirstLogin || false,
    //     isAdmin: user.isAdmin || false,
    //   };
    // },
  }),
  LINE({
    clientId: process.env.LINE_CLIENT_ID!,
    clientSecret: process.env.LINE_CLIENT_SECRET!,
    checks: ["state"],
    // profile: async (profile) => {
    //   // LINE特有のプロファイル処理
    //   const email = profile.email;

    //   const user = await db.user.findUnique({
    //     where: { email },
    //   });

    //   return {
    //     id: profile.sub,
    //     name: user?.name || profile.name,
    //     email: email,
    //     image: user?.image || profile.picture,
    //     oAuthProfileImage: "",
    //     isFirstLogin: user?.isFirstLogin || false,
    //     isAdmin: user?.isAdmin || false,
    //   };
    // },
  }) as any,
  Twitter({
    clientId: process.env.TWITTER_CLIENT_ID!,
    clientSecret: process.env.TWITTER_CLIENT_SECRET!,
    // profile: async (profile) => {
    //   // 既存ユーザを探す。なければ user は null
    //   const user = await db.user.findFirst({
    //     where: {
    //       accounts: {
    //         some: {
    //           provider: "twitter",
    //           providerAccountId: profile.data.id,
    //         },
    //       },
    //     },
    //   });

    //   // 既存ユーザがある場合は user.id、ない場合は「まだDBに存在しない」ので null or 空文字でOK
    //   const userId = user?.id ?? null;

    //   return {
    //     // まだDB上に存在しないユーザなので、idは null or "" を返しておく
    //     // NextAuth はこの返り値をもとに "まだないなら新規作成" の処理を進めます。
    //     id: userId,

    //     // name は User モデルで必須なので、必ず埋める
    //     // 既存ユーザがあれば user.name、なければ Twitter 表示名を使う
    //     name: user?.name ?? profile.data.name,

    //     // Twitterはメールアドレスを取得できないことが多いので、既存レコードがない場合は空文字に
    //     email: user?.email ?? "",

    //     // プロフィール画像がない（or 更新したい）なら Twitter 側のURLを使う
    //     image: user?.image ?? profile.data.profile_image_url,
    //     oAuthProfileImage:
    //       user?.oAuthProfileImage ?? profile.data.profile_image_url,

    //     // 初回ログインかどうかの判定など、お好みで
    //     isFirstLogin: user?.isFirstLogin ?? true,
    //     isAdmin: user?.isAdmin ?? false,
    //   };
    // },
  }),
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "text" },
      password: { label: "Password", type: "password" },
    },
    authorize: async (credentials) => {
      if (!credentials) {
        return null;
      }

      const user = await db.user.findUnique({
        where: { email: credentials.email },
      });

      if (user && user.password) {
        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        if (isValid) {
          // 認証情報を含めて返す
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            oAuthProfileImage: user.oAuthProfileImage,
            isFirstLogin: user.isFirstLogin,
            isAdmin: user.isAdmin || false,
          };
        }
      }
      return null;
    },
  }),
];

export const authAdapter = PrismaAdapter(db);
