import type { MasterDataEntity } from "@/shared/master-data/types";

export interface Faculty extends MasterDataEntity {
  fullName: string;
  email: string;
  mobile: string;
}

export interface FacultyPayload {
  fullName: string;
  email: string;
  mobile: string;
}

export type CreateFacultyPayload = FacultyPayload;
export type UpdateFacultyPayload = FacultyPayload;

export interface FacultyListParams {
  page: number;
  limit: number;
  search?: string;
}

export interface FacultyPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  from: number;
  to: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface FacultyListResponse {
  success: boolean;
  message: string;
  data: {
    faculties: Faculty[];
  };
  pagination: FacultyPagination;
}

export interface FacultyMutationResponse {
  success: boolean;
  message: string;
  data: {
    faculty: Faculty;
  };
}

export interface FacultyDeleteResponse {
  success: boolean;
  message: string;
  data: {
    faculty: Faculty;
  };
}