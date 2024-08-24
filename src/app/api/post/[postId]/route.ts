import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";

type ContextProps = {
  params: {
    postId: string;
  };
};

export async function DELETE(req: Request, context: ContextProps) {
  try {
    const session = await getAuthSession();
    const { params } = context;
    const body = await req.json();
    if (session?.user?.id !== body.userId) {
      return NextResponse.json(
        { message: "not arrow update post" },
        { status: 500 }
      );
    }
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
    const session = await getAuthSession();
    const { params } = context;
    const body = await req.json();
    if (session?.user?.id !== body.userId) {
      return NextResponse.json(
        { message: "not arrow update post" },
        { status: 500 }
      );
    }
    await db.post.update({
      where: {
        id: params.postId,
      },
      data: {
        title: body.title,
        content: body.content,
        image: body.image || null,
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
