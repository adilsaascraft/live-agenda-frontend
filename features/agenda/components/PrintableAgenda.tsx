"use client";

import { useMemo } from "react";
import { createPortal } from "react-dom";

import { formatDate, formatNow } from "@/features/dashboard/dashboard.utils";

import { AGENDA_EVENT } from "../constants/agenda.constants";
import { useIsClient } from "../hooks/useIsClient";
import { useNow } from "../hooks/useNow";
import type { AgendaTopicLookup } from "../types/agenda.types";
import { getTopicParticipantGroups, groupLookupsBySession } from "../utils/agenda.utils";
import { formatTimeRange } from "../utils/format.utils";

export const PRINT_ROOT_ID = "agenda-print-root";

/**
 * The only stylesheet for the printed agenda. Paper output deliberately uses
 * plain ink colours instead of theme tokens (themes can be dark / tinted).
 * Hidden on screen; when printing, every other child of <body> (page,
 * sheet, dialogs, overlays) is hidden so ONLY this block is printed.
 */
const PRINT_CSS = `
#${PRINT_ROOT_ID} { display: none; }
@media print {
  @page { size: A4; margin: 14mm; }
  html, body {
    background: #fff !important;
    height: auto !important;
    overflow: visible !important;
    position: static !important;
  }
  body > *:not(#${PRINT_ROOT_ID}) { display: none !important; }
  #${PRINT_ROOT_ID} {
    display: block !important;
    color: #111;
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
    font-size: 10.5pt;
    line-height: 1.45;
  }
  #${PRINT_ROOT_ID} h1 { font-size: 20pt; margin: 0 0 2mm; }
  #${PRINT_ROOT_ID} h2 { font-size: 13pt; margin: 0 0 1mm; }
  #${PRINT_ROOT_ID} h3 { font-size: 11pt; margin: 0 0 1mm; }
  #${PRINT_ROOT_ID} p { margin: 0 0 1mm; }
  #${PRINT_ROOT_ID} .pa-header { border-bottom: 2px solid #111; padding-bottom: 4mm; margin-bottom: 6mm; }
  #${PRINT_ROOT_ID} .pa-muted { color: #555; }
  #${PRINT_ROOT_ID} .pa-session { margin-bottom: 7mm; }
  #${PRINT_ROOT_ID} .pa-session-head {
    border-left: 3px solid #111;
    padding-left: 3mm;
    margin-bottom: 3mm;
    break-after: avoid;
    page-break-after: avoid;
  }
  #${PRINT_ROOT_ID} .pa-topic {
    border: 1px solid #ccc;
    border-radius: 2mm;
    padding: 2.5mm 3mm;
    margin: 0 0 2.5mm 6mm;
    break-inside: avoid;
    page-break-inside: avoid;
  }
  #${PRINT_ROOT_ID} .pa-meta { color: #555; font-size: 9.5pt; }
}
`;

interface PrintableAgendaProps {
  items: readonly AgendaTopicLookup[];
}

/** Printable "My Agenda" (portalled to <body>; browsers can Save as PDF). */
export function PrintableAgenda({ items }: PrintableAgendaProps) {
  const isClient = useIsClient();
  const now = useNow();
  const groups = useMemo(() => groupLookupsBySession(items), [items]);

  if (!isClient || groups.length === 0) return null;

  return createPortal(
    <div id={PRINT_ROOT_ID} aria-hidden="true">
      <style>{PRINT_CSS}</style>

      <header className="pa-header">
        <h1>{AGENDA_EVENT.name}</h1>
        <p>{AGENDA_EVENT.dateRangeLabel}</p>
        <p>
          {AGENDA_EVENT.venue}, {AGENDA_EVENT.location}
        </p>
        <p className="pa-muted">
          My Agenda · {items.length} {items.length === 1 ? "topic" : "topics"}
          {now ? ` · Generated ${formatNow(now)}` : ""}
        </p>
      </header>

      {groups.map(({ session, topics }) => (
        <section key={session.id} className="pa-session">
          <div className="pa-session-head">
            <h2>{session.name}</h2>
            <p>
              {formatDate(session.sessionDate)} · {formatTimeRange(session.startTime, session.endTime)}
            </p>
            <p className="pa-meta">
              {[session.hall?.name && `Hall: ${session.hall.name}`, session.track?.name && `Track: ${session.track.name}`]
                .filter(Boolean)
                .join("  |  ")}
            </p>
            {session.chairpersons.length > 0 && (
              <p className="pa-meta">
                {session.chairpersons.length > 1 ? "Chairpersons" : "Chairperson"}:{" "}
                {session.chairpersons.map((person) => person.fullName).join(", ")}
              </p>
            )}
          </div>

          {topics.map((topic) => (
            <article key={topic.id} className="pa-topic">
              <h3>{topic.name}</h3>
              <p className="pa-meta">
                {formatTimeRange(topic.startTime, topic.endTime)}
                {topic.type ? ` · ${topic.type}` : ""}
              </p>
              {getTopicParticipantGroups(topic).map((group) => (
                <p key={group.role}>
                  <strong>{group.label}:</strong> {group.people.map((person) => person.fullName).join(", ")}
                </p>
              ))}
            </article>
          ))}
        </section>
      ))}
    </div>,
    document.body,
  );
}
