import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { CreatePostBodySchema } from "@/app/api/post/model";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json({ message: "not login" }, { status: 401 });
    }
    const body = CreatePostBodySchema.parse(await req.json());
    const post = await db.post.create({
      data: {
        title: body.title,
        content: body.content,
        userId: session.user.id,
        image: body.image,
        tags: {
          create: body.tags.map((tagId) => ({
            tag: {
              connect: { id: tagId },
            },
          })),
        },
      },
    });
    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `could not create post: ${error}` },
      { status: 500 }
    );
  }
}
