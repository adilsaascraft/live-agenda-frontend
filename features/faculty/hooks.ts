
"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { getIndianFormattedDate } from "@/lib/formatIndianDate";

import { FACULTY_CONFIG } from "./config";

import {
  createFaculty,
  deleteFaculty,
  getFaculties,
  updateFaculty,
} from "./service";

import type {
  CreateFacultyPayload,
  FacultyListParams,
  UpdateFacultyPayload,
} from "./type";

/**
 * Faculty list query.
 *
 * Supports:
 * - Server-side pagination
 * - Server-side search
 */
export function useFacultyList(params: FacultyListParams) {
  const normalizedParams = {
    page: params.page,
    limit: params.limit,
    search: params.search?.trim() ?? "",
  };

  return useQuery({
    queryKey: [
      ...FACULTY_CONFIG.queryKey,
      normalizedParams,
    ],

    queryFn: () => getFaculties(normalizedParams),

    placeholderData: keepPreviousData,

    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Create faculty mutation.
 */
export function useFacultyCreate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateFacultyPayload) =>
      createFaculty(payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: FACULTY_CONFIG.queryKey,
      });

      toast.success("Faculty created successfully!", {
        description: getIndianFormattedDate(),
      });
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to create faculty.");
    },
  });
}

/**
 * Update faculty mutation.
 */
export function useFacultyUpdate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateFacultyPayload;
    }) => updateFaculty({ id, payload }),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: FACULTY_CONFIG.queryKey,
      });

      toast.success("Faculty updated successfully!", {
        description: getIndianFormattedDate(),
      });
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to update faculty.");
    },
  });
}

/**
 * Delete faculty mutation.
 */
export function useFacultyDelete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteFaculty(id),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: FACULTY_CONFIG.queryKey,
      });

      toast.warning("Faculty deleted successfully!", {
        description: getIndianFormattedDate(),
      });
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete faculty.");
    },
  });
}
