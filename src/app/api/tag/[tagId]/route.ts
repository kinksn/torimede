import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";

type ContextProps = {
  params: {
    tagId: string;
  };
};

export async function DELETE(_req: Request, context: ContextProps) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json({ message: "not login" }, { status: 401 });
    }
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
