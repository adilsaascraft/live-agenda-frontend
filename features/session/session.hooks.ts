
"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { SESSION_CONFIG } from "./session.config";
import { sessionService } from "./session.service";

import type {
  CreateSessionPayload,
  SessionListParams,
  UpdateSessionPayload,
} from "./session.types";

export function useSessions(params: SessionListParams) {
  return useQuery({
    queryKey: [...SESSION_CONFIG.queryKey, params],
    queryFn: () => sessionService.getSessions(params),
    placeholderData: keepPreviousData,
  });
}

export function useSessionHalls() {
  return useQuery({
    queryKey: SESSION_CONFIG.lookupQueryKeys.halls,
    queryFn: sessionService.getHalls,
    staleTime: 1000 * 60 * 10,
  });
}

export function useSessionTracks() {
  return useQuery({
    queryKey: SESSION_CONFIG.lookupQueryKeys.tracks,
    queryFn: sessionService.getTracks,
    staleTime: 1000 * 60 * 10,
  });
}

export function useSessionFaculties() {
  return useQuery({
    queryKey: SESSION_CONFIG.lookupQueryKeys.faculties,
    queryFn: sessionService.getFaculties,
    staleTime: 1000 * 60 * 10,
  });
}

export function useCreateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSessionPayload) =>
      sessionService.createSession(payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: SESSION_CONFIG.queryKey,
      });

      toast.success("Session created successfully.");
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to create session.");
    },
  });
}

export function useUpdateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateSessionPayload;
    }) => sessionService.updateSession(id, payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: SESSION_CONFIG.queryKey,
      });

      toast.success("Session updated successfully.");
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to update session.");
    },
  });
}

export function useDeleteSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => sessionService.deleteSession(id),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: SESSION_CONFIG.queryKey,
      });

      toast.success("Session deleted successfully.");
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete session.");
    },
  });
}
