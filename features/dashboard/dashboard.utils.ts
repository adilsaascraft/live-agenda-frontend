import type {
  AgendaSession,
  DashboardData,
  DashboardFaculty,
  DashboardMetrics,
  DashboardSessionRef,
  DashboardTopic,
  DistributionItem,
  FacultyRoleKey,
  RoleStat,
  ScheduleDateItem,
  TopFaculty,
  TopicType,
  UpcomingSession,
} from "./dashboard.types";

/**
 * Session dates are stored as UTC instants that represent midnight in the
 * event's local timezone (e.g. 2026-11-16T18:30Z === 17 Nov 00:00 IST).
 * Every calendar comparison therefore has to happen in that timezone.
 */
export const EVENT_TIME_ZONE = "Asia/Kolkata";

const TOPIC_TYPES: TopicType[] = ["Talk", "Debate", "Panel Discussion"];
const UNASSIGNED = "Unassigned";
const UPCOMING_LIMIT = 10;
const TOP_FACULTY_LIMIT = 10;
const RECENT_SESSIONS_LIMIT = 10;
const RECENT_TOPICS_LIMIT = 10;

/* ------------------------------ date helpers ------------------------------ */

const dateKeyFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: EVENT_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const clockFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: EVENT_TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

/** YYYY-MM-DD for the given instant, in the event timezone. */
export function toDateKey(value: string | Date): string | null {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return dateKeyFormatter.format(date);
}

function getMinutesOfDay(date: Date): number {
  const parts = clockFormatter.formatToParts(date);
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  return hour * 60 + minute;
}

/** "02:30 PM" -> 870. Returns null when the string can't be parsed. */
export function parseTimeToMinutes(value?: string): number | null {
  if (!value) return null;
  const match = value.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;

  let hour = Number(match[1]) % 12;
  if (match[3].toUpperCase() === "PM") hour += 12;
  return hour * 60 + Number(match[2]);
}

/* ----------------------------- session helpers ---------------------------- */

function refName(
  ref: DashboardSessionRef["hallId"] | DashboardSessionRef["trackId"],
  key: "hallName" | "trackName",
): string {
  if (ref && typeof ref === "object") {
    const name = (ref as Record<string, unknown>)[key];
    if (typeof name === "string" && name.trim()) return name;
  }
  return UNASSIGNED;
}

function toAgendaSession(raw: DashboardSessionRef): AgendaSession | null {
  if (!raw._id || !raw.sessionDate) return null;

  const dateKey = toDateKey(raw.sessionDate);
  if (!dateKey) return null;

  const startMinutes = parseTimeToMinutes(raw.startTime);
  let endMinutes = parseTimeToMinutes(raw.endTime);
  // A session ending "after midnight" (e.g. 11 PM - 1 AM).
  if (startMinutes != null && endMinutes != null && endMinutes < startMinutes) {
    endMinutes += 24 * 60;
  }

  return {
    id: raw._id,
    name: raw.sessionName || "Untitled session",
    dateKey,
    sessionDate: raw.sessionDate,
    startTime: raw.startTime || "",
    endTime: raw.endTime || "",
    startMinutes,
    endMinutes,
    hall: refName(raw.hallId, "hallName"),
    track: refName(raw.trackId, "trackName"),
    chairpersons: raw.chairperson ?? [],
  };
}

/**
 * The API doesn't return a complete session list: `upcomingSessions` and
 * `recentSessions` are capped, and a session can exist only inside a topic's
 * populated `sessionId` (Session A in your payload). Merge every source.
 */
export function collectSessions(data: DashboardData): AgendaSession[] {
  const map = new Map<string, AgendaSession>();

  const add = (raw?: DashboardSessionRef | string | null) => {
    if (!raw || typeof raw === "string" || !raw._id || map.has(raw._id)) return;
    const session = toAgendaSession(raw);
    if (session) map.set(session.id, session);
  };

  data.lists.upcomingSessions.forEach(add);
  data.lists.recentSessions
  .slice(0, RECENT_SESSIONS_LIMIT)
  .forEach(add);

data.lists.recentTopics
  .slice(0, RECENT_TOPICS_LIMIT)
  .forEach((topic) => add(topic.sessionId));

  return [...map.values()];
}

function compareSessions(a: AgendaSession, b: AgendaSession): number {
  if (a.dateKey !== b.dateKey) return a.dateKey < b.dateKey ? -1 : 1;
  const diff = (a.startMinutes ?? 0) - (b.startMinutes ?? 0);
  return diff !== 0 ? diff : a.name.localeCompare(b.name);
}

/* ------------------------------- aggregation ------------------------------ */

function sortDistribution(items: DistributionItem[]): DistributionItem[] {
  return [...items].sort(
    (a, b) => b.count - a.count || a.label.localeCompare(b.label),
  );
}

