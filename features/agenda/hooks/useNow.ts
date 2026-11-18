"use client";

import { useMemo, useSyncExternalStore } from "react";

import { STATUS_TICK_MS } from "../constants/agenda.constants";

/**
 * One shared clock for every status badge.
 *
 * - A single interval (shared by all subscribers) refreshes the timestamp
 *   every STATUS_TICK_MS and only while the tab is visible; it is also
 *   refreshed the moment the tab becomes visible again.
 * - Only components calling useNow() re-render on a tick, never the page.
 * - The server snapshot is null, so the first client render matches the
 *   server (no hydration mismatch); consumers render a placeholder until
 *   the clock has started.
 * - The interval and listener are removed when the last subscriber leaves.
 */

let current: number | null = null;
let timer: ReturnType<typeof setInterval> | undefined;
const listeners = new Set<() => void>();

function emit(): void {
  current = Date.now();
  listeners.forEach((listener) => listener());
}

function onVisibilityChange(): void {
  if (document.visibilityState === "visible") emit();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);

  if (listeners.size === 1) {
    current = Date.now();
    timer = setInterval(() => {
      if (document.visibilityState === "visible") emit();
    }, STATUS_TICK_MS);
    document.addEventListener("visibilitychange", onVisibilityChange);
  }

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      clearInterval(timer);
      timer = undefined;
      current = null;
      document.removeEventListener("visibilitychange", onVisibilityChange);
    }
  };
}

const getSnapshot = (): number | null => (listeners.size === 0 ? null : current);
const getServerSnapshot = (): number | null => null;

/** Current time, or null until the client clock has started. */
export function useNow(): Date | null {
  const timestamp = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return useMemo(() => (timestamp === null ? null : new Date(timestamp)), [timestamp]);
}
