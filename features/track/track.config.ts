export const TRACK_CONFIG = {
  endpoint: "/api/tracks",

  lookups: {
    faculties: "/api/faculties/all",
  },

  queryKey: ["tracks"] as const,

  lookupQueryKeys: {
    faculties: ["tracks", "lookup", "faculties"] as const,
  },

  // Sessions display track names and use the track lookup, so they must be
  // refreshed whenever a track is created, updated or deleted.
  relatedQueryKeys: {
    sessions: ["sessions"] as const,
  },

  pageSize: 20,
} as const;

export const TRACK_STATUS_OPTIONS = [
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
] as const;

export const TRACK_FORM_DEFAULTS = {
  trackName: "",
  status: "Active",
  trackLeaderIds: [],
} satisfies {
  trackName: string;
  status: "Active" | "Inactive";
  trackLeaderIds: string[];
};
