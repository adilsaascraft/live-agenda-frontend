
"use client";

import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

import type { AgendaPerson } from "../types/agenda.types";
import { cx } from "../utils/cx";
import { useHighlight } from "./HighlightContext";

interface PersonChipProps {
  person: AgendaPerson;
  icon: LucideIcon;
  cardId: string;
}

export const PersonChip = memo(function PersonChip({
  person,
  icon: Icon,
  cardId,
}: PersonChipProps) {
  const reduceMotion = useReducedMotion();
  
  const {
  speakerId,
  elementId,
  searchPeople = [],
} = useHighlight();

const highlighted =
  (speakerId === person.id && elementId === cardId) ||
  searchPeople.some(
    (match) =>
      match.speakerId === person.id &&
      match.elementId === cardId,
  );

  return (
    <motion.span
      data-highlighted={highlighted ? "true" : undefined}
      animate={
        highlighted && !reduceMotion
          ? {
              scale: [1, 1.06, 1],
              backgroundColor: [
                "rgba(251, 191, 36, 0)",
                "rgba(251, 191, 36, 0.22)",
                "rgba(251, 191, 36, 0)",
              ],
              boxShadow: [
                "0 0 0 0 rgba(252, 211, 77, 0)",
                "0 0 0 3px rgba(252, 211, 77, 0.65)",
                "0 0 0 0 rgba(252, 211, 77, 0)",
              ],
            }
          : { scale: 1 }
      }
      transition={
        highlighted && !reduceMotion
          ? {
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
            }
          : { duration: 0.2 }
      }
      className={cx(
        "inline-flex max-w-full items-center gap-1.5 rounded-md px-1 py-0.5 text-sm font-semibold",
        highlighted ? "text-amber-300" : "text-white",
      )}
    >
      <Icon className="size-4 shrink-0" aria-hidden="true" />
      <span className="break-words">{person.fullName}</span>
    </motion.span>
  );
});
