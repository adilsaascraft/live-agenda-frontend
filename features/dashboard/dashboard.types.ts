
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

export interface DashboardScheduleOverview {
  todaySessions: number;
  upcomingSessions: number;
  pastSessions: number;
}

export interface DistributionItem {
  name?: string;
  label?: string;
  count: number;
}

export interface FacultyAssignmentItem {
  role: string;
  count: number;
}

export interface TopAssignedFaculty {
  facultyId?: string;
  _id?: string;
  fullName: string;
  email?: string;
  count: number;
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

export interface DashboardSession {
  _id: string;
  sessionName: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  hallId?: DashboardHall | string | null;
  trackId?: DashboardTrack | string | null;
  chairperson?: DashboardFaculty[];
  createdAt?: string;
}

export interface DashboardTopic {
  _id: string;
  topicName: string;
  topicType: "Talk" | "Debate" | "Panel Discussion";
  startTime?: string;
  endTime?: string;
  sessionId?: {
    _id?: string;
    sessionName?: string;
    sessionDate?: string;
  } | string | null;
  createdAt?: string;
}

export interface DashboardDistributions {
  sessionsByHall: DistributionItem[];
  sessionsByTrack: DistributionItem[];
  topicsByType: DistributionItem[];
  facultyAssignmentsByRole: FacultyAssignmentItem[];
  topAssignedFaculty: TopAssignedFaculty[];
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
