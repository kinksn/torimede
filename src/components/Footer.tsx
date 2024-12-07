"use client";

import React from "react";
import { usePathname } from "next/navigation";
import LogoIcon from "@/components/assets/logo.svg";
import { SVGIcon } from "@/components/ui/SVGIcon";

export const Footer = () => {
  const pathname = usePathname();
  const ignorePath = ["/login", "/signup"];
  const isIgnoredPath = ignorePath.includes(pathname);

  if (isIgnoredPath) return null;

  return (
    <div className="w-full">
      <SVGIcon svg={LogoIcon} className="text-primary-700 w-[140px]" />
      <p className="text-typography-md">
        トリメデは鳥さんを愛でることに特化した写真共有サービスです。<br></br>
        街中で野鳥を眺めるような気持ちでお楽しみください。
      </p>
      <small className="font-comfortaa">Created By SHUNYA KATAOKA</small>
    </div>
  );
};
