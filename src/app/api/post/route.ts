import { GetPostSelectTags } from "@/app/api/post/model";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const posts: GetPostSelectTags[] = await db.post.findMany({
      /**
     * フィールドには`createdAt`なども含まれているが、
     * selectで必要なフィールドだけ返すように設定できる
     * {
        id: 'clwj2ksp20004qhn05byuh7wy',
        title: 'test',
        content: 'content',
        createdAt: 2024-05-23T09:47:47.654Z,
        updatedAt: 2024-05-23T09:47:33.370Z,
      }
     */
      select: {
        id: true,
        title: true,
        content: true,
        image: true,
        userId: true,
        // リレーショナルフィールドも出力できる
        tags: {
          select: {
            tag: {
              select: {
                name: true,
                id: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedPosts = posts.map((post) => ({
      ...post,
      tags: post.tags.map((tagRelation) => {
        return {
          name: tagRelation.tag.name,
          id: tagRelation.tag.id,
        };
      }),
    }));

    return NextResponse.json(formattedPosts, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `could not fetch posts: ${error}` },
      { status: 500 }
    );
  }
}
