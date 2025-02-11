import Link from "next/link";
import MedeChan from "@/components/assets/mede-chan/default-pale.svg";
import { PillButton } from "@/components/basic/PillButton";
import { ContentToolbar } from "@/components/ContentToolbar";
import { SVGIcon } from "@/components/ui/SVGIcon";

export default function NotFound() {
  return (
    <>
      <ContentToolbar />
      <div className="flex flex-col justify-center items-center h-[calc(100%-88px)] max-sm:h-auto max-sm:pb-5 max-sm:px-5">
        <div className="flex flex-col justify-center items-center gap-4 max-sm:gap-0">
          <div className="flex gap-4 font-comfortaa text-primary-700 text-[200px] max-sm:text-[96px] leading-none font-bold">
            <div className="max-sm:pt-4">4</div>
            <SVGIcon svg={MedeChan} className="w-[188px] max-sm:w-[84px]" />
            <div className="max-sm:pt-4">X</div>
          </div>
          <h2 className="text-typography-xxl max-sm:text-typography-lg max-sm:font-bold text-primary-700 font-bold font-zenMaruGothic leading-normal">
            ページが見つかりませんでした
          </h2>
          <p>削除された可能性もあります</p>
          <PillButton className="flex max-sm:mt-3" asChild>
            <Link href="/">トップページに戻る</Link>
          </PillButton>
        </div>
      </div>
    </>
  );
}
