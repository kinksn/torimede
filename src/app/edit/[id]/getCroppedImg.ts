import { Area } from "react-easy-crop";
import { MIME_TYPE_MAP } from "@/lib/constants/image";

/**
 * 画像URL(オブジェクトURL)をもとに <img>要素を作成
 */
export function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (error) => reject(error);
    img.src = url;
  });
}

/**
 * 受け取ったMIMEを、canvas.toBlobに渡すMIMEへ変換する (GIFは非対応なのでPNGにフォールバック)
 */
function decideCanvasMimeType(mimeType: string): { mime: string; ext: string } {
  if (!MIME_TYPE_MAP[mimeType]) {
    // 想定外のMIMEタイプが来たら JPEGにフォールバック
    return { mime: "image/jpeg", ext: "jpg" };
  }

  // GIFは非対応 → PNG にフォールバック
  if (mimeType === "image/gif") {
    return { mime: "image/png", ext: "png" };
  }

  // jpg/jpeg/png はそのまま
  return MIME_TYPE_MAP[mimeType];
}

/**
 * トリミングして File を返す関数
 * @param imageSrc    ユーザーがアップロードした画像の dataURL
 * @param pixelCrop   react-easy-crop で取得した切り取り領域
 * @param baseName    出力ファイルの "ベース名" (拡張子はあとで付与)
 * @param originalMimeType  元のファイルのMIMEタイプ("image/png"等)
 */
export const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: Area,
  baseName: string,
  originalMimeType: string
): Promise<File | null> => {
  // 1) 画像読み込み
  const image = await createImage(imageSrc);
  if (!image) return null;

  // 2) 元画像をcanvasに描画し、指定領域を抜き出す
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // 画像全体を最初に描画して ImageData を抜き出す
  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0);

  // 指定領域を抜き出す
  const data = ctx.getImageData(
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height
  );

  // canvas のサイズを「切り取り領域」だけに再設定
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  ctx.putImageData(data, 0, 0);

  // 3) 出力用に MIME Type と拡張子を決定
  const { mime, ext } = decideCanvasMimeType(originalMimeType);
  const outputFileName = `${baseName}.${ext}`;

  // 4) canvas.toBlob(..., mime)
  return new Promise<File | null>((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        resolve(null);
        return;
      }
      // Blob → File 化して返す
      resolve(new File([blob], outputFileName, { type: mime }));
    }, mime);
  });
};
