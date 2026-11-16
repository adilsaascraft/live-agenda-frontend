
"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";

import { AUTH_ROUTES } from "./auth.constants";

import {
  getAdminProfile,
  login as loginRequest,
  logout as logoutRequest,
  refreshToken,
} from "./auth.service";

import {
  getStoredAccessToken,
  useAuthStore,
} from "./auth.store";

import type { LoginPayload } from "./auth.types";
import { getAuthErrorMessage } from "./auth.utils";

/* -------------------------------------------------------------------------- */
/* Bootstrap session once                                                      */
/* -------------------------------------------------------------------------- */

let authBootstrapPromise: Promise<void> | null = null;

function initializeAuthSession(): Promise<void> {
  // Already resolved (bootstrap finished, or the user just logged in /
  // logged out and the store is settled). Never verify twice.
  if (!useAuthStore.getState().isInitializing) {
    return Promise.resolve();
  }

  // The promise is intentionally kept for the lifetime of the page, so
  // React Strict Mode's double effect and several consumers (root page and
  // protected layout) all share one single verification request.
  if (!authBootstrapPromise) {
    authBootstrapPromise = (async () => {
      const store = useAuthStore.getState();

      try {
        const storedToken = getStoredAccessToken();

        if (storedToken) {
          // Restore the saved access token into memory.
          store.setAccessToken(storedToken);
        } else {
          // No saved access token: try the HTTP-only refresh cookie.
          await refreshToken();
        }

        // Validate the session and restore admin information.
        // If the access token has expired, the API client will
        // automatically refresh it and retry this request.
        await getAdminProfile();
      } catch {
        // No valid session: require a new login.
        useAuthStore.getState().clearSession();
      } finally {
        useAuthStore.getState().setInitializing(false);
      }
    })();
  }

  return authBootstrapPromise;
}

/* -------------------------------------------------------------------------- */
/* Authentication hook                                                         */
/* -------------------------------------------------------------------------- */

export function useAuth() {
  const router = useRouter();

  const admin = useAuthStore((state) => state.admin);
  const accessToken = useAuthStore((state) => state.accessToken);
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  /* ------------------------------------------------------------------------ */
  /* Sign in                                                                   */
  /* ------------------------------------------------------------------------ */

  const signIn = useCallback(
    async (payload: LoginPayload) => {
      const result = await loginRequest(payload);

      router.replace(AUTH_ROUTES.dashboard);
      router.refresh();

      return result;
    },
    [router]
  );

  /* ------------------------------------------------------------------------ */
  /* Sign out                                                                  */
  /* ------------------------------------------------------------------------ */

  const signOut = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      router.replace(AUTH_ROUTES.login);
      router.refresh();
    }
  }, [router]);

  return {
    admin,
    accessToken,
    isAuthenticated,
    signIn,
    signOut,
  };
}

/* -------------------------------------------------------------------------- */
/* Authentication bootstrap                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Safe to call from several components (root page, protected layout):
 * the verification itself only ever runs once.
 *
 * Restores the access token from localStorage and validates
 * the session using the backend.
 */
export function useAuthBootstrap() {
  useEffect(() => {
    void initializeAuthSession();
  }, []);
}

/* -------------------------------------------------------------------------- */
/* Protected route hook                                                        */
/* -------------------------------------------------------------------------- */

export function useRequireAuth() {
  const router = useRouter();

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  const isInitializing = useAuthStore(
    (state) => state.isInitializing
  );

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      router.replace(AUTH_ROUTES.login);
    }
  }, [isAuthenticated, isInitializing, router]);

  return {
    isAuthenticated,
    isInitializing,
  };
}

/* -------------------------------------------------------------------------- */
/* Export auth error helper                                                    */
/* -------------------------------------------------------------------------- */

export { getAuthErrorMessage };
