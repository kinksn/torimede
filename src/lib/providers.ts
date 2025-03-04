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
  }),
  LINE({
    clientId: process.env.LINE_CLIENT_ID!,
    clientSecret: process.env.LINE_CLIENT_SECRET!,
    checks: ["state"],
  }) as any,
  Twitter({
    clientId: process.env.TWITTER_CLIENT_ID!,
    clientSecret: process.env.TWITTER_CLIENT_SECRET!,
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
