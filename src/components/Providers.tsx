// import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { SessionProvider } from "next-auth/react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { HistoryIndexTracker } from "@/components/HistoryIndexTracker/HistoryIndexTracker";
import { Analytics } from "@vercel/analytics/next";
import { PATH } from "@/lib/constants/path";
import { ToastProvider } from "@/components/basic/Toast";
import { TanstackProvider } from "@/components/TanstackProvider";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { auth } from "@/lib/auth";

const Providers = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  return (
    <>
      <div>
        <SessionProvider session={session}>
          <TanstackProvider>
            <HistoryIndexTracker pathname={PATH.post}>
              {children}
            </HistoryIndexTracker>
            <ReactQueryDevtools initialIsOpen={false} />
          </TanstackProvider>
        </SessionProvider>
        <Analytics />
      </div>
      <ToastProvider />
      <SpeedInsights />
    </>
  );
};

export default Providers;
