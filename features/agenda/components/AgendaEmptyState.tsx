"use client";

import { motion } from "framer-motion";
import { CalendarDays, FilterX, SearchX, Star, Users, type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { cx } from "../utils/cx";

export type AgendaEmptyVariant =
  | "no-topics"
  | "no-results"
  | "no-matches"
  | "no-favorites"
  | "no-speakers";

const CONTENT: Record<
  AgendaEmptyVariant,
  { icon: LucideIcon; title: string; description: string; actionLabel?: string }
> = {
  "no-topics": {
    icon: CalendarDays,
    title: "The agenda isn’t available yet",
    description: "Sessions and topics will appear here as soon as the schedule is published.",
  },
  "no-results": {
    icon: SearchX,
    title: "No results found",
    description: "Try a different name, hall, track or topic — or clear your search.",
    actionLabel: "Clear search & filters",
  },
  "no-matches": {
    icon: FilterX,
    title: "No sessions match these filters",
    description: "Try changing the filters, or reset them to see the full agenda.",
    actionLabel: "Reset filters",
  },
  "no-favorites": {
    icon: Star,
    title: "Your agenda is empty",
    description: "Tap the star on any topic to save it here and build your personal schedule.",
  },
  "no-speakers": {
    icon: Users,
    title: "No speakers listed yet",
    description: "Speakers will appear here once they are added to the agenda.",
  },
};

interface AgendaEmptyStateProps {
  variant: AgendaEmptyVariant;
  onAction?: () => void;
  compact?: boolean;
}

export function AgendaEmptyState({ variant, onAction, compact = false }: AgendaEmptyStateProps) {
  const { icon: Icon, title, description, actionLabel } = CONTENT[variant];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
      className={cx(
        "flex flex-col items-center gap-4 rounded-2xl border border-dashed bg-muted/30 px-6 text-center",
        compact ? "py-10" : "py-16",
      )}
    >
      <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="size-7" aria-hidden="true" />
      </span>
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">{description}</p>
      </div>
      {onAction && actionLabel && (
        <Button type="button" variant="outline" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
}
