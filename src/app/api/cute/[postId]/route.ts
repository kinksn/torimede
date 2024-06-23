import { db } from "@/lib/db";
import { NextResponse } from "next/server";

type ContextPropds = {
  params: {
    postId: string;
  };
};

export async function POST(_req: Request, context: ContextPropds) {
  try {
    const { params } = context;
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
