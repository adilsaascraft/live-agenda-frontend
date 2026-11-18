"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Clock, Layers, MapPin, UserRound } from "lucide-react";

import { formatDate } from "@/features/dashboard/dashboard.utils";

import type { AgendaSession, AgendaTopic } from "../types/agenda.types";
import { getSessionElementId } from "../utils/agenda.utils";
import { cx } from "../utils/cx";
import { formatTimeRange } from "../utils/format.utils";
import { useHighlight } from "./HighlightContext";
import { PersonChip } from "./PersonChip";
import { StatusBadge } from "./StatusBadge";
import { TopicCard } from "./TopicCard";

interface SessionCardProps {
  session: AgendaSession;
  /** Topics to show (already filtered by search / topic type). */
  topics: readonly AgendaTopic[];
}

export const SessionCard = memo(function SessionCard({ session, topics }: SessionCardProps) {
  const elementId = getSessionElementId(session.id);
  const titleId = `${elementId}-title`;
  const isTarget = useHighlight().elementId === elementId;

  return (
    <motion.section
      id={elementId}
      aria-labelledby={titleId}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="scroll-mt-24"
    >
      <div
        className={cx(
          "overflow-hidden rounded-2xl border border-l-4 border-l-primary bg-card shadow-sm transition-shadow duration-300",
          isTarget && "ring-2 ring-primary/50 shadow-md",
        )}
      >
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1.5">
            <p className="flex items-center gap-2 text-2xl font-bold tracking-tight text-card-foreground">
              <CalendarDays className="size-6 text-primary" aria-hidden="true" />
              {formatDate(session.sessionDate)}
            </p>
            <p className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
              <Clock className="size-4" aria-hidden="true" />
              {formatTimeRange(session.startTime, session.endTime)}
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:items-end">
            <StatusBadge slot={session} />
            {session.hall && (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-sm font-medium">
                <MapPin className="size-4 text-primary" aria-hidden="true" />
                {session.hall.name}
              </span>
            )}
            {session.track && (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-sm font-medium">
                <Layers className="size-4 text-primary" aria-hidden="true" />
                {session.track.name}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-3 border-t px-5 pb-5 pt-4">
          <h3 id={titleId} className="text-xl font-bold leading-snug text-card-foreground">
            {session.name}
          </h3>

          {session.chairpersons.length > 0 && (
            <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:gap-3">
              <span className="shrink-0 text-xs font-semibold text-muted-foreground sm:w-36 sm:pt-1">
                {session.chairpersons.length > 1 ? "Chairpersons" : "Chairperson"}
              </span>
              <ul className="flex min-w-0 flex-wrap gap-1.5">
                {session.chairpersons.map((person) => (
                  <li key={person.id}>
                    <PersonChip person={person} icon={UserRound} cardId={elementId} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {topics.length > 0 && (
        <div className="relative ml-3 mt-3 space-y-3 border-l-2 border-primary/25 pl-4 sm:ml-8 sm:pl-6">
          {topics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      )}
    </motion.section>
  );
});
