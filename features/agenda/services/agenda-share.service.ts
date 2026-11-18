import api, { ApiError } from "@/services/api";

import { AGENDA_EVENT } from "../constants/agenda.constants";

/**
 * WhatsApp PDF delivery integration boundary.
 *
 * A generated PDF cannot be attached through a `wa.me` link, and WhatsApp
 * Business credentials must never reach the browser. Delivery therefore
 * needs a SERVER-SIDE endpoint that you own. This module only talks to that
 * endpoint; it is configured through one public env var holding the endpoint
 * path (not a secret):
 *
 *   NEXT_PUBLIC_AGENDA_SHARE_ENDPOINT=/api/public/agenda/share-whatsapp
 *
 * (the path above is an EXAMPLE — use whatever your backend exposes).
 * Until it is set, sharing reports "not configured" instead of pretending.
 * The full request/response contract is in docs/WHATSAPP_BACKEND_CONTRACT.md.
 */
const SHARE_ENDPOINT = process.env.NEXT_PUBLIC_AGENDA_SHARE_ENDPOINT?.trim() || null;

export const isAgendaShareConfigured = (): boolean => SHARE_ENDPOINT !== null;

export interface ShareAgendaRequest {
  /** Recipient's display name. */
  name: string;
  /** Recipient number in E.164 format, e.g. "+919876543210". */
  phone: string;
  /** Favourite topic ids. The backend rebuilds the PDF from its own data. */
  topicIds: string[];
}

export class ShareNotConfiguredError extends Error {
  constructor() {
    super("Agenda sharing endpoint is not configured.");
    this.name = "ShareNotConfiguredError";
    Object.setPrototypeOf(this, ShareNotConfiguredError.prototype);
  }
}

/**
 * Resolves only when the backend answered 2xx. The backend must answer 2xx
 * only after WhatsApp accepted the document message (see contract doc).
 */
export async function shareAgendaViaWhatsApp(
  request: ShareAgendaRequest,
  signal?: AbortSignal,
): Promise<void> {
  if (!SHARE_ENDPOINT) throw new ShareNotConfiguredError();

  await api.post<unknown>(
    SHARE_ENDPOINT,
    {
      event: AGENDA_EVENT.name,
      recipient: { name: request.name, phone: request.phone },
      topicIds: request.topicIds,
    },
    { signal, credentials: "omit" },
  );
}

/** End-user-safe messages. */
export function getShareErrorMessage(error: unknown): string {
  if (error instanceof ShareNotConfiguredError) {
    return "Sending to WhatsApp isn't available yet. You can use Print and choose “Save as PDF” instead.";
  }
  if (error instanceof ApiError) {
    switch (error.code) {
      case "NETWORK_ERROR":
        return "We couldn't reach the server. Please check your connection and try again.";
      case "TIMEOUT":
        return "This is taking too long. Please try again.";
      case "ABORTED":
        return "The request was cancelled.";
      default:
        break;
    }
    if (error.status === 429) return "Too many requests. Please wait a moment and try again.";
    if (error.status >= 400 && error.status < 500) {
      return error.message || "We couldn't send your agenda. Please check your details and try again.";
    }
    if (error.status >= 500) {
      return "The sharing service is having trouble right now. Please try again later.";
    }
  }
  return "We couldn't send your agenda. Please try again.";
}
