import PostCard from "@/components/PostCard";
import { db } from "@/lib/db";

async function getPosts() {
  const response = await db.post.findMany({
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
      // リレーショナルフィールドも出力できる
      tag: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return response.map((post) => ({
    ...post,
    tag: post.tag ?? undefined,
  }));
}

export default async function Home() {
  const posts = await getPosts();

  return (
    <main className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
      {posts.map((post) => (
        <PostCard post={post} key={post.id} />
      ))}
    </main>
  );
}
