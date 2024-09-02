import { TagIdSchema, TagObjectSchema } from "@/app/api/tag/model";
import { z } from "zod";

export const UpdatePostBodySchema = z.object({
  title: z.string(),
  content: z.string().optional(),
  userId: z.string(),
  tags: z.array(z.union([TagIdSchema, TagObjectSchema])),
});

export const CreatePostBodySchema = z.object({
  title: z.string(),
  content: z.string().optional(),
  image: z.string(),
  tags: z.array(TagIdSchema),
});

export const GetPostSelectTagsSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string().optional(),
  image: z.string(),
  userId: z.string(),
  tags: z.array(
    z.object({
      tag: TagObjectSchema,
    })
  ),
});
export type GetPostSelectTags = z.infer<typeof GetPostSelectTagsSchema>;

export const GetPostOutputSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string().optional(),
  image: z.string(),
  userId: z.string(),
  tags: z.array(TagObjectSchema),
});
export type GetPostOutput = z.infer<typeof GetPostOutputSchema>;
