"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { ChevronRight, UserRound } from "lucide-react";

import type { AgendaSpeaker } from "../types/agenda.types";
import { pluralize } from "../utils/format.utils";

interface SpeakerCardProps {
  speaker: AgendaSpeaker;
  onSelect: (speakerId: string) => void;
}

export const SpeakerCard = memo(function SpeakerCard({ speaker, onSelect }: SpeakerCardProps) {
  const appearances = pluralize(speaker.appearanceCount, "appearance");

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(speaker.id)}
      aria-label={`${speaker.fullName}, ${appearances}. Show in schedule.`}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 26 }}
      className="group flex w-full items-center gap-3 rounded-xl border bg-card p-4 text-left shadow-xs transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <UserRound className="size-5" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block break-words font-semibold leading-snug text-card-foreground">
          {speaker.fullName}
        </span>
        <span className="block text-sm text-muted-foreground">{appearances}</span>
      </span>
      <ChevronRight
        className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </motion.button>
  );
});
