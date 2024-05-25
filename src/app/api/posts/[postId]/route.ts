import { db } from "@/lib/db";
import { NextResponse } from "next/server";

type ContextProps = {
  params: {
    postId: string;
  };
};

export async function DELETE(_req: Request, context: ContextProps) {
  try {
    const { params } = context;
    await db.post.delete({
      where: {
        id: params.postId,
      },
    });
    return new Response(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { message: "could not delete post" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request, context: ContextProps) {
  try {
    const { params } = context;
    const body = await req.json();
    await db.post.update({
      where: {
        id: params.postId,
      },
      data: {
        title: body.title,
        content: body.content,
        tagId: body.tagId || null,
      },
    });
    return NextResponse.json({ message: "update success" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "could not update post" },
      { status: 500 }
    );
  }
}

export async function GET(_req: Request, context: ContextProps) {
  try {
    const { params } = context;
    const post = await db.post.findFirst({
      where: {
        id: params.postId,
      },
      include: {
        tag: true,
      },
    });
    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "could not get post" },
      { status: 500 }
    );
  }
}
