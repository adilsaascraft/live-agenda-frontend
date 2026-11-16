export const AUTH_ENDPOINTS = {
  login: "/api/auth/login",
  refreshToken: "/api/auth/refresh-token",
  logout: "/api/auth/logout",
  forgotPassword: "/api/auth/forgot-password",
  resetPassword: (token: string) =>
    `/api/auth/reset-password/${encodeURIComponent(token)}`,
  me: "/api/auth/me",
} as const;

export const AUTH_ROUTES = {
  login: "/login",
  forgotPassword: "/forgot-password",
  dashboard: "/dashboard",
} as const;
