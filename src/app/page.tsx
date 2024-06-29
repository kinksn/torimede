import PostCard from "@/components/PostCard";
import { GET } from "@/app/api/posts/route";
import { PostAddRelationFields } from "@/types";

export default async function Home() {
  const posts = await (await GET()).json();

  return (
    <main className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
      {posts.map((post: PostAddRelationFields) => (
        <PostCard post={post} key={post.id} />
      ))}
    </main>
  );
}
