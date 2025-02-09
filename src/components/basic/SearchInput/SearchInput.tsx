"use client";

import { SVGIcon } from "@/components/ui/SVGIcon";
import { cn } from "@/lib/utils";
import { forwardRef, useState } from "react";
import SearchIcon from "@/components/assets/icon/search.svg";
import XmarkIcon from "@/components/assets/icon/x-mark.svg";
import { RoundButton } from "@/components/basic/RoundButton";
import { cva, type VariantProps } from "class-variance-authority";

const borderGradientStyles = `
  transition-all
  rounded-full
  relative
  before:transition-all
  before:content-['']
  before:block
  before:pointer-events-none
  before:absolute
  before:inset-0
  before:rounded-full
  before:p-[1px]
  before:bg-[linear-gradient(90deg,rgba(230,118,66,0)_0%,rgba(205,172,0,0)_50%,rgba(77,98,150,0)_100%)]
  before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]
  before:[-webkit-mask-composite:xor]
  before:[mask-composite:exclude]

  hover:before:bg-[linear-gradient(90deg,rgba(230,118,66,1)_0%,rgba(205,172,0,1)_50%,rgba(77,98,150,1)_100%)]

  [&.focused]:before:p-[2px]
  [&.focused]:before:bg-[linear-gradient(90deg,rgba(230,118,66,1)_0%,rgba(205,172,0,1)_50%,rgba(77,98,150,1)_100%)]
  [&.focused]:shadow-searchInput
`;

const searchInputStylesProps = cva(
  `border border-primary-50 outline-none bg-primary-50 h-12 pl-12 pr-[20px] max-sm:pr-3 rounded-full text-textColor-basic placeholder:text-textColor-weak hover:border-transparent`,
  {
    variants: {
      size: {
        md: "h-12",
        sm: "h-9 pl-10",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

type SearchInputProps = Omit<React.ComponentProps<"input">, "size"> &
  VariantProps<typeof searchInputStylesProps> & {
    onClear?: () => void;
  };

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ value, className, size, onChange, onClear, ...props }, ref) => {
    const [localValue, setLocalValue] = useState(value);
    const [isFocused, setIsFocused] = useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setLocalValue(event.target.value);
      onChange?.(event);
    };

    const handleClear = () => {
      setLocalValue("");
      onClear?.();
    };

    return (
      <div className="relative">
        <div
          className={`absolute top-0 z-10 ${
            size === "md" ? "left-4" : "left-2"
          } flex h-full item-center`}
        >
          <SVGIcon svg={SearchIcon} className="w-6 text-primary-700 " />
        </div>
        <div className={`${borderGradientStyles} ${isFocused && "focused"}`}>
          <input
            type="search"
            value={localValue}
            onChange={handleChange}
            className={cn(searchInputStylesProps({ size }), className)}
            onFocus={() => {
              setIsFocused(true);
            }}
            onBlurCapture={() => {
              setIsFocused(false);
            }}
            ref={ref}
            {...props}
          />
        </div>
        <div className="absolute top-0 right-0 flex h-full items-center">
          {String(localValue).length > 0 && (
            <RoundButton
              type="button"
              size={size === "md" ? "sm" : "xs"}
              colorTheme="white"
              className="mr-[6px]"
              icon={
                <SVGIcon
                  svg={XmarkIcon}
                  className={`${
                    size === "md" ? "w-3" : "w-2"
                  } text-primary-700`}
                />
              }
              onClick={handleClear}
            />
          )}
        </div>
      </div>
    );
  }
);
SearchInput.displayName = "SearchInput";
