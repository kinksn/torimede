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

  // トークンが存在しない場合はそのまま処理を続行
  if (!token) return NextResponse.next();

  // isFirstLogin が true なら /change-username にリダイレクト
  if (token.isFirstLogin === true && url.pathname === "/") {
    return NextResponse.redirect(new URL("/change-username", req.url));
  }

  // isFirstLogin が false なのに /change-username を開こうとした場合、トップページにリダイレクト
  if (token.isFirstLogin === false && url.pathname === "/change-username") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return response;
}

// matcher で適用するパスを指定
export const config = {
  matcher: ["/", "/change-username"],
};
