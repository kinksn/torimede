"use client";

import * as motion from "motion/react-client";
import GlitterFillSVG from "@/components/assets/ornament/glitter-fill.svg";
import GlitterStrokeSVG from "@/components/assets/ornament/glitter-stroke.svg";
import { SVGIcon } from "@/components/ui/SVGIcon";

export type GlitterData = {
  id: string;
  x: number;
  y: number;
  delay: number;
  type: "fill" | "stroke";
};

type GlitterAnimationProps = {
  glitter: GlitterData;
  onComplete: (id: string) => void;
};

export const GlitterAnimation = ({
  glitter,
  onComplete,
}: GlitterAnimationProps) => {
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: [0.8, 1, 0.1], opacity: [0, 1, 0] }}
      transition={{
        duration: 1.2,
        ease: "easeInOut",
        times: [0, 0.5, 1],
        delay: glitter.delay,
      }}
      onAnimationComplete={() => onComplete(glitter.id)}
      style={{
        position: "absolute",
        zIndex: 9999,
        left: glitter.x,
        top: glitter.y,
        mixBlendMode: "color-dodge",
      }}
    >
      {/* 星の種類で分岐 */}
      {glitter.type === "fill" ? (
        <SVGIcon svg={GlitterFillSVG} className="w-8 h-8" />
      ) : (
        <SVGIcon svg={GlitterStrokeSVG} className="w-12 h-12" />
      )}
    </motion.div>
  );
};
