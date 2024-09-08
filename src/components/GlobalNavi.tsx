"use client";

import { Bird } from "lucide-react";
import Link from "next/link";
import { SearchForm } from "@/components/SearchForm";
import { signOut, useSession } from "next-auth/react";
import { Session } from "next-auth";
import { usePathname } from "next/navigation";
import Image from "next/image";

type GlobalNaviProps = {
  initialSession: Session | null;
  profileImage: string | null | undefined;
};

export const GlobalNavi = ({
  initialSession,
  profileImage,
}: GlobalNaviProps) => {
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
            <span className="text-md font-bold leading-tight">トリメデ</span>
          </Link>
        </div>
        <SearchForm />
        <div className="flex-none">
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link
                  href="/create"
                  className="btn btn-ghost hover:bg-yellow-400 hover:text-white"
                >
                  投稿
                </Link>
                <div className="dropdown dropdown-end h-8">
                  <div tabIndex={0} className="avatar">
                    <div className="w-8 rounded-full">
                      {profileImage && (
                        <Image
                          src={session?.user?.image!}
                          alt=""
                          width="16"
                          height="16"
                        />
                      )}
                    </div>
                  </div>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                  >
                    <li>
                      <Link href={`/user/${session?.user?.id}`}>
                        マイページ
                      </Link>
                    </li>
                    <li onClick={() => signOut()}>
                      <a>ログアウト</a>
                    </li>
                  </ul>
                </div>
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
