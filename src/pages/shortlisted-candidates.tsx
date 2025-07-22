"use client";

import { ShortlistedCandidatesPage } from "@/components/shortlisted-candidates-page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function ShorlistCandidates() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ShortlistedCandidatesPage />
    </QueryClientProvider>
  );
}
