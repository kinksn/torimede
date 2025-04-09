"use client";

import axios from "axios";
import Masonry from "@/components/react-layout-masonry";
import { PostImage } from "@/components/PostImage";
import TankenMedechan from "@/components/assets/mede-chan/tanken.svg";
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
          <SVGIcon
            svg={TankenMedechan}
            className="w-[180px] max-sm:w-[120px]"
          />
          <p className="text-center max-sm:text-left">
            ごめんなさい、検索中にエラーが発生しました。
            <br className="max-sm:hidden" />
            しばらく時間をおいてもういちど試してください。
          </p>
        </div>
      ) : posts && posts.length > 0 ? (
        <Masonry columns={{ 845: 2, 1024: 3, 1280: 4 }} gap={20}>
          {posts.map((post) => (
            <PostImage key={post.id} post={post} />
          ))}
        </Masonry>
      ) : searchQuery || searchTag ? (
        <div className="flex flex-col items-center justify-center gap-5">
          <SVGIcon
            svg={TankenMedechan}
            className="w-[180px] max-sm:w-[120px]"
          />
          <p className="text-center max-sm:text-left">
            探している鳥さんは見つかりませんでした。
            <br className="max-sm:hidden" />
            言葉を変えて探してみてください。
          </p>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
