import { api } from "@/services/api";

import { TRACK_CONFIG } from "./track.config";

import type {
  CreateTrackPayload,
  TrackFacultyListResponse,
  TrackListParams,
  TrackListResponse,
  UpdateTrackPayload,
} from "./track.types";

export const trackService = {
  async getTracks(params: TrackListParams): Promise<TrackListResponse> {
    return api.get<TrackListResponse>(TRACK_CONFIG.endpoint, {
      params: {
        page: params.page,
        limit: params.limit,
        ...(params.search?.trim() ? { search: params.search.trim() } : {}),
        ...(params.status ? { status: params.status } : {}),
        ...(params.sortBy ? { sortBy: params.sortBy } : {}),
        ...(params.sortOrder ? { sortOrder: params.sortOrder } : {}),
      },
    });
  },

  async getFaculties(): Promise<TrackFacultyListResponse> {
    return api.get<TrackFacultyListResponse>(TRACK_CONFIG.lookups.faculties);
  },

  async createTrack(payload: CreateTrackPayload): Promise<unknown> {
    return api.post(TRACK_CONFIG.endpoint, payload);
  },

  async updateTrack(
    id: string,
    payload: UpdateTrackPayload,
  ): Promise<unknown> {
    return api.put(`${TRACK_CONFIG.endpoint}/${id}`, payload);
  },

  async deleteTrack(id: string): Promise<void> {
    return api.delete<void>(`${TRACK_CONFIG.endpoint}/${id}`);
  },
};
