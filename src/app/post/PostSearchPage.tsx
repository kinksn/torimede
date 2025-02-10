"use client";

import axios from "axios";
import Masonry from "@/components/react-layout-masonry";
import PostCard from "@/components/PostCard";
import SyoboMedeChan from "@/components/assets/mede-chan/syobo.svg";
import { GetPostOutput } from "@/app/api/post/model";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { FaceLoader } from "@/components/basic/FaceLoader";
import { SVGIcon } from "@/components/ui/SVGIcon";

const searchPosts = async (
  query: string,
  tag: string
): Promise<GetPostOutput["posts"]> => {
  const params = new URLSearchParams();
  if (query) params.append("q", query);
  if (tag) params.append("tag", tag);

  const { data } = await axios.get(`/api/post/search?${params.toString()}`);
  return data;
};

export const PostSearchPage = () => {
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
    <div className="px-5 max-sm:px-0 h-full max-sm:h-auto">
      <div className="w-full bg-white rounded-20 px-10 py-10 max-sm:px-5">
        <div className="container mx-auto px-4 max-sm:px-0">
          <h1 className="text-typography-xl mb-5 text-center font-bold leading-normal font-zenMaruGothic">
            {searchQuery}
            {searchTag}
          </h1>
          {isLoading ? (
            <div className="flex justify-center">
              <FaceLoader />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center gap-5">
              <SVGIcon svg={SyoboMedeChan} />
              <p className="text-center max-sm:text-left">
                ごめんなさい、検索中にエラーが発生しました。
                <br className="max-sm:hidden" />
                しばらく時間をおいてもういちど試してください。
              </p>
            </div>
          ) : posts && posts.length > 0 ? (
            <Masonry columns={{ 845: 2, 1024: 3, 1280: 4 }} gap={20}>
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </Masonry>
          ) : searchQuery || searchTag ? (
            <div className="flex flex-col items-center justify-center gap-5">
              <SVGIcon svg={SyoboMedeChan} />
              <p className="text-center max-sm:text-left">
                ごめんなさい、探している鳥さんは見つかりませんでした。
                <br className="max-sm:hidden" />
                言葉を変えて探してみてください。
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-5">
              <SVGIcon svg={SyoboMedeChan} />
              <p className="text-center max-sm:text-left">
                検索ワードを入力してください
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
