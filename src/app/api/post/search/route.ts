import { GetPostOutput, GetPostSelectTags } from "@/app/api/post/model";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // @see(https://developer.mozilla.org/ja/docs/Web/API/URL/searchParams)
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");
    const tag = searchParams.get("tag");

    const fetchPostsByQuery = async (keywords: string[]) => {
      const posts: GetPostSelectTags[] = await db.post.findMany({
        where: {
          OR: keywords.map((keyword) => ({
            OR: [
              { title: { contains: keyword, mode: "insensitive" } },
              { content: { contains: keyword, mode: "insensitive" } },
            ],
          })),
        },
        include: {
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
      });

      const formattedPosts: GetPostOutput[] = posts.map((post) => ({
        ...post,
        tags: post.tags.map((tagRelation) => ({
          name: tagRelation.tag.name,
          id: tagRelation.tag.id,
        })),
      }));

      return formattedPosts;
    };

    const fetchPostsByTag = async (tagName: string) => {
      const posts: GetPostSelectTags[] = await db.post.findMany({
        where: {
          tags: {
            some: {
              tag: {
                name: { contains: tagName, mode: "insensitive" },
              },
            },
          },
        },
        include: {
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
      });

      const formattedPosts: GetPostOutput[] = posts.map((post) => ({
        ...post,
        tags: post.tags.map((tagRelation) => ({
          name: tagRelation.tag.name,
          id: tagRelation.tag.id,
        })),
      }));

      return formattedPosts;
    };

    // クエリパラメータに基づいて関数を選択し、実行
    const posts = query
      ? await fetchPostsByQuery(query.split(/\s+|　+/).filter(Boolean))
      : tag
      ? await fetchPostsByTag(tag)
      : null;

    if (!posts) {
      return NextResponse.json(
        { message: "検索クエリまたはタグが必要です" },
        { status: 400 }
      );
    }

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `投稿の検索中にエラーが発生しました： ${error}` },
      { status: 500 }
    );
  }
}
