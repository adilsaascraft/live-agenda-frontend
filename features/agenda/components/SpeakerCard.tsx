
"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { ChevronRight, UserRound } from "lucide-react";

import { colors, gradients } from "@/lib/constants/colors";

import type { AgendaSpeaker } from "../types/agenda.types";
import { pluralize } from "../utils/format.utils";

interface SpeakerCardProps {
  speaker: AgendaSpeaker;
  onSelect: (speakerId: string) => void;
}

export const SpeakerCard = memo(function SpeakerCard({
  speaker,
  onSelect,
}: SpeakerCardProps) {
  const appearances = pluralize(speaker.appearanceCount, "appearance");

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(speaker.id)}
      aria-label={`${speaker.fullName}, ${appearances}. Show in schedule.`}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 400, damping: 26 }}
      className="group relative flex w-full items-center gap-3 overflow-hidden rounded-xl border p-3.5 pl-5 text-left shadow-sm transition-shadow duration-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 sm:p-4 sm:pl-6"
      style={{
        background: gradients.midnightPurple,
        borderColor: colors.orange[200],
      }}
    >
      {/* Left accent */}
      <motion.span
        variants={{
          rest: { background: gradients.sunsetGold },
          hover: { background: gradients.forestGreen },
        }}
        initial="rest"
        className="absolute inset-y-0 left-0 z-10 w-1"
        aria-hidden="true"
      />

      {/* Speaker icon */}
      <span
        className="flex size-11 shrink-0 items-center justify-center rounded-full border shadow-sm transition-transform duration-200 group-hover:scale-105"
        style={{
          background: gradients.berryGlow,
          borderColor: colors.rose[300],
          color: colors.zinc[50],
        }}
      >
        <UserRound className="size-5" aria-hidden="true" />
      </span>

      {/* Speaker details */}
      <span className="min-w-0 flex-1">
        <span
          className="block break-words font-bold leading-snug transition-colors duration-200"
          style={{ color: colors.white[50] }}
        >
          {speaker.fullName}
        </span>

        <span
          className="mt-1 block text-sm font-medium"
          style={{ color: colors.white[50] }}
        >
          {appearances}
        </span>
      </span>

      {/* Navigation indicator */}
      <span
        className="flex size-8 shrink-0 items-center justify-center rounded-full border transition-all duration-200 group-hover:translate-x-0.5 group-hover:border-orange-400"
        style={{
          backgroundColor: colors.orange[50],
          borderColor: colors.orange[200],
          color: colors.orange[700],
        }}
      >
        <ChevronRight className="size-5" aria-hidden="true" />
      </span>
    </motion.button>
  );
});
