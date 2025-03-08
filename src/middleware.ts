import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";
import NextAuth from "next-auth";

export const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const url = req.nextUrl;
  const session = await auth();

  // Cache-Controlヘッダーを追加してキャッシュを無効化
  const response = NextResponse.next({
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });

  // ログイン前のアクセス制限
  if (!session?.user) {
    if (
      url.pathname.startsWith("/create") ||
      url.pathname.startsWith("/edit") ||
      url.pathname === "/change-profile"
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return response;
  }

  // ログイン後のリダイレクト処理
  const isFirstLogin = session.user.isFirstLogin;

  if (isFirstLogin === true && url.pathname !== "/change-profile") {
    return NextResponse.redirect(new URL("/change-profile", req.url));
  }

  if (isFirstLogin === false && url.pathname === "/change-profile") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (url.pathname === "/login" || url.pathname === "/signup") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return response;
});

// matcher で適用するパスを指定
export const config = {
  matcher: [
    "/",
    "/change-profile",
    "/login",
    "/signup",
    "/create/:path*",
    "/edit/:path*",
    "/user/:path*",
    "/post/:path*",
  ],
};
