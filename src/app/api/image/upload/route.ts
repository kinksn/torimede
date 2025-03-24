import { NextResponse } from "next/server";
import { ACCEPT_IMAGE_TYPES, MAX_IMAGE_SIZE } from "@/lib/constants/image";
import { auth } from "@/lib/auth";
import { processImage } from "@/app/api/image/imageProcessor";
import { uploadFileToS3 } from "@/app/api/image/imageDao";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { message: "not allowed upload image" },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { error: "File is required and must be a valid file." },
        { status: 400 }
      );
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileType = file.type;

    if (!ACCEPT_IMAGE_TYPES.includes(fileType)) {
      return NextResponse.json(
        { error: "File type not allowed." },
        { status: 400 }
      );
    }

    if (fileBuffer.length > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { error: "File size limit exceeded." },
        { status: 400 }
      );
    }

    // 画像圧縮処理
    const { buffer: processedBuffer, mimeType: processedType } =
      await processImage(fileBuffer, fileType);

    const fileUrl = await uploadFileToS3(processedBuffer, processedType);

    return NextResponse.json({ success: true, fileUrl });
  } catch {
    return NextResponse.json(
      { error: "Upload could not be completed" },
      { status: 500 }
    );
  }
}
