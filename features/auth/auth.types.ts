export interface Admin {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T | null;
  errors?: unknown;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginData {
  admin: Admin;
  accessToken: string;
}

export interface RefreshData {
  accessToken: string;
}

export interface AdminProfileData {
  admin: Admin;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  password: string;
}

export interface AuthState {
  admin: Admin | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
}
