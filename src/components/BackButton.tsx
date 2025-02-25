"use client";

import ArrowLeft from "@/components/assets/icon/arrow-left.svg";
import { PillButton } from "@/components/basic/PillButton";
import { SVGIcon } from "@/components/ui/SVGIcon";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

type BackButtonProps = {
  className?: string;
  iconClassName?: string;
};

const BackButton = ({ className, iconClassName }: BackButtonProps) => {
  const router = useRouter();

  return (
    <PillButton
      colorTheme={"outline"}
      iconLeft={
        <SVGIcon svg={ArrowLeft} className={cn("w-6", iconClassName)} />
      }
      onClick={() => router.back()}
      className={className}
    >
      戻る
    </PillButton>
  );
};

export default BackButton;
