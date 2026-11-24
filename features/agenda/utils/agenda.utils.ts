import {
  formatDate,
  parseTimeToMinutes,
  toDateKey,
} from "@/features/dashboard/dashboard.utils";

import {
  EVENT_UTC_OFFSET,
  KNOWN_TOPIC_TYPES,
  MINUTES_PER_DAY,
  MS_PER_DAY,
  MS_PER_MINUTE,
  PARTICIPANT_ROLE_LABELS,
  PARTICIPANT_ROLE_ORDER,
} from "../constants/agenda.constants";
import type {
  AgendaCriteria,
  AgendaFilterOptions,
  AgendaFilters,
  AgendaModel,
  AgendaPerson,
  AgendaRef,
  AgendaSession,
  AgendaSpeaker,
  AgendaStatus,
  AgendaTimeSlot,
  AgendaTopic,
  AgendaTopicLookup,
  ApiTopic,
  FilteredSession,
  ParticipantGroup,
  ParticipantRole,
  SelectOption,
  SpeakerAppearance,
} from "../types/agenda.types";

const collator = new Intl.Collator("en", { numeric: true, sensitivity: "base" });
const MAX_MINUTES = Number.MAX_SAFE_INTEGER;

/* -------------------------------------------------------------------------- */
/* DOM ids (stable navigation targets)                                         */
/* -------------------------------------------------------------------------- */

export const getSessionElementId = (sessionId: string): string =>
  `agenda-session-${sessionId}`;

export const getTopicElementId = (topicId: string): string =>
  `agenda-topic-${topicId}`;

/* -------------------------------------------------------------------------- */
/* Defensive primitives                                                        */
/* -------------------------------------------------------------------------- */

function cleanString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeSearchText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function toPersonList(value: unknown): AgendaPerson[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const people: AgendaPerson[] = [];

  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const record = item as Record<string, unknown>;
    const id = cleanString(record._id);
    const fullName = cleanString(record.fullName);
    if (!id || !fullName || seen.has(id)) continue;
    seen.add(id);
    people.push({ id, fullName });
  }
  return people;
}

function toRef(value: unknown, nameKey: "hallName" | "trackName"): AgendaRef | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const id = cleanString(record._id);
  const name = cleanString(record[nameKey]);
  return id && name ? { id, name } : null;
}

/* -------------------------------------------------------------------------- */
/* Normalisation                                                               */
/* -------------------------------------------------------------------------- */

function toSession(raw: ApiTopic["sessionId"]): AgendaSession | null {
  if (!raw || typeof raw !== "object") return null;

  const id = cleanString(raw._id);
  const sessionDate = cleanString(raw.sessionDate);
  if (!id || !sessionDate) return null;

  // Calendar day in the EVENT timezone — never the UTC day.
  const dateKey = toDateKey(sessionDate);
  if (!dateKey) return null;

  const hall = toRef(raw.hallId, "hallName");
  const track = toRef(raw.trackId, "trackName");
  const chairpersons = toPersonList(raw.chairperson);
  const trackLeaders = toPersonList(
    raw.trackId && typeof raw.trackId === "object"
      ? raw.trackId.trackLeaderIds
      : undefined,
  );
  const name = cleanString(raw.sessionName) || "Untitled session";
  const startTime = cleanString(raw.startTime);
  const endTime = cleanString(raw.endTime);

  return {
    id,
    name,
    sessionDate,
    dateKey,
    startTime,
    endTime,
    startMinutes: parseTimeToMinutes(startTime),
    endMinutes: parseTimeToMinutes(endTime),
    hall,
    track,
    trackLeaders,
    chairpersons,
    topics: [],
    searchText: normalizeSearchText(
      [
        name,
        hall?.name,
        track?.name,
        ...trackLeaders.map((p) => p.fullName),
        ...chairpersons.map((p) => p.fullName),
      ]
        .filter(Boolean)
        .join(" "),
    ),
  };
}

function toTopic(raw: ApiTopic, id: string, session: AgendaSession): AgendaTopic {
  const name = cleanString(raw.topicName) || "Untitled topic";
  const type = cleanString(raw.topicType);
  const startTime = cleanString(raw.startTime);
  const endTime = cleanString(raw.endTime);
  const startMinutes = parseTimeToMinutes(startTime);
  const endMinutes = parseTimeToMinutes(endTime);

  // A topic that starts "earlier" than its session inside a session that
  // crosses midnight actually happens after midnight (next calendar day).
  const sessionCrossesMidnight =
    session.startMinutes != null &&
    session.endMinutes != null &&
    session.endMinutes < session.startMinutes;
  const dayOffset: 0 | 1 =
    sessionCrossesMidnight &&
    startMinutes != null &&
    session.startMinutes != null &&
    startMinutes < session.startMinutes
      ? 1
      : 0;

  const participants: Record<ParticipantRole, AgendaPerson[]> = {
    faculty: toPersonList(raw.facultyId),
    moderator: toPersonList(raw.moderatorId),
    panelist: toPersonList(raw.panelistId),
    expertPanelist: toPersonList(raw.expertPanelistId),
  };

  const names = PARTICIPANT_ROLE_ORDER.flatMap((role) =>
    participants[role].map((p) => p.fullName),
  );

  return {
    id,
    sessionId: session.id,
    name,
    type,
    dateKey: session.dateKey,
    startTime,
    endTime,
    startMinutes,
    endMinutes,
    dayOffset,
    participants,
    searchText: normalizeSearchText([name, type, ...names].join(" ")),
  };
}

const topicSortKey = (topic: AgendaTopic): number =>
  topic.startMinutes == null
    ? MAX_MINUTES
    : topic.dayOffset * MINUTES_PER_DAY + topic.startMinutes;

function compareTopics(a: AgendaTopic, b: AgendaTopic): number {
  const diff = topicSortKey(a) - topicSortKey(b);
  return diff !== 0 ? diff : collator.compare(a.name, b.name);
}

function compareSessions(a: AgendaSession, b: AgendaSession): number {
  if (a.dateKey !== b.dateKey) return a.dateKey < b.dateKey ? -1 : 1;
  const diff = (a.startMinutes ?? MAX_MINUTES) - (b.startMinutes ?? MAX_MINUTES);
  return diff !== 0 ? diff : collator.compare(a.name, b.name);
}

/**
 * Turns the flat topic list into the full agenda model. Pure: the input is
 * never mutated. Topics are grouped under their parent session by
 * `sessionId._id`, so a session can never be produced twice.
 */
export function buildAgendaModel(rawTopics: readonly ApiTopic[]): AgendaModel {
  const sessionMap = new Map<string, AgendaSession>();
  const seenTopicIds = new Set<string>();
  let skippedTopicCount = 0;

  for (const raw of rawTopics) {
    if (!raw || typeof raw !== "object") {
      skippedTopicCount += 1;
      continue;
    }

    const topicId = cleanString(raw._id);
    if (!topicId) {
      skippedTopicCount += 1;
      continue;
    }
    if (seenTopicIds.has(topicId)) continue; // duplicate record

    const sessionRaw = raw.sessionId;
    const sessionKey =
      sessionRaw && typeof sessionRaw === "object" ? cleanString(sessionRaw._id) : "";

    let session = sessionKey ? sessionMap.get(sessionKey) : undefined;
    if (!session) {
      const created = toSession(sessionRaw);
      if (!created) {
        skippedTopicCount += 1;
        continue;
      }
      session = created;
      sessionMap.set(created.id, created);
    }

    seenTopicIds.add(topicId);
    session.topics.push(toTopic(raw, topicId, session));
  }

  const sessions = [...sessionMap.values()].sort(compareSessions);
  sessions.forEach((session) => session.topics.sort(compareTopics));

  const topicIndex = new Map<string, AgendaTopicLookup>();
  let order = 0;
  for (const session of sessions) {
    for (const topic of session.topics) {
      topicIndex.set(topic.id, { topic, session, order });
      order += 1;
    }
  }

  const speakers = buildSpeakers(sessions);

  return {
    sessions,
    topicIndex,
    speakers,
    speakerIndex: new Map(speakers.map((s) => [s.id, s])),
    filterOptions: buildFilterOptions(sessions),
    stats: {
      sessionCount: sessions.length,
      topicCount: topicIndex.size,
      skippedTopicCount,
    },
  };
}

/* -------------------------------------------------------------------------- */
/* Filter options                                                              */
/* -------------------------------------------------------------------------- */

function sortOptions(options: SelectOption[]): SelectOption[] {
  return options.sort((a, b) => collator.compare(a.label, b.label));
}

function buildFilterOptions(
  sessions: readonly AgendaSession[],
): AgendaFilterOptions {
  const dates = new Map<string, SelectOption>();
  const halls = new Map<string, SelectOption>();
  const tracks = new Map<string, SelectOption>();
  const extraTypes = new Set<string>();

  let dayNumber = 0;

  for (const session of sessions) {
    // Sessions are already chronological.
    // Assign a day number only once per unique session date.
    if (!dates.has(session.dateKey)) {
      dayNumber += 1;

      dates.set(session.dateKey, {
        value: session.dateKey,
        label: `Day ${dayNumber} : ${formatDate(session.sessionDate)}`,
      });
    }

    if (session.hall && !halls.has(session.hall.id)) {
      halls.set(session.hall.id, {
        value: session.hall.id,
        label: session.hall.name,
      });
    }

    if (session.track && !tracks.has(session.track.id)) {
      tracks.set(session.track.id, {
        value: session.track.id,
        label: session.track.name,
      });
    }

    for (const topic of session.topics) {
      if (
        topic.type &&
        !KNOWN_TOPIC_TYPES.some((t) => sameType(t, topic.type))
      ) {
        extraTypes.add(topic.type);
      }
    }
  }

  return {
    dates: [...dates.values()],
    halls: sortOptions([...halls.values()]),
    tracks: sortOptions([...tracks.values()]),

    topicTypes: [
      ...KNOWN_TOPIC_TYPES.map((t) => ({
        value: t,
        label: t,
      })),
      ...[...extraTypes]
        .sort(collator.compare)
        .map((t) => ({
          value: t,
          label: t,
        })),
    ],
  };
}

/* -------------------------------------------------------------------------- */
/* Search + filtering                                                          */
/* -------------------------------------------------------------------------- */

const sameType = (a: string, b: string): boolean =>
  a.trim().toLowerCase() === b.trim().toLowerCase();

export function tokenizeQuery(query: string): string[] {
  const normalized = normalizeSearchText(query);
  return normalized ? normalized.split(" ") : [];
}

const matchesAll = (haystack: string, tokens: readonly string[]): boolean =>
  tokens.every((token) => haystack.includes(token));

export function hasActiveFilters(filters: AgendaFilters): boolean {
  return (
    filters.dateKey !== null ||
    filters.hallId !== null ||
    filters.trackId !== null ||
    filters.topicType !== null
  );
}

/**
 * Applies search + all filters with AND logic. Does not mutate its input.
 *
 * Search semantics (every whitespace-separated word must match):
 *  - all words found in the session's own fields (name, hall, track,
 *    chairpersons) → the session is shown with all of its topics;
 *  - otherwise a topic matches when the words are found across the topic's
 *    fields and its session's fields → the session is shown with only the
 *    matching topics.
 * A topic-type filter keeps a session only if it still has matching topics.
 */
