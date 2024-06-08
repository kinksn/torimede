import { z } from "zod";

export const signUpFormSchema = z
  .object({
    name: z.string().min(1, "1文字以上入力してください"),
    email: z.string().email("メールアドレスの形式で入力してください"),
    password: z.string().min(6, "6文字以上入力してください"),
  })
  .strict();
