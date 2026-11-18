"use client";

import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { AGENDA_STATUS_LABELS } from "../constants/agenda.constants";
import { useNow } from "../hooks/useNow";
import type { AgendaStatus, AgendaTimeSlot } from "../types/agenda.types";
import { getAgendaStatus } from "../utils/agenda.utils";
import { cx } from "../utils/cx";

/** The one place status colours are defined (semantic theme tokens only). */
const STATUS_STYLES: Record<AgendaStatus, string> = {
  live: "bg-destructive/10 text-destructive",
  today: "bg-primary/10 text-primary",
  tomorrow: "bg-accent text-accent-foreground",
  coming: "bg-secondary text-secondary-foreground",
  past: "bg-muted text-muted-foreground",
};

interface StatusBadgeProps {
  slot: AgendaTimeSlot;
  className?: string;
}

/**
 * Subscribes to the shared clock itself, so a tick re-renders only the
 * badges — never the cards or the page. Until the client clock starts it
 * renders a fixed-size placeholder (no layout shift, no hydration mismatch).
 */
export const StatusBadge = memo(function StatusBadge({ slot, className }: StatusBadgeProps) {
  const now = useNow();
  const reduceMotion = useReducedMotion();

  if (!now) {
    return (
      <span
        aria-hidden="true"
        className={cx("inline-block h-6 w-[4.5rem] rounded-full bg-muted/60", className)}
      />
    );
  }

  const status = getAgendaStatus(slot, now);

  return (
    <span
      data-status={status}
      className={cx(
        "inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-xs font-semibold",
        STATUS_STYLES[status],
        className,
      )}
    >
      {status === "live" && (
        <span className="relative flex size-2" aria-hidden="true">
          {!reduceMotion && (
            <motion.span
              className="absolute inset-0 rounded-full bg-destructive"
              animate={{ scale: [1, 2.4], opacity: [0.6, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
            />
          )}
          <span className="relative size-2 rounded-full bg-destructive" />
        </span>
      )}
      {AGENDA_STATUS_LABELS[status]}
    </span>
  );
});
