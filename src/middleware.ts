import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const token = await getToken({ req });

  // Cache-Controlヘッダーを追加してキャッシュを無効化
  const response = NextResponse.next({
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });

  /**
   * ログイン前
   */
  if (!token && url.pathname.startsWith("/create")) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (!token && url.pathname.startsWith("/edit")) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (!token && url.pathname === "/change-username") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // トークンが存在しない場合はそのまま処理を続行
  if (!token) return NextResponse.next();

  /**
   * ログイン後
   */
  if (token.isFirstLogin === true && url.pathname === "/") {
    return NextResponse.redirect(new URL("/change-username", req.url));
  }
  if (token.isFirstLogin === false && url.pathname === "/change-username") {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (!!token && url.pathname === "/login") {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (!!token && url.pathname === "/signup") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return response;
}

// matcher で適用するパスを指定
export const config = {
  matcher: [
    "/",
    "/change-username",
    "/login",
    "/signup",
    "/create/:path*",
    "/edit/:path*",
  ],
};
