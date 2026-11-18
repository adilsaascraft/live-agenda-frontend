"use client";

import { memo } from "react";

import type { FilteredSession } from "../types/agenda.types";
import { SessionCard } from "./SessionCard";

interface AgendaScheduleProps {
  filtered: readonly FilteredSession[];
}

/** Unique session cards, each with its (filtered) topics beneath it. */
export const AgendaSchedule = memo(function AgendaSchedule({ filtered }: AgendaScheduleProps) {
  return (
    <div className="space-y-8">
      {filtered.map(({ session, topics }) => (
        <SessionCard key={session.id} session={session} topics={topics} />
      ))}
    </div>
  );
});
