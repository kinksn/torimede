import { idWithBrandSchema } from "@/lib/util/entity";
import { z } from "zod";

export const userIdSchema = idWithBrandSchema("UserId");
export type UserId = z.infer<typeof userIdSchema>;

export const getUserProfileSchema = z.object({
  id: userIdSchema,
  name: z.string(),
  image: z.string().url(),
});

export const getUserPostsSchema = z.array(
  z.object({
    id: userIdSchema,
    image: z.string().url(),
  })
);

export const getUserOutputSchema = z.object({
  profile: getUserProfileSchema,
  posts: getUserPostsSchema,
  cutedPosts: getUserPostsSchema,
  isMe: z.boolean(),
});

export const updateUserNameInputSchema = z.object({
  name: z.string().max(15),
});

export const updateUserProfileSchema = z.object({
  name: updateUserNameInputSchema.shape.name,
  userId: userIdSchema,
});
export type UpdateUserProfile = z.infer<typeof updateUserProfileSchema>;
