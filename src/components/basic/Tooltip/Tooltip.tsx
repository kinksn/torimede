import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import {
  Tooltip as ShadcnTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { useMemo, useState } from "react";
import { breakText } from "@/lib/util/breakText";

const baseClasses =
  "relative rounded-[12px] border-none bg-primary-900 text-white font-zenMaruGothic font-bold leading-loose overflow-visible whitespace-pre-line";

const tooltipStylesProps = cva("", {
  variants: {
    unstyled: {
      true: "",
      false: baseClasses,
    },
    size: {
      md: "p-3 text-typography-sm",
      unstyled: "",
    },
    side: {
      top: "-translate-x-1/2 -translate-y-1/2 left-1/2 -bottom-3",
      right: "rotate-90 -left-[6px] top-1/2 bottom-1/2",
      left: "-rotate-90 -right-[6px] top-1/2 bottom-1/2",
      bottom:
        "rotate-180 -translate-x-1/2 -translate-y-1/2 left-1/2 -top-[4px]",
    },
  },
  defaultVariants: {
    unstyled: false,
    size: "md",
  },
});

type TooltipProps = React.ButtonHTMLAttributes<HTMLDivElement> &
  VariantProps<typeof tooltipStylesProps> &
  React.ComponentProps<typeof TooltipPrimitive.Content> &
  React.ComponentProps<typeof TooltipPrimitive.Root> & {
    label: string;
    children: React.ReactNode;
    disabled?: boolean;
  };

export const Tooltip = ({
  label,
  children,
  disabled,
  size,
  open,
  onOpenChange,
  className,
  side = "top",
}: TooltipProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (disabled) {
    return <div>{children}</div>;
  }

  const onOpen = open !== undefined ? open : isOpen;

  return (
    <TooltipProvider delayDuration={0}>
      <ShadcnTooltip open={onOpen} onOpenChange={onOpenChange}>
        {open !== undefined ? (
          <TooltipTrigger asChild>
            <div>{children}</div>
          </TooltipTrigger>
        ) : (
          <TooltipTrigger
            asChild
            onMouseEnter={() => {
              setIsOpen(true);
            }}
            onMouseLeave={() => {
              setIsOpen(false);
            }}
            onFocus={() => {
              setIsOpen(true);
            }}
            onBlur={() => {
              setIsOpen(false);
            }}
          >
            <div>{children}</div>
          </TooltipTrigger>
        )}

        <TooltipContent
          className={cn(tooltipStylesProps({ size }), className)}
          side={side}
        >
          <>
            <p>{breakText(label)}</p>
            <Arrow side={side} />
          </>
        </TooltipContent>
      </ShadcnTooltip>
    </TooltipProvider>
  );
};

const Arrow = ({
  side = "top",
  className,
}: React.ComponentProps<typeof TooltipPrimitive.Content>) => {
  return (
    <div
      className={cn(
        "absolute text-primary-900 transform",
        tooltipStylesProps({ side, size: "unstyled", unstyled: true }),
        className
      )}
    >
      <svg
        width="12"
        height="8"
        viewBox="0 0 12 8"
        fill="currentColor"
        className="w-3 h-2 block"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.6 5.86667C6.8 6.93333 5.2 6.93333 4.4 5.86667L-2.54292e-07 -9.53991e-08L12 9.53674e-07L7.6 5.86667Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
};
