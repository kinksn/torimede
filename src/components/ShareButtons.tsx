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
    <div className="flex gap-2">
      <a
        className="btn"
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        <button>Twitter</button>
      </a>
      <a
        className="btn"
        href={lineUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        <button>LINE</button>
      </a>
      <a
        className="btn"
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        <button>Facebook</button>
      </a>
    </div>
  );
};
