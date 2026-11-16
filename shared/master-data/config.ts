import type { AnyRecord, MasterDataEntity } from "./types";

export interface MasterDataEntityConfig {
  singular: string;
  plural: string;
}

export interface MasterDataApiConfig {
  endpoint: string;
  queryKey: string;
  listKey: string;
}

export interface MasterDataFieldConfig<
  TPayload extends AnyRecord,
  TFieldKey extends keyof TPayload,
> {
  key: TFieldKey;
  label: string;
  placeholder: string;
}

export interface MasterDataConfig<
  TEntity extends MasterDataEntity,
  TCreatePayload extends AnyRecord,
  TUpdatePayload extends AnyRecord,
  TFieldKey extends keyof TCreatePayload,
> {
  entity: MasterDataEntityConfig;
  api: MasterDataApiConfig;
  field: MasterDataFieldConfig<TCreatePayload, TFieldKey>;
}