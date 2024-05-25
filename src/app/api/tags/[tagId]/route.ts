import { db } from "@/lib/db";
import { NextResponse } from "next/server";

type ContextProps = {
  params: {
    tagId: string;
  };
};

export async function DELETE(_req: Request, context: ContextProps) {
  try {
    const { params } = context;
    await db.tag.delete({
      where: {
        id: params.tagId,
      },
    });
    return new Response(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { message: "could not delete tag" },
      { status: 500 }
    );
  }
}