export function filterAgenda(
  sessions: readonly AgendaSession[],
  criteria: AgendaCriteria,
): FilteredSession[] {
  const tokens = tokenizeQuery(criteria.query);
  const result: FilteredSession[] = [];

  for (const session of sessions) {
    if (criteria.dateKey && session.dateKey !== criteria.dateKey) continue;
    if (criteria.hallId && session.hall?.id !== criteria.hallId) continue;
    if (criteria.trackId && session.track?.id !== criteria.trackId) continue;

    const { topicType } = criteria;
    let topics: readonly AgendaTopic[] = topicType
      ? session.topics.filter((t) => sameType(t.type, topicType))
      : session.topics;
    if (topics.length === 0) continue;

    if (tokens.length > 0 && !matchesAll(session.searchText, tokens)) {
      topics = topics.filter((t) =>
        matchesAll(`${t.searchText} ${session.searchText}`, tokens),
      );
      if (topics.length === 0) continue;
    }

    result.push({ session, topics });
  }
  return result;
}

/* -------------------------------------------------------------------------- */
/* Participants                                                                */
/* -------------------------------------------------------------------------- */

/** Non-empty participant groups in display order. Empty roles are omitted. */
export function getTopicParticipantGroups(topic: AgendaTopic): ParticipantGroup[] {
  const groups: ParticipantGroup[] = [];
  for (const role of PARTICIPANT_ROLE_ORDER) {
    const people = topic.participants[role];
    if (people.length === 0) continue;
    const labels = PARTICIPANT_ROLE_LABELS[role];
    groups.push({
      role,
      label: people.length > 1 ? labels.plural : labels.singular,
      people,
    });
  }
  return groups;
}

/* -------------------------------------------------------------------------- */
/* Speakers                                                                    */
/* -------------------------------------------------------------------------- */

function buildSpeakers(sessions: readonly AgendaSession[]): AgendaSpeaker[] {
  const byId = new Map<
    string,
    { id: string; fullName: string; appearances: SpeakerAppearance[] }
  >();

  const entryFor = (person: AgendaPerson) => {
    let entry = byId.get(person.id);
    if (!entry) {
      entry = { id: person.id, fullName: person.fullName, appearances: [] };
      byId.set(person.id, entry);
    }
    return entry;
  };

  for (const session of sessions) {
    // One appearance per session card where the person chairs or leads the
    // track (a person holding both still gets a single appearance).
    const sessionPeople = new Map<string, AgendaPerson>();
    for (const person of [...session.chairpersons, ...session.trackLeaders]) {
      if (!sessionPeople.has(person.id)) sessionPeople.set(person.id, person);
    }
    for (const chair of sessionPeople.values()) {
      entryFor(chair).appearances.push({
        kind: "session",
        key: `session:${session.id}`,
        sessionId: session.id,
        elementId: getSessionElementId(session.id),
      });
    }

    for (const topic of session.topics) {
      // One appearance per topic card, however many roles the person holds.
      const rolesByPerson = new Map<
        string,
        { person: AgendaPerson; roles: ParticipantRole[] }
      >();
      for (const role of PARTICIPANT_ROLE_ORDER) {
        for (const person of topic.participants[role]) {
          const existing = rolesByPerson.get(person.id);
          if (existing) existing.roles.push(role);
          else rolesByPerson.set(person.id, { person, roles: [role] });
        }
      }

      for (const { person, roles } of rolesByPerson.values()) {
        entryFor(person).appearances.push({
          kind: "topic",
          key: `topic:${topic.id}`,
          sessionId: session.id,
          topicId: topic.id,
          elementId: getTopicElementId(topic.id),
          roles,
        });
      }
    }
  }

  return [...byId.values()]
    .map((entry) => ({ ...entry, appearanceCount: entry.appearances.length }))
    .sort((a, b) => collator.compare(a.fullName, b.fullName));
}

/* -------------------------------------------------------------------------- */
/* Favourites                                                                  */
/* -------------------------------------------------------------------------- */

