"use client";

import { SVGIcon } from "@/components/ui/SVGIcon";
import { useRouter } from "next/navigation";
import Xmark from "@/components/assets/icon/x-mark.svg";

type TagProps = {
  children: React.ReactNode;
  disabled?: boolean;
  deletable?: boolean;
  href?: string;
  onDelete?: () => void;
};

export const Tag = ({
  children,
  href,
  disabled,
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
      className={`text-typography-md bg-white rounded-full font-bold py-2 px-3 leading-none shadow-basic inline-flex items-center gap-1 ${
        href ? "cursor-pointer" : "cursor-default"
      }`}
      onClick={() => handleClick(href)}
    >
      {children}
      {deletable && (
        <button
          type="button"
          aria-label={`${children} を削除`}
          className="p-[2px] m-0 leading-none rounded-full hover:bg-primary-50"
          disabled={disabled}
          onClick={onDelete}
        >
          <SVGIcon svg={Xmark} className="text-textColor-basic w-2" />
        </button>
      )}
    </div>
  );
};
