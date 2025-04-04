"use client";

import { useUIBlock } from "@/hooks/useUIBlock";
import { useCallback, useEffect } from "react";

export const UIBlocker = ({ zIndex = 9999 }: { zIndex?: number }) => {
  const { isUIBlock } = useUIBlock();

  const updateViewport = useCallback(() => {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      if (isUIBlock) {
        viewport.setAttribute(
          "content",
          "width=device-width, initial-scale=1, maximum-scale=1"
        );
      } else {
        viewport.setAttribute("content", "width=device-width, initial-scale=1");
      }
    }
  }, [isUIBlock]);

  useEffect(() => {
    updateViewport();
  });

  if (!isUIBlock) return null;

  return (
    <div
      className="fixed w-screen h-screen inset-0 bg-transparent"
      style={{
        userSelect: "none",
        WebkitUserSelect: "none",
        touchAction: "none",
        WebkitTouchCallout: "none",
        zIndex: zIndex,
      }}
      role="presentation"
      aria-hidden="true"
      onTouchMove={(e) => e.preventDefault()}
      onClick={(e) => e.preventDefault()}
    />
  );
};
