import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Input as ShadcnInput } from "@/components/ui/input";
import React from "react";
import { FormLabel } from "@/components/basic/FormLabel";
import { FormControl, FormItem, FormMessage } from "@/components/ui/form";

const inputStylesProps = cva(
  "px-3 bg-primary-50 border-2 border-transparent !text-base transition-all !mt-0 font-medium shadow-transparent placeholder:text-faint",
  {
    variants: {
      size: {
        md: "h-[60px]",
      },
      colorTheme: {
        primary:
          "hover:border-tertialy-oceanblue-400 focus:!shadow-inputActive focus:border-tertialy-oceanblue-400",
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

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> &
  VariantProps<typeof inputStylesProps> & {
    label?: string;
    requirement?: "optional" | "required";
    error?: boolean;
  };

export const Input = ({
  size,
  className,
  label,
  colorTheme,
  requirement,
  disabled,
  error = false,
  ...props
}: InputProps) => {
  return (
    <FormItem className="flex flex-col">
      {label && (
        <FormLabel requirement={requirement} className="mb-2">
          {label}
        </FormLabel>
      )}
      <FormControl>
        <ShadcnInput
          disabled={disabled}
          className={cn(
            inputStylesProps({
              size,
              colorTheme,
              isDesabled: disabled ? true : false,
              isError: error ? true : false,
            }),
            className
          )}
          style={{ boxShadow: "unset", outline: "unset" }}
          {...props}
        />
      </FormControl>
      <FormMessage className="!mt-1 text-state-error letter-spacing-[0] text-xs" />
    </FormItem>
  );
};
