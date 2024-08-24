"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import PostCard from "@/components/PostCard";
import { PostAddRelationFields } from "@/types";
import BackButton from "@/components/BackButton";

const searchPosts = async (query: string): Promise<PostAddRelationFields[]> => {
  const { data } = await axios.get(
    `/api/posts/search?q=${encodeURIComponent(query)}`
  );
  return data;
};

export default function PostsPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  const {
    data: posts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["posts", searchQuery],
    queryFn: () => searchPosts(searchQuery),
    enabled: !!searchQuery,
  });

  return (
    <div className="container mx-auto px-4">
      <BackButton />
      <h1 className="text-2xl font-bold mb-4">投稿一覧</h1>
      {isLoading ? (
        <div>読み込み中...</div>
      ) : error ? (
        <div>エラーが発生しました。</div>
      ) : posts && posts.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : searchQuery ? (
        <p>検索結果が見つかりませんでした。</p>
      ) : (
        <p>検索ワードを入力してください。</p>
      )}
    </div>
  );
}
