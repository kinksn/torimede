"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { SVGIcon } from "@/components/ui/SVGIcon";
import LogoIcon from "@/components/assets/logo.svg";
import XIcon from "@/components/assets/icon/x.svg";
import Link from "next/link";

export const Footer = () => {
  const pathname = usePathname();
  const ignorePath = ["/login", "/signup"];
  const isIgnoredPath = ignorePath.includes(pathname);

  if (isIgnoredPath) return null;

  return (
    <div className="w-full py-10 px-2 max-sm:py-5 text-text-basic">
      <div className="bg-base-content py-20 px-20 rounded-20 grid grid-cols-2 max-sm:grid-cols-1 max-sm:gap-10 max-sm:py-10 max-sm:px-10">
        <div className="grid gap-4">
          <SVGIcon
            svg={LogoIcon}
            className="text-primary-700 w-[140px] max-sm:w-[90px]"
          />
          <p className="text-typography-md">
            トリメデは鳥さんを愛でることに特化した写真共有サービスです。
            <br className="max-sm:hidden"></br>
            街中で野鳥を眺めるような気持ちでお楽しみください。
          </p>
          <small className="font-comfortaa text-typography-xs">
            Created By SHUNYA KATAOKA
          </small>
        </div>
        <div className="self-end justify-self-end whitespace-nowrap max-sm:justify-self-start">
          <ul className="flex items-center gap-5 text-typography-sm font-bold max-sm:flex-col max-sm:justify-start max-sm:items-start">
            <li>
              <Link href="/">利用規約</Link>
            </li>
            <li>
              <Link href="/">プライバシーポリシー</Link>
            </li>
            <li>
              <a href="/" target="_blank">
                ご要望・お問い合わせ
              </a>
            </li>
            <li>
              <a href="https://x.com/" target="_blank">
                <SVGIcon svg={XIcon} className="text-primary-700 w-[24px]" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
