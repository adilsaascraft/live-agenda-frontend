import { api } from "@/services/api";

import { FACULTY_CONFIG } from "./config";

import type {
  CreateFacultyPayload,
  FacultyDeleteResponse,
  FacultyListParams,
  FacultyListResponse,
  FacultyMutationResponse,
  UpdateFacultyPayload,
} from "./type";

/**
 * Get faculties with server-side pagination and search.
 *
 * GET /api/faculties?page=1&limit=20&search=asif
 */
export async function getFaculties({
  page,
  limit,
  search,
}: FacultyListParams): Promise<FacultyListResponse> {
  return api.get<FacultyListResponse>(FACULTY_CONFIG.endpoint, {
    params: {
      page,
      limit,
      search: search?.trim() || undefined,
    },
  });
}

/**
 * Create faculty.
 *
 * POST /api/faculties
 */
export async function createFaculty(
  payload: CreateFacultyPayload,
): Promise<FacultyMutationResponse> {
  return api.post<FacultyMutationResponse>(
    FACULTY_CONFIG.endpoint,
    payload,
  );
}

/**
 * Update faculty.
 *
 * PUT /api/faculties/:id
 */
export async function updateFaculty({
  id,
  payload,
}: {
  id: string;
  payload: UpdateFacultyPayload;
}): Promise<FacultyMutationResponse> {
  return api.put<FacultyMutationResponse>(
    `${FACULTY_CONFIG.endpoint}/${id}`,
    payload,
  );
}

/**
 * Delete faculty.
 *
 * DELETE /api/faculties/:id
 */
export async function deleteFaculty(
  id: string,
): Promise<FacultyDeleteResponse> {
  return api.delete<FacultyDeleteResponse>(
    `${FACULTY_CONFIG.endpoint}/${id}`,
  );
}