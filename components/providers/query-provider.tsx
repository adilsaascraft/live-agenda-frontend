'use client'

import { useState } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

interface QueryProviderProps {
  children: React.ReactNode
}

/**
 * -----------------------------------------------------------------------------
 * ExpoCon Query Provider
 * -----------------------------------------------------------------------------
 *
 * Initializes a single QueryClient instance for the application.
 *
 * Responsibilities:
 * - Provide QueryClient
 * - Configure global query defaults
 * - Configure mutation defaults
 * - Enable React Query Devtools in development
 * -----------------------------------------------------------------------------
 */

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            /**
             * Retry failed requests once.
             */
            retry: 1,

            /**
             * Prevent unnecessary refetching when
             * switching browser tabs.
             */
            refetchOnWindowFocus: false,

            /**
             * Don't automatically refetch after reconnect.
             */
            refetchOnReconnect: false,

            /**
             * Don't automatically refetch when mounting.
             */
            refetchOnMount: false,

            /**
             * Consider data fresh for 5 minutes.
             */
            staleTime: 5 * 60 * 1000,

            /**
             * Keep cached data for 10 minutes.
             */
            gcTime: 10 * 60 * 1000,
          },

          mutations: {
            /**
             * Mutations should not retry automatically.
             */
            retry: false,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}

      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-right"
        />
      )}
    </QueryClientProvider>
  )
}
