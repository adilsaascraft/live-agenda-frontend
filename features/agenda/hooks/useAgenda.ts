"use client";

import { useQuery } from "@tanstack/react-query";

import {
  AGENDA_QUERY_KEY,
  AGENDA_STALE_TIME_MS,
} from "../constants/agenda.constants";
import {
  fetchPublicTopics,
  getAgendaErrorMessage,
  shouldRetryAgendaRequest,
} from "../services/agenda.service";
import { buildAgendaModel } from "../utils/agenda.utils";

/**
 * Fetches the agenda exactly once and derives everything else from it.
 *
 * - The raw response is what React Query caches; `select` (a stable,
 *   module-level function) derives the normalised model, so it is only
 *   recomputed when the response changes.
 * - Window-focus / reconnect refetching is off and the data stays fresh for
 *   10 minutes: switching tabs, filtering or toggling favourites never
 *   triggers another request. Only the retry button does.
 */
export function useAgenda() {
  const query = useQuery({
    queryKey: AGENDA_QUERY_KEY,
    queryFn: ({ signal }) => fetchPublicTopics(signal),
    select: buildAgendaModel,
    staleTime: AGENDA_STALE_TIME_MS,
    retry: shouldRetryAgendaRequest,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return {
    model: query.data,
    isLoading: query.isPending,
    isRefetching: query.isFetching && !query.isPending,
    isError: query.isError,
    errorMessage: query.isError ? getAgendaErrorMessage(query.error) : null,
    refetch: query.refetch,
  };
}
