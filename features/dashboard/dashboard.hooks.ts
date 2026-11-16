
"use client";

import { useCallback, useEffect, useState } from "react";

import { getDashboard } from "./dashboard.service";
import type { DashboardData } from "./dashboard.types";

interface UseDashboardReturn {
  data: DashboardData | null;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useDashboard(enabled = true): UseDashboardReturn {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    if (!enabled) return;

    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      const response = await getDashboard();

      if (!response.success || !response.data) {
        throw new Error(
          response.message || "Unable to load dashboard data.",
        );
      }

      setData(response.data);
    } catch (err) {
      setIsError(true);
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading the dashboard.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    if (enabled) {
      void fetchDashboard();
    }
  }, [enabled, fetchDashboard]);

  return {
    data,
    isLoading,
    isError,
    error,
    refetch: fetchDashboard,
  };
}
