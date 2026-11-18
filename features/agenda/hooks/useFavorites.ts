"use client";

import { useCallback, useSyncExternalStore } from "react";

import { FAVORITES_STORAGE_KEY } from "../constants/agenda.constants";

/**
 * Favourite topic ids, persisted in localStorage.
 *
 * Implemented as a tiny external store consumed through useSyncExternalStore:
 *  - the server snapshot is always empty, so server and first client render
 *    match (no hydration mismatch) and localStorage is never touched on the
 *    server;
 *  - only topic ids are stored — never API data;
 *  - malformed JSON / wrong shapes are treated as "no favourites";
 *  - the `storage` event keeps other browser tabs in sync;
 *  - if storage is unavailable (private mode, quota) it degrades to memory.
 */

const MAX_FAVORITES = 500;
const EMPTY: readonly string[] = Object.freeze([]);

let memoryRaw: string | null = null;
let cachedRaw: string | null | undefined;
let cachedIds: readonly string[] = EMPTY;
const listeners = new Set<() => void>();

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(FAVORITES_STORAGE_KEY);
  } catch {
    return memoryRaw;
  }
}

function writeRaw(raw: string): void {
  memoryRaw = raw;
  try {
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, raw);
  } catch {
    /* storage unavailable: keep the in-memory copy */
  }
}

function parseIds(raw: string | null): readonly string[] {
  if (!raw) return EMPTY;
  try {
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return EMPTY;
    const ids = new Set<string>();
    for (const item of value) {
      if (typeof item === "string" && item.trim() && ids.size < MAX_FAVORITES) {
        ids.add(item);
      }
    }
    return ids.size > 0 ? [...ids] : EMPTY;
  } catch {
    return EMPTY;
  }
}

/** Referentially stable until the stored value actually changes. */
function getSnapshot(): readonly string[] {
  const raw = readRaw();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedIds = parseIds(raw);
  }
  return cachedIds;
}

const getServerSnapshot = (): readonly string[] => EMPTY;

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === FAVORITES_STORAGE_KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function setIds(ids: readonly string[]): void {
  writeRaw(JSON.stringify(ids));
  listeners.forEach((listener) => listener());
}

/* Stable actions (module-level, so consumers can use them in effects). */

export function toggleFavorite(id: string): void {
  const current = getSnapshot();
  setIds(current.includes(id) ? current.filter((x) => x !== id) : [...current, id]);
}

export function removeFavorites(ids: readonly string[]): void {
  if (ids.length === 0) return;
  const drop = new Set(ids);
  const current = getSnapshot();
  const next = current.filter((id) => !drop.has(id));
  if (next.length !== current.length) setIds(next);
}

/** Subscribes only this caller to one id's state. */
export function useIsFavorite(id: string): boolean {
  const getIdSnapshot = useCallback(() => getSnapshot().includes(id), [id]);
  return useSyncExternalStore(subscribe, getIdSnapshot, () => false);
}

export function useFavorites() {
  const ids = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return {
    ids,
    count: ids.length,
    toggle: toggleFavorite,
    remove: (id: string) => removeFavorites([id]),
    removeMany: removeFavorites,
  };
}
