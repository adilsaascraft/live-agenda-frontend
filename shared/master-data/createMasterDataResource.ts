import { api } from "@/services/api";

import type { MasterDataConfig } from "./config";

import type {
  AnyRecord,
  ApiResponse,
  DeleteParams,
  MasterDataEntity,
  PaginatedMasterData,
  PaginationMeta,
  PaginationParams,
  UpdateRequest,
} from "./types";

interface PaginatedApiResponse<TData> {
  success: boolean;
  message: string;
  data: TData;
  pagination: PaginationMeta;
}

export interface MasterDataResource<
  TEntity extends MasterDataEntity,
  TCreatePayload extends AnyRecord,
  TUpdatePayload extends AnyRecord,
  TFieldKey extends keyof TCreatePayload,
> {
  config: MasterDataConfig<
    TEntity,
    TCreatePayload,
    TUpdatePayload,
    TFieldKey
  >;

  keys: {
    all: readonly [string];
    lists(): readonly [string, "list"];
    list(): readonly [string, "list"];
    details(): readonly [string, "detail"];
    detail(id: string): readonly [string, "detail", string];
  };

  service: {
    create(payload: TCreatePayload): ReturnType<typeof api.post<TEntity>>;

    getAll(
      params?: PaginationParams,
    ): Promise<PaginatedMasterData<TEntity>>;

    getById(id: string): ReturnType<typeof api.get<ApiResponse<TEntity>>>;

    update(
      request: UpdateRequest<TUpdatePayload>,
    ): ReturnType<typeof api.put<TEntity>>;

    delete(params: DeleteParams): ReturnType<typeof api.delete<void>>;
  };
}

export function createMasterDataResource<
  TEntity extends MasterDataEntity,
  TCreatePayload extends AnyRecord,
  TUpdatePayload extends AnyRecord,
  TFieldKey extends keyof TCreatePayload,
>(
  config: MasterDataConfig<
    TEntity,
    TCreatePayload,
    TUpdatePayload,
    TFieldKey
  >,
): MasterDataResource<
  TEntity,
  TCreatePayload,
  TUpdatePayload,
  TFieldKey
> {
  const all = [config.api.queryKey] as const;

  const keys = {
    all,
    lists: () => [...all, "list"] as const,
    list: () => [...all, "list"] as const,
    details: () => [...all, "detail"] as const,
    detail: (id: string) => [...all, "detail", id] as const,
  };

  const service = {
    create(payload: TCreatePayload) {
      return api.post<TEntity>(config.api.endpoint, payload);
    },

    async getAll({
      page = 1,
      limit = 20,
    }: PaginationParams = { page: 1, limit: 20 }) {
      const response = await api.get<
        PaginatedApiResponse<Record<string, TEntity[]>>
      >(config.api.endpoint, {
        params: { page, limit },
      });

      const items = response.data?.[config.api.listKey];

      if (!Array.isArray(items)) {
        throw new Error(
          `Invalid response: expected data.${config.api.listKey} to be an array.`,
        );
      }

      if (!response.pagination) {
        throw new Error("Pagination metadata is missing from the API response.");
      }

      return {
        items,
        pagination: response.pagination,
      };
    },

    getById(id: string) {
      return api.get<ApiResponse<TEntity>>(
        `${config.api.endpoint}/${id}`,
      );
    },

    update({ _id, payload }: UpdateRequest<TUpdatePayload>) {
      return api.put<TEntity>(
        `${config.api.endpoint}/${_id}`,
        payload,
      );
    },

    delete({ _id }: DeleteParams) {
      return api.delete<void>(`${config.api.endpoint}/${_id}`);
    },
  };

  return {
    config,
    keys,
    service,
  };
}