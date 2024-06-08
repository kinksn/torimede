import { z } from "zod";
import NextAuth from "next-auth";

export type FormInputPost = {
  title: string;
  content: string;
  tagId?: string;
};

export type Tag = {
  id: string;
  name: string;
};

export type Login = {
  email: string;
  password: string;
};

export type SignUp = {
  email: string;
  password: string;
  name: string;
};

// 型の拡張
declare module "next-auth" {
  interface Session {
    user?: {
      name: string | null;
      email?: string | null;
      image?: string | null;
      isAdmin: boolean; // ここにisAdminを追加
    };
  }

  interface User {
    isAdmin: boolean; // ここにisAdminを追加
  }

  interface JWT {
    isAdmin: boolean; // ここにisAdminを追加
  }
}
