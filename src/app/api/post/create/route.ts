import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createPostBodySchema } from "@/app/api/post/model";
import { getUserDailyPostCount } from "@/app/api/user/userDao";
import { MAX_DAILY_POSTS } from "@/lib/constants/limits";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Not login" }, { status: 401 });
    }

    // 当日（日本時間基準）の投稿数をチェック
    const dailyPostCount = await getUserDailyPostCount({
      userId: session.user.id,
    });

    if (dailyPostCount >= MAX_DAILY_POSTS) {
      return NextResponse.json(
        {
          message: `1日の投稿上限（${MAX_DAILY_POSTS}回）に達しました。明日また投稿してください。`,
        },
        { status: 400 }
      );
    }

    const body = createPostBodySchema.parse(await req.json());
    const post = await db.post.create({
      data: {
        title: body.title,
        content: body.content,
        userId: session.user.id,
        images: {
          create: body.images.map((image) => ({
            url: image.url,
            alt: image.alt,
          })),
        },
        tags: {
          create: body.tags.map((tagId) => ({
            tag: {
              connect: { id: tagId },
            },
          })),
        },
      },
    });
    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `could not create post: ${error}` },
      { status: 500 }
    );
  }
}
