"use client";

import { SVGIcon } from "@/components/ui/SVGIcon";
import { useRouter } from "next/navigation";
import Xmark from "@/components/assets/icon/x-mark.svg";
import { Button } from "@/components/basic/Button";
import { RoundButton } from "@/components/basic/RoundButton";
import { cn } from "@/lib/utils";

type TagProps = {
  children: React.ReactNode;
  disabled?: boolean;
  deletable?: boolean;
  href?: string;
  className?: string;
  onDelete?: (e: React.MouseEvent) => void;
};

export const Tag = ({
  children,
  href,
  disabled,
  className,
  deletable,
  onDelete,
}: TagProps) => {
  const router = useRouter();

  const handleClick = (href?: string) => {
    if (href) {
      router.push(`/post?tag=${href}`);
    }
    return;
  };

  return (
    <div
      role="listitem"
      aria-label={`タグ: ${children}`}
      className={cn(
        `text-typography-md text-left bg-white rounded-full font-bold py-2 px-3 leading-none shadow-basic inline-flex items-center gap-1 border border-primary-700 ${
          href ? "cursor-pointer" : "cursor-default"
        }`,
        className
      )}
      onClick={() => handleClick(href)}
    >
      {children}
      {deletable && (
        <RoundButton
          aria-label={`${children} を削除`}
          size={"xs"}
          colorTheme={"white"}
          className="p-[2px] m-0 leading-none rounded-full hover:bg-primary-50"
          onClick={onDelete}
          icon={
            <div>
              <SVGIcon svg={Xmark} className="text-textColor-basic w-2" />
            </div>
          }
          asChild
        />
      )}
    </div>
  );
};
