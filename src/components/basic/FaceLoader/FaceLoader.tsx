"use client";

// TODO：パスアニメーションを実装する

import type { SVGProps } from "react";
import { motion } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const faceLoaderStylesProps = cva(
  "rounded-full flex items-center justify-center bg-secondary-100",
  {
    variants: {
      size: {
        md: "w-12 h-12",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

type FaceLoaderProps = SVGProps<SVGSVGElement> &
  VariantProps<typeof faceLoaderStylesProps> & {
    // isAnimating?: boolean;
    className?: string;
  };

export const FaceLoader = ({
  size = "md",
  // isAnimating = true,
  className,
}: FaceLoaderProps) => {
  // const pathVariants = {
  //   initial: { y: 0 },
  //   animate: { y: [0, -2, 0, 2, 0] },
  // };

  return (
    <div className={cn(faceLoaderStylesProps({ size }), className)}>
      <motion.svg
        // width={size}
        // height={size / 3}
        className={`text-tertialy-oceanblue-400 ${size === "md" && "w-7"}`}
        viewBox="0 0 24 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 1.2,
        }}
      >
        <motion.path
          d="M5.81818 3.0697C5.81818 5.32911 3.90729 5.89433 2.52391 5.81029C1.00739 5.71816 7.33932e-05 5.42151 1.80513e-09 3.06975C-5.40785e-05 1.33679 1.21505 0 2.85068 0C3.99262 0 5.81818 0.965504 5.81818 3.0697Z"
          fill="currentColor"
          // variants={pathVariants}
          // animate={isAnimating ? "animate" : "initial"}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 1.5,
            delay: 0,
          }}
        />
        <motion.path
          d="M18.1818 3.0697C18.1818 5.32911 20.0927 5.89433 21.4761 5.81029C22.9926 5.71816 23.9999 5.42151 24 3.06975C24.0001 1.33679 22.7849 0 21.1493 0C20.0074 0 18.1818 0.965504 18.1818 3.0697Z"
          fill="currentColor"
          // variants={pathVariants}
          // animate={isAnimating ? "animate" : "initial"}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 1.5,
            delay: 0.5,
          }}
        />
        <motion.path
          d="M13.9709 1.51224C13.3455 1.02313 12.5768 0.727295 11.9243 0.727295C11.0937 0.727295 10.5302 0.916764 9.72931 1.51224C8.56727 2.37627 7.27246 5.38602 7.27246 6.23669C7.27246 7.08736 7.90806 7.54363 8.51823 7.69056C9.1284 7.8375 11.9243 8.19119 15.2282 7.86809C15.8417 7.80808 17.1638 7.69056 16.5828 5.56821C16.0329 3.55951 14.3861 1.83704 13.9709 1.51224Z"
          fill="currentColor"
          // variants={pathVariants}
          // animate={isAnimating ? "animate" : "initial"}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 1.5,
            delay: 0.25,
          }}
        />
      </motion.svg>
    </div>
  );
};
