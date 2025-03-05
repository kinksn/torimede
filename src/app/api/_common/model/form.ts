import { userIdSchema } from "@/app/api/user/model";
import { z } from "zod";

export const formInputPostSchema = z.object({
  title: z.string(),
  content: z.string().nullish(),
  images: z.array(
    z.object({
      url: z.string(),
      alt: z.string().optional(),
    })
  ),
  userId: userIdSchema.nullable(),
});
export type FormInputPost = z.infer<typeof formInputPostSchema>;
