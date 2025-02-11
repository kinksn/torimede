"use client";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

const textButtonStylesProps = cva(
  `flex items-center gap-1 transition-all font-zenMaruGothic px-4 rounded-md font-bold text-base data-[disabled=true]:bg-transparent data-[disabled=true]:hover:bg-transparent data-[disabled=true]:cursor-not-allowed data-[disabled=true]:pointer-events-none`,
  {
    variants: {
      size: {
        md: "h-12 text-typography-md",
        sm: "h-9 text-typography-sm",
      },
      colorTheme: {
        primary:
          "text-textColor-basic hover:bg-primary-50 active:bg-primary-100 data-[disabled]:text-textColor-faint",
        red: "text-state-delete hover:bg-tertialy-fleshTomato-50 active:bg-tertialy-fleshTomato-100 data-[disabled]:text-tertialy-fleshTomato-100",
      },
    },
    defaultVariants: {
      size: "md",
      colorTheme: "primary",
    },
  }
);

type TextButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof textButtonStylesProps> & {
    asChild?: boolean;
    icon?: React.ReactNode;
  };

export const TextButton = ({
  asChild,
  children,
  className,
  icon,
  size,
  colorTheme,
  disabled,
  ...props
}: TextButtonProps) => {
  const Icon = icon && (
    <span data-disabled={disabled} className="data-[disabled=true]:opacity-20">
      {icon}
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
        textButtonStylesProps({ size, colorTheme }),
        className,
        childElement.props.className
      ),
      // children はアイコン + 元々の子供
      children: (
        <>
          {Icon}
          {childElement.props.children}
        </>
      ),
    });
  }

  return (
    <button
      type="button"
      className={cn(textButtonStylesProps({ size, colorTheme }), className)}
      data-disabled={disabled}
      {...props}
    >
      {Icon}
      {children}
    </button>
  );
};
