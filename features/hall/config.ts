import type { MasterDataConfig } from "@/shared/master-data/config";

import type {
  Hall,
  CreateHallPayload,
  UpdateHallPayload,
} from "./type";

export const hallConfig: MasterDataConfig<
  Hall,
  CreateHallPayload,
  UpdateHallPayload,
  "hallName"
> = {
  entity: {
    singular: "Hall",
    plural: "Halls",
  },

  api: {
    endpoint: "/api/halls",
    queryKey: "halls",
    listKey: "halls",
  },

  field: {
    key: "hallName",
    label: "Hall Name",
    placeholder: "Enter hall name",
  },
};