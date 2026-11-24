"use client";

import { memo, useEffect, useMemo, useState } from "react";

import type { FilteredSession } from "../types/agenda.types";
import { formatDate } from "@/features/dashboard/dashboard.utils";
import { getSessionElementId, getTopicElementId } from "../utils/agenda.utils";
import { AGENDA_REVEAL_EVENT } from "../hooks/useSpeakerNavigation";
import { useHighlight } from "./HighlightContext";
import { SessionCard } from "./SessionCard";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

interface AgendaScheduleProps {
  filtered: readonly FilteredSession[];
}

interface DateGroup {
  dateKey: string;
  sessionDate: string;
  sessions: FilteredSession[];
}

/** Groups sessions by calendar day only for the "Day N" heading. */
function groupSessionsByDate(
  filtered: readonly FilteredSession[],
): DateGroup[] {
  const dateMap = new Map<string, DateGroup>();

  for (const item of filtered) {
    const { session } = item;
    let group = dateMap.get(session.dateKey);

    if (!group) {
      group = {
        dateKey: session.dateKey,
        sessionDate: session.sessionDate,
        sessions: [],
      };
      dateMap.set(session.dateKey, group);
    }

    group.sessions.push(item);
  }

  return Array.from(dateMap.values());
}

/* -------------------------------------------------------------------------- */
/* One accordion per session                                                   */
/* -------------------------------------------------------------------------- */

interface SessionAccordionProps {
  item: FilteredSession;
}

const SessionAccordion = memo(function SessionAccordion({
  item,
}: SessionAccordionProps) {
  const { session, topics } = item;
  const value = session.id;

  const [open, setOpen] = useState(true);

  const { elementId: highlightedId, searchElementIds } = useHighlight();

  // DOM ids that live inside this session's panel.
  const ownIds = useMemo(
    () =>
      new Set<string>([
        getSessionElementId(session.id),
        ...topics.map((topic) => getTopicElementId(topic.id)),
      ]),
    [session.id, topics],
  );

  // Speaker navigation targets a card that is not rendered while collapsed.
  useEffect(() => {
    const onReveal = (event: Event) => {
      const target = (event as CustomEvent<string>).detail;
      if (ownIds.has(target)) setOpen(true);
    };

    window.addEventListener(AGENDA_REVEAL_EVENT, onReveal);
    return () => window.removeEventListener(AGENDA_REVEAL_EVENT, onReveal);
  }, [ownIds]);

  // Schedule search / highlight: make sure matching cards are visible.
  useEffect(() => {
    const hit =
      (highlightedId != null && ownIds.has(highlightedId)) ||
      (searchElementIds ?? []).some((id) => ownIds.has(id));

    if (hit) setOpen(true);
  }, [highlightedId, searchElementIds, ownIds]);

  return (
    // Sky border around the whole session (title + card + topics)
    <div className="overflow-hidden rounded-xl border-2 border-zinc-300 bg-background">
      <Accordion
        value={open ? [value] : []}
        onValueChange={(next: unknown) =>
          setOpen(Array.isArray(next) ? next.length > 0 : Boolean(next))
        }
        className="w-full"
      >
        <AccordionItem value={value} className="border-0">
          <AccordionTrigger
            aria-label={`Toggle session ${session.name}`}
            className="hover:no-underline"
          >
            {/* Session name centred - only while collapsed */}
            {open ? (
              <span className="sr-only">{session.name}</span>
            ) : (
              <span className="flex-1 px-2 text-center text-base font-bold leading-snug tracking-tight text-zinc-800 sm:text-lg">
                {session.name}
              </span>
            )}
          </AccordionTrigger>

          <AccordionContent className="pb-0">
            <div className="px-3 pt-1 pb-3">
              <SessionCard session={session} topics={topics} />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
});

/* -------------------------------------------------------------------------- */
/* Schedule                                                                    */
/* -------------------------------------------------------------------------- */

export const AgendaSchedule = memo(function AgendaSchedule({
  filtered,
}: AgendaScheduleProps) {
  const groupedSessions = useMemo(
    () => groupSessionsByDate(filtered),
    [filtered],
  );

  if (groupedSessions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      {groupedSessions.map((dateGroup, dateIndex) => (
        <section
          key={dateGroup.dateKey}
          data-agenda-date-section
          className="space-y-5"
        >
          <h2 className="text-base font-bold tracking-tight text-rose-900 sm:text-lg">
            Day {dateIndex + 1} : {formatDate(dateGroup.sessionDate)}
          </h2>

          {dateGroup.sessions.map((item) => (
            <SessionAccordion key={item.session.id} item={item} />
          ))}
        </section>
      ))}
    </div>
  );
});
