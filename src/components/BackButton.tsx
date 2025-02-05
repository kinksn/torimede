"use client";

import ArrowLeft from "@/components/assets/icon/arrow-left.svg";
import { PillButton } from "@/components/basic/PillButton";
import { SVGIcon } from "@/components/ui/SVGIcon";
import { useRouter } from "next/navigation";

type BackButtonProps = {
  className?: string;
};

const BackButton = ({ className }: BackButtonProps) => {
  const router = useRouter();

  return (
    <PillButton
      colorTheme={"outline"}
      iconLeft={<SVGIcon svg={ArrowLeft} className="w-6" />}
      onClick={() => router.back()}
      className={className}
    >
      戻る
    </PillButton>
  );
};

export default BackButton;
