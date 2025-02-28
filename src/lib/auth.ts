import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { providers, authAdapter } from "./providers";

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  providers,
  adapter: authAdapter,
});
