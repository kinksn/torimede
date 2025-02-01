import { userIdSchema } from "@/app/api/user/model";
import { z } from "zod";

// TODO: idWidthBrandSchema("TagId")にする
export const tagIdSchema = z.string();

const tagNameSchema = z.string().min(1, "1文字以上入力してください");

export const tagSchema = z.object({
  id: tagIdSchema,
  name: tagNameSchema,
  userId: userIdSchema,
});
export type Tag = z.infer<typeof tagSchema>;

export const tagCreateInputSchema = z.object({
  name: tagNameSchema,
});
export type TagCreateInput = z.infer<typeof tagCreateInputSchema>;

export const tagUpdateInputSchema = z.object({
  name: tagNameSchema,
  userId: userIdSchema,
});
export type TagUpdateInput = z.infer<typeof tagUpdateInputSchema>;
