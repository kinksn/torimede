// lib/auth.config.ts
import type { NextAuthConfig } from "next-auth";
import { UserId } from "@/app/api/user/model";
import { db } from "@/lib/db";

export const authConfig = {
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      // 1. 初回サインイン時 (user がある場合)
      if (user) {
        // user.id が PrismaAdapter で作成された User レコードの id
        token.sub = user.id;
        token.isAdmin = user.isAdmin || false;
        token.isFirstLogin = user.isFirstLogin || false;
        token.name = user.name || "";
        token.image = user.image || token.picture;
        token.email = user.email || ""; // Twitterなら空になるケースが多い
      }

      // 2. フロントから session.update() を呼んだ (trigger === "update")、
      //    または「user がいない (2回目以降のリクエスト) だけど token.sub がある」場合に
      //    DBの最新データを再取得してトークンを更新する。
      if (trigger === "update" || (!user && token.sub)) {
        try {
          // node環境 (サーバーサイド) でのみ動かす
          if (
            typeof window === "undefined" &&
            process.env.NEXT_RUNTIME !== "edge"
          ) {
            // token.sub (DB の User.id) を元にユーザー再取得
            const userFromDb = await db.user.findUnique({
              where: { id: token.sub },
            });
            if (userFromDb) {
              // OAuth プロフィール画像の更新が必要かチェック
              // (token.picture はNextAuthがOAuth情報として持ってる)
              if (userFromDb.oAuthProfileImage !== token.picture) {
                try {
                  await db.user.update({
                    where: { id: userFromDb.id },
                    data: { oAuthProfileImage: token.picture },
                  });
                } catch (error) {
                  console.error("Failed to update oAuthProfileImage:", error);
                }
              }
              // DBの最新情報をトークンに反映
              token.isAdmin = userFromDb.isAdmin;
              token.isFirstLogin = userFromDb.isFirstLogin;
              token.name = userFromDb.name;
              // DBに画像があればそちら優先。なければ token.picture
              token.image = userFromDb.image ?? token.picture;
              // もし email も何らかの理由で更新したいなら
              token.email = userFromDb.email || token.email;
            }
          }
        } catch (error) {
          console.error("Failed to update token with DB data:", error);
        }
      }

      return token;
    },
    async session({ token, session }) {
      if (token && session.user) {
        session.user.isAdmin = !!token.isAdmin;
        session.user.isFirstLogin = !!token.isFirstLogin;
        session.user.image = token.image as string;
        session.user.oAuthProfileImage = token.picture as string;
        session.user.id = token.sub as UserId;
        session.user.name = (token.name as string) || "";
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
