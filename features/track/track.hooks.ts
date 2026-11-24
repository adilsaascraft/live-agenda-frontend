"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { TRACK_CONFIG } from "./track.config";
import { trackService } from "./track.service";

import type {
  CreateTrackPayload,
  TrackListParams,
  UpdateTrackPayload,
} from "./track.types";
import { getIndianFormattedDate } from "@/lib/formatIndianDate";

async function invalidateTrackQueries(queryClient: QueryClient) {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: TRACK_CONFIG.queryKey }),
    // Session list rows and the session form's track dropdown depend on tracks.
    queryClient.invalidateQueries({
      queryKey: TRACK_CONFIG.relatedQueryKeys.sessions,
    }),
  ]);
}

export function useTracks(params: TrackListParams) {
  return useQuery({
    queryKey: [...TRACK_CONFIG.queryKey, params],
    queryFn: () => trackService.getTracks(params),
    placeholderData: keepPreviousData,
  });
}

export function useTrackFaculties() {
  return useQuery({
    queryKey: TRACK_CONFIG.lookupQueryKeys.faculties,
    queryFn: trackService.getFaculties,
    staleTime: 1000 * 60 * 10,
  });
}

export function useCreateTrack() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTrackPayload) =>
      trackService.createTrack(payload),

    onSuccess: async () => {
      await invalidateTrackQueries(queryClient);

      toast.success("Track created successfully!", {
        description: getIndianFormattedDate(),
      });
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to create track.");
    },
  });
}

export function useUpdateTrack() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateTrackPayload;
    }) => trackService.updateTrack(id, payload),

    onSuccess: async () => {
      await invalidateTrackQueries(queryClient);

      toast.success("Track updated successfully!", {
        description: getIndianFormattedDate(),
      });
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to update track.");
    },
  });
}

export function useDeleteTrack() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => trackService.deleteTrack(id),

    onSuccess: async () => {
      await invalidateTrackQueries(queryClient);

      toast.warning("Track deleted successfully!", {
        description: getIndianFormattedDate(),
      });
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete track.");
    },
  });
}
