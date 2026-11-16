export type AnyRecord = object;

export type MasterDataStatus = "Active" | "Inactive";

export interface MasterDataEntity {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeleteParams {
  _id: string;
}

export interface UpdateRequest<TPayload extends AnyRecord> {
  _id: string;
  payload: TPayload;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  from: number;
  to: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PaginatedMasterData<
  TEntity extends MasterDataEntity,
> {
  items: TEntity[];
  pagination: PaginationMeta;
}

export interface ApiResponse<TData> {
  success: boolean;
  message: string;
  data: TData;
}