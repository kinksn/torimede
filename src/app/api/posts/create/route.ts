import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json({ message: "not login" }, { status: 500 });
    }
    const body = await req.json();
    const post = await db.post.create({
      data: {
        title: body.title,
        content: body.content,
        tagId: body.tagId || null,
        userId: session.user.id,
      },
    });
    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "could not create post" },
      { status: 500 }
    );
  }
}
