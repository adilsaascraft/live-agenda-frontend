
'use client'

import { useQuery } from '@tanstack/react-query'

import type { MasterDataResource } from './createMasterDataResource'
import type { AnyRecord, MasterDataEntity } from './types'

interface UseMasterDataListParams {
  page?: number
  limit?: number
}

export function useMasterDataList<
  TEntity extends MasterDataEntity,
  TCreatePayload extends AnyRecord,
  TUpdatePayload extends AnyRecord,
  TFieldKey extends keyof TCreatePayload,
>(
  resource: MasterDataResource<
    TEntity,
    TCreatePayload,
    TUpdatePayload,
    TFieldKey
  >,
  { page = 1, limit = 20 }: UseMasterDataListParams = {},
) {
  return useQuery({
    queryKey: [...resource.keys.list(), page, limit],

    queryFn: () => resource.service.getAll({ page, limit }),

    staleTime: 1000 * 60 * 5,

    // Keep previous page data visible while fetching the next page.
    placeholderData: (previousData) => previousData,
  })
}
