"use client";

import Ztext from "react-ztext";
import MedeMoji from "@/components/assets/ornament/mede-moji.svg";
import { useEffect, useRef } from "react";
import { SVGIcon } from "@/components/ui/SVGIcon";

export const MEDEMOJI_COLORS = {
  bloodOrange: {
    front: "text-tertialy-bloodOrange-400",
    back: "[&>div>span>span:not(:first-of-type)>span]:text-tertialy-bloodOrange-800",
  },
  oceanBlue: {
    front: "text-tertialy-oceanblue-400",
    back: "[&>div>span>span:not(:first-of-type)>span]:text-tertialy-oceanblue-800",
  },
  secondary: {
    front: "text-secondary-medemojiFront",
    back: "[&>div>span>span:not(:first-of-type)>span]:text-secondary-medemojiBack",
  },
} as const;

export type MedeMojiColorsVariant = keyof typeof MEDEMOJI_COLORS;

type Props = {
  x: number; // 配置先のX座標
  y: number; // 配置先のY座標
  variant: MedeMojiColorsVariant;
  onAnimationEnd: () => void; // アニメ終了時に呼び出すコールバック
};

export function MedeMojiItem({ x, y, variant, onAnimationEnd }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const { back, front } = MEDEMOJI_COLORS[variant];

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    // CSSアニメーション完了をフック
    const handleAnimationEnd = (e: AnimationEvent) => {
      // 複数アニメーションがあるが、fadeOut終了時のみ削除する
      if (e.animationName === "fadeOut") {
        onAnimationEnd();
      }
    };

    el.addEventListener("animationend", handleAnimationEnd);
    return () => {
      el.removeEventListener("animationend", handleAnimationEnd);
    };
  }, [onAnimationEnd]);

  return (
    <div
      ref={rootRef}
      style={{
        position: "absolute",
        left: x,
        top: y,
        pointerEvents: "none",
        animation: "fadeOut 1.1s ease-out both",
      }}
    >
      <span className={`${back} inline-block`}>
        <Ztext
          depth="20px"
          direction="both"
          event="none"
          eventRotation="30deg"
          eventDirection="default"
          fade={false}
          perspective="160px"
          layers={120}
          style={{
            animation: "rotateSphereYOutLeftTop 1.1s ease-out both",
            transformStyle: "preserve-3d",
            position: "relative",
          }}
        >
          <span
            className={`text-[100px] ${front} font-bold font-zenMaruGothic`}
          >
            <SVGIcon svg={MedeMoji} className="w-20" />
          </span>
        </Ztext>
      </span>
    </div>
  );
}
