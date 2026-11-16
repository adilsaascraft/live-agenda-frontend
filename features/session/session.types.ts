
export interface SessionHall {
  _id: string;
  hallName: string;
}

export interface SessionTrack {
  _id: string;
  trackName: string;
}

export interface SessionChairperson {
  _id: string;
  fullName: string;
  email: string;
}

export interface Session {
  _id: string;
  sessionName: string;
  hallId: SessionHall | string;
  trackId: SessionTrack | string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  chairperson: SessionChairperson[] | string[];
  createdAt: string;
  updatedAt: string;
}

export interface SessionPayload {
  sessionName: string;
  hallId: string;
  trackId: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  chairperson: string[];
}

export type CreateSessionPayload = SessionPayload;
export type UpdateSessionPayload = Partial<SessionPayload>;

export interface SessionPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  from?: number;
  to?: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface SessionListResponse {
  success: boolean;
  message: string;
  data: {
    sessions: Session[];
  };
  pagination: SessionPagination;
}

export interface SessionLookupResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface SessionHallListResponse
  extends SessionLookupResponse<{
    halls: SessionHall[];
  }> {}

export interface SessionTrackListResponse
  extends SessionLookupResponse<{
    tracks: SessionTrack[];
  }> {}

export interface SessionFaculty {
  _id: string;
  fullName: string;
  email: string;
  mobile: string;
}

export interface SessionFacultyListResponse
  extends SessionLookupResponse<{
    faculties: SessionFaculty[];
  }> {}

export interface SessionFormValues {
  sessionName: string;
  hallId: string;
  trackId: string;
  sessionDate: Date | undefined;
  startTime: string;
  endTime: string;
  chairperson: string[];
}

export interface SessionListParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
