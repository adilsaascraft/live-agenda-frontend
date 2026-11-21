
"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import { colors } from "@/lib/constants/colors";

import type { ActiveSpeakerNav } from "../hooks/useSpeakerNavigation";

interface SpeakerNavigatorProps {
  navigation: ActiveSpeakerNav;
  onPrevious: () => void;
  onNext: () => void;
  onClose: () => void;
}

const iconButton =
  "inline-flex size-9 shrink-0 touch-manipulation items-center justify-center rounded-full transition-colors hover:bg-white/15 active:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400";

export function SpeakerNavigator({
  navigation,
  onPrevious,
  onNext,
  onClose,
}: SpeakerNavigatorProps) {
  return (
    <motion.div
      role="region"
      aria-label={`Appearances of ${navigation.fullName}`}
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.96 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="fixed inset-x-3 bottom-4 z-40 mx-auto flex w-fit max-w-[calc(100%-1.5rem)] items-center gap-2 rounded-full border px-3 py-1.5 shadow-xl sm:gap-2.5 sm:px-4"
      style={{
        backgroundColor: colors.zinc[900],
        borderColor: colors.zinc[700],
        color: colors.zinc[50],
        marginBottom: "env(safe-area-inset-bottom, 0px)",
        touchAction: "manipulation",
      }}
    >
      {/* Close button - top left */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close appearance navigator"
        className={`${iconButton} absolute -left-2 -top-2 z-50 border`}
        style={{
          backgroundColor: colors.zinc[800],
          borderColor: colors.zinc[700],
          color: colors.orange[300],
        }}
      >
        <X className="size-4" aria-hidden="true" />
      </button>

      {/* Speaker name */}
      <span className="min-w-0 max-w-[180px] truncate text-sm font-semibold sm:max-w-[260px]">
        {navigation.fullName}
      </span>

      {/* Appearance counter */}
      <span
        className="shrink-0 rounded-full px-2 py-1 text-xs font-bold tabular-nums"
        style={{
          backgroundColor: colors.zinc[800],
          color: colors.orange[300],
        }}
      >
        {navigation.index + 1} / {navigation.total}
      </span>

      {/* Previous */}
      <button
        type="button"
        onClick={onPrevious}
        aria-label="Previous appearance"
        className={iconButton}
        style={{ touchAction: "manipulation" }}
      >
        <ChevronLeft className="size-4" aria-hidden="true" />
      </button>

      {/* Next */}
      <button
        type="button"
        onClick={onNext}
        aria-label="Next appearance"
        className={iconButton}
        style={{ touchAction: "manipulation" }}
      >
        <ChevronRight className="size-4" aria-hidden="true" />
      </button>
    </motion.div>
  );
}
