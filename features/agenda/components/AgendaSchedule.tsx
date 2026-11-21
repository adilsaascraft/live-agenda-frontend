
"use client";

import { memo, useMemo } from "react";

import type { FilteredSession } from "../types/agenda.types";
import { formatDate } from "@/features/dashboard/dashboard.utils";
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

interface HallGroup {
  hallId: string;
  hallName: string;
  sessions: FilteredSession[];
}

interface DateGroup {
  dateKey: string;
  sessionDate: string;
  halls: HallGroup[];
}

function groupSessionsByDateAndHall(
  filtered: readonly FilteredSession[],
): DateGroup[] {
  const dateMap = new Map<
    string,
    {
      sessionDate: string;
      halls: Map<string, HallGroup>;
    }
  >();

  for (const item of filtered) {
    const { session } = item;

    const dateKey = session.dateKey;
    const hallId = session.hall?.id ?? "unknown-hall";
    const hallName = session.hall?.name ?? "Unassigned Hall";

    if (!dateMap.has(dateKey)) {
      dateMap.set(dateKey, {
        sessionDate: session.sessionDate,
        halls: new Map(),
      });
    }

    const dateGroup = dateMap.get(dateKey)!;

    if (!dateGroup.halls.has(hallId)) {
      dateGroup.halls.set(hallId, {
        hallId,
        hallName,
        sessions: [],
      });
    }

    dateGroup.halls.get(hallId)!.sessions.push(item);
  }

  return Array.from(dateMap.entries()).map(([dateKey, dateGroup]) => ({
    dateKey,
    sessionDate: dateGroup.sessionDate,
    halls: Array.from(dateGroup.halls.values()),
  }));
}

export const AgendaSchedule = memo(function AgendaSchedule({
  filtered,
}: AgendaScheduleProps) {
  const groupedSessions = useMemo(
    () => groupSessionsByDateAndHall(filtered),
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
          {dateGroup.halls.map((hallGroup) => {
            const accordionValue = `${dateGroup.dateKey}-${hallGroup.hallId}`;

            return (
              <div key={accordionValue}>
                {/* Gradient border wrapper */}
                <div className="rounded-xl bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 p-[2px]">
                  <div className="overflow-hidden rounded-[10px] bg-background">
                    {/* Independent accordion for each Date + Hall */}
                    <Accordion
                      defaultValue={[accordionValue]}
                      className="w-full"
                    >
                      <AccordionItem
                        value={accordionValue}
                        className="border-0"
                      >
                        {/* Date left / Hall right / Accordion icon */}
                        <AccordionTrigger
                          aria-label={`Toggle sessions for Day ${dateIndex + 1}, ${hallGroup.hallName}`}
                          className="hover:no-underline"
                        >
                          <div className="flex w-full flex-wrap items-center justify-between gap-2 pr-2">
                            <h3 className="text-base font-bold tracking-tight text-rose-900 sm:text-lg">
                              Day {dateIndex + 1} :{" "}
                              {formatDate(dateGroup.sessionDate)}
                            </h3>

                            <span className="text-sm font-bold tracking-wide text-orange-900">
                              Hall : {hallGroup.hallName}
                            </span>
                          </div>
                        </AccordionTrigger>

                        {/* Divider */}
                        <div className="mx-3 h-px bg-border" />

                        {/* Session cards and topics */}
                        <AccordionContent className="pb-0">
                          <div className="space-y-8 px-3 pt-4 pb-3">
                            {hallGroup.sessions.map(({ session, topics }) => (
                              <SessionCard
                                key={session.id}
                                session={session}
                                topics={topics}
                              />
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      ))}
    </div>
  );
});
