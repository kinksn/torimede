// import { postIdSchema } from "@/app/api/post/model";
import { idWithBrandSchema } from "@/lib/util/entity";
import { z } from "zod";

export const userIdSchema = idWithBrandSchema("UserId");
export type UserId = z.infer<typeof userIdSchema>;

export const userNameSchema = z
  .string()
  .min(1, "1文字以上入力してください")
  .max(15, "15文字以内で入力してください");

export const userSchema = z.object({
  id: userIdSchema,
  name: z.string(),
  email: z.string().email(),
  image: z.string(),
  isAdmin: z.boolean(),
});

export const getUserProfileSchema = z.object({
  id: userIdSchema,
  name: z.string(),
  image: z.string(),
  oAuthProfileImage: z.string().nullish(),
});
export type GetUserProfile = z.infer<typeof getUserProfileSchema>;

// TODO: postIdSchemaをimportしたいが循環参照でエラーになる
const postIdSchema = idWithBrandSchema("PostId");
export const getUserPostsSchema = z.array(
  z.object({
    id: postIdSchema,
    userId: userIdSchema,
    image: z.string(),
  })
);

export const getUserOutputSchema = z.object({
  profile: getUserProfileSchema,
  posts: getUserPostsSchema,
  cutedPosts: getUserPostsSchema,
});
export type GetUserOutput = z.infer<typeof getUserOutputSchema>;

export const updateUserInputSchema = z.object({
  name: userNameSchema.optional(),
  image: z.string().optional(),
  isFirstLogin: z.boolean().optional(),
});
export type UpdateUserInput = z.infer<typeof updateUserInputSchema>;

export const updateUserNameSchema = z.object({
  userId: userIdSchema,
  name: userNameSchema,
});
export type UpdateUserName = z.infer<typeof updateUserNameSchema>;

export const updateUserImageSchema = z.object({
  userId: userIdSchema,
  image: z.string(),
});
export type UpdateUserImage = z.infer<typeof updateUserImageSchema>;

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
export type SignUpForm = z.infer<typeof signUpFormSchema>;

export const loginFormSchema = z
  .object({
    email: z.string().email("メールアドレスの形式で入力してください"),
    password: z.string().min(6, "6文字以上入力してください"),
  })
  .strict();
export type LoginForm = z.infer<typeof loginFormSchema>;
