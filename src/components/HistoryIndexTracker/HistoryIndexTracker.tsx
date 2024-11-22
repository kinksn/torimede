"use client";

import { useInterceptPopState } from "@/components/HistoryIndexTracker/hook/useInterceptPopState";
import React from "react";

export type Pathname = `/${string}`;

export function HistoryIndexTracker({
  children,
  pathname,
}: {
  children: React.ReactNode;
  pathname: Pathname;
}) {
  useInterceptPopState(pathname);

  return <>{children}</>;
}
