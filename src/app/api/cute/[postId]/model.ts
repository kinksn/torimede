import { postIdSchema } from "@/app/api/post/model";
import { userIdSchema } from "@/app/api/user/model";
import { z } from "zod";

export const MAX_CUTE_COUNT = 50;

export const createCuteSchema = z.object({
  postId: postIdSchema,
  cuteCount: z.number(),
});
export type CreateCute = z.infer<typeof createCuteSchema>;

export const createCuteBodySchema = z.object({
  userId: userIdSchema,
  cuteCount: z
    .number()
    .min(1, "cute count must be at least 1")
    .max(MAX_CUTE_COUNT, "cute count exceeds the maximum limit"),
});

export const getCuteCountByPostIdOutputSchema = z.number();
