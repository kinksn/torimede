import { z } from "zod";

// TODO: idWidthBrandSchema("TagId")にする
export const tagIdSchema = z.string();

export const tagObjectSchema = z.object({
  id: z.string(),
  name: z.string(),
});
