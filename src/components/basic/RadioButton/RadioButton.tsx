"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

const radioButtonItemStyles = cva(
  "rounded-full flex items-center justify-center [&[data-state=checked]>span>svg]:hidden [&[data-state=checked]>span]:block [&[data-state=checked]>span]:bg-white [&[data-state=checked]>span]:w-3 [&[data-state=checked]>span]:h-3 [&[data-state=checked]>span]:rounded-full",
  {
    variants: {
      size: {
        md: "w-6 h-6",
      },
      colorTheme: {
        primary:
          "border-2 border-primary-700 [&[data-state=checked]]:bg-primary-700 [&[data-state=checked]>span]:border-primary-700",
      },
    },
    defaultVariants: {
      size: "md",
      colorTheme: "primary",
    },
  }
);

type RadioButtonItemProps = VariantProps<typeof radioButtonItemStyles> &
  Omit<
    React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>,
    "options"
  > & {
    options: { label: string; value: string }[];
    containerClassName?: string;
    itemClassName?: string;
  };

export const RadioButton = ({
  options,
  containerClassName,
  itemClassName,
  size,
  colorTheme,
  onChange,
}: RadioButtonItemProps) => {
  return (
    <RadioGroup className={cn("", containerClassName)} onChange={onChange}>
      {options.map((option, index) => (
        <div
          key={`${option.value}-${index}`}
          className="flex items-center gap-2"
        >
          <RadioGroupItem
            value={option.value}
            id={index.toString()}
            className={cn(
              radioButtonItemStyles({ size, colorTheme }),
              itemClassName
            )}
          />
          <label htmlFor={index.toString()} className="cursor-pointer">
            {option.label}
          </label>
        </div>
      ))}
    </RadioGroup>
  );
};
