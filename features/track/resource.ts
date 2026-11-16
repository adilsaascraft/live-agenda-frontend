import { createMasterDataResource } from "@/shared/master-data/createMasterDataResource";

import { trackConfig } from "./config";

import type {
  Track,
  CreateTrackPayload,
  UpdateTrackPayload,
} from "./type";

export const trackResource = createMasterDataResource<
  Track,
  CreateTrackPayload,
  UpdateTrackPayload,
  "trackName"
>(trackConfig);