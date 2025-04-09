import { ImageResponse } from "next/og";
import { NextResponse } from "next/server";
import { z } from "zod";
import sharp from "sharp";
import "isomorphic-fetch";
// App router includes @vercel/og.
// No need to install it.

const urlParamsSchema = z.object({
  title: z.string().min(1),
  image: z.string().url(),
  userName: z.string().min(1),
});

// 画像のサイズを取得し、縮小後の横幅を計算する関数
async function calculateImageWidth(
  imageUrl: string,
  targetHeight: number
): Promise<number> {
  const res = await fetch(imageUrl);
  // arrayBuffer()メソッドはfetchで取得したレスポンスを「生のバイナリデータ」（ArrayBuffer）として取得する
  // 画像やファイルなどバイナリデータを扱うために使う
  const buffer = await res.arrayBuffer();
  // BufferはNode.js環境でバイナリデータを扱うためのオブジェクト
  // `Buffer.from(buffer)`はfetchで取得→変換したArrayBufferをNode.jsで扱えるBufferオブジェクトに変換する処理
  const { width, height } = await sharp(Buffer.from(buffer)).metadata();

  // アスペクト比を保持しつつ高さを`targetHeight`に縮小した際の横幅を計算
  const aspectRatio = width! / height!;
  return Math.round(targetHeight * aspectRatio); // 横幅を計算して返す
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const queryParams = {
    title: searchParams.get("title"),
    image: searchParams.get("image"),
    userName: searchParams.get("userName"),
  };

  try {
    const parsedParams = urlParamsSchema.safeParse(queryParams);
    if (!parsedParams.success) {
      return new ImageResponse(
        (
          <div
            style={{
              backgroundImage: `url(${process.env.NEXT_PUBLIC_BASE_URL}/og/ogp-default.png)`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "top center",
              width: "1200px",
              height: "630px",
            }}
          ></div>
        ),
        {
          width: 1200,
          height: 630,
        }
      );
    }

    // 画像の親divの高さ
    const IMAGE_HEIGHT = 550;
    const imageWidth = await calculateImageWidth(
      parsedParams.data.image,
      IMAGE_HEIGHT
    );

    return new ImageResponse(
      (
        <div
          style={{
            backgroundColor: "#F0F0F0",
            width: "100%",
            height: "100%",
            display: "flex",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "40px",
            }}
          >
            <div
              style={{
                backgroundColor: "#E5E5E5",
                display: "flex",
                position: "relative",
                width: "707px",
                height: "550px",
                borderRadius: "20px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  backgroundImage: `url(${parsedParams.data.image})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: `100% ${IMAGE_HEIGHT}px`,
                  margin: "0 auto",
                  width: `${imageWidth}px`,
                  height: "100%",
                }}
              ></div>
              <div
                style={{
                  position: "absolute",
                  backgroundColor: "rgba(43, 47, 58, 0.8)",
                  color: "#fff",
                  fontSize: "16px",
                  fontWeight: "bold",
                  borderRadius: "4px",
                  padding: "4px 8px",
                  bottom: "20px",
                  left: "20px",
                }}
              >
                {`${parsedParams.data.title}  @${parsedParams.data.userName}`}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "453px",
                height: "100%",
              }}
            >
              <div
                style={{
                  width: "356px",
                  height: "118px",
                  backgroundImage: `url(${process.env.NEXT_PUBLIC_BASE_URL}/og/ogp-detailTitle.svg)`,
                  backgroundRepeat: "none",
                  backgroundSize: "cover",
                }}
              ></div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    return NextResponse.json(
      { message: `could not create OGimage: ${error}` },
      { status: 500 }
    );
  }
}
