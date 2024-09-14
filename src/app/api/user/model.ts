import { postIdSchema } from "@/app/api/post/model";
import { idWithBrandSchema } from "@/lib/util/entity";
import { z } from "zod";

export const userIdSchema = idWithBrandSchema("UserId");
export type UserId = z.infer<typeof userIdSchema>;

export const getUserProfileSchema = z.object({
  id: userIdSchema,
  name: z.string(),
  image: z.string().url(),
});
export type GetUserProfile = z.infer<typeof getUserProfileSchema>;

export const getUserPostsSchema = z.array(
  z.object({
    id: postIdSchema,
    userId: userIdSchema,
    image: z.string().url(),
  })
);

export const getUserOutputSchema = z.object({
  profile: getUserProfileSchema,
  posts: getUserPostsSchema,
  cutedPosts: getUserPostsSchema,
});
export type GetUserOutput = z.infer<typeof getUserOutputSchema>;

export const updateUserInputSchema = z.object({
  name: z.string().min(1).max(15).optional(),
  isFirstLogin: z.boolean().optional(),
});
export type UpdateUserInput = z.infer<typeof updateUserInputSchema>;

export const updateUserNameSchema = z.object({
  name: updateUserInputSchema.shape.name,
  userId: userIdSchema,
});
export type UpdateUserName = z.infer<typeof updateUserNameSchema>;

export const updateUserIsFirstLoginSchema = z.object({
  isFirstLogin: updateUserInputSchema.shape.isFirstLogin,
  userId: userIdSchema,
});
export type UpdateUserIsFirstLogin = z.infer<
  typeof updateUserIsFirstLoginSchema
>;

export const signUpFormSchema = z
  .object({
    name: z.string().min(1, "1文字以上入力してください"),
    email: z.string().email("メールアドレスの形式で入力してください"),
    password: z.string().min(6, "6文字以上入力してください"),
  })
  .strict();
