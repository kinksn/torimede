"use client";

import { usePathname } from "next/navigation";
import React from "react";

export const Footer = () => {
  const pathname = usePathname();
  const ignorePath = ["/login", "/signup"];
  const isIgnoredPath = ignorePath.includes(pathname);

  if (isIgnoredPath) return null;

  return <div className="w-full">Footer</div>;
};