function countBy<T>(items: T[], getLabel: (item: T) => string): DistributionItem[] {
  const map = new Map<string, number>();
  items.forEach((item) => {
    const label = getLabel(item);
    map.set(label, (map.get(label) ?? 0) + 1);
  });
  return sortDistribution(
    [...map.entries()].map(([label, count]) => ({ label, count })),
  );
}

const ROLE_FIELDS: Array<{
  key: FacultyRoleKey;
  label: string;
  field: "facultyId" | "moderatorId" | "panelistId" | "expertPanelistId";
  apiName: string;
}> = [
  { key: "faculty", label: "Faculty", field: "facultyId", apiName: "faculty" },
  { key: "moderator", label: "Moderator", field: "moderatorId", apiName: "moderator" },
  { key: "panelist", label: "Panelist", field: "panelistId", apiName: "panelist" },
  {
    key: "expertPanelist",
    label: "Expert panelist",
    field: "expertPanelistId",
    apiName: "expertpanelist",
  },
];

function personId(person: DashboardFaculty): string {
  return person._id || person.email || person.fullName;
}

function computeFacultyStats(topics: DashboardTopic[]) {
  const roleSets = new Map<FacultyRoleKey, Set<string>>();
  const roleAssignments = new Map<FacultyRoleKey, number>();
  const people = new Map<string, TopFaculty>();
  let totalAssignments = 0;

  ROLE_FIELDS.forEach(({ key }) => {
    roleSets.set(key, new Set());
    roleAssignments.set(key, 0);
  });

  topics.forEach((topic) => {
    ROLE_FIELDS.forEach(({ key, field }) => {
      // De-duplicate inside a single topic+role so one slot is never counted twice.
      const seen = new Set<string>();

      (topic[field] ?? []).forEach((person) => {
        const id = personId(person);
        if (seen.has(id)) return;
        seen.add(id);

        roleSets.get(key)!.add(id);
        roleAssignments.set(key, (roleAssignments.get(key) ?? 0) + 1);
        totalAssignments += 1;

        const entry =
          people.get(id) ??
          ({
            id,
            fullName: person.fullName,
            email: person.email,
            total: 0,
            roles: {},
          } satisfies TopFaculty);

        entry.total += 1;
        entry.roles[key] = (entry.roles[key] ?? 0) + 1;
        people.set(id, entry);
      });
    });
  });

  const roles: RoleStat[] = ROLE_FIELDS.map(({ key, label }) => ({
    key,
    label,
    unique: roleSets.get(key)!.size,
    assignments: roleAssignments.get(key) ?? 0,
  }));

  const topFaculty = [...people.values()]
    .sort((a, b) => b.total - a.total || a.fullName.localeCompare(b.fullName))
    .slice(0, TOP_FACULTY_LIMIT);

  return { roles, topFaculty, uniquePeople: people.size, totalAssignments };
}

/* ---------------------------------- main ---------------------------------- */

