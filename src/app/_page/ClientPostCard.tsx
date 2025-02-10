"use client";

import { useEffect } from "react";
import PostCard from "@/components/PostCard";
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
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (error) return <div>エラーが発生しました: {JSON.stringify(error)}</div>;

  return (
    <>
      <InitialPagePathSetter />
      <Masonry columns={{ 845: 2, 1024: 3, 1280: 4 }} gap={20}>
        {isSuccess &&
          data?.pages.map((pages) =>
            pages.posts.map((post: any) => {
              return <PostCard post={post} key={post.id} />;
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
