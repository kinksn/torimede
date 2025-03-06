import React, { useRef } from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { FormLabel } from "@/components/basic/FormLabel";
import { FormControl, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea as ShadcnTextarea } from "@/components/ui/textarea";

// TODO：transition-allをborderとshadowに絞って効かせる
const textareaStylesProps = cva(
  "px-3 bg-primary-50 rounded-md border-2 border-transparent !text-base !transition-all   !mt-0 font-medium shadow-transparent placeholder:text-faint !outline-none",
  {
    variants: {
      size: {
        md: "min-h-20",
      },
      colorTheme: {
        primary:
          "hover:border-tertialy-oceanblue-400 focus:!shadow-inputActive focus:border-tertialy-oceanblue-400 focus-visible:!border-tertialy-oceanblue-400",
      },
      isDesabled: {
        true: "bg-achromatic-100 hover:border-transparent",
        false: "",
      },
      isError: {
        true: "!bg-tertialy-bloodOrange-50 !border-state-error !shadow-inputActiveError focus:!shadow-inputActiveError",
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
      colorTheme: "primary",
      isError: false,
      isDesabled: false,
    },
  }
);

type TextareaProps = React.ComponentProps<"textarea"> &
  VariantProps<typeof textareaStylesProps> & {
    label?: string;
    requirement?: "optional" | "required";
    error?: boolean;
  };

export const Textarea = ({
  size,
  className,
  label,
  colorTheme,
  requirement,
  disabled,
  error = false,
  ...props
}: TextareaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  return (
    <FormItem className={cn("flex flex-col h-full", className)}>
      {label && (
        <FormLabel requirement={requirement} className="mb-2">
          {label}
        </FormLabel>
      )}
      <FormControl>
        <ShadcnTextarea
          ref={textareaRef}
          disabled={disabled}
          onChange={handleInput}
          onInput={handleInput}
          className={cn(
            textareaStylesProps({
              size,
              colorTheme,
              isDesabled: disabled ? true : false,
              isError: error ? true : false,
            })
          )}
          {...props}
        />
      </FormControl>
      <FormMessage className="!mt-1 text-state-error letter-spacing-[0] text-xs" />
    </FormItem>
  );
};
