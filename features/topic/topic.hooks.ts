
"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { TOPIC_CONFIG } from "./topic.config";

import {
  createTopic,
  deleteTopic,
  getTopicFaculties,
  getTopicSessions,
  getTopics,
  updateTopic,
} from "./topic.service";

import type {
  CreateTopicPayload,
  TopicListParams,
  UpdateTopicPayload,
} from "./topic.types";

export function useTopics(params: TopicListParams) {
  return useQuery({
    queryKey: [...TOPIC_CONFIG.queryKey, params],
    queryFn: () => getTopics(params),
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });
}

export function useTopicSessions() {
  return useQuery({
    queryKey: ["sessions", "all"],
    queryFn: getTopicSessions,
    staleTime: 1000 * 60 * 5,
  });
}

export function useTopicFaculties() {
  return useQuery({
    queryKey: ["faculties", "all"],
    queryFn: getTopicFaculties,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateTopic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTopicPayload) => createTopic(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: TOPIC_CONFIG.queryKey,
      });
    },
  });
}

export function useUpdateTopic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateTopicPayload;
    }) => updateTopic({ id, payload }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: TOPIC_CONFIG.queryKey,
      });
    },
  });
}

export function useDeleteTopic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTopic(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: TOPIC_CONFIG.queryKey,
      });
    },
  });
}
