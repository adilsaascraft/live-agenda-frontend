
"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { getIndianFormattedDate } from "@/lib/formatIndianDate";

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

/**
 * Topics list query.
 */
export function useTopics(params: TopicListParams) {
  return useQuery({
    queryKey: [...TOPIC_CONFIG.queryKey, params],
    queryFn: () => getTopics(params),
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Topic sessions lookup query.
 */
export function useTopicSessions() {
  return useQuery({
    queryKey: ["sessions", "all"],
    queryFn: getTopicSessions,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Topic faculties lookup query.
 */
export function useTopicFaculties() {
  return useQuery({
    queryKey: ["faculties", "all"],
    queryFn: getTopicFaculties,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Create topic mutation.
 */
export function useCreateTopic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTopicPayload) =>
      createTopic(payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: TOPIC_CONFIG.queryKey,
      });

      toast.success("Topic created successfully!", {
        description: getIndianFormattedDate(),
      });
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to create topic.");
    },
  });
}

/**
 * Update topic mutation.
 */
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

      toast.success("Topic updated successfully!", {
        description: getIndianFormattedDate(),
      });
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to update topic.");
    },
  });
}

/**
 * Delete topic mutation.
 */
export function useDeleteTopic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTopic(id),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: TOPIC_CONFIG.queryKey,
      });

      toast.warning("Topic deleted successfully!", {
        description: getIndianFormattedDate(),
      });
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete topic.");
    },
  });
}
