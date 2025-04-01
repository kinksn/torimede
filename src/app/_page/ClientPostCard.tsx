"use client";

import { useEffect } from "react";
import { PostImage } from "@/components/PostImage";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { postKeys } from "@/service/post/key";
import { GetPostOutput } from "@/app/api/post/model";
import { InitialPagePathSetter } from "@/components/InitialPagePathSetter";
// メインソンリーーレイアウト実現ライブラリ：https://github.com/sibiraj-s/react-layout-masonry#readme
// 本家だとSSR時にwindowオブジェクトがエラーになるバグがあったため直接プロジェクトに入れて読み込んでいる
import Masonry from "@/components/react-layout-masonry";
import { FaceLoader } from "@/components/basic/FaceLoader";
import { toast } from "sonner";

type FetchPostParams = {
  take?: number;
  lastCursor?: string;
};

const fetchPosts = async ({ take, lastCursor }: FetchPostParams) => {
  const response = await axios.get<GetPostOutput>("/api/post", {
    params: { take, lastCursor },
  });
  return response?.data;
};

const ClientPostCard = () => {
  const { ref, inView } = useInView();

  const {
    data,
    error,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isSuccess,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryFn: ({ pageParam = "" }) =>
      fetchPosts({ take: 2, lastCursor: pageParam }),
    queryKey: postKeys.infiniteList(),
    initialPageParam: "",
    getNextPageParam: (lastPage) => {
      return lastPage?.metaData.lastCursor;
    },
  });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const FetchNextPage = async () => {
      if (hasNextPage) {
        try {
          await fetchNextPage();
          timeoutId = setTimeout(FetchNextPage, 500);
        } catch (error) {
          toast.error("投稿の読み込みに失敗しました");
          console.error(error);
        }
      }
    };

    if (inView && hasNextPage) {
      FetchNextPage();
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [inView, hasNextPage, fetchNextPage]);

  if (error)
    return <div>投稿の読み込みに失敗しました: {JSON.stringify(error)}</div>;

  return (
    <>
      <InitialPagePathSetter />
      <Masonry columns={{ 845: 2, 1024: 3, 1280: 4 }} gap={20}>
        {isSuccess &&
          data?.pages.map((pages) =>
            pages.posts.map((post: any) => {
              return <PostImage post={post} key={post.id} />;
            })
          )}
      </Masonry>
      {(isLoading || isFetchingNextPage) && (
        <div className="flex items-center justify-center py-10">
          <FaceLoader />
        </div>
      )}
      {hasNextPage && <div ref={ref} className="h-[1px] w-full"></div>}
    </>
  );
};

export default ClientPostCard;
