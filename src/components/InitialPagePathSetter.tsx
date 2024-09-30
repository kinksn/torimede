"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useSetAtom } from "jotai";
import { initialPagePath } from "@/lib/atom/initialPagePath";

// 主な用途は、投稿詳細モーダルの「x」ボタン押下時、投稿詳細モーダルを最初に開く前のページに戻すため使っている
// 上記挙動を実現したいページで <InitialPagePathSetter /> を設置する必要がある
export const InitialPagePathSetter = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const setInitialPagePath = useSetAtom(initialPagePath);

  const isPostPage = pathname.startsWith("/post") && searchParams.size === 0;

  useEffect(() => {
    if (!isPostPage)
      setInitialPagePath(
        pathname + (searchParams.size ? `?${searchParams.toString()}` : "")
      );
  }, [pathname, searchParams, isPostPage, setInitialPagePath]);

  return null;
};
