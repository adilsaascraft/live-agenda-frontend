import { createMasterDataResource } from "@/shared/master-data/createMasterDataResource";

import { hallConfig } from "./config";

import type {
  Hall,
  CreateHallPayload,
  UpdateHallPayload,
} from "./type";

export const hallResource = createMasterDataResource<
  Hall,
  CreateHallPayload,
  UpdateHallPayload,
  "hallName"
>(hallConfig);