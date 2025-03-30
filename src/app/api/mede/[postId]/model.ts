import { userIdSchema } from "@/app/api/user/model";
import { idWithBrandSchema } from "@/lib/util/entity";
import { z } from "zod";

export const MAX_MEDE_COUNT = 50;

export const medeIdSchema = idWithBrandSchema("MedeId");

export const medeSchema = z.object({
  id: medeIdSchema,
  // TODO: postIdSchemaにしたいが循環参照でエラーになる
  postId: z.string(),
});
export type Mede = z.infer<typeof medeSchema>;

export const createMedeSchema = z.object({
  // TODO: postIdSchemaにしたいが循環参照でエラーになる
  postId: z.string(),
  userId: userIdSchema,
  medeCount: z.number(),
});
export type CreateMede = z.infer<typeof createMedeSchema>;

export const createMedeOutputSchema = z.object({
  totalMedeCount: z.number(),
});
export type CreateMedeOutput = z.infer<typeof createMedeOutputSchema>;

export const createMedeBodySchema = z.object({
  medeCount: z
    .number()
    .min(1, "mede count must be at least 1")
    .max(MAX_MEDE_COUNT, "mede count exceeds the maximum limit"),
});

export const getUserMedeCountForPostSchema = z.number();
