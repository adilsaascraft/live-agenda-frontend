"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import type { ActiveSpeakerNav } from "../hooks/useSpeakerNavigation";

interface SpeakerNavigatorProps {
  navigation: ActiveSpeakerNav;
  onPrevious: () => void;
  onNext: () => void;
  onClose: () => void;
}

const iconButton =
  "inline-flex size-8 items-center justify-center rounded-full hover:bg-primary-foreground/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground";

/** Floating control for stepping through all appearances of one speaker. */
export function SpeakerNavigator({ navigation, onPrevious, onNext, onClose }: SpeakerNavigatorProps) {
  return (
    <motion.div
      role="region"
      aria-label={`Appearances of ${navigation.fullName}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-x-4 bottom-4 z-40 mx-auto flex w-fit max-w-[calc(100%-2rem)] items-center gap-1 rounded-full bg-primary py-1.5 pl-4 pr-1.5 text-primary-foreground shadow-lg"
      style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <span className="min-w-0 truncate text-sm font-medium">{navigation.fullName}</span>
      <span className="mx-1 shrink-0 text-xs opacity-80" aria-live="polite">
        {navigation.index + 1} of {navigation.total}
      </span>
      <button type="button" onClick={onPrevious} aria-label="Previous appearance" className={iconButton}>
        <ChevronLeft className="size-4" aria-hidden="true" />
      </button>
      <button type="button" onClick={onNext} aria-label="Next appearance" className={iconButton}>
        <ChevronRight className="size-4" aria-hidden="true" />
      </button>
      <button type="button" onClick={onClose} aria-label="Close appearance navigator" className={iconButton}>
        <X className="size-4" aria-hidden="true" />
      </button>
    </motion.div>
  );
}
