"use client";

import { useMemo } from "react";
import { BadgeCheck, GraduationCap, Mic, Users, type LucideIcon } from "lucide-react";

import type { AgendaTopic, ParticipantRole } from "../types/agenda.types";
import { getTopicParticipantGroups } from "../utils/agenda.utils";
import { PersonChip } from "./PersonChip";

export const ROLE_ICONS: Record<ParticipantRole, LucideIcon> = {
  faculty: GraduationCap,
  moderator: Mic,
  panelist: Users,
  expertPanelist: BadgeCheck,
};

interface ParticipantGroupsProps {
  topic: AgendaTopic;
  cardId: string;
}

/** Labelled participant rows. Roles with nobody assigned are omitted entirely. */
export function ParticipantGroups({ topic, cardId }: ParticipantGroupsProps) {
  const groups = useMemo(() => getTopicParticipantGroups(topic), [topic]);
  if (groups.length === 0) return null;

  return (
    <dl className="mt-3 space-y-2">
      {groups.map((group) => {
        const Icon = ROLE_ICONS[group.role];
        return (
          <div key={group.role} className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:gap-3">
            <dt className="flex shrink-0 items-center gap-1.5 text-xs font-semibold text-muted-foreground sm:w-36 sm:pt-1">
              <Icon className="size-3.5" aria-hidden="true" />
              {group.label}
            </dt>
            <dd className="flex min-w-0 flex-wrap gap-1.5">
              {group.people.map((person) => (
                <PersonChip key={person.id} person={person} icon={Icon} cardId={cardId} />
              ))}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
