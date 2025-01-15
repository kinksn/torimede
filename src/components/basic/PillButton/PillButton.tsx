"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const pillButtonStylesProps = cva(
  `flex items-center gap-1 transition-all font-zenMaruGothic px-4 rounded-full font-bold data-[disabled=true]:bg-transparent data-[disabled=true]:hover:bg-transparent data-[disabled=true]:cursor-not-allowed data-[disabled=true]:pointer-events-none`,
  {
    variants: {
      size: {
        md: "h-12 text-typography-md",
        sm: "h-9 text-typography-sm",
      },
      colorTheme: {
        primary:
          "bg-primary-700 text-white hover:bg-primary-800 active:bg-primary-900 data-[disabled=true]:bg-primary-50 data-[disabled=true]:text-textColor-faint",
        secondary:
          "bg-secondary-100 text-textColor-basic hover:bg-secondary-200 active:bg-secondary-300 data-[disabled=true]:bg-secondary-50 data-[disabled=true]:text-textColor-faint",
        outline:
          "bg-white text-textColor-basic border-2 border-textColor-basic hover:bg-primary-50 active:bg-primary-100 data-[disabled=true]:bg-primary-50 data-[disabled=true]:text-textColor-faint  data-[disabled=true]:border-textColor-faint",
      },
    },
    defaultVariants: {
      size: "md",
      colorTheme: "primary",
    },
  }
);

type PillButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof pillButtonStylesProps> & {
    asChild?: boolean;
    iconLeft?: React.ReactNode;
    iconRight?: React.ReactNode;
  };

export const PillButton = ({
  asChild,
  children,
  className,
  iconLeft,
  iconRight,
  size,
  colorTheme,
  disabled,
  ...props
}: PillButtonProps) => {
  const IconLeft = iconLeft && (
    <span data-disabled={disabled} className="data-[disabled=true]:opacity-20">
      {iconLeft}
    </span>
  );
  const IconRight = iconRight && (
    <span data-disabled={disabled} className="data-[disabled=true]:opacity-20">
      {iconRight}
    </span>
  );

  // Slotコンポーネントを使うとasChild=true時にアイコンを設定した状態でaタグを内包した場合
  // アイコンとテキストが並列にレンダリングされてしまうため、
  // asChild=true時は常にchildrenの中にアイコンとテキストをレンダリングする。
  if (asChild && React.isValidElement(children)) {
    const childElement = children as React.ReactElement<
      {
        className?: string;
        children?: React.ReactNode;
      } & Record<string, unknown>
    >;

    return React.cloneElement(childElement, {
      // 子要素が元々持っている props
      ...childElement.props,
      "data-disabled": disabled,
      className: cn(
        pillButtonStylesProps({ size, colorTheme }),
        className,
        childElement.props.className
      ),
      // children はアイコン + 元々の子供
      children: (
        <>
          {IconLeft}
          {childElement.props.children}
          {IconRight}
        </>
      ),
    });
  }

  return (
    <button
      type="button"
      className={cn(pillButtonStylesProps({ size, colorTheme }), className)}
      data-disabled={disabled}
      {...props}
    >
      {IconLeft}
      {children}
      {IconRight}
    </button>
  );
};
