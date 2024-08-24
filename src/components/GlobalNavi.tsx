"use client";

import { Bird } from "lucide-react";
import Link from "next/link";
import { SearchForm } from "@/components/SearchForm";
import { signOut, useSession } from "next-auth/react";
import { Session } from "next-auth";
import { usePathname } from "next/navigation";

type GlobalNaviProps = {
  initialSession: Session | null;
};

export const GlobalNavi = ({ initialSession }: GlobalNaviProps) => {
  const { data: session } = useSession();
  const pathname = usePathname();
  // サーバーから得たセッション情報とクライアントのセッション情報を組み合わせている
  const isAuthenticated = initialSession || session;

  const ignorePath = ["/login", "/signup"];
  const isIgnoredPath = ignorePath.includes(pathname);

  if (isIgnoredPath) return null;

  return (
    <div className="navbar bg-neutral-100">
      <div className="container">
        <div className="flex-1">
          <Link className="flex items-center gap-1" href="/">
            <Bird />
            <span className="text-md font-bold leading-tight">PIPI BLOG</span>
          </Link>
        </div>
        <SearchForm />
        <div className="flex-none">
          <div className="flex">
            {isAuthenticated ? (
              <>
                <Link
                  href="/create"
                  className="btn btn-ghost hover:bg-yellow-400 hover:text-white"
                >
                  投稿
                </Link>
                <button
                  className="btn btn-ghost hover:bg-yellow-400 hover:text-white"
                  onClick={() => signOut()}
                >
                  ログアウト
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="btn btn-ghost hover:bg-yellow-400 hover:text-white"
                >
                  ログイン
                </Link>
                <Link
                  href="/signup"
                  className="btn btn-ghost hover:bg-yellow-400 hover:text-white"
                >
                  新規登録
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
