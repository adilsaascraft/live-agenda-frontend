
import { api } from "@/services/api";

import { TOPIC_CONFIG } from "./topic.config";

import type {
  CreateTopicPayload,
  TopicFacultiesResponse,
  TopicListParams,
  TopicListResponse,
  TopicSessionsResponse,
  UpdateTopicPayload,
} from "./topic.types";

export async function getTopics(
  params: TopicListParams,
): Promise<TopicListResponse> {
  return api.get<TopicListResponse>(TOPIC_CONFIG.endpoint, {
    params: {
      page: params.page,
      limit: params.limit,
      ...(params.search ? { search: params.search } : {}),
      ...(params.sortBy ? { sortBy: params.sortBy } : {}),
      ...(params.order ? { order: params.order } : {}),
    },
  });
}

/**
 * Form lookup: fetch all sessions without pagination.
 */
export async function getTopicSessions(): Promise<TopicSessionsResponse> {
  return api.get<TopicSessionsResponse>("/api/sessions/all");
}

/**
 * Form lookup: fetch all faculties without pagination.
 */
export async function getTopicFaculties(): Promise<TopicFacultiesResponse> {
  return api.get<TopicFacultiesResponse>("/api/faculties/all");
}

export async function createTopic(
  payload: CreateTopicPayload,
): Promise<unknown> {
  return api.post(TOPIC_CONFIG.endpoint, payload);
}

export async function updateTopic({
  id,
  payload,
}: {
  id: string;
  payload: UpdateTopicPayload;
}): Promise<unknown> {
  return api.put(`${TOPIC_CONFIG.endpoint}/${id}`, payload);
}

export async function deleteTopic(id: string): Promise<void> {
  return api.delete<void>(`${TOPIC_CONFIG.endpoint}/${id}`);
}
