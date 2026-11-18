"use client";

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MotionConfig } from "framer-motion";

/**
 * Feature-local providers.
 *
 * - QueryClientProvider: gives the agenda its own cache. If your app already
 *   mounts a global QueryClientProvider you can delete this wrapper's query
 *   part — the agenda will then share the global client.
 * - MotionConfig reducedMotion="user": every Framer Motion transform /
 *   layout animation is disabled for people with prefers-reduced-motion.
 */
export function AgendaProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { refetchOnWindowFocus: false } },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </QueryClientProvider>
  );
}
