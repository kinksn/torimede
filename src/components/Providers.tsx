"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { SessionProvider } from "next-auth/react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { HistoryIndexTracker } from "@/components/HistoryIndexTracker/HistoryIndexTracker";
import { Analytics } from "@vercel/analytics/next";
import { PATH } from "@/lib/constants/path";
import { ToastProvider } from "@/components/basic/Toast";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 5, retryDelay: 1000 } },
});

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div>
        <SessionProvider>
          <QueryClientProvider client={queryClient}>
            <HistoryIndexTracker pathname={PATH.post}>
              {children}
            </HistoryIndexTracker>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </SessionProvider>
        <Analytics />
      </div>
      <ToastProvider />
    </>
  );
};

export default Providers;
