import type {
  MasterDataEntity,
  MasterDataStatus,
} from "@/shared/master-data/types";

export interface Hall extends MasterDataEntity {
  hallName: string;
  status: MasterDataStatus;
}

export interface CreateHallPayload {
  hallName: string;
  status: MasterDataStatus;
}

export type UpdateHallPayload = CreateHallPayload;