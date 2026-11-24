
"use client";

import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  CalendarDays,
  Clock,
  Layers,
  MapPin,
  Presentation,
  UserRound,
} from "lucide-react";
import { SearchHighlightText } from "./SearchHighlightText";
import { colors, gradients } from "@/lib/constants/colors";
import { formatDate } from "@/features/dashboard/dashboard.utils";

import type { AgendaSession, AgendaTopic } from "../types/agenda.types";
import { getSessionElementId } from "../utils/agenda.utils";
import { formatTimeRange } from "../utils/format.utils";
import { getAgendaDateTime } from "../utils/agenda-date-time";
import { useHighlight } from "./HighlightContext";
import { PersonChip } from "./PersonChip";
import { AgendaCountdown } from "./AgendaCountdown";
import { TopicCard } from "./TopicCard";

interface SessionCardProps {
  session: AgendaSession;
  /** Topics to show (already filtered by search / topic type). */
  topics: readonly AgendaTopic[];
}

export const SessionCard = memo(function SessionCard({
  session,
  topics,
}: SessionCardProps) {
  const elementId = getSessionElementId(session.id);
  const titleId = `${elementId}-title`;

  const {
    elementId: highlightedElementId,
    searchElementIds = [],
  } = useHighlight();

  const reduceMotion = useReducedMotion();

  const isTarget =
    highlightedElementId === elementId ||
    searchElementIds.includes(elementId);

  const sessionDateTime = getAgendaDateTime(
    session.sessionDate,
    session.startTime,
    session.endTime,
  );

  return (
    <motion.section
      id={elementId}
      aria-labelledby={titleId}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="scroll-mt-24"
    >
      <motion.div
  initial="rest"
  animate={
    isTarget && !reduceMotion
      ? {
          borderColor: [
            colors.sky[900],
            colors.zinc[900],
            colors.sky[900],
          ],
        }
      : {
          borderColor: colors.rose[100],
        }
  }
  transition={
    isTarget && !reduceMotion
      ? { duration: 1, repeat: Infinity, ease: "easeInOut" }
      : { duration: 0.2 }
  }
  className="relative overflow-hidden rounded-xl border shadow-sm"
  style={{
    borderColor: colors.rose[100],
  }}
>
        {/* Left accent - Always rose-900 */}
<div
  className="absolute inset-y-0 left-0 z-10 w-1"
  style={{ backgroundColor: colors.rose[900] }}
  aria-hidden="true"
/>

        <div className="space-y-3 p-3 pl-5 sm:p-4 sm:pl-6">
          {/* Row 1: Date + status + countdown on left, hall on right */}
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <div
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2"
                style={{
                  backgroundColor: colors.zinc[900],
                  color: colors.zinc[50],
                }}
              >
                <CalendarDays className="size-4 shrink-0" aria-hidden="true" />
                <span className="text-sm font-bold tracking-wide">
                  {formatDate(session.sessionDate)}
                </span>
              </div>

              <AgendaCountdown
                startAt={sessionDateTime.startAt}
                endAt={sessionDateTime.endAt}
              />
            </div>

            {session.hall && (
              <span
                className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-sm font-semibold"
                style={{
                  backgroundColor: colors.orange[50],
                  borderColor: colors.orange[200],
                  color: colors.orange[900],
                }}
              >
                <MapPin className="size-4 shrink-0" aria-hidden="true" />
                <SearchHighlightText text={session.hall.name} />
              </span>
            )}
          </div>

          {/* Row 2: Session time */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span
              className="inline-flex items-center gap-1.5 text-sm font-semibold"
              style={{ color: colors.slate[700] }}
            >
              <Clock
                className="size-4 shrink-0"
                style={{ color: colors.slate[600] }}
                aria-hidden="true"
              />
              {formatTimeRange(session.startTime, session.endTime)}
            </span>
          </div>

          {/* Row 3: Session name */}
          <h3
            id={titleId}
            className="flex items-center gap-2 text-lg font-bold leading-snug tracking-tight text-zinc-800 sm:text-xl"
          >
            <Presentation className="size-5 shrink-0 text-zinc-500" />
            <SearchHighlightText text={session.name} />
          </h3>

          {/* Row 4: Track + track leaders (same look as chairpersons) */}
          {session.track && (
            <div className="space-y-3">
              <span
                className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-sm font-semibold"
                style={{
                  backgroundColor: colors.amber[50],
                  borderColor: colors.amber[200],
                  color: colors.amber[900],
                }}
              >
                <Layers className="size-4 shrink-0" aria-hidden="true" />
                <SearchHighlightText text={session.track.name} />
              </span>

              {session.trackLeaders.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="shrink-0 text-lg font-bold"
                    style={{ color: colors.zinc[900] }}
                  >
                    {session.trackLeaders.length > 1
                      ? "Track Leaders:"
                      : "Track Leader:"}
                  </span>

                  <ul className="flex min-w-0 flex-wrap items-center gap-2">
                    {session.trackLeaders.map((person) => (
                      <li
                        key={person.id}
                        className="rounded-lg border border-zinc-200 px-3 py-2 text-sm font-bold shadow-sm"
                        style={{
                          backgroundColor: colors.navy[900],
                          color: colors.zinc[50],
                        }}
                      >
                        <PersonChip
                          person={person}
                          icon={UserRound}
                          cardId={elementId}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Divider + Chairpersons */}
        <div
          className="space-y-3 border-t px-3 py-3 pl-5 sm:px-4 sm:pl-6"
          style={{ borderColor: colors.orange[200] }}
        >
          {session.chairpersons.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="shrink-0 text-lg font-bold"
                style={{ color: colors.zinc[900] }}
              >
                {session.chairpersons.length > 1
                  ? "Chairpersons:"
                  : "Chairperson:"}
              </span>

              {/* One shared background for all chairperson names */}
              <ul className="flex min-w-0 flex-wrap items-center gap-2">
                {session.chairpersons.map((person) => (
                  <li
                    key={person.id}
                    className="rounded-lg border border-zinc-200 px-3 py-2 text-sm font-bold shadow-sm"
                    style={{
                      backgroundColor: colors.navy[900],
                      color: colors.zinc[50],
                    }}
                  >
                    <PersonChip
                      person={person}
                      icon={UserRound}
                      cardId={elementId}
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </motion.div>

      {/* Session topics timeline */}
      {topics.length > 0 && (
        <div className="relative ml-3 mt-5 sm:ml-8">
          {/* Main vertical timeline */}
          <div
            className="absolute bottom-3 left-[9px] top-0 w-[2px] rounded-full"
            style={{
  background: gradients.primary,
}}
            aria-hidden="true"
          />

          {/* Topics */}
          <div className="space-y-4">
            {topics.map((topic, index) => (
              <div key={topic.id} className="relative pl-9">
                {/* Topic Number Node */}
                <div
                  className="absolute left-0 top-0 z-10 flex size-7 -translate-y-1/2 items-center justify-center rounded-full border-2 text-[11px] font-extrabold tabular-nums shadow-md"
                  style={{
                    background: gradients.primary,
                    borderColor: gradients.primary,
                    color: colors.white[50],
                    boxShadow: `0 0 0 3px ${colors.rose[50]}`,
                  }}
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(2, "0")}
                </div>

                {/* Topic card */}
                <TopicCard
  topic={topic}
  sessionDate={session.sessionDate}
  topicIndex={index}
/>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.section>
  );
});
