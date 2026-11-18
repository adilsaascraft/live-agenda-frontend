"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

import { toggleFavorite, useIsFavorite } from "../hooks/useFavorites";
import { cx } from "../utils/cx";

interface FavoriteButtonProps {
  topicId: string;
  topicName: string;
  className?: string;
}

/**
 * Subscribes to just its own topic id, so toggling one star re-renders one
 * button — not the list and not the other cards.
 */
export function FavoriteButton({ topicId, topicName, className }: FavoriteButtonProps) {
  const isFavorite = useIsFavorite(topicId);

  return (
    <motion.button
      type="button"
      onClick={() => toggleFavorite(topicId)}
      aria-pressed={isFavorite}
      aria-label={
        isFavorite
          ? `Remove “${topicName}” from My Agenda`
          : `Add “${topicName}” to My Agenda`
      }
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.85 }}
      className={cx(
        "inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isFavorite && "text-primary hover:text-primary",
        className,
      )}
    >
      <motion.span
        key={isFavorite ? "on" : "off"}
        initial={{ scale: 0.6, rotate: -25 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 16 }}
        className="flex"
      >
        <Star className={cx("size-5", isFavorite && "fill-current")} aria-hidden="true" />
      </motion.span>
    </motion.button>
  );
}
