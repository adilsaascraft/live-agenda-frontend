
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
  Tag,
  UserRound,
} from "lucide-react";

import { formatDate, formatNow } from "@/features/dashboard/dashboard.utils";
import { colors, gradients } from "@/lib/constants/colors";

import { AGENDA_EVENT } from "../utils/agenda-event";
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

  /* Session - aligned with the My Agenda sheet */
  #${PRINT_ROOT_ID} .pa-session {
    margin-bottom: 7mm;
    border: 1px solid #881337;
    border-radius: 4mm;
    overflow: hidden;
    background: #eff6ff !important;
    page-break-inside: auto;
    break-inside: auto;
  }

  #${PRINT_ROOT_ID} .pa-session-top {
    padding: 4mm;
    background: #eff6ff !important;
  }

  #${PRINT_ROOT_ID} .pa-session-heading {
    display: flex;
    align-items: flex-start;
    gap: 2.5mm;
    margin-bottom: 3mm;
  }

  #${PRINT_ROOT_ID} .pa-session-icon {
    display: inline-flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    width: 8mm;
    height: 8mm;
    border-radius: 2mm;
    color: #ffffff !important;
    background: #2563eb !important;
  }

  #${PRINT_ROOT_ID} .pa-session-eyebrow {
    margin-bottom: 1mm !important;
    color: #1d4ed8;
    font-size: 7pt;
    font-weight: 700;
    letter-spacing: 1pt;
    text-transform: uppercase;
  }

  #${PRINT_ROOT_ID} .pa-session-title {
    display: block;
    margin: 0;
    padding: 0;
    color: #172554;
    font-size: 12pt;
    font-weight: 800;
    line-height: 1.35;
  }

  #${PRINT_ROOT_ID} .pa-session-meta-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 2mm 5mm;
    border-top: 1px solid rgba(147, 197, 253, 0.55);
    padding-top: 2.5mm;
    margin-top: 2.5mm;
  }

  #${PRINT_ROOT_ID} .pa-session-date,
  #${PRINT_ROOT_ID} .pa-session-time,
  #${PRINT_ROOT_ID} .pa-session-hall,
  #${PRINT_ROOT_ID} .pa-session-track {
    display: inline-flex;
    align-items: center;
    gap: 1.5mm;
    color: #475569;
    font-size: 8pt;
    font-weight: 600;
  }

  #${PRINT_ROOT_ID} .pa-session-hall {
    color: #1e40af;
  }

  #${PRINT_ROOT_ID} .pa-session-track {
    color: #1e3a8a;
  }

  #${PRINT_ROOT_ID} .pa-person-row {
    display: flex;
    align-items: flex-start;
    gap: 2mm;
    border-top: 1px solid rgba(147, 197, 253, 0.55);
    padding: 2.5mm 4mm;
    background: #eff6ff !important;
    color: #475569;
    font-size: 8pt;
  }

  #${PRINT_ROOT_ID} .pa-person-label {
    flex: 0 0 auto;
    color: #172554;
    font-weight: 800;
  }

  #${PRINT_ROOT_ID} .pa-person-names {
    min-width: 0;
    font-weight: 500;
  }

  /* Topic */
  #${PRINT_ROOT_ID} .pa-topics {
    padding: 3mm;
    background: #eff6ff !important;
  }

  #${PRINT_ROOT_ID} .pa-topic {
    position: relative;
    margin-bottom: 3mm;
    border: 1px solid #c7d2fe;
    border-radius: 3mm;
    padding: 3.5mm;
    background: #eff6ff !important;
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

  #${PRINT_ROOT_ID} .pa-topic-title-row {
    display: flex;
    align-items: flex-start;
    gap: 2mm;
    margin: 0 0 2mm;
  }

  #${PRINT_ROOT_ID} .pa-topic-title-icon {
    display: inline-flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    width: 7mm;
    height: 7mm;
    border-radius: 2mm;
    background: #f3e8ff !important;
    color: #6b21a8 !important;
  }

  #${PRINT_ROOT_ID} .pa-topic-title {
    margin: 0;
    padding: 0;
    color: #172554;
    font-size: 10pt;
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
    border-top: 1px solid rgba(147, 197, 253, 0.55);
    margin-top: 3mm;
    padding-top: 2.5mm;
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