export function buildDashboardMetrics(
  data: DashboardData,
  now: Date = new Date(),
): DashboardMetrics {
  const { summary, distributions, lists } = data;

  const sessions = collectSessions(data).sort(compareSessions);
  const topics = lists.recentTopics.slice(0, RECENT_TOPICS_LIMIT);

  const sessionsComplete = sessions.length >= summary.totalSessions;
  const topicsComplete = topics.length >= summary.totalTopics;

  const todayKey = toDateKey(now) ?? "";
  const nowMinutes = getMinutesOfDay(now);

  /* 1. Schedule overview + sessions by date */
  const byDateMap = new Map<string, ScheduleDateItem>();
  let today = 0;
  let upcoming = 0;
  let past = 0;

  sessions.forEach((session) => {
    if (session.dateKey === todayKey) today += 1;
    else if (session.dateKey > todayKey) upcoming += 1;
    else past += 1;

    const existing = byDateMap.get(session.dateKey);
    if (existing) existing.count += 1;
    else {
      byDateMap.set(session.dateKey, {
        dateKey: session.dateKey,
        sessionDate: session.sessionDate,
        count: 1,
        isToday: session.dateKey === todayKey,
        isPast: session.dateKey < todayKey,
      });
    }
  });

  const byDate = [...byDateMap.values()].sort((a, b) =>
    a.dateKey < b.dateKey ? -1 : 1,
  );

  /* 4 + 5. Sessions by hall / track (API aggregates are exact when our list is partial) */
  const halls = sessionsComplete
    ? countBy(sessions, (s) => s.hall)
    : sortDistribution(
        distributions.sessionsByHall.map((i) => ({
          label: i.name || UNASSIGNED,
          count: i.sessionCount ?? 0,
        })),
      );

  const tracks = sessionsComplete
    ? countBy(sessions, (s) => s.track)
    : sortDistribution(
        distributions.sessionsByTrack.map((i) => ({
          label: i.name || UNASSIGNED,
          count: i.sessionCount ?? 0,
        })),
      );

  /* 6. Topics by type */
  const topicTypes: DistributionItem[] = topicsComplete
    ? TOPIC_TYPES.map((type) => ({
        label: type,
        count: topics.filter((t) => t.topicType === type).length,
      }))
    : TOPIC_TYPES.map((type) => ({
        label: type,
        count:
          distributions.topicsByType.find((i) => i.topicType === type)?.total ?? 0,
      }));

  /* 3 + 8. Faculty roles (unique) and top faculty */
  let roles: RoleStat[];
  let topFaculty: TopFaculty[];
  let uniquePeople: number;
  let totalAssignments: number;

  if (topicsComplete) {
    ({ roles, topFaculty, uniquePeople, totalAssignments } =
      computeFacultyStats(topics));
  } else {
    roles = ROLE_FIELDS.map(({ key, label, apiName }) => {
      const total =
        distributions.facultyAssignmentsByRole.find(
          (r) => r.role.replace(/\s+/g, "").toLowerCase() === apiName,
        )?.totalAssignments ?? 0;
      return { key, label, unique: total, assignments: total };
    });
    topFaculty = distributions.topAssignedFaculty
      .slice(0, TOP_FACULTY_LIMIT)
      .map((f) => ({
        id: f.facultyId,
        fullName: f.fullName,
        email: f.email,
        total: f.totalAssignments,
        roles: {},
      }));
    totalAssignments = roles.reduce((sum, r) => sum + r.assignments, 0);
    uniquePeople = Math.max(...roles.map((r) => r.unique), 0);
  }

  /* 7. Next 5 sessions: today (not yet finished) and every later day */
  const upcomingSessions: UpcomingSession[] = sessions
    .filter((s) => {
      if (s.dateKey > todayKey) return true;
      if (s.dateKey < todayKey) return false;
      return s.endMinutes == null || nowMinutes < s.endMinutes;
    })
    .slice(0, UPCOMING_LIMIT)
    .map((s) => {
      const isLive =
        s.dateKey === todayKey &&
        s.startMinutes != null &&
        s.endMinutes != null &&
        nowMinutes >= s.startMinutes &&
        nowMinutes < s.endMinutes;

      return {
        ...s,
        phase: isLive ? "live" : s.dateKey === todayKey ? "today" : "upcoming",
      };
    });

  return {
    completeness: {
      sessions: sessionsComplete,
      topics: topicsComplete,
      knownSessions: sessions.length,
      knownTopics: topics.length,
    },
    schedule: { today, upcoming, past, byDate },
    halls,
    tracks,
    topicTypes,
    roles,
    rolesExact: topicsComplete,
    uniquePeople,
    totalAssignments,
    topFaculty,
    upcomingSessions,
  };
}

/* -------------------------------- formatting ------------------------------- */

const numberFormatter = new Intl.NumberFormat("en-IN");

export function formatNumber(value: number | undefined): string {
  return numberFormatter.format(value ?? 0);
}

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  timeZone: EVENT_TIME_ZONE,
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const shortDateFormatter = new Intl.DateTimeFormat("en-IN", {
  timeZone: EVENT_TIME_ZONE,
  weekday: "short",
  day: "2-digit",
  month: "short",
});

const dayFormatter = new Intl.DateTimeFormat("en-IN", {
  timeZone: EVENT_TIME_ZONE,
  day: "2-digit",
});

const monthFormatter = new Intl.DateTimeFormat("en-IN", {
  timeZone: EVENT_TIME_ZONE,
  month: "short",
});

const dateTimeFormatter = new Intl.DateTimeFormat("en-IN", {
  timeZone: EVENT_TIME_ZONE,
  weekday: "long",
  day: "2-digit",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function safeDate(value?: string): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(value?: string): string {
  const date = safeDate(value);
  return date ? dateFormatter.format(date) : "Date unavailable";
}

export function formatShortDate(value?: string): string {
  const date = safeDate(value);
  return date ? shortDateFormatter.format(date) : "Date unavailable";
}

export function formatDayMonth(value?: string): { day: string; month: string } {
  const date = safeDate(value);
  return date
    ? { day: dayFormatter.format(date), month: monthFormatter.format(date) }
    : { day: "--", month: "" };
}

export function formatNow(date: Date): string {
  return dateTimeFormatter.format(date);
}

/** "Today", "Tomorrow" or a short date. */
export function relativeDayLabel(dateKey: string, sessionDate: string, now: Date): string {
  const todayKey = toDateKey(now);
  const tomorrowKey = toDateKey(new Date(now.getTime() + 24 * 60 * 60 * 1000));
  if (dateKey === todayKey) return "Today";
  if (dateKey === tomorrowKey) return "Tomorrow";
  return formatShortDate(sessionDate);
}

export function getInitials(fullName?: string): string {
  const words = (fullName ?? "")
    .replace(/^(dr|prof|mr|mrs|ms)\.?\s+/i, "")
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) return "F";
  return (words[0][0] + (words[1]?.[0] ?? "")).toUpperCase();
}
