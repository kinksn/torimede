"use client";

import LinkIcon from "@/components/assets/icon/link.svg";
import { useCallback, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { PillButton } from "@/components/basic/PillButton";
import { SVGIcon } from "@/components/ui/SVGIcon";
import { Tooltip } from "@/components/basic/Tooltip";

export const UrlCopyButton = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [tooltipLabel, setTooltipLabel] = useState("");
  const [isOpenTooltip, setIsOpenTooltip] = useState(false);

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
      setTooltipLabel("URLをコピーしました");
      setIsOpenTooltip(true);
      setTimeout(() => {
        setIsOpenTooltip(false);
      }, 2000);
    } catch (error) {
      setTooltipLabel("URLのコピーに失敗しました");
      setIsOpenTooltip(true);
      setTimeout(() => {
        setIsOpenTooltip(false);
      }, 2000);
      console.error(error);
    }
  }, [currentUrl]);

  return (
    <Tooltip label={tooltipLabel} open={isOpenTooltip} className="bottom-3">
      <PillButton
        size={"sm"}
        className="bg-primary-700"
        iconLeft={<SVGIcon svg={LinkIcon} className="w-5" />}
        onClick={onCopy}
      >
        URLをコピー
      </PillButton>
    </Tooltip>
  );
};
