/* -------------------------------------------------------------------------- */
/* Raw API shapes — GET /api/public/topics                                     */
/* -------------------------------------------------------------------------- */

export interface ApiPerson {
  _id: string;
  fullName: string;
}

export interface ApiHall {
  _id: string;
  hallName: string;
}

export interface ApiTrack {
  _id: string;
  trackName: string;
}

/**
 * Populated session embedded in each topic. Hall / track are typed as possibly
 * missing or un-populated (a bare id string) because the normaliser must never
 * trust populated references blindly.
 */
export interface ApiSession {
  _id: string;
  sessionName: string;
  hallId: ApiHall | string | null;
  trackId: ApiTrack | string | null;
  sessionDate: string;
  startTime: string;
  endTime: string;
  chairperson: ApiPerson[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiTopic {
  _id: string;
  topicName: string;
  startTime: string;
  endTime: string;
  topicType: string;
  sessionId: ApiSession | string | null;
  facultyId: ApiPerson[];
  moderatorId: ApiPerson[];
  panelistId: ApiPerson[];
  expertPanelistId: ApiPerson[];
  createdAt: string;
  updatedAt: string;
}

export interface PublicTopicsResponse {
  success: boolean;
  message: string;
  data: {
    topics: ApiTopic[];
  };
}

/* -------------------------------------------------------------------------- */
/* Normalised domain model                                                     */
/* -------------------------------------------------------------------------- */

export type ParticipantRole =
  | "faculty"
  | "moderator"
  | "panelist"
  | "expertPanelist";

export interface AgendaPerson {
  id: string;
  fullName: string;
}

export interface AgendaRef {
  id: string;
  name: string;
}

export interface AgendaTopic {
  id: string;
  sessionId: string;
  name: string;
  /** Raw API value, e.g. "Talk". Empty string when missing. */
  type: string;
  /** Session date key (YYYY-MM-DD, event timezone). Never the topic's own date. */
  dateKey: string;
  startTime: string;
  endTime: string;
  startMinutes: number | null;
  endMinutes: number | null;
  /**
   * 1 when the topic starts after midnight inside a session that crosses
   * midnight (e.g. session 11 PM–1 AM, topic 12:10 AM). Otherwise 0.
   */
  dayOffset: 0 | 1;
  participants: Record<ParticipantRole, AgendaPerson[]>;
  /** Normalised, lower-cased text used by search. */
  searchText: string;
}

export interface AgendaSession {
  id: string;
  name: string;
  /** Original ISO instant from the API. */
  sessionDate: string;
  /** YYYY-MM-DD in the event timezone. */
  dateKey: string;
  startTime: string;
  endTime: string;
  startMinutes: number | null;
  endMinutes: number | null;
  hall: AgendaRef | null;
  track: AgendaRef | null;
  chairpersons: AgendaPerson[];
  topics: AgendaTopic[];
  searchText: string;
}

/** A topic together with its parent session and its global agenda position. */
export interface AgendaTopicLookup {
  topic: AgendaTopic;
  session: AgendaSession;
  order: number;
}

/* ------------------------------ speakers ---------------------------------- */

export type SpeakerAppearance =
  | {
      kind: "session";
      key: string;
      sessionId: string;
      /** DOM id of the session card. */
      elementId: string;
    }
  | {
      kind: "topic";
      key: string;
      sessionId: string;
      topicId: string;
      /** DOM id of the topic card. */
      elementId: string;
      roles: ParticipantRole[];
    };

export interface AgendaSpeaker {
  id: string;
  fullName: string;
  /** Agenda order: first entry is the earliest card the person appears on. */
  appearances: SpeakerAppearance[];
  appearanceCount: number;
}

/* ------------------------------- filters ---------------------------------- */

export interface SelectOption {
  value: string;
  label: string;
}

export interface AgendaFilterOptions {
  dates: SelectOption[];
  halls: SelectOption[];
  tracks: SelectOption[];
  topicTypes: SelectOption[];
}

/** `null` means "no filter" (All). */
export interface AgendaFilters {
  dateKey: string | null;
  hallId: string | null;
  trackId: string | null;
  topicType: string | null;
}

export interface AgendaCriteria extends AgendaFilters {
  query: string;
}

export interface FilteredSession {
  session: AgendaSession;
  /** Topics to display under the session (already filtered). */
  topics: readonly AgendaTopic[];
}

/* -------------------------------- status ---------------------------------- */

export type AgendaStatus = "live" | "past" | "today" | "tomorrow" | "coming";

export interface AgendaTimeSlot {
  dateKey: string;
  startMinutes: number | null;
  endMinutes: number | null;
  dayOffset?: 0 | 1;
}

/* -------------------------------- model ----------------------------------- */

export interface AgendaModel {
  /** Unique sessions, sorted by date → start time → name. */
  sessions: AgendaSession[];
  topicIndex: ReadonlyMap<string, AgendaTopicLookup>;
  speakers: AgendaSpeaker[];
  speakerIndex: ReadonlyMap<string, AgendaSpeaker>;
  filterOptions: AgendaFilterOptions;
  stats: {
    sessionCount: number;
    topicCount: number;
    /** Topics that could not be placed under a valid session. */
    skippedTopicCount: number;
  };
}

export interface ParticipantGroup {
  role: ParticipantRole;
  label: string;
  people: AgendaPerson[];
}
