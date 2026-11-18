import api, { ApiError } from "@/services/api";

import {
  AGENDA_MAX_RETRIES,
  PUBLIC_TOPICS_ENDPOINT,
} from "../constants/agenda.constants";
import type { ApiTopic } from "../types/agenda.types";

/** Thrown when the server answered but the payload is not the expected shape. */
export class AgendaDataError extends Error {
  constructor(message = "Unexpected agenda response shape.") {
    super(message);
    this.name = "AgendaDataError";
    Object.setPrototypeOf(this, AgendaDataError.prototype);
  }
}

/**
 * Validates the envelope `{ success, message, data: { topics: [] } }` and
 * returns the topics array. Individual topics are validated later by the
 * normaliser, so one malformed record never breaks the whole agenda.
 */
export function extractTopics(payload: unknown): ApiTopic[] {
  if (payload && typeof payload === "object") {
    const envelope = payload as { success?: unknown; data?: unknown };

    if (envelope.success === false) {
      throw new AgendaDataError("The API reported an unsuccessful response.");
    }

    if (envelope.data && typeof envelope.data === "object") {
      const topics = (envelope.data as { topics?: unknown }).topics;
      if (Array.isArray(topics)) return topics as ApiTopic[];
    }
  }
  throw new AgendaDataError();
}

/**
 * Single GET to /api/public/topics through the shared api client.
 * credentials: "omit" — the endpoint is public, and the client default
 * ("include") would be rejected by a wildcard CORS policy.
 */
export async function fetchPublicTopics(
  signal?: AbortSignal,
): Promise<ApiTopic[]> {
  const payload = await api.get<unknown>(PUBLIC_TOPICS_ENDPOINT, {
    credentials: "omit",
    signal,
  });
  return extractTopics(payload);
}

/** Don't hammer the server for errors a retry cannot fix. */
export function shouldRetryAgendaRequest(
  failureCount: number,
  error: unknown,
): boolean {
  if (failureCount >= AGENDA_MAX_RETRIES) return false;

  if (error instanceof AgendaDataError) return false;

  if (error instanceof ApiError) {
    if (error.code === "CONFIG_ERROR" || error.code === "ABORTED") return false;
    if (error.code === "INVALID_JSON") return false;
    // 4xx will not fix itself; network failures (status 0), timeouts and
    // 5xx are worth another attempt.
    if (error.status >= 400 && error.status < 500) return false;
  }
  return true;
}

/** End-user-safe message. Never exposes raw technical details. */
export function getAgendaErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.code) {
      case "NETWORK_ERROR":
        return "We couldn't reach the server. Please check your internet connection and try again.";
      case "TIMEOUT":
        return "The server is taking too long to respond. Please try again.";
      case "CONFIG_ERROR":
        return "The agenda is temporarily unavailable. Please try again later.";
      default:
        break;
    }
    if (error.status >= 500) {
      return "The agenda service is having trouble right now. Please try again in a moment.";
    }
    if (error.status >= 400) {
      return "We couldn't load the agenda. Please try again later.";
    }
  }

  if (error instanceof AgendaDataError) {
    return "The agenda data we received looked unexpected. Please try again shortly.";
  }

  return "Something went wrong while loading the agenda. Please try again.";
}
