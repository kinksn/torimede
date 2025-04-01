"use client";

import * as motion from "motion/react-client";
import { ImageItem } from "@/components/basic/ImageItem";
import { useState } from "react";
import { PostId, PostImage } from "@/app/api/post/model";
import { UserId } from "@/app/api/user/model";
import { HoloEffect } from "@/app/user/[userId]/_components/HoloEffect";

type KiraImageProps = {
  post: {
    id: PostId;
    userId: UserId;
    images: PostImage[];
  };
};

export const KiraImage = ({ post }: KiraImageProps) => {
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const { images } = post;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.8,
        scale: { type: "spring", visualDuration: 0.4, bounce: 0.2 },
      }}
      onAnimationComplete={() => {
        setIsAnimationComplete(true);
      }}
    >
      <HoloEffect onParentAnimationComplete={isAnimationComplete}>
        <ImageItem
          imageUrl={images[0].url}
          // `53px`SP時のheaderの縦幅
          className="max-sm:max-h-[calc(100svh-53px)]"
          imageContainerClassName="max-sm:max-h-[inherit]"
          imageClassName="max-sm:max-h-[inherit] max-sm:object-cover"
        />
      </HoloEffect>
    </motion.div>
  );
};
