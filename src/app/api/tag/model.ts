import { userIdSchema } from "@/app/api/user/model";
import { z } from "zod";

// TODO: idWidthBrandSchema("TagId")にする
export const tagIdSchema = z.string();

export const tagSchema = z.object({
  id: tagIdSchema,
  name: z.string().min(1),
  userId: userIdSchema,
});
export type Tag = z.infer<typeof tagSchema>;

export const tagCreateInputSchema = z.object({
  name: z.string().min(1),
});
export type TagCreateInput = z.infer<typeof tagCreateInputSchema>;

export const tagUpdateInputSchema = z.object({
  name: z.string().min(1),
  userId: userIdSchema,
});
export type TagUpdateInput = z.infer<typeof tagUpdateInputSchema>;
