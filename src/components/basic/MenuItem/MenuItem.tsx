import { SVGIcon } from "@/components/ui/SVGIcon";
import Link from "next/link";

// ボタンに広げる可能性のある標準属性
type BaseProps = {
  menuType?: "option" | "button";
  isLink?: boolean;
  isShowIcon?: boolean;
  iconSvg?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconSvgColor?: string;
  onClick?: () => void;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onSelect">;

/** isLink=true 時にのみ href が必須になる判別ユニオン */
type IsLinkProps =
  | {
      isLink: true;
      href: string; // isLink=true の場合は必須
      onClick?: never;
      onSelect?: never;
    }
  | {
      isLink?: false; // デフォルト or false
      href?: never; // false の場合は指定不可
    };

// menuType="option" 用
type OptionMenuProps<T> = {
  menuType: "option"; // ← 省略時は"option"扱い
  option: T;
  onSelect: (option: T) => void;
  isLink?: never;
} & BaseProps &
  IsLinkProps;

// menuType="button" 用
type MenuProps = {
  menuType: "button";
  isLink?: boolean;
  option?: never;
  onSelect?: never;
} & BaseProps &
  IsLinkProps;

type MenuItemProps<T> = OptionMenuProps<T> | MenuProps;

export const MenuItem = <T,>({
  menuType,
  iconSvg,
  iconSvgColor,
  isShowIcon,
  isLink,
  href,
  option,
  children,
  onSelect,
  onClick,
  ...props
}: MenuItemProps<T>) => {
  // クリック時の共通処理
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (menuType === "option") {
      onSelect?.(option);
    }
    onClick?.();
  };

  if (isLink) {
    // isLink=true の場合は <Link> を返す
    return (
      <Link
        href={href}
        className="cursor-pointer font-medium font-zenMaruGothic h-12 flex gap-1 items-center py-4 px-3 hover:bg-primary-50 w-full"
      >
        {!!iconSvg && isShowIcon && (
          <SVGIcon svg={iconSvg} className={`${iconSvgColor ?? ""} w-6`} />
        )}
        {children}
      </Link>
    );
  } else {
    // isLink=false の場合は <button> を返す
    return (
      <button
        className="cursor-pointer font-medium font-zenMaruGothic h-12 flex gap-1 items-center py-4 px-3 hover:bg-primary-50 w-full"
        onClick={handleClick}
        {...props}
      >
        {!!iconSvg && isShowIcon && (
          <SVGIcon svg={iconSvg} className={`${iconSvgColor ?? ""} w-6`} />
        )}
        {children}
      </button>
    );
  }
};
