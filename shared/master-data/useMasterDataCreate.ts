'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createInvalidateOnSuccess } from '@/lib/react-query/mutation-utils'

import type { MasterDataResource } from './createMasterDataResource'
import type { AnyRecord, MasterDataEntity } from './types'

/**
 * -----------------------------------------------------------------------------
 * ExpoCon Master Data Create Mutation
 * -----------------------------------------------------------------------------
 *
 * Generic create mutation for any master-data resource.
 *
 * Example:
 *
 * const createMutation = useMasterDataCreate(companyTypeResource)
 * -----------------------------------------------------------------------------
 */

export function useMasterDataCreate<
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
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: resource.service.create,

    onSuccess: createInvalidateOnSuccess(queryClient, resource.keys.list()),
  })
}
