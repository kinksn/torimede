import sharp from "sharp";

type ProcessImageResult = {
  buffer: Buffer;
  mimeType: string;
};

/**
 * 画像を圧縮処理する純粋関数
 * @param fileBuffer 元の画像バッファ
 * @param mimeType 元の画像のMIMEタイプ
 * @returns 処理後の画像バッファとMIMEタイプ
 */
export async function processImage(
  fileBuffer: Buffer,
  mimeType: string
): Promise<ProcessImageResult> {
  // 画像形式でない場合はそのまま返す
  if (!mimeType.startsWith("image/")) {
    return { buffer: fileBuffer, mimeType };
  }

  try {
    const sharpInstance = sharp(fileBuffer);

    // 画像の種類に応じた処理
    if (mimeType === "image/jpeg" || mimeType === "image/jpg") {
      const processed = await sharpInstance
        .jpeg({ quality: 80, progressive: true })
        .toBuffer();
      return { buffer: processed, mimeType: "image/jpeg" };
    }

    if (mimeType === "image/png") {
      const processed = await sharpInstance
        .png({ compressionLevel: 8, progressive: true })
        .toBuffer();
      return { buffer: processed, mimeType: "image/png" };
    }

    if (mimeType === "image/gif") {
      // GIFはそのまま（sharpはGIFアニメーションの処理に制限あり）
      return { buffer: fileBuffer, mimeType };
    }

    // その他の画像形式はWebP形式に変換して圧縮
    const processed = await sharpInstance.webp({ quality: 80 }).toBuffer();
    return { buffer: processed, mimeType: "image/webp" };
  } catch (err) {
    console.error("Image processing error:", err);
    // 圧縮に失敗した場合は元のファイルを使用
    return { buffer: fileBuffer, mimeType };
  }
}
