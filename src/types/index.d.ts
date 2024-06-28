import { z } from "zod";
import NextAuth from "next-auth";
import { Post } from "@prisma/client";

export type FormInputPost = {
  title: string;
  content: string;
  image?: string;
  tagId?: string;
  userId?: string;
};

export type Tag = {
  id: string;
  name: string;
};

export type PostAddRelationFields = Post & {
  tag?: Tag;
  image?: string;
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
      id: string | null;
    };
  }

  interface User {
    isAdmin: boolean; // ここにisAdminを追加
  }

  interface JWT {
    isAdmin: boolean; // ここにisAdminを追加
  }
}
