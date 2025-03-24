export const MAX_IMAGE_SIZE = 15 * 1024 * 1024; // 15MB

export const ACCEPT_IMAGE_TYPES = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/gif",
];

// 受け入れるMimeTypeをマップ化
export const MIME_TYPE_MAP: Record<string, { mime: string; ext: string }> = {
  "image/jpg": { mime: "image/jpeg", ext: "jpg" },
  "image/jpeg": { mime: "image/jpeg", ext: "jpg" },
  "image/png": { mime: "image/png", ext: "png" },
  "image/gif": { mime: "image/gif", ext: "gif" },
};

export const POST_COMPRESSION_OPTIONS = {
  maxSizeMB: 1, // 最大1MBに抑える
  maxWidthOrHeight: 2128, // 最大幅 or 高さを2128pxに
  useWebWorker: true,
  initialQuality: 0.8, // JPEGの品質（80%）
};
