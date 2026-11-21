
"use client";

import { motion } from "framer-motion";
import {
  CalendarDays,
  FilterX,
  SearchX,
  Star,
  Users,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { colors, gradients } from "@/lib/constants/colors";

import { cx } from "../utils/cx";

export type AgendaEmptyVariant =
  | "no-topics"
  | "no-results"
  | "no-matches"
  | "no-favorites"
  | "no-speakers";

const CONTENT: Record<
  AgendaEmptyVariant,
  {
    icon: LucideIcon;
    title: string;
    description: string;
    actionLabel?: string;
  }
> = {
  "no-topics": {
    icon: CalendarDays,
    title: "The agenda isn’t available yet",
    description:
      "Sessions and topics will appear here as soon as the schedule is published.",
  },
  "no-results": {
    icon: SearchX,
    title: "No results found",
    description:
      "Try a different name, hall, track or topic — or clear your search.",
    actionLabel: "Clear search & filters",
  },
  "no-matches": {
    icon: FilterX,
    title: "No sessions match these filters",
    description:
      "Try changing the filters, or reset them to see the full agenda.",
    actionLabel: "Reset filters",
  },
  "no-favorites": {
    icon: Star,
    title: "Your agenda is empty",
    description:
      "Tap the star on any topic to save it here and build your personal schedule.",
  },
  "no-speakers": {
    icon: Users,
    title: "No speakers listed yet",
    description:
      "Speakers will appear here once they are added to the agenda.",
  },
};

interface AgendaEmptyStateProps {
  variant: AgendaEmptyVariant;
  onAction?: () => void;
  compact?: boolean;
}

export function AgendaEmptyState({
  variant,
  onAction,
  compact = false,
}: AgendaEmptyStateProps) {
  const { icon: Icon, title, description, actionLabel } = CONTENT[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cx(
        "flex flex-col items-center gap-4 rounded-2xl border border-dashed bg-background px-6 text-center transition-colors duration-200",
        compact ? "py-10" : "py-16",
      )}
      style={{
        borderColor: colors.violet[200],
      }}
    >
      {/* Icon */}
      <motion.span
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="flex size-16 items-center justify-center rounded-2xl shadow-sm"
        style={{
          background: gradients.pastelPurple,
          color: colors.violet[700],
        }}
      >
        <Icon className="size-7" strokeWidth={1.8} aria-hidden="true" />
      </motion.span>

      {/* Message */}
      <div className="max-w-md space-y-2">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          {title}
        </h2>

        <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>

      {/* Optional action */}
      {onAction && actionLabel && (
        <Button
          type="button"
          variant="outline"
          onClick={onAction}
          className="mt-1 h-10 gap-2 rounded-lg border-2 px-5 font-semibold text-violet-700 shadow-sm transition-all duration-200 hover:border-violet-800 hover:text-white hover:shadow-md active:scale-[0.97]"
          onMouseEnter={(event) => {
            event.currentTarget.style.background = gradients.royalPurple;
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.background = "transparent";
          }}
          style={{
            borderColor: colors.violet[600],
          }}
        >
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
}
