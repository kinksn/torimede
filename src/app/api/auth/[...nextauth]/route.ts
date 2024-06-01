import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth/next";

// /api/auth/*で始まるすべてのAPIリクエストは、[...nextauth]ファイルに書かれたコードで処理される
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
