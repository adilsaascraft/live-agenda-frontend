import type {
  MasterDataEntity,
  MasterDataStatus,
} from "@/shared/master-data/types";

export interface Track extends MasterDataEntity {
  trackName: string;
  status: MasterDataStatus;
}

export interface CreateTrackPayload {
  trackName: string;
  status: MasterDataStatus;
}

export type UpdateTrackPayload = CreateTrackPayload;