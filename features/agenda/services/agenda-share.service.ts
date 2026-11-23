import api, { ApiError } from "@/services/api";
import type { AgendaSheetMode } from "../constants/agenda.constants";

const SAVED_AGENDA_ENDPOINT = "/api/agenda/whatsapp/saved";
const FULL_AGENDA_ENDPOINT = "/api/agenda/whatsapp/full";

export interface ShareAgendaRequest {
  name: string;
  phone: string;
  topicIds: string[];
  mode: AgendaSheetMode;
}


export async function shareAgendaViaWhatsApp(
  request: ShareAgendaRequest,
  signal?: AbortSignal,
): Promise<void> {
  const endpoint = request.mode === "full"
    ? FULL_AGENDA_ENDPOINT
    : SAVED_AGENDA_ENDPOINT;

  const payload = request.mode === "full"
    ? { name: request.name, mobile: request.phone }
    : { name: request.name, mobile: request.phone, topicIds: request.topicIds };

  await api.post<unknown>(endpoint, payload, { signal, credentials: "omit", skipAuthRefresh: true, timeout: 120_000 });
}


export function getShareErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.code === "NETWORK_ERROR") return "We couldn't reach the server. Check your connection and try again.";
    if (error.code === "TIMEOUT") return "This is taking too long. Please try again.";
    if (error.code === "ABORTED") return "The request was cancelled.";
    if (error.status === 429) return error.message || "You've reached the agenda sharing limit. Please try again later.";
    if (error.status >= 400 && error.status < 500) return error.message || "We couldn't send your agenda. Please check your details and try again.";
    if (error.status >= 500) return "Agenda sharing is temporarily unavailable. Please try again later.";
  }
  return "We couldn't send your agenda. Please try again.";
}
