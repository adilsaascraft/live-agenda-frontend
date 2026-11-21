
"use client";

import { useMemo } from "react";
import { createPortal } from "react-dom";
import {
  Activity,
  CalendarDays,
  Clock,
  FileText,
  Heart,
  Layers,
  MapPin,
  Presentation,
  Tag,
} from "lucide-react";

import { formatDate, formatNow } from "@/features/dashboard/dashboard.utils";
import { colors, gradients } from "@/lib/constants/colors";

import { AGENDA_EVENT } from "../constants/agenda.constants";
import { useIsClient } from "../hooks/useIsClient";
import { useNow } from "../hooks/useNow";
import type { AgendaTopicLookup } from "../types/agenda.types";
import {
  getTopicParticipantGroups,
  groupLookupsBySession,
} from "../utils/agenda.utils";
import { formatTimeRange } from "../utils/format.utils";
import { ParticipantGroups } from "./ParticipantGroups";

export const PRINT_ROOT_ID = "agenda-print-root";

const PRINT_CSS = `
#${PRINT_ROOT_ID} {
  display: none;
}

@media print {
  @page {
    size: A4;
    margin: 12mm;
  }

  html,
  body {
    background: #ffffff !important;
    height: auto !important;
    overflow: visible !important;
    position: static !important;
    margin: 0 !important;
  }

  body > *:not(#${PRINT_ROOT_ID}) {
    display: none !important;
  }

  #${PRINT_ROOT_ID} {
    display: block !important;
    width: 100%;
    color: #18181b;
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
    font-size: 9pt;
    line-height: 1.45;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  #${PRINT_ROOT_ID} * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    box-sizing: border-box;
  }

  #${PRINT_ROOT_ID} p {
    margin: 0;
  }

  /* Header */
  #${PRINT_ROOT_ID} .pa-header {
    position: relative;
    overflow: hidden;
    border-radius: 5mm;
    padding: 8mm 7mm;
    margin-bottom: 8mm;
    color: #ffffff;
    background: #6d28d9 !important;
    page-break-inside: avoid;
    break-inside: avoid;
  }

  #${PRINT_ROOT_ID} .pa-header h1 {
    font-size: 24pt;
    line-height: 1.15;
    font-weight: 800;
    letter-spacing: -0.5pt;
    margin: 2mm 0 3mm;
  }

  #${PRINT_ROOT_ID} .pa-header-event {
    font-size: 9pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2pt;
    color: #e9d5ff;
  }

  #${PRINT_ROOT_ID} .pa-header-details {
    display: flex;
    flex-wrap: wrap;
    gap: 2mm 5mm;
    margin-top: 4mm;
    font-size: 9pt;
    font-weight: 600;
  }

  #${PRINT_ROOT_ID} .pa-header-detail {
    display: flex;
    align-items: center;
    gap: 2mm;
  }

  #${PRINT_ROOT_ID} .pa-generated {
    border-top: 1px solid rgba(255,255,255,0.25);
    margin-top: 5mm;
    padding-top: 3mm;
    color: #f3e8ff;
    font-size: 8pt;
    font-weight: 500;
  }

  /* Session */
  #${PRINT_ROOT_ID} .pa-session {
    margin-bottom: 7mm;
    border: 1px solid #fed7aa;
    border-radius: 4mm;
    overflow: hidden;
    background: #fff7ed !important;
    page-break-inside: auto;
    break-inside: auto;
  }

  #${PRINT_ROOT_ID} .pa-session-top {
    padding: 4mm;
    background: #ffedd5 !important;
    border-bottom: 1px solid #fdba74;
  }

  #${PRINT_ROOT_ID} .pa-session-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 2mm;
    margin-bottom: 3mm;
  }

  #${PRINT_ROOT_ID} .pa-session-date {
    display: inline-flex;
    align-items: center;
    gap: 1.5mm;
    border-radius: 2mm;
    padding: 2mm 3mm;
    background: #18181b !important;
    color: #ffffff !important;
    font-size: 8pt;
    font-weight: 700;
  }

  #${PRINT_ROOT_ID} .pa-session-hall {
    display: inline-flex;
    align-items: center;
    gap: 1.5mm;
    border: 1px solid #fdba74;
    border-radius: 2mm;
    padding: 1.5mm 3mm;
    background: #fff7ed !important;
    color: #9a3412 !important;
    font-weight: 700;
    font-size: 8pt;
  }

  #${PRINT_ROOT_ID} .pa-session-time {
    display: flex;
    align-items: center;
    gap: 1.5mm;
    color: #475569;
    font-size: 8.5pt;
    font-weight: 700;
  }

  #${PRINT_ROOT_ID} .pa-session-track {
    display: inline-flex;
    align-items: center;
    gap: 1.5mm;
    border: 1px solid #fcd34d;
    border-radius: 2mm;
    padding: 1.5mm 3mm;
    background: #fffbeb !important;
    color: #92400e !important;
    font-size: 8pt;
    font-weight: 700;
  }

  #${PRINT_ROOT_ID} .pa-session-title {
    display: flex;
    align-items: flex-start;
    gap: 2mm;
    margin: 0;
    padding: 4mm;
    color: #27272a;
    font-size: 13pt;
    font-weight: 800;
    line-height: 1.35;
  }

  #${PRINT_ROOT_ID} .pa-chairpersons {
    border-top: 1px solid #fdba74;
    padding: 3mm 4mm;
    background: #ffedd5 !important;
  }

  #${PRINT_ROOT_ID} .pa-chair-label {
    font-weight: 800;
    margin-right: 2mm;
  }

  #${PRINT_ROOT_ID} .pa-chair-list {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5mm;
    margin-top: 2mm;
  }

  #${PRINT_ROOT_ID} .pa-chair {
    border-radius: 2mm;
    padding: 1.5mm 3mm;
    background: #172554 !important;
    color: #ffffff !important;
    font-size: 8pt;
    font-weight: 700;
  }

  /* Topic */
  #${PRINT_ROOT_ID} .pa-topics {
    padding: 3mm;
  }

  #${PRINT_ROOT_ID} .pa-topic {
    position: relative;
    margin-bottom: 3mm;
    border: 1px solid #99f6e4;
    border-radius: 3mm;
    padding: 3.5mm;
    background: #ccfbf1 !important;
    page-break-inside: avoid;
    break-inside: avoid;
  }

  #${PRINT_ROOT_ID} .pa-topic:last-child {
    margin-bottom: 0;
  }

  #${PRINT_ROOT_ID} .pa-topic-type {
    display: inline-flex;
    align-items: center;
    gap: 1.5mm;
    border: 1px solid;
    border-radius: 2mm;
    padding: 1.5mm 3mm;
    font-size: 8pt;
    font-weight: 700;
    margin-bottom: 2mm;
  }

  #${PRINT_ROOT_ID} .pa-topic-title {
    display: flex;
    align-items: flex-start;
    gap: 2mm;
    margin: 0 0 2mm;
    color: #172554;
    font-size: 11pt;
    font-weight: 800;
    line-height: 1.4;
  }

  #${PRINT_ROOT_ID} .pa-topic-time {
    display: flex;
    align-items: center;
    gap: 1.5mm;
    color: #334155;
    font-size: 8.5pt;
    font-weight: 700;
  }

  #${PRINT_ROOT_ID} .pa-topic-participants {
    border-top: 1px solid #99f6e4;
    margin-top: 3mm;
    padding-top: 3mm;
  }

  /* Footer */
  #${PRINT_ROOT_ID} .pa-footer {
    border-radius: 4mm;
    padding: 5mm;
    background: #18181b !important;
    color: #ffffff !important;
    margin-top: 6mm;
    page-break-inside: avoid;
    break-inside: avoid;
  }

  #${PRINT_ROOT_ID} .pa-footer-brand {
    display: flex;
    align-items: center;
    gap: 2mm;
    font-size: 12pt;
    font-weight: 800;
  }

  #${PRINT_ROOT_ID} .pa-footer-copyright {
    margin-top: 2mm;
    color: #d4d4d8;
    font-size: 8pt;
  }

  #${PRINT_ROOT_ID} .pa-footer-attribution {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1.5mm;
    margin-top: 3mm;
    color: #d4d4d8;
    font-size: 8pt;
  }

  #${PRINT_ROOT_ID} .pa-footer-heart {
    color: #fb923c !important;
    fill: #fb923c !important;
  }

  #${PRINT_ROOT_ID} .pa-footer-company {
    color: #7dd3fc !important;
    font-weight: 800;
  }

  /* Avoid breaking individual cards */
  #${PRINT_ROOT_ID} .pa-topic,
  #${PRINT_ROOT_ID} .pa-chairpersons,
  #${PRINT_ROOT_ID} .pa-session-title {
    page-break-inside: avoid;
    break-inside: avoid;
  }
}
`;

interface PrintableAgendaProps {
  items: readonly AgendaTopicLookup[];
}

const TOPIC_TYPE_STYLES: Record<
  string,
  {
    backgroundColor: string;
    borderColor: string;
    color: string;
  }
> = {
  Talk: {
    backgroundColor: colors.blue[50],
    borderColor: colors.blue[200],
    color: colors.blue[800],
  },
  Debate: {
    backgroundColor: colors.violet[50],
    borderColor: colors.violet[200],
    color: colors.violet[800],
  },
  "Panel Discussion": {
    backgroundColor: colors.teal[50],
    borderColor: colors.teal[200],
    color: colors.teal[800],
  },
};

const DEFAULT_TOPIC_STYLE = {
  backgroundColor: colors.slate[100],
  borderColor: colors.slate[200],
  color: colors.slate[700],
};

function PrintableTopic({
  topic,
}: {
  topic: AgendaTopicLookup["topic"];
}) {
  const typeStyle = TOPIC_TYPE_STYLES[topic.type ?? ""] ?? DEFAULT_TOPIC_STYLE;
  const groups = getTopicParticipantGroups(topic);

  return (
    <article className="pa-topic">
      {topic.type && (
        <div
          className="pa-topic-type"
          style={{
            backgroundColor: typeStyle.backgroundColor,
            borderColor: typeStyle.borderColor,
            color: typeStyle.color,
          }}
        >
          <Tag size={12} />
          {topic.type}
        </div>
      )}

      <h3 className="pa-topic-title">
        <FileText
          size={17}
          style={{ color: colors.slate[600], flexShrink: 0 }}
        />
        {topic.name}
      </h3>

      <p className="pa-topic-time">
        <Clock size={13} style={{ color: colors.amber[700] }} />
        {formatTimeRange(topic.startTime, topic.endTime)}
      </p>

      {groups.length > 0 && (
        <div className="pa-topic-participants">
          <ParticipantGroups
            topic={topic}
            cardId={`print-topic-${topic.id}`}
          />
        </div>
      )}
    </article>
  );
}

