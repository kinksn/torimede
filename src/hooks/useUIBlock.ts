"use client";

import { useAtom } from "jotai";
import { uiBlockAtom } from "@/lib/atom/uiBlock";

export const useUIBlock = () => {
  const [isUIBlock, setIsUIBlock] = useAtom(uiBlockAtom);

  const block = () => setIsUIBlock(true);
  const unblock = () => setIsUIBlock(false);

  return {
    isUIBlock,
    block,
    unblock,
  };
};
