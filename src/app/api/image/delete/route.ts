import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { handleDaoError } from "@/lib/api/daoUtil";
import { deleteImageFromS3 } from "@/app/api/image/imageDao";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { message: "not allowed upload image" },
        { status: 403 }
      );
    }
    const { imageUrl } = await req.json();
    await deleteImageFromS3(imageUrl);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete image:", error);
    return NextResponse.json(
      { message: "Failed to delete image" },
      { status: 500 }
    );
  }
}
