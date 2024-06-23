import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";

type ContextPropds = {
  params: {
    postId: string;
  };
};

export async function POST(req: Request, context: ContextPropds) {
  try {
    const session = await getAuthSession();
    const { params } = context;
    const body = await req.json();
    if (session?.user?.id === body.userId || session == null) {
      return NextResponse.json(
        { message: "not arrow add cute" },
        { status: 500 }
      );
    }
    const cute = await db.cute.create({
      data: {
        postId: params.postId,
      },
    });
    return NextResponse.json(cute, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "could not add cute" },
      { status: 500 }
    );
  }
}