function PrintableSession({
  session,
  topics,
}: {
  session: AgendaTopicLookup["session"];
  topics: readonly AgendaTopicLookup["topic"][];
}) {
  return (
    <section className="pa-session">
      {/* Session metadata */}
      <div className="pa-session-top">
        <div className="pa-session-meta">
          <span className="pa-session-date">
            <CalendarDays size={13} />
            {formatDate(session.sessionDate)}
          </span>

          {session.hall && (
            <span className="pa-session-hall">
              <MapPin size={12} />
              {session.hall.name}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="pa-session-time">
            <Clock size={13} />
            {formatTimeRange(session.startTime, session.endTime)}
          </p>

          {session.track && (
            <span className="pa-session-track">
              <Layers size={12} />
              {session.track.name}
            </span>
          )}
        </div>
      </div>

      {/* Session title */}
      <h2 className="pa-session-title">
        <Presentation
          size={19}
          style={{ color: colors.zinc[500], flexShrink: 0 }}
        />
        {session.name}
      </h2>

      {/* Chairpersons */}
      {session.chairpersons.length > 0 && (
        <div className="pa-chairpersons">
          <p className="pa-chair-label">
            {session.chairpersons.length > 1
              ? "Chairpersons"
              : "Chairperson"}
          </p>

          <div className="pa-chair-list">
            {session.chairpersons.map((person) => (
              <span key={person.id} className="pa-chair">
                {person.fullName}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Topics */}
      {topics.length > 0 && (
        <div className="pa-topics">
          {topics.map((topic) => (
            <PrintableTopic key={topic.id} topic={topic} />
          ))}
        </div>
      )}
    </section>
  );
}

/** Printable "My Agenda" - mirrors the visual language of the live agenda. */
export function PrintableAgenda({ items }: PrintableAgendaProps) {
  const isClient = useIsClient();
  const now = useNow();

  const groups = useMemo(
    () => groupLookupsBySession(items),
    [items],
  );

  if (!isClient || groups.length === 0) return null;

  return createPortal(
    <div id={PRINT_ROOT_ID} aria-hidden="true">
      <style>{PRINT_CSS}</style>

      {/* Agenda Header */}
      <header
  className="pa-header"
  style={{
    background: gradients.royalPurple,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  }}
>
  <div
    className="pa-header-event"
    style={{ justifyContent: "center", textAlign: "center" }}
  >
    <Activity
      size={13}
      style={{ display: "inline", marginRight: 6 }}
    />
    Conference Agenda
  </div>

  <h1>{AGENDA_EVENT.name}</h1>

  <div
    className="pa-header-details"
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
    }}
  >
    <div className="pa-header-detail" style={{ justifyContent: "center" }}>
      <CalendarDays size={14} />
      {AGENDA_EVENT.dateRangeLabel}
    </div>

    <div className="pa-header-detail" style={{ justifyContent: "center" }}>
      <MapPin size={14} />
      {AGENDA_EVENT.venue}
    </div>

    <div className="pa-header-detail" style={{ justifyContent: "center" }}>
      {AGENDA_EVENT.location}
    </div>
  </div>

  <p className="pa-generated" style={{ textAlign: "center" }}>
    My Agenda · {items.length}{" "}
    {items.length === 1 ? "topic" : "topics"}
    {now ? ` · Generated ${formatNow(now)}` : ""}
  </p>
</header>

      {/* Sessions & Topics */}
      <main>
        {groups.map(({ session, topics }) => (
          <PrintableSession
            key={session.id}
            session={session}
            topics={topics}
          />
        ))}
      </main>

      {/* Agenda Footer */}
      <footer
  className="pa-footer"
  style={{
    background: gradients.obsidian,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    gap: "12px",
  }}
>
  <div className="pa-footer-brand">
    <span
      className="flex size-8 items-center justify-center rounded-lg"
      style={{
        background: gradients.orangeFire,
        color: colors.white[50],
      }}
    >
      <CalendarDays size={16} />
    </span>

    <span>
      eagenda
      <span style={{ color: colors.orange[400] }}>.live</span>
    </span>
  </div>

  <p className="pa-footer-copyright">
    © {new Date().getFullYear()} All rights reserved.
  </p>

  <div className="pa-footer-attribution">
    <span>Crafted with</span>
    <Heart className="pa-footer-heart" size={12} />
    <span>by</span>
    <span className="pa-footer-company">
      SaaScraft Studio India Pvt Ltd
    </span>
  </div>
</footer>
    </div>,
    document.body,
  );
}
