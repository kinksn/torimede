import { z } from "zod";
import NextAuth from "next-auth";
import { Post } from "@prisma/client";

export type FormInputPost = {
  title: string;
  content?: string;
  image?: string;
  tags: Tag[];
  userId?: string;
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
      isAdmin: boolean;
      isFirstLogin: boolean;
      id: string | null;
    };
  }

  interface User {
    isAdmin: boolean;
    isFirstLogin: boolean;
  }

  interface JWT {
    isAdmin: boolean;
    isFirstLogin: boolean;
  }
}
