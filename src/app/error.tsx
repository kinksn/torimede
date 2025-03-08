"use client"; // Error boundaries must be Client Components

import MedeChan from "@/components/assets/mede-chan/default-pale.svg";
import { PillButton } from "@/components/basic/PillButton";
import { ContentToolbar } from "@/components/ContentToolbar";
import { SVGIcon } from "@/components/ui/SVGIcon";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <>
      <ContentToolbar />
      <div className="flex flex-col justify-center items-center h-[calc(100%-88px)] max-sm:h-auto max-sm:pb-5 max-sm:px-5">
        <div className="flex flex-col justify-center items-center gap-4 max-sm:gap-0">
          <div className="flex gap-4 font-comfortaa text-primary-700 text-[200px] max-sm:text-[96px] leading-none font-bold">
            <div className="max-sm:pt-4">5</div>
            <SVGIcon svg={MedeChan} className="w-[188px] max-sm:w-[84px]" />
            <div className="max-sm:pt-4">X</div>
          </div>
          <h2 className="text-typography-xxl max-sm:text-typography-lg max-sm:font-bold text-primary-700 font-bold font-zenMaruGothic leading-normal">
            ページは表示できませんでした
          </h2>
          <p>しばらくしてから再度アクセスしてみてください</p>
          <PillButton
            className="flex max-sm:mt-3"
            onClick={
              // Attempt to recover by trying to re-render the segment
              () => reset()
            }
          >
            もう一度読み込む
          </PillButton>
        </div>
      </div>
    </>
  );
}
