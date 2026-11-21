
"use client";

import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { colors } from "@/lib/constants/colors";

import { AGENDA_STATUS_LABELS } from "../constants/agenda.constants";
import { useNow } from "../hooks/useNow";
import type { AgendaStatus, AgendaTimeSlot } from "../types/agenda.types";
import { getAgendaStatus } from "../utils/agenda.utils";
import { cx } from "../utils/cx";

/** Centralized status colours using the project's colors.ts palette. */
const STATUS_STYLES: Record<
  AgendaStatus,
  { backgroundColor: string; color: string }
> = {
  live: {
    backgroundColor: colors.red[50],
    color: colors.red[700],
  },
  today: {
    backgroundColor: colors.green[50],
    color: colors.green[800],
  },
  tomorrow: {
    backgroundColor: colors.orange[50],
    color: colors.orange[800],
  },
  coming: {
    backgroundColor: colors.orange[50],
    color: colors.orange[800],
  },
  past: {
    backgroundColor: colors.zinc[100],
    color: colors.zinc[600],
  },
};

const STATUS_DOT_COLORS: Record<AgendaStatus, string> = {
  live: colors.red[600],
  today: colors.green[600],
  tomorrow: colors.orange[600],
  coming: colors.orange[600],
  past: colors.zinc[500],
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
export const StatusBadge = memo(function StatusBadge({
  slot,
  className,
}: StatusBadgeProps) {
  const now = useNow();
  const reduceMotion = useReducedMotion();

  if (!now) {
    return (
      <span
        aria-hidden="true"
        className={cx("inline-block h-6 w-[4.5rem] rounded-full", className)}
        style={{ backgroundColor: colors.zinc[100] }}
      />
    );
  }

  const status = getAgendaStatus(slot, now);
  const dotColor = STATUS_DOT_COLORS[status];

  return (
    <span
      data-status={status}
      className={cx(
        "inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-xs font-semibold",
        className,
      )}
      style={STATUS_STYLES[status]}
    >
      {status === "live" && (
        <span className="relative flex size-2" aria-hidden="true">
          {!reduceMotion && (
            <motion.span
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: dotColor }}
              animate={{ scale: [1, 2.4], opacity: [0.6, 0] }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          )}

          <span
            className="relative size-2 rounded-full"
            style={{ backgroundColor: dotColor }}
          />
        </span>
      )}

      {AGENDA_STATUS_LABELS[status]}
    </span>
  );
});
