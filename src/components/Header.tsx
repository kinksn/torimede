"use client";

import Link from "next/link";
import Logo from "@/components/assets/logo-color-fixed.svg";
import { SearchForm } from "@/components/SearchForm";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { usePathname } from "next/navigation";
import { SVGIcon } from "@/components/ui/SVGIcon";
import { TextButton } from "@/components/basic/TextButton";
import { Button } from "@/components/basic/Button";
import { AccountMenu } from "@/components/AccountMenu";
import { useState } from "react";
import { Separator } from "@radix-ui/react-separator";

const showIgnorePath = ["/login", "/signup"];

type HeaderProps = {
  initialSession: Session | null;
  profileImage: string | null | undefined;
};

export const Header = ({ initialSession, profileImage }: HeaderProps) => {
  const { data: session } = useSession();
  const pathname = usePathname();

  // サーバーから得たセッション情報とクライアントのセッション情報を組み合わせている
  const isAuthenticated = initialSession || session;

  const isIgnoredPath = showIgnorePath.includes(pathname);

  if (isIgnoredPath) return null;

  return (
    <header>
      <div className={`h-[88px] max-sm:h-[53px] w-full`}></div>
      <div className="flex items-center w-full px-2 pt-2 max-sm:px-0 max-sm:pt-0 bg-neutral-100 fixed top-0 left-0 z-50 max-sm:flex-col">
        <div className="relative flex items-center bg-white rounded-20 max-sm:rounded-none justify-between w-full py-4 max-sm:py-[2px] px-10 max-sm:px-5">
          <Link
            className="flex items-center gap-1"
            href="/"
            aria-label="トップページへ"
          >
            <SVGIcon svg={Logo} className="w-[90px] max-sm:w-[80px]" />
          </Link>
          <div
            className={`absolute max-sm:static max-sm:ml-auto left-1/2 -translate-x-2/4 max-sm:translate-x-0 flex items-center justify-center`}
          >
            <SearchForm
              className={`w-[620px] max-md:w-[420px] max-sm:w-full`}
            />
          </div>
          <div className="flex items-center gap-5 max-sm:gap-2">
            {isAuthenticated ? (
              <>
                <Button
                  className="max-sm:h-9 max-sm:text-typography-sm max-sm:font-bold"
                  asChild
                >
                  <Link href="/create">投稿</Link>
                </Button>
                <AccountMenu
                  initialSession={initialSession}
                  profileImage={profileImage}
                />
              </>
            ) : (
              <>
                <TextButton
                  className="max-sm:h-9 max-sm:text-typography-sm max-sm:font-bold"
                  asChild
                >
                  <Link href="/login">ログイン</Link>
                </TextButton>
                <Button
                  className="max-sm:h-9 max-sm:text-typography-sm max-sm:font-bold"
                  asChild
                >
                  <Link href="/signup">新規登録</Link>
                </Button>
              </>
            )}
          </div>
        </div>
        <Separator className="border-[0.5px] hidden border-textColor-faint max-sm:block max-sm:w-full" />
      </div>
    </header>
  );
};
