import { z } from "zod";

export const ACCEPT_IMAGE_TYPES = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/gif",
];
export const MAX_IMAGE_SIZE = 15 * 1024 * 1024; // 15MB

export const uploadPostImageSchema = z
  .array(z.instanceof(File))
  .refine((files) => files.length > 0, { message: "画像を設定してください" })
  .refine(
    (files) => files.every((file) => ACCEPT_IMAGE_TYPES.includes(file.type)),
    {
      message: "拡張子（png,jpg,jpeg,gif）のファイルを設定してください",
    }
  )
  .refine((files) => files.every((file) => file.size <= MAX_IMAGE_SIZE), {
    message: "ファイルサイズは15MB以内にしてください",
  });
