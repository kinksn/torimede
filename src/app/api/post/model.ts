import { cuteSchema } from "@/app/api/cute/[postId]/model";
import { uploadPostImageSchema } from "@/app/api/post/upload/model";
import { tagIdSchema, tagSchema } from "@/app/api/tag/model";
import { userIdSchema, userSchema } from "@/app/api/user/model";
import { idWithBrandSchema } from "@/lib/util/entity";
import { z } from "zod";

export const postIdSchema = idWithBrandSchema("PostId");
export type PostId = z.infer<typeof postIdSchema>;

export const getPostByPostIdInputSchema = postIdSchema;
export type GetPostByPostIdInput = z.infer<typeof getPostByPostIdInputSchema>;

export const getPostByPostIdOutputSchema = z.object({
  id: postIdSchema,
  title: z.string(),
  content: z.string().optional(),
  image: z.string(),
  userId: userIdSchema,
});
export type GetPostByPostIdOutput = z.infer<typeof getPostByPostIdOutputSchema>;

export const updatePostBodySchema = z.object({
  title: z.string().min(2, "タイトルは2文字以上入力してください"),
  content: z.string().optional(),
  userId: userIdSchema,
  tags: z.array(z.union([tagIdSchema, tagSchema])),
});

export const createPostSchema = z.object({
  title: z.string().min(2, "タイトルは2文字以上入力してください"),
  content: z.string().optional(),
  image: uploadPostImageSchema,
  tags: z.array(tagIdSchema),
});

export const editPostSchema = z.object({
  title: z.string().min(2, "タイトルは2文字以上入力してください"),
  content: z.string().optional(),
  image: z.string().url(),
  tags: z.array(tagSchema),
  userId: userIdSchema,
});
export type EditPost = z.infer<typeof editPostSchema>;

export const createPostBodySchema = z.object({
  title: z.string().min(2, "タイトルは2文字以上入力してください"),
  content: z.string().optional(),
  image: z.string().url(),
  tags: z.array(tagIdSchema),
});

export const getPostSelectTagsSchema = z.object({
  id: postIdSchema,
  title: z.string(),
  content: z.string().optional(),
  image: z.string(),
  userId: userIdSchema,
  tags: z.array(
    z.object({
      tag: tagSchema,
    })
  ),
});
export type GetPostSelectTags = z.infer<typeof getPostSelectTagsSchema>;

export const getPostSelectTagsOutputSchema = z.object({
  id: postIdSchema,
  title: z.string(),
  content: z.string().optional(),
  image: z.string(),
  userId: userIdSchema,
  tags: z.array(
    z.object({
      tag: tagSchema,
    })
  ),
});
export type GetPostSelectTagsOutput = z.infer<
  typeof getPostSelectTagsOutputSchema
>;

export const getPostOutputSchema = z.object({
  posts: z.array(
    z.object({
      id: postIdSchema,
      title: z.string(),
      content: z.string().optional(),
      image: z.string(),
      userId: userIdSchema,
      tags: z.array(tagSchema),
    })
  ),
  metaData: z.object({
    lastCursor: postIdSchema,
    hasNextPage: z.boolean(),
  }),
});
export type GetPostOutput = z.infer<typeof getPostOutputSchema>;

export const getPostDetailOutputSchema = z.object({
  id: postIdSchema,
  title: z.string(),
  content: z.string().optional(),
  image: z.string(),
  userId: userIdSchema,
  tags: z.array(tagSchema),
  user: userSchema,
  cutes: z.array(cuteSchema),
});
export type GetPostDetailOutput = z.infer<typeof getPostDetailOutputSchema>;

export const getUserPostsOutputSchema = z.array(
  z.object({
    id: postIdSchema,
    title: z.string(),
    content: z.string().optional(),
    image: z.string(),
    userId: userIdSchema,
    tags: z.array(tagSchema),
    cutes: z.array(cuteSchema),
  })
);
export type GetUserPostsOutput = z.infer<typeof getUserPostsOutputSchema>;
