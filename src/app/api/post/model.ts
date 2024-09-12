import { uploadPostImageSchema } from "@/app/api/post/upload/model";
import { tagIdSchema, tagObjectSchema } from "@/app/api/tag/model";
import { idWithBrandSchema } from "@/lib/util/entity";
import { z } from "zod";

export const postIdSchema = idWithBrandSchema("PostId");
export type PostId = z.infer<typeof postIdSchema>;

export const updatePostBodySchema = z.object({
  title: z.string().min(2, "タイトルは2文字以上入力してください"),
  content: z.string().optional(),
  userId: z.string(),
  tags: z.array(z.union([tagIdSchema, tagObjectSchema])),
});

export const createPostSchema = z.object({
  title: z.string().min(2, "タイトルは2文字以上入力してください"),
  content: z.string().optional(),
  image: uploadPostImageSchema,
  tags: z.array(tagIdSchema),
});

export const createPostBodySchema = z.object({
  title: z.string().min(2, "タイトルは2文字以上入力してください"),
  content: z.string().optional(),
  image: z.string().url(),
  tags: z.array(tagIdSchema),
});

export const getPostSelectTagsSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string().optional(),
  image: z.string(),
  userId: z.string(),
  tags: z.array(
    z.object({
      tag: tagObjectSchema,
    })
  ),
});
export type GetPostSelectTags = z.infer<typeof getPostSelectTagsSchema>;

export const getPostOutputSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string().optional(),
  image: z.string(),
  userId: z.string(),
  tags: z.array(tagObjectSchema),
});
export type GetPostOutput = z.infer<typeof getPostOutputSchema>;
