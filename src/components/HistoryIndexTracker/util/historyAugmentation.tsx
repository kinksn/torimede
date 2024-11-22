"use client";

import { Pathname } from "@/components/HistoryIndexTracker/HistoryIndexTracker";
import { DEBUG } from "@/lib/constants/debug";

type RenderedState = {
  // 現在のナビゲーションスタックのインデックス
  index: number;
};

let setupDone = false;
let writeState = () => {};

const updateIndexWithDelay = (
  setNextIndex: (index: number) => void,
  index: number
) => {
  setTimeout(() => {
    setNextIndex(index);
  }, 0);
};

// 初回読み込み時history.stateに独自のステータスを追加する関数
// Next.js also modifies history.pushState and history.replaceState in useEffect.
// And it's order seems to be not guaranteed.
// So we setup only once before Next.js does.
export function setupHistoryAugmentationOnce({
  renderedStateRef,
  setNextIndex,
  pathname,
}: {
  renderedStateRef: { current: RenderedState };
  setNextIndex: (index: number) => void;
  pathname: Pathname;
}): { writeState: () => void } {
  if (setupDone) return { writeState };

  if (DEBUG) console.log("setupHistoryAugmentationOnce: setup");

  const originalPushState = window.history.pushState;
  const originalReplaceState = window.history.replaceState;
  if (DEBUG) {
    (window as any).__next_navigation_guard_debug_history_aug = {
      originalPushState,
      originalReplaceState,
    };
  }

  renderedStateRef.current.index =
    Number(window.history.state.__history_index_tracker_index) || 0;

  if (DEBUG)
    console.log(
      `setupHistoryAugmentationOnce: initial currentIndex is ${renderedStateRef.current.index}`
    );

  writeState = () => {
    if (DEBUG)
      console.log(
        `setupHistoryAugmentationOnce: write state by replaceState(): currentIndex is ${renderedStateRef.current.index}`
      );

    const modifiedState = {
      ...window.history.state,
      __history_index_tracker_index: renderedStateRef.current.index,
    };

    originalReplaceState.call(
      window.history,
      modifiedState,
      "",
      window.location.href
    );
  };

  if (window.history.state.__history_index_tracker_index == null) {
    writeState();
  }

  // ブラウザの進む戻るでは発火せずページ遷移のタイミングで
  window.history.pushState = function (state, unused, url) {
    if (typeof url === "string") {
      // Pre-increment to avoid race condition.
      url.startsWith(pathname) && ++renderedStateRef.current.index;
    } else {
      renderedStateRef.current.index = 0;
    }

    if (DEBUG)
      console.log(
        `setupHistoryAugmentationOnce: push: currentIndex is ${renderedStateRef.current.index}`
      );

    const modifiedState = {
      ...state,
      __history_index_tracker_index: renderedStateRef.current.index,
    };

    updateIndexWithDelay(setNextIndex, renderedStateRef.current.index);
    originalPushState.call(this, modifiedState, unused, url);
  };

  window.history.replaceState = function (state, unused, url) {
    if (DEBUG)
      console.log(
        `setupHistoryAugmentationOnce: replace: currentIndex is ${renderedStateRef.current.index}`
      );

    const modifiedState = {
      ...state,
      __history_index_tracker_index: renderedStateRef.current.index,
    };

    updateIndexWithDelay(setNextIndex, renderedStateRef.current.index);
    originalReplaceState.call(this, modifiedState, unused, url);
  };

  setupDone = true;

  return { writeState };
}
