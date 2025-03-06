import { postImageIdSchema } from "@/app/api/_common/model/id";
import { medeSchema } from "@/app/api/mede/[postId]/model";
import { ACCEPT_IMAGE_TYPES } from "@/app/api/post/upload/model";
import { tagIdSchema, tagSchema } from "@/app/api/tag/model";
import { userIdSchema, userSchema } from "@/app/api/user/model";
import { idWithBrandSchema } from "@/lib/util/entity";
import { z } from "zod";

export const postIdSchema = idWithBrandSchema("PostId");
export type PostId = z.infer<typeof postIdSchema>;

export const getPostByPostIdInputSchema = postIdSchema;
export type GetPostByPostIdInput = z.infer<typeof getPostByPostIdInputSchema>;

export const postImagesSchema = z.object({
  id: postImageIdSchema,
  postId: postIdSchema,
  url: z.string(),
  alt: z.string().optional(),
});
export type PostImage = z.infer<typeof postImagesSchema>;

export const getPostByPostIdOutputSchema = z.object({
  id: postIdSchema,
  title: z.string(),
  content: z.string().optional(),
  images: postImagesSchema.array(),
  userId: userIdSchema,
});
export type GetPostByPostIdOutput = z.infer<typeof getPostByPostIdOutputSchema>;

export const updatePostBodySchema = z.object({
  title: z
    .string()
    .min(2, "タイトルは2文字以上入力してください")
    .max(50, "タイトルは50文字以内で入力してください"),
  content: z
    .string()
    .max(400, "投稿内容は400文字以内で入力してください")
    .optional(),
  userId: userIdSchema,
  tags: z.array(z.union([tagIdSchema, tagSchema])),
});

export const createPostSchema = z.object({
  title: z
    .string()
    .min(2, "タイトルは2文字以上入力してください")
    .max(50, "タイトルは50文字以内で入力してください"),
  content: z
    .string()
    .max(400, "投稿内容は400文字以内で入力してください")
    .optional(),
  images: z
    .array(z.instanceof(File))
    .nonempty("画像を設定してください")
    .refine(
      (files) => files.every((file) => ACCEPT_IMAGE_TYPES.includes(file.type)),
      {
        message: "拡張子（png,jpg,jpeg,gif）のファイルを設定してください",
      }
    ),
  tags: z.array(tagIdSchema),
});

export const editPostSchema = z.object({
  title: z.string().min(2, "タイトルは2文字以上入力してください"),
  content: z.string().optional(),
  images: z.array(
    z.object({
      url: z.string(),
      alt: z.string().optional(),
    })
  ),
  tags: z.array(tagSchema),
  userId: userIdSchema,
});
export type EditPost = z.infer<typeof editPostSchema>;

export const createPostBodySchema = z.object({
  title: z.string().min(2, "タイトルは2文字以上入力してください"),
  content: z.string().optional(),
  images: z.array(
    z.object({
      url: z.string(),
      alt: z.string().optional(),
    })
  ),
  tags: z.array(tagIdSchema),
});

export const getPostSelectTagsSchema = z.object({
  id: postIdSchema,
  title: z.string(),
  content: z.string().optional(),
  images: postImagesSchema.array(),
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
  images: postImagesSchema.array(),
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
      images: postImagesSchema.array(),
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
  images: postImagesSchema.array(),
  userId: userIdSchema,
  tags: z.array(tagSchema),
  user: userSchema,
  medes: z.array(medeSchema),
});
export type GetPostDetailOutput = z.infer<typeof getPostDetailOutputSchema>;

export const getUserPostsOutputSchema = z.array(
  z.object({
    id: postIdSchema,
    title: z.string(),
    content: z.string().optional(),
    images: postImagesSchema.array(),
    userId: userIdSchema,
    tags: z.array(tagSchema),
    medes: z.array(medeSchema),
  })
);
export type GetUserPostsOutput = z.infer<typeof getUserPostsOutputSchema>;
