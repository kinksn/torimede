"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

type SliderProps = React.ComponentPropsWithoutRef<
  typeof SliderPrimitive.Root
> & {
  label?: string;
};

export const Slider = ({
  className,
  label = "ズーム",
  ...props
}: SliderProps) => (
  <div className="flex items-center gap-2">
    <p className="text-sm whitespace-nowrap font-zenMaruGothic font-bold">
      {label}
    </p>
    <SliderPrimitive.Root
      className={cn(
        "relative flex items-center w-full touch-none select-none",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-tertialy-oceanblue-50">
        <SliderPrimitive.Range className="absolute h-full bg-tertialy-oceanblue-400" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="relative block h-5 w-5 rounded-full bg-white transition-colors shadow-sliderThumb disabled:pointer-events-none hover:cursor-grab active:cursor-grab before:content-[''] before:block before:absolute before:top-1 before:left-1 before:rounded-full before:w-3 before:h-3 before:bg-tertialy-oceanblue-400" />
    </SliderPrimitive.Root>
  </div>
);
