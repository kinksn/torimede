"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import PostCard from "@/components/PostCard";
import BackButton from "@/components/BackButton";
import { GetPostOutput } from "@/app/api/post/model";

const searchPosts = async (
  query: string,
  tag: string
): Promise<GetPostOutput[]> => {
  const params = new URLSearchParams();
  if (query) params.append("q", query);
  if (tag) params.append("tag", tag);

  const { data } = await axios.get(`/api/post/search?${params.toString()}`);
  return data;
};

export default function PostsPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const searchTag = searchParams.get("tag") || "";

  const {
    data: posts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["posts", searchQuery, searchTag],
    queryFn: () => searchPosts(searchQuery, searchTag),
    enabled: !!searchQuery || !!searchTag,
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
      ) : searchQuery || searchTag ? (
        <p>検索結果が見つかりませんでした。</p>
      ) : (
        <p>検索ワードを入力してください。</p>
      )}
    </div>
  );
}
