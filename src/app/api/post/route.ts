import { db } from "@/lib/db";
import { PostAddRelationFields } from "@/types";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const posts: PostAddRelationFields[] = await db.post.findMany({
      /**
     * 以下が全てのフィールドだが、
     * selectで必要なフィールドだけ返すように設定できる
     * {
        id: 'clwj2ksp20004qhn05byuh7wy',
        title: 'test',
        content: 'content',
        createdAt: 2024-05-23T09:47:47.654Z,
        updatedAt: 2024-05-23T09:47:33.370Z,
        tagId: 'clwitzu3e0000qhn0ailoe8r9'
      }
     */
      select: {
        id: true,
        title: true,
        content: true,
        image: true,
        // リレーショナルフィールドも出力できる
        tag: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(
      posts.map((post) => ({
        ...post,
        image: post.image ?? undefined,
        tag: post.tag ?? undefined,
      })),
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "could not fetch posts" },
      { status: 500 }
    );
  }
}
