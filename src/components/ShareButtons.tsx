"use client";

import FacebookIcon from "@/components/assets/icon/color-fixed/facebook.svg";
import LineIcon from "@/components/assets/icon/color-fixed/line.svg";
import XIcon from "@/components/assets/icon/color-fixed/x.svg";
import { usePathname } from "next/navigation";
import { SVGIcon } from "@/components/ui/SVGIcon";

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
    <div className="flex gap-3">
      <a href={twitterUrl} target="_blank" rel="noopener noreferrer">
        <SVGIcon svg={XIcon} className="w-9" />
      </a>
      <a href={lineUrl} target="_blank" rel="noopener noreferrer">
        <SVGIcon svg={LineIcon} className="w-9" />
      </a>
      <a href={facebookUrl} target="_blank" rel="noopener noreferrer">
        <SVGIcon svg={FacebookIcon} className="w-9" />
      </a>
    </div>
  );
};