interface PrintablePerson {
  id?: string;
  fullName: string;
}

function getPrintablePeople(value: unknown): PrintablePerson[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    if (typeof item !== "object" || item === null) return [];
    const person = item as Record<string, unknown>;
    const fullName =
      typeof person.fullName === "string" && person.fullName.trim()
        ? person.fullName.trim()
        : undefined;

    return fullName
      ? [{
          id: typeof person.id === "string" ? person.id : undefined,
          fullName,
        }]
      : [];
  });
}

function PrintablePersonRow({
  label,
  people,
}: {
  label: string;
  people: PrintablePerson[];
}) {
  if (people.length === 0) return null;

  return (
    <div className="pa-person-row">
      <UserRound size={13} style={{ color: "#64748b", flexShrink: 0 }} />
      <span className="pa-person-label">{label}:</span>
      <span className="pa-person-names">
        {people.map((person) => person.fullName).join(", ")}
      </span>
    </div>
  );
}

function PrintableTopic({
  topic,
}: {
  topic: AgendaTopicLookup["topic"];
}) {
  const typeStyle = TOPIC_TYPE_STYLES[topic.type ?? ""] ?? DEFAULT_TOPIC_STYLE;
  const groups = getTopicParticipantGroups(topic);
  const topicData = topic as unknown as Record<string, unknown>;
  const faculty = getPrintablePeople(
    topicData.faculty ?? topicData.facultyMembers ?? topicData.facultyId,
  );

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

      {/* Topic title stays on the card surface; no separate title background. */}
      <div className="pa-topic-title-row">
        <span className="pa-topic-title-icon">
          <FileText size={15} />
        </span>
        <h3 className="pa-topic-title">{topic.name}</h3>
      </div>

      <p className="pa-topic-time">
        <Clock size={13} style={{ color: colors.amber[700] }} />
        {formatTimeRange(topic.startTime, topic.endTime)}
      </p>

      {/* Faculty uses the same plain, unboxed treatment as session people. */}
      <PrintablePersonRow label="Faculty" people={faculty} />

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
      {/* Session name */}
      <div className="pa-session-top">
        <div className="pa-session-heading">
          <span className="pa-session-icon">
            <Layers size={16} />
          </span>
          <div>
            <p className="pa-session-eyebrow">Session</p>
            <h2 className="pa-session-title">{session.name}</h2>
          </div>
        </div>

        {/* Row 1: Date + time */}
        <div className="pa-session-meta-row">
          <span className="pa-session-date">
            <CalendarDays size={13} />
            {formatDate(session.sessionDate)}
          </span>
          <span className="pa-session-time">
            <Clock size={13} />
            {formatTimeRange(session.startTime, session.endTime)}
          </span>
        </div>

        {/* Row 2: Hall + track */}
        {(session.hall || session.track) && (
          <div className="pa-session-meta-row">
            {session.hall && (
              <span className="pa-session-hall">
                <MapPin size={12} />
                {session.hall.name}
              </span>
            )}
            {session.track && (
              <span className="pa-session-track">
                <Layers size={12} />
                {session.track.name}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Row 3: Chairpersons */}
      <PrintablePersonRow
        label={session.chairpersons.length > 1 ? "Chairpersons" : "Chairperson"}
        people={session.chairpersons}
      />

      {/* Row 4: Track leaders */}
      <PrintablePersonRow
        label={session.trackLeaders.length > 1 ? "Track Leaders" : "Track Leader"}
        people={session.trackLeaders}
      />

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
    background: gradients.primary,
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
      eAgenda
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
