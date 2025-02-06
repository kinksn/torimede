import { SVGIcon } from "@/components/ui/SVGIcon";
import { cn } from "@/lib/utils";
import Link from "next/link";

// ボタンに広げる可能性のある標準属性
type BaseProps = {
  menuType?: "option" | "button";
  isLink?: boolean;
  isShowIcon?: boolean;
  menu?: React.ReactNode;
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
  menu,
  isLink,
  href,
  option,
  children,
  className,
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
      <div className="relative flex w-full cursor-pointer font-medium font-zenMaruGothic min-h-12">
        <Link
          className={cn(
            "h-auto flex gap-1 items-center px-3 hover:bg-primary-50 w-full",
            className
          )}
          href={href}
        >
          <div
            className={`flex items-center w-full ${
              !!menu && "justify-between"
            }`}
          >
            <div className="flex">
              {!!iconSvg && isShowIcon && (
                <SVGIcon
                  svg={iconSvg}
                  className={`${iconSvgColor ?? ""} w-6`}
                />
              )}
              {children}
            </div>
          </div>
        </Link>
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {menu}
        </div>
      </div>
    );
  } else {
    // isLink=false の場合は <button> を返す
    return (
      <div
        className="relative flex w-full cursor-pointer font-medium font-zenMaruGothic min-h-12"
        role="menuitem"
        aria-haspopup={!!menu}
      >
        <button
          className={cn(
            "h-auto flex gap-1 items-center px-3 hover:bg-primary-50 w-full",
            className
          )}
          onClick={handleClick}
          aria-label={typeof children === "string" ? children : undefined}
          {...props}
        >
          <div
            className={`flex items-center w-full ${
              !!menu && "justify-between"
            }`}
          >
            <div className="flex">
              {!!iconSvg && isShowIcon && (
                <SVGIcon
                  svg={iconSvg}
                  className={`${iconSvgColor ?? ""} w-6`}
                />
              )}
              {children}
            </div>
          </div>
        </button>
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {menu}
        </div>
      </div>
    );
  }
};
