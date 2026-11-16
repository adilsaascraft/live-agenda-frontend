
import { api } from "@/services/api";

import { SESSION_CONFIG } from "./session.config";

import type {
  CreateSessionPayload,
  SessionFacultyListResponse,
  SessionHallListResponse,
  SessionListParams,
  SessionListResponse,
  SessionTrackListResponse,
  UpdateSessionPayload,
} from "./session.types";

export const sessionService = {
  async getSessions(
    params: SessionListParams,
  ): Promise<SessionListResponse> {
    return api.get<SessionListResponse>(SESSION_CONFIG.endpoint, {
      params: {
        page: params.page,
        limit: params.limit,
        ...(params.search?.trim()
          ? { search: params.search.trim() }
          : {}),
        ...(params.sortBy ? { sortBy: params.sortBy } : {}),
        ...(params.sortOrder ? { sortOrder: params.sortOrder } : {}),
      },
    });
  },

  async getHalls(): Promise<SessionHallListResponse> {
    return api.get<SessionHallListResponse>(
      SESSION_CONFIG.lookups.halls,
    );
  },

  async getTracks(): Promise<SessionTrackListResponse> {
    return api.get<SessionTrackListResponse>(
      SESSION_CONFIG.lookups.tracks,
    );
  },

  async getFaculties(): Promise<SessionFacultyListResponse> {
    return api.get<SessionFacultyListResponse>(
      SESSION_CONFIG.lookups.faculties,
    );
  },

  async createSession(
    payload: CreateSessionPayload,
  ): Promise<unknown> {
    return api.post(SESSION_CONFIG.endpoint, payload);
  },

  async updateSession(
    id: string,
    payload: UpdateSessionPayload,
  ): Promise<unknown> {
    return api.put(`${SESSION_CONFIG.endpoint}/${id}`, payload);
  },

  async deleteSession(id: string): Promise<void> {
    return api.delete<void>(`${SESSION_CONFIG.endpoint}/${id}`);
  },
};
