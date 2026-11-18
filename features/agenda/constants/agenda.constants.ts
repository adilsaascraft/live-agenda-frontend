import type {
  AgendaFilters,
  AgendaStatus,
  ParticipantRole,
} from "../types/agenda.types";

/* -------------------------------------------------------------------------- */
/* Event                                                                       */
/* -------------------------------------------------------------------------- */

export const AGENDA_EVENT = {
  name: "AROICON 2026",
  startDate: "2026-12-03",
  endDate: "2026-12-06",
  dateRangeLabel: "03 December 2026 – 06 December 2026",
  venue: "Hyderabad International Convention Centre (HICC)",
  location: "Hyderabad, Telangana, India",
} as const;

/**
 * Fixed UTC offset of the event timezone (Asia/Kolkata == EVENT_TIME_ZONE in
 * dashboard.utils). India has no DST, so a constant offset is exact and lets
 * us turn "<dateKey> + minutes" into a real timestamp.
 */
export const EVENT_UTC_OFFSET = "+05:30";

export const MINUTES_PER_DAY = 24 * 60;
export const MS_PER_MINUTE = 60_000;
export const MS_PER_DAY = MINUTES_PER_DAY * MS_PER_MINUTE;

/* -------------------------------------------------------------------------- */
/* API / data fetching                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Passed to `api.get`, which prefixes NEXT_PUBLIC_API_PUBLIC_URL. If that env
 * var already ends in "/api", change this to "/public/topics".
 */
export const PUBLIC_TOPICS_ENDPOINT = "/api/public/topics";

export const AGENDA_QUERY_KEY = ["agenda", "public-topics"] as const;

/** The agenda is fetched once; it is considered fresh for this long. */
export const AGENDA_STALE_TIME_MS = 10 * 60 * 1000;
export const AGENDA_MAX_RETRIES = 2;

/* -------------------------------------------------------------------------- */
/* UI behaviour                                                                */
/* -------------------------------------------------------------------------- */

export const SEARCH_DEBOUNCE_MS = 250;
/** How often status badges re-evaluate. Only badges subscribe to this. */
export const STATUS_TICK_MS = 30_000;
export const SPEAKER_HIGHLIGHT_MS = 4_000;

export const AGENDA_TABS = [
  { value: "schedule", label: "Agenda Schedule" },
  { value: "speakers", label: "Speakers" },
] as const;

export type AgendaTabValue = (typeof AGENDA_TABS)[number]["value"];

/* -------------------------------------------------------------------------- */
/* Filters                                                                     */
/* -------------------------------------------------------------------------- */

/** Select sentinel for "All …" (Select values must be strings). */
export const FILTER_ALL = "all";

export const KNOWN_TOPIC_TYPES = ["Talk", "Debate", "Panel Discussion"] as const;

export const EMPTY_AGENDA_FILTERS: AgendaFilters = {
  dateKey: null,
  hallId: null,
  trackId: null,
  topicType: null,
};

/* -------------------------------------------------------------------------- */
/* Labels                                                                      */
/* -------------------------------------------------------------------------- */

export const PARTICIPANT_ROLE_ORDER: readonly ParticipantRole[] = [
  "faculty",
  "moderator",
  "panelist",
  "expertPanelist",
];

export const PARTICIPANT_ROLE_LABELS: Record<
  ParticipantRole,
  { singular: string; plural: string }
> = {
  faculty: { singular: "Faculty", plural: "Faculty" },
  moderator: { singular: "Moderator", plural: "Moderators" },
  panelist: { singular: "Panelist", plural: "Panelists" },
  expertPanelist: { singular: "Expert Panelist", plural: "Expert Panelists" },
};

export const AGENDA_STATUS_LABELS: Record<AgendaStatus, string> = {
  live: "Live",
  past: "Past",
  today: "Today",
  tomorrow: "Tomorrow",
  coming: "Coming",
};

/* -------------------------------------------------------------------------- */
/* Persistence                                                                 */
/* -------------------------------------------------------------------------- */

export const FAVORITES_STORAGE_KEY = "aroicon-2026:agenda:favorites:v1";
