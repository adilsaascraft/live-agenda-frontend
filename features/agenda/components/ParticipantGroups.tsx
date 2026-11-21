
"use client";

import { useMemo } from "react";
import {
  BadgeCheck,
  GraduationCap,
  Mic,
  Users,
  type LucideIcon,
} from "lucide-react";

import { colors } from "@/lib/constants/colors";

import type { AgendaTopic, ParticipantRole } from "../types/agenda.types";
import { getTopicParticipantGroups } from "../utils/agenda.utils";
import { PersonChip } from "./PersonChip";

export const ROLE_ICONS: Record<ParticipantRole, LucideIcon> = {
  faculty: GraduationCap,
  moderator: Mic,
  panelist: Users,
  expertPanelist: BadgeCheck,
};

/** Premium dark role-specific backgrounds across all topic cards. */
const ROLE_STYLES: Record<ParticipantRole, { backgroundColor: string }> = {
  faculty: {
    backgroundColor: colors.amber[900],
  },
  moderator: {
    backgroundColor: colors.rose[900],
  },
  panelist: {
    backgroundColor: colors.sky[900],
  },
  expertPanelist: {
    backgroundColor: colors.lime[900],
  },
};

interface ParticipantGroupsProps {
  topic: AgendaTopic;
  cardId: string;
}

/** Labelled participant rows. Roles with nobody assigned are omitted entirely. */
export function ParticipantGroups({
  topic,
  cardId,
}: ParticipantGroupsProps) {
  const groups = useMemo(() => getTopicParticipantGroups(topic), [topic]);

  if (groups.length === 0) return null;

  return (
    
<dl className="mt-3 space-y-2.5">
  {groups.map((group) => {
    const Icon = ROLE_ICONS[group.role];
    const roleStyle = ROLE_STYLES[group.role];

    return (
      <div
        key={group.role}
        className="flex flex-wrap items-center gap-2"
      >
        <dt className="flex shrink-0 items-center gap-1.5 text-sm font-bold text-zinc-900">
          <Icon className="size-4" aria-hidden="true" />
          {group.label}:
        </dt>

        <dd className="flex min-w-0 flex-wrap items-center gap-2">
          {group.people.map((person) => (
            <span
              key={person.id}
              className="rounded-lg border border-zinc-200 px-3 py-2 text-sm font-bold shadow-sm"
              style={{
                ...roleStyle,
                color: colors.zinc[50],
              }}
            >
              <PersonChip
                person={person}
                icon={Icon}
                cardId={cardId}
              />
            </span>
          ))}
        </dd>
      </div>
    );
  })}
</dl>

  );
}
