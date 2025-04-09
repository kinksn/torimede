import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Input as ShadcnInput } from "@/components/ui/input";
import { FormLabel } from "@/components/basic/FormLabel";
import { FormControl, FormItem, FormMessage } from "@/components/ui/form";

const inputStylesProps = cva(
  "px-3 bg-primary-50 border-2 border-transparent !text-base transition-all !mt-0 font-medium shadow-transparent placeholder:text-faint",
  {
    variants: {
      size: {
        md: "h-[60px]",
        sm: "h-9",
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
        true: "!bg-tertialy-bloodOrange-50 !border-state-error focus:!shadow-inputActiveError",
        false: "",
      },
      hasIcon: {
        true: "pl-11",
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
    inputClassName?: string;
    formMessageClassName?: string;
    icon?: React.ReactNode;
  };

export const Input = ({
  size,
  className,
  inputClassName,
  formMessageClassName,
  label,
  colorTheme,
  requirement,
  disabled,
  icon,
  error = false,
  ...props
}: InputProps) => {
  return (
    <FormItem className={cn("flex flex-col space-y-0 > *", className)}>
      {label && (
        <FormLabel requirement={requirement} size={size} className="mb-2">
          {label}
        </FormLabel>
      )}
      <FormControl>
        <div className="relative">
          {!!icon && (
            <div className="absolute top-0 left-0 w-12 h-full flex items-center justify-center">
              {icon}
            </div>
          )}
          <ShadcnInput
            disabled={disabled}
            className={cn(
              inputStylesProps({
                size,
                colorTheme,
                isDesabled: disabled ? true : false,
                isError: error ? true : false,
                hasIcon: !!icon ? true : false,
              }),
              inputClassName
            )}
            style={{ boxShadow: "unset", outline: "unset" }}
            {...props}
          />
        </div>
      </FormControl>
      <FormMessage
        className={cn(
          "!mt-1 text-state-error letter-spacing-[0] text-xs",
          formMessageClassName
        )}
      />
    </FormItem>
  );
};
