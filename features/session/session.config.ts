
export const SESSION_CONFIG = {
  endpoint: "/api/sessions",

  lookups: {
    halls: "/api/halls/active/all",
    tracks: "/api/tracks/active/all",
    faculties: "/api/faculties/all",
  },

  queryKey: ["sessions"] as const,

  lookupQueryKeys: {
    halls: ["sessions", "lookup", "halls"] as const,
    tracks: ["sessions", "lookup", "tracks"] as const,
    faculties: ["sessions", "lookup", "faculties"] as const,
  },

  pageSize: 20,
} as const;

export const SESSION_FORM_DEFAULTS = {
  sessionName: "",
  hallId: "",
  trackId: "",
  sessionDate: undefined,
  startTime: "",
  endTime: "",
  chairperson: [],
} satisfies {
  sessionName: string;
  hallId: string;
  trackId: string;
  sessionDate: Date | undefined;
  startTime: string;
  endTime: string;
  chairperson: string[];
};
