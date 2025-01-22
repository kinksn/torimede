import { GetPostSelectTags } from "@/app/api/post/model";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);

  const take = Number(url.searchParams.get("take"));
  const lastCursor = url.searchParams.get("lastCursor");

  try {
    const posts: GetPostSelectTags[] = await db.post.findMany({
      take: take ?? 10,
      ...(lastCursor && {
        skip: 1,
        cursor: {
          // MEMO: ここにcreatedAt入れないとおかしな挙動になる可能性あり
          id: lastCursor,
        },
      }),
      select: {
        id: true,
        title: true,
        content: true,
        image: true,
        userId: true,
        tags: {
          select: {
            tag: true,
          },
        },
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    });

    if (posts.length === 0) {
      return NextResponse.json(
        {
          posts: [],
          metaData: {
            lastCursor: null,
            hasNextPage: false,
          },
        },
        { status: 200 }
      );
    }

    const lastPost = posts[posts.length - 1];
    const cursor = lastPost.id;

    const nextPage = await db.post.findMany({
      take: take ?? 10,
      skip: 1,
      cursor: {
        id: cursor,
      },
    });

    const formattedPosts = posts.map((post) => ({
      ...post,
      tags: post.tags.map((tagRelation) => ({
        name: tagRelation.tag.name,
        id: tagRelation.tag.id,
      })),
    }));

    const result = {
      posts: formattedPosts,
      metaData: {
        lastCursor: cursor,
        hasNextPage: nextPage.length > 0,
      },
    };

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `could not fetch posts: ${error}` },
      { status: 500 }
    );
  }
}
