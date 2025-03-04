import { idWithBrandSchema } from "@/lib/util/entity";
import { z } from "zod";

export const postImageIdSchema = idWithBrandSchema("PostImageId");
export type PostImageId = z.infer<typeof postImageIdSchema>;
