"use client";

import React from "react";
import { usePathname } from "next/navigation";

type ShareButtonProps = {
  text: string;
};

export const ShareButtons = ({ text }: ShareButtonProps) => {
  const pathname = usePathname();

  const currentUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${pathname}`;
  const encodedText = encodeURIComponent(text);

  const twitterUrl = `https://twitter.com/intent/tweet?url=${currentUrl}&text=${encodedText}`;
  const lineUrl = `https://social-plugins.line.me/lineit/share?url=${currentUrl}&text=${encodedText}`;
  const facebookUrl = `https://www.facebook.com/sharer.php?u=${currentUrl}`;

  return (
    <div>
      <a href={twitterUrl} target="_blank" rel="noopener noreferrer">
        <button>Share on Twitter</button>
      </a>
      <a href={lineUrl} target="_blank" rel="noopener noreferrer">
        <button>Share on LINE</button>
      </a>
      <a href={facebookUrl} target="_blank" rel="noopener noreferrer">
        <button>Share on Facebook</button>
      </a>
    </div>
  );
};
