import { z } from "zod";

export const TagIdSchema = z.string();

export const TagObjectSchema = z.object({
  id: z.string(),
  name: z.string(),
});
