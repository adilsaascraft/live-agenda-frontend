import type { QueryClient, QueryKey } from '@tanstack/react-query'

export function createInvalidateOnSuccess(
  queryClient: QueryClient,
  ...queryKeys: QueryKey[]
) {
  return async () => {
    await Promise.all(
      queryKeys.map((queryKey) =>
        queryClient.invalidateQueries({
          queryKey,
        }),
      ),
    )
  }
}
