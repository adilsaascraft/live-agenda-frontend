
import { create } from "zustand";
import type { Admin } from "./auth.types";
import { setAccessToken } from "@/services/api";

const ACCESS_TOKEN_STORAGE_KEY = "live-agenda-access-token";

interface AuthStore {
  admin: Admin | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;

  setSession: (admin: Admin, accessToken: string) => void;
  setAccessToken: (accessToken: string) => void;
  setAdmin: (admin: Admin) => void;
  setInitializing: (value: boolean) => void;
  clearSession: () => void;
}

/* -------------------------------------------------------------------------- */
/* Local storage helpers                                                       */
/* -------------------------------------------------------------------------- */

function persistAccessToken(token: string | null): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    if (token) {
      window.localStorage.setItem(
        ACCESS_TOKEN_STORAGE_KEY,
        token
      );
    } else {
      window.localStorage.removeItem(
        ACCESS_TOKEN_STORAGE_KEY
      );
    }
  } catch (error) {
    console.error("Unable to persist access token:", error);
  }
}

export function getStoredAccessToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage.getItem(
      ACCESS_TOKEN_STORAGE_KEY
    );
  } catch (error) {
    console.error("Unable to read access token:", error);
    return null;
  }
}

/* -------------------------------------------------------------------------- */
/* Zustand auth store                                                          */
/* -------------------------------------------------------------------------- */

export const useAuthStore = create<AuthStore>((set) => ({
  admin: null,
  accessToken: null,
  isAuthenticated: false,
  isInitializing: true,

  setSession: (admin, token) => {
    setAccessToken(token);
    persistAccessToken(token);

    set({
      admin,
      accessToken: token,
      isAuthenticated: true,
      isInitializing: false,
    });
  },

  setAccessToken: (token) => {
    setAccessToken(token);
    persistAccessToken(token);

    set({
      accessToken: token,
      isAuthenticated: Boolean(token),
    });
  },

  setAdmin: (admin) => {
    set({ admin });
  },

  setInitializing: (value) => {
    set({ isInitializing: value });
  },

  clearSession: () => {
    setAccessToken(null);
    persistAccessToken(null);

    set({
      admin: null,
      accessToken: null,
      isAuthenticated: false,
      isInitializing: false,
    });
  },
}));
