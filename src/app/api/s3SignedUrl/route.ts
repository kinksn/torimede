import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ACCEPT_IMAGE_TYPES } from "@/lib/constants/image";
import { getSignedUrlForUpload } from "@/app/api/s3SignedUrl/dao";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { fileType } = await request.json();

    if (!fileType || !ACCEPT_IMAGE_TYPES.includes(fileType)) {
      return NextResponse.json(
        { error: "Invalid file type." },
        { status: 400 }
      );
    }

    const { signedUrl, fileUrl } = await getSignedUrlForUpload(fileType);

    return NextResponse.json({ signedUrl, fileUrl });
  } catch (error) {
    console.error("Failed to get signed URL:", error);
    return NextResponse.json(
      { error: "Failed to get signed URL." },
      { status: 500 }
    );
  }
}
