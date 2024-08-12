import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // @see(https://developer.mozilla.org/ja/docs/Web/API/URL/searchParams)
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json(
        { message: "検索クエリが必要です" },
        { status: 400 }
      );
    }

    const posts = await db.post.findMany({
      where: {
        OR: [
          // `mode: "insensitive"`は検索クエリの大文字小文字を区別しないオプション
          { title: { contains: query, mode: "insensitive" } },
          { content: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        tag: true,
      },
    });

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "could not get post" },
      { status: 500 }
    );
  }
}
