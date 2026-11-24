export type TrackStatus = "Active" | "Inactive";

export interface TrackLeader {
  _id: string;
  fullName: string;
  email: string;
  mobile: string;
}

export interface Track {
  _id: string;
  trackName: string;
  trackLeaderIds: TrackLeader[] | string[];
  status: TrackStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TrackPayload {
  trackName: string;
  status: TrackStatus;
  trackLeaderIds: string[];
}

export type CreateTrackPayload = TrackPayload;
export type UpdateTrackPayload = Partial<TrackPayload>;

export interface TrackPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  from?: number;
  to?: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface TrackListResponse {
  success: boolean;
  message: string;
  data: {
    tracks: Track[];
  };
  pagination: TrackPagination;
}

export interface TrackLookupResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface TrackFacultyListResponse
  extends TrackLookupResponse<{
    faculties: TrackLeader[];
  }> {}

export interface TrackFormValues {
  trackName: string;
  status: TrackStatus;
  trackLeaderIds: string[];
}

export interface TrackListParams {
  page: number;
  limit: number;
  search?: string;
  status?: TrackStatus;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
