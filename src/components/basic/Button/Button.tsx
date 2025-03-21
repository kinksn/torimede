"use client";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

const buttonStylesProps = cva(
  `flex items-center gap-1 transition-all font-zenMaruGothic border-2 px-4 rounded-md font-bold data-[disabled=true]:bg-transparent data-[disabled=true]:hover:bg-transparent data-[disabled=true]:cursor-not-allowed data-[disabled=true]:pointer-events-none data-[disabled=true]:shadow-none`,
  {
    variants: {
      size: {
        lg: "h-[60px] text-typography-lg",
        md: "h-12 text-typography-md",
        sm: "h-9 text-typography-sm",
      },
      colorTheme: {
        primary:
          "bg-primary-700 text-white border-primary-800 shadow-buttonPrimaryDefault hover:bg-primary-800 hover:shadow-buttonPrimaryHover hover:border-primary-900 active:shadow-buttonPrimaryActive active:border-primary-700 active:text-textColor-weak data-[disabled=true]:border-none data-[disabled=true]:bg-primary-50 data-[disabled=true]:text-textColor-faint",
        outline:
          "bg-white text-textColor-basic shadow-buttonOutlineDefault border-textColor-basic hover:bg-primary-50 hover:shadow-buttonOutlineHover active:bg-primary-100 active:shadow-buttonOutlineActive data-[disabled=true]:border-textColor-weak data-[disabled=true]:text-textColor-weak data-[disabled=true]:bg-primary-50",
      },
    },
    defaultVariants: {
      size: "md",
      colorTheme: "primary",
    },
  }
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonStylesProps> & {
    asChild?: boolean;
    iconLeft?: React.ReactNode;
    iconRight?: React.ReactNode;
  };

export const Button = ({
  asChild,
  children,
  className,
  iconLeft,
  iconRight,
  size,
  colorTheme,
  disabled,
  ...props
}: ButtonProps) => {
  const IconLeft = iconLeft && (
    <span data-disabled={disabled} className="pr-[6px]">
      {iconLeft}
    </span>
  );
  const IconRight = iconRight && (
    <span data-disabled={disabled} className="pl-[6px]">
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
        buttonStylesProps({ size, colorTheme }),
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
      className={cn(buttonStylesProps({ size, colorTheme }), className)}
      data-disabled={disabled}
      {...props}
    >
      {IconLeft}
      {children}
      {IconRight}
    </button>
  );
};
