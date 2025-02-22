"use client";

import { useAtom } from "jotai";
import { uiBlockAtom } from "@/lib/atom/uiBlock";

export const useUIBlock = () => {
  const [uiBlock, setUiBlock] = useAtom(uiBlockAtom);

  const block = () => setUiBlock(true);
  const unblock = () => setUiBlock(false);

  return {
    uiBlock,
    block,
    unblock,
  };
};
