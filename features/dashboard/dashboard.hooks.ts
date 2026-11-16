"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { getDashboard } from "./dashboard.service";
import type { DashboardData } from "./dashboard.types";

interface UseDashboardReturn {
  data: DashboardData | null;
  /** True only for the first load (no data on screen yet). */
  isLoading: boolean;
  /** True while re-fetching with data already on screen. */
  isRefreshing: boolean;
  isError: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useDashboard(enabled = true): UseDashboardReturn {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(enabled);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasDataRef = useRef(false);
  const requestIdRef = useRef(0);

  const fetchDashboard = useCallback(async () => {
    if (!enabled) return;

    // Ignore responses from older requests (unmount, double-click, strict mode).
    const requestId = ++requestIdRef.current;
    const isCurrent = () => requestId === requestIdRef.current;

    if (hasDataRef.current) setIsRefreshing(true);
    else setIsLoading(true);
    setError(null);

    try {
      const response = await getDashboard();

      if (!response.success || !response.data) {
        throw new Error(response.message || "Unable to load dashboard data.");
      }

      if (!isCurrent()) return;
      hasDataRef.current = true;
      setData(response.data);
    } catch (err) {
      if (!isCurrent()) return;
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading the dashboard.",
      );
    } finally {
      if (isCurrent()) {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    }
  }, [enabled]);

  useEffect(() => {
    if (enabled) void fetchDashboard();

    return () => {
      requestIdRef.current += 1;
    };
  }, [enabled, fetchDashboard]);

  return {
    data,
    isLoading,
    isRefreshing,
    isError: error !== null,
    error,
    refetch: fetchDashboard,
  };
}
