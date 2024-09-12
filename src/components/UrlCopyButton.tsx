"use client";

import React, { useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export const UrlCopyButton = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentUrl =
    searchParams.size === 0
      ? `${process.env.NEXT_PUBLIC_BASE_URL}${pathname}`
      : `${
          process.env.NEXT_PUBLIC_BASE_URL
        }${pathname}?${searchParams.toString()}`;

  const onCopy = useCallback(() => {
    if (typeof navigator === "undefined") return;
    navigator.clipboard.writeText(currentUrl ?? "");
  }, [currentUrl]);

  return (
    <div>
      <button className="btn mt-2" onClick={onCopy}>
        URLをコピー
      </button>
    </div>
  );
};
