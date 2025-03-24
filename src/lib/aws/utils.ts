import crypto from "crypto";

export const generateUniqueFileName = (fileType: string) => {
  const timestamp = Date.now();
  const randomUuid = crypto.randomUUID();
  const extension = fileType.split("/")[1];
  return `${randomUuid}-${timestamp}.${extension}`;
};
