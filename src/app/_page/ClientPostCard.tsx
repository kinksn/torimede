"use client";

import { useEffect } from "react";
import PostCard from "@/components/PostCard";
import { useInView } from "react-intersection-observer";
import { Session } from "next-auth";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { postKeys } from "@/service/post/key";
import { GetPostOutput } from "@/app/api/post/model";
import { InitialPagePathSetter } from "@/components/InitialPagePathSetter";

type ClientSideFetchProps = {
  session: Session | null;
};

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

const ClientPostCard = ({ session }: ClientSideFetchProps) => {
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
  }, [hasNextPage, inView, fetchNextPage]);

  if (error) return <div>エラーが発生しました: {JSON.stringify(error)}</div>;

  return (
    <>
      <InitialPagePathSetter />
      {isSuccess &&
        data?.pages.map((page) =>
          page.posts.map((post: any, index: number) => {
            if (page.posts.length === index + 1) {
              return (
                <div ref={ref} key={`${post.id}${index}`}>
                  <PostCard post={post} key={post.id} session={session} />
                </div>
              );
            } else {
              return <PostCard post={post} key={post.id} session={session} />;
            }
          })
        )}
      {(isLoading || isFetchingNextPage) && <>Loading...</>}
    </>
  );
};

export default ClientPostCard;
