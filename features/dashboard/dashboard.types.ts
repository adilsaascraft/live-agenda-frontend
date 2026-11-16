/* ------------------------------------------------------------------ */
/*  Raw API types (match the real /api/dashboard payload)              */
/* ------------------------------------------------------------------ */

export type TopicType = "Talk" | "Debate" | "Panel Discussion";

export interface DashboardSummary {
  totalSessions: number;
  totalTopics: number;
  totalFaculty: number;
  totalHalls: number;
  totalTracks: number;
}

export interface StatusCount {
  total: number;
  active: number;
  inactive: number;
}

export interface DashboardStatusOverview {
  halls: StatusCount;
  tracks: StatusCount;
}

/** NOTE: the backend buckets by UTC date. The UI recomputes this in the event timezone. */
export interface DashboardScheduleOverview {
  todaySessions: number;
  upcomingSessions: number;
  pastSessions: number;
}

export interface ApiSessionCount {
  name: string;
  sessionCount: number;
}

export interface ApiTopicTypeCount {
  topicType: TopicType;
  total: number;
}

export interface ApiRoleCount {
  role: string;
  totalAssignments: number;
}

export interface ApiTopFaculty {
  facultyId: string;
  fullName: string;
  email?: string;
  mobile?: string;
  totalAssignments: number;
}

export interface DashboardDistributions {
  sessionsByHall: ApiSessionCount[];
  sessionsByTrack: ApiSessionCount[];
  topicsByType: ApiTopicTypeCount[];
  facultyAssignmentsByRole: ApiRoleCount[];
  topAssignedFaculty: ApiTopFaculty[];
}

export interface DashboardFaculty {
  _id?: string;
  fullName: string;
  email?: string;
  mobile?: string;
}

export interface DashboardHall {
  _id?: string;
  hallName: string;
  status?: "Active" | "Inactive";
}

export interface DashboardTrack {
  _id?: string;
  trackName: string;
  status?: "Active" | "Inactive";
}

/** Session as embedded in a topic (or any partial session reference). */
export interface DashboardSessionRef {
  _id?: string;
  sessionName?: string;
  sessionDate?: string;
  startTime?: string;
  endTime?: string;
  hallId?: { _id?: string; hallName?: string; status?: string } | string | null;
  trackId?: { _id?: string; trackName?: string; status?: string } | string | null;
  chairperson?: DashboardFaculty[];
}

export interface DashboardSession extends DashboardSessionRef {
  _id: string;
  sessionName: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardTopic {
  _id: string;
  topicName: string;
  topicType: TopicType;
  startTime?: string;
  endTime?: string;
  sessionId?: DashboardSessionRef | string | null;
  facultyId?: DashboardFaculty[];
  moderatorId?: DashboardFaculty[];
  panelistId?: DashboardFaculty[];
  expertPanelistId?: DashboardFaculty[];
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardLists {
  upcomingSessions: DashboardSession[];
  recentSessions: DashboardSession[];
  recentTopics: DashboardTopic[];
}

export interface DashboardData {
  generatedAt: string;
  summary: DashboardSummary;
  statusOverview: DashboardStatusOverview;
  scheduleOverview: DashboardScheduleOverview;
  distributions: DashboardDistributions;
  lists: DashboardLists;
}

export interface DashboardApiResponse {
  success: boolean;
  message: string;
  data: DashboardData;
}

/* ------------------------------------------------------------------ */
/*  Derived (UI) types                                                 */
/* ------------------------------------------------------------------ */

export interface DistributionItem {
  label: string;
  count: number;
}

export type FacultyRoleKey =
  | "faculty"
  | "moderator"
  | "panelist"
  | "expertPanelist";

export interface RoleStat {
  key: FacultyRoleKey;
  label: string;
  /** Distinct people in this role. */
  unique: number;
  /** Total topic assignments in this role (repeats included). */
  assignments: number;
}

export interface TopFaculty {
  id: string;
  fullName: string;
  email?: string;
  total: number;
  roles: Partial<Record<FacultyRoleKey, number>>;
}

export interface AgendaSession {
  id: string;
  name: string;
  /** YYYY-MM-DD in the event timezone. */
  dateKey: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  startMinutes: number | null;
  endMinutes: number | null;
  hall: string;
  track: string;
  chairpersons: DashboardFaculty[];
}

export type UpcomingPhase = "live" | "today" | "upcoming";

export interface UpcomingSession extends AgendaSession {
  phase: UpcomingPhase;
}

export interface ScheduleDateItem {
  dateKey: string;
  sessionDate: string;
  count: number;
  isToday: boolean;
  isPast: boolean;
}

export interface DashboardMetrics {
  completeness: {
    sessions: boolean;
    topics: boolean;
    knownSessions: number;
    knownTopics: number;
  };
  schedule: {
    today: number;
    upcoming: number;
    past: number;
    byDate: ScheduleDateItem[];
  };
  halls: DistributionItem[];
  tracks: DistributionItem[];
  topicTypes: DistributionItem[];
  roles: RoleStat[];
  /** false when role numbers fall back to the API's (non-unique) totals. */
  rolesExact: boolean;
  uniquePeople: number;
  totalAssignments: number;
  topFaculty: TopFaculty[];
  upcomingSessions: UpcomingSession[];
}
