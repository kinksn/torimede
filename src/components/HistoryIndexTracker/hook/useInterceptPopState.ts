"use client";

import { useIsomorphicLayoutEffect } from "@/lib/util/useIsomorphicLayoutEffect";
import { useAtom } from "jotai";
import { setupHistoryAugmentationOnce } from "@/components/HistoryIndexTracker/util/historyAugmentation";
import { historyIndexTrackerIndexAtom } from "@/lib/globalState/historyIndexTrackerIndexAtom";
import { Pathname } from "@/components/HistoryIndexTracker/HistoryIndexTracker";

type RenderedState = {
  // 現在のナビゲーションスタックのインデックス
  index: number;
};

type HistoryState = {
  __history_index_tracker_index: number;
};

// 現在のナビゲーション状態を追跡するために使用するオブジェクト
const renderedStateRef: { current: RenderedState } = {
  current: { index: -1 },
};

export function useInterceptPopState(pathname: Pathname) {
  const [_, setNextIndex] = useAtom(historyIndexTrackerIndexAtom);

  useIsomorphicLayoutEffect(() => {
    // NOTE: Called before Next.js router setup which is useEffect().
    // https://github.com/vercel/next.js/blob/50b9966ba9377fd07a27e3f80aecd131fa346482/packages/next/src/client/components/app-router.tsx#L518
    setupHistoryAugmentationOnce({ renderedStateRef, setNextIndex, pathname });
    const handlePopState = createHandlePopState();

    const onPopState = (event: PopStateEvent) => {
      handlePopState(event.state);
    };

    // NOTE: Called before Next.js router setup which is useEffect().
    // https://github.com/vercel/next.js/blob/50b9966ba9377fd07a27e3f80aecd131fa346482/packages/next/src/client/components/app-router.tsx#L518
    // NOTE: capture on popstate listener is not working on Chrome.
    window.addEventListener("popstate", onPopState);

    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }, []);
}

function createHandlePopState() {
  return (nextState: HistoryState) => {
    const nextIndex: number =
      Number(nextState.__history_index_tracker_index) || 0;
    renderedStateRef.current.index = nextIndex;
  };
}
