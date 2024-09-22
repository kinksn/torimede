import { userIdSchema } from "@/app/api/user/model";
import { idWithBrandSchema } from "@/lib/util/entity";
import { z } from "zod";

export const MAX_CUTE_COUNT = 50;

export const cuteIdSchema = idWithBrandSchema("CuteId");

export const cuteSchema = z.object({
  id: cuteIdSchema,
  // TODO: postIdSchemaにしたいが循環参照でエラーになる
  postId: z.string(),
});

export const createCuteSchema = z.object({
  // TODO: postIdSchemaにしたいが循環参照でエラーになる
  postId: z.string(),
  userId: userIdSchema,
  cuteCount: z.number(),
});
export type CreateCute = z.infer<typeof createCuteSchema>;

export const createCuteOutputSchema = z.object({
  totalCuteCount: z.number(),
});
export type CreateCuteOutput = z.infer<typeof createCuteOutputSchema>;

export const createCuteBodySchema = z.object({
  cuteCount: z
    .number()
    .min(1, "cute count must be at least 1")
    .max(MAX_CUTE_COUNT, "cute count exceeds the maximum limit"),
});

export const getUserCuteCountForPostSchema = z.number();
