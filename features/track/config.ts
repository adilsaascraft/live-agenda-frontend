import type { MasterDataConfig } from "@/shared/master-data/config";

import type {
  Track,
  CreateTrackPayload,
  UpdateTrackPayload,
} from "./type";

export const trackConfig: MasterDataConfig<
  Track,
  CreateTrackPayload,
  UpdateTrackPayload,
  "trackName"
> = {
  entity: {
    singular: "Track",
    plural: "Tracks",
  },

  api: {
    endpoint: "/api/tracks",
    queryKey: "tracks",
    listKey: "tracks",
  },

  field: {
    key: "trackName",
    label: "Track Name",
    placeholder: "Enter track name",
  },
};