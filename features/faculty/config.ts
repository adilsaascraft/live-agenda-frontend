export const FACULTY_CONFIG = {
  endpoint: "/api/faculties",
  queryKey: ["faculties"] as const,
  pageSize: 20,
  searchDebounce: 500,
};

export const FACULTY_FORM_DEFAULTS = {
  fullName: "",
  email: "",
  mobile: "",
} as const;