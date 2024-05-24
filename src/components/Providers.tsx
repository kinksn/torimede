"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import React, { Suspense } from "react";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 5, retryDelay: 1000 } },
});

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={null}>{children}</Suspense>
    </QueryClientProvider>
  );
};

export default Providers;
