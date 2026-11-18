"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

import type { AgendaPerson } from "../types/agenda.types";
import { cx } from "../utils/cx";
import { useHighlight } from "./HighlightContext";

interface PersonChipProps {
  person: AgendaPerson;
  icon: LucideIcon;
  /** DOM id of the card this chip belongs to (used for speaker highlighting). */
  cardId: string;
}

export const PersonChip = memo(function PersonChip({ person, icon: Icon, cardId }: PersonChipProps) {
  const { speakerId, elementId } = useHighlight();
  const highlighted = speakerId === person.id && elementId === cardId;

  return (
    <motion.span
      data-highlighted={highlighted ? "true" : undefined}
      animate={highlighted ? { scale: [1, 1.08, 1] } : { scale: 1 }}
      transition={{ duration: 0.6, repeat: highlighted ? 2 : 0 }}
      className={cx(
        "inline-flex max-w-full items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors duration-300",
        highlighted
          ? "bg-primary text-primary-foreground ring-2 ring-primary/40"
          : "bg-muted text-foreground/80",
      )}
    >
      <Icon className="size-3.5 shrink-0" aria-hidden="true" />
      <span className="break-words">{person.fullName}</span>
    </motion.span>
  );
});
