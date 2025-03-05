import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createPostBodySchema } from "@/app/api/post/model";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "not login" }, { status: 401 });
    }
    const body = createPostBodySchema.parse(await req.json());
    const post = await db.post.create({
      data: {
        title: body.title,
        content: body.content,
        userId: session.user.id,
        images: {
          create: body.images.map((image) => ({
            url: image.url,
            alt: image.alt,
          })),
        },
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