export interface FavoriteResolution {
  /** Resolved topics, in agenda order (date → time), not click order. */
  items: AgendaTopicLookup[];
  /** Saved ids that no longer exist in the latest API response. */
  missingIds: string[];
}

export function resolveFavorites(
  model: AgendaModel,
  ids: readonly string[],
): FavoriteResolution {
  const items: AgendaTopicLookup[] = [];
  const missingIds: string[] = [];

  for (const id of new Set(ids)) {
    const lookup = model.topicIndex.get(id);
    if (lookup) items.push(lookup);
    else missingIds.push(id);
  }

  items.sort((a, b) => a.order - b.order);
  return { items, missingIds };
}

export interface SessionTopicGroup {
  session: AgendaSession;
  topics: AgendaTopic[];
}

/** Groups already-sorted lookups by their parent session (for sheet / print). */
export function groupLookupsBySession(
  items: readonly AgendaTopicLookup[],
): SessionTopicGroup[] {
  const groups = new Map<string, SessionTopicGroup>();
  for (const { session, topic } of items) {
    const group = groups.get(session.id);
    if (group) group.topics.push(topic);
    else groups.set(session.id, { session, topics: [topic] });
  }
  return [...groups.values()];
}

/* -------------------------------------------------------------------------- */
/* Status (Live / Past / Today / Tomorrow / Coming)                            */
/* -------------------------------------------------------------------------- */

function dateKeyToEpoch(dateKey: string): number | null {
  const time = Date.parse(`${dateKey}T00:00:00${EVENT_UTC_OFFSET}`);
  return Number.isNaN(time) ? null : time;
}

/**
 * Real [start, end) timestamps for a slot, or null when the start time is
 * unknown. Handles ranges that cross midnight (end earlier than start rolls
 * to the next day). A missing end time is treated as an instant.
 */
export function getTimeWindow(
  slot: AgendaTimeSlot,
): { start: number; end: number } | null {
  if (slot.startMinutes == null) return null;
  const base = dateKeyToEpoch(slot.dateKey);
  if (base == null) return null;

  const offset = (slot.dayOffset ?? 0) * MINUTES_PER_DAY;
  const startMinute = offset + slot.startMinutes;
  let endMinute = slot.endMinutes == null ? startMinute : offset + slot.endMinutes;
  if (endMinute < startMinute) endMinute += MINUTES_PER_DAY;

  return {
    start: base + startMinute * MS_PER_MINUTE,
    end: base + endMinute * MS_PER_MINUTE,
  };
}

/**
 * Single primary status. Precedence: Live > Past > Today > Tomorrow > Coming.
 * Live/Past come from real timestamps; Today/Tomorrow/Coming describe an item
 * that has not started yet, relative to the current date in the event
 * timezone. Falls back to date-only when the start time cannot be parsed.
 */
export function getAgendaStatus(slot: AgendaTimeSlot, now: Date): AgendaStatus {
  const nowMs = now.getTime();
  const todayKey = toDateKey(now);
  if (!todayKey) return "coming";

  const window = getTimeWindow(slot);

  if (window) {
    if (nowMs >= window.end) return "past";
    if (nowMs >= window.start) return "live";
  } else if (slot.dateKey < todayKey) {
    // ISO date keys (YYYY-MM-DD) compare correctly as strings.
    return "past";
  }

  // Not started yet: classify by the calendar day it starts on.
  const startDayKey = window ? toDateKey(new Date(window.start)) : slot.dateKey;
  if (startDayKey === todayKey) return "today";
  if (startDayKey === toDateKey(new Date(nowMs + MS_PER_DAY))) return "tomorrow";
  return "coming";
}

export const getSessionStatus = (session: AgendaSession, now: Date): AgendaStatus =>
  getAgendaStatus(session, now);

export const getTopicStatus = (topic: AgendaTopic, now: Date): AgendaStatus =>
  getAgendaStatus(topic, now);
