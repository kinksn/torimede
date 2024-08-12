"use client";

import { Bird } from "lucide-react";
import Link from "next/link";
import { SearchForm } from "@/components/SearchForm";
import { signOut, useSession } from "next-auth/react";

export const GlobalNavi = () => {
  const { status } = useSession();
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
            {status === "unauthenticated" && (
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
            {status === "authenticated" && (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
