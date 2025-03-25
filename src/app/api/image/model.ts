import {
  ACCEPT_IMAGE_TYPES,
  MAX_IMAGE_SIZE,
  SIZE_OVER_ERROR_MESSAGE,
} from "@/lib/constants/image";
import { z } from "zod";

export const uploadImageSchema = z
  .array(z.instanceof(File))
  .refine((files) => files.length > 0, { message: "画像を設定してください" })
  .refine(
    (files) => files.every((file) => ACCEPT_IMAGE_TYPES.includes(file.type)),
    {
      message: "拡張子（png,jpg,jpeg,gif）のファイルを設定してください",
    }
  )
  .refine((files) => files.every((file) => file.size <= MAX_IMAGE_SIZE), {
    message: SIZE_OVER_ERROR_MESSAGE,
  });
