"use client";

import LinkIcon from "@/components/assets/icon/link.svg";
import { useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { PillButton } from "@/components/basic/PillButton";
import { SVGIcon } from "@/components/ui/SVGIcon";
import { toast } from "sonner";

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
    try {
      navigator.clipboard.writeText(currentUrl);
      toast.success("URLをコピーしました");
    } catch (error) {
      toast.error("URLのコピーに失敗しました");
      console.error(error);
    }
  }, [currentUrl]);

  return (
    <PillButton
      size={"sm"}
      className="bg-primary-700"
      iconLeft={<SVGIcon svg={LinkIcon} className="w-5" />}
      onClick={onCopy}
    >
      URLをコピー
    </PillButton>
  );
};
