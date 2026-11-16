
import api, {
  setAccessTokenRefreshHandler,
  type ApiRequestConfig,
} from "@/services/api";

import { AUTH_ENDPOINTS } from "./auth.constants";
import { useAuthStore } from "./auth.store";

import type {
  AdminProfileData,
  ApiEnvelope,
  ForgotPasswordPayload,
  LoginData,
  LoginPayload,
  RefreshData,
  ResetPasswordPayload,
} from "./auth.types";

/* -------------------------------------------------------------------------- */
/* Shared refresh request                                                      */
/* -------------------------------------------------------------------------- */

let refreshPromise: Promise<string> | null = null;

/* -------------------------------------------------------------------------- */
/* Validate API response                                                       */
/* -------------------------------------------------------------------------- */

function requireData<T>(response: ApiEnvelope<T>): T {
  if (!response.success || response.data === null) {
    throw new Error(
      response.message || "The request could not be completed."
    );
  }

  return response.data;
}

/* -------------------------------------------------------------------------- */
/* Login                                                                       */
/* -------------------------------------------------------------------------- */

export async function login(
  payload: LoginPayload
): Promise<LoginData> {
  const response = await api.post<ApiEnvelope<LoginData>>(
    AUTH_ENDPOINTS.login,
    payload,
    {
      skipAuthRefresh: true,
      credentials: "include",
    }
  );

  const data = requireData(response);

  // Save admin and access token in Zustand and localStorage.
  useAuthStore.getState().setSession(
    data.admin,
    data.accessToken
  );

  return data;
}

/* -------------------------------------------------------------------------- */
/* Refresh access token                                                        */
/* -------------------------------------------------------------------------- */

export async function refreshToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const response = await api.post<ApiEnvelope<RefreshData>>(
        AUTH_ENDPOINTS.refreshToken,
        undefined,
        {
          skipAuthRefresh: true,
          credentials: "include",
        }
      );

      const data = requireData(response);

      if (!data.accessToken) {
        throw new Error(
          "The server did not return a new access token."
        );
      }

      // Update Zustand, API memory and localStorage.
      useAuthStore.getState().setAccessToken(
        data.accessToken
      );

      return data.accessToken;
    })().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

/* -------------------------------------------------------------------------- */
/* Register automatic refresh handler                                         */
/* -------------------------------------------------------------------------- */

setAccessTokenRefreshHandler(async () => {
  try {
    return await refreshToken();
  } catch (error) {
    // Refresh token expired, invalid or revoked.
    useAuthStore.getState().clearSession();

    throw error;
  }
});

/* -------------------------------------------------------------------------- */
/* Logout                                                                      */
/* -------------------------------------------------------------------------- */

export async function logout(): Promise<void> {
  try {
    await api.post<ApiEnvelope<null>>(
      AUTH_ENDPOINTS.logout,
      undefined,
      {
        skipAuthRefresh: true,
        credentials: "include",
      }
    );
  } finally {
    // Clear local session even if the logout request fails.
    useAuthStore.getState().clearSession();
  }
}

/* -------------------------------------------------------------------------- */
/* Forgot password                                                             */
/* -------------------------------------------------------------------------- */

export async function forgotPassword(
  payload: ForgotPasswordPayload
): Promise<ApiEnvelope<unknown>> {
  return api.post<ApiEnvelope<unknown>>(
    AUTH_ENDPOINTS.forgotPassword,
    payload,
    {
      skipAuthRefresh: true,
    }
  );
}

/* -------------------------------------------------------------------------- */
/* Reset password                                                              */
/* -------------------------------------------------------------------------- */

export async function resetPassword(
  token: string,
  payload: ResetPasswordPayload
): Promise<ApiEnvelope<unknown>> {
  return api.post<ApiEnvelope<unknown>>(
    AUTH_ENDPOINTS.resetPassword(token),
    payload,
    {
      skipAuthRefresh: true,
    }
  );
}

/* -------------------------------------------------------------------------- */
/* Get admin profile                                                           */
/* -------------------------------------------------------------------------- */

export async function getAdminProfile(
  config?: ApiRequestConfig
): Promise<AdminProfileData> {
  const response = await api.get<ApiEnvelope<AdminProfileData>>(
    AUTH_ENDPOINTS.me,
    config
  );

  const data = requireData(response);

  useAuthStore.getState().setAdmin(data.admin);

  return data;
}
