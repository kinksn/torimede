import { postImageIdSchema } from "@/app/api/_common/model/id";
import { uploadImageSchema } from "@/app/api/image/model";
import { medeSchema } from "@/app/api/mede/[postId]/model";
import { tagIdSchema, tagSchema } from "@/app/api/tag/model";
import { userIdSchema, userSchema } from "@/app/api/user/model";
import { MAX_POST_TAG_COUNT } from "@/lib/constants/limits";
import { idWithBrandSchema } from "@/lib/util/entity";
import { ReportReason } from "@prisma/client";
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
  tags: z
    .array(z.union([tagIdSchema, tagSchema]))
    .max(MAX_POST_TAG_COUNT, `タグの設定は最大${MAX_POST_TAG_COUNT}個までです`),
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
  images: uploadImageSchema,
  tags: z
    .array(tagIdSchema)
    .max(MAX_POST_TAG_COUNT, `タグの設定は最大${MAX_POST_TAG_COUNT}個までです`),
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
  tags: z
    .array(tagSchema)
    .max(MAX_POST_TAG_COUNT, `タグの設定は最大${MAX_POST_TAG_COUNT}個までです`),
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
  tags: z
    .array(tagIdSchema)
    .max(MAX_POST_TAG_COUNT, `タグの設定は最大${MAX_POST_TAG_COUNT}個までです`),
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

export const getPostsSelectMedesOutputSchema = z.array(
  z.object({
    id: postIdSchema,
    title: z.string(),
    content: z.string().optional(),
    images: postImagesSchema.array(),
    userId: userIdSchema,
    medes: z.array(medeSchema),
  })
);
export type GetPostsSelectMedesOutput = z.infer<
  typeof getPostsSelectMedesOutputSchema
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

const postReportReasonEnumSchema = z.nativeEnum(ReportReason, {
  errorMap: () => ({ message: "項目を選択してください" }),
});
export type PostReportReasonEnum = z.infer<typeof postReportReasonEnumSchema>;

export const postReportInputSchema = z.object({
  reason: postReportReasonEnumSchema,
  content: z.string().max(300, "300文字以内で入力してください").optional(),
});
export type PostReportInput = z.infer<typeof postReportInputSchema>;
