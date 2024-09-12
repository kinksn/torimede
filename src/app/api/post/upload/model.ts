import { z } from "zod";

const ACCEPT_IMAGE_TYPES = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/gif",
];

export const uploadPostImageSchema = z
  .custom<FileList>()
  .refine((file) => file.length !== 0, { message: "画像を選択してください" })
  .transform((file) => file[0])
  .refine((file) => ACCEPT_IMAGE_TYPES.includes(file.type), {
    message: " 拡張子（png,jpg,jpeg,gif）のファイルを設定してください",
  });
