
"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Star } from "lucide-react";

import { toggleFavorite, useIsFavorite } from "../hooks/useFavorites";
import { cx } from "../utils/cx";

interface FavoriteButtonProps {
  topicId: string;
  topicName: string;
  className?: string;
}

export function FavoriteButton({
  topicId,
  topicName,
  className,
}: FavoriteButtonProps) {
  const isFavorite = useIsFavorite(topicId);
  const [expanded, setExpanded] = useState(false);

  const label = isFavorite
    ? "Remove from My Agenda"
    : "Mark This Topic Favorite";

  return (
    <motion.button
      type="button"
      onClick={() => toggleFavorite(topicId)}
      onHoverStart={() => setExpanded(true)}
      onHoverEnd={() => setExpanded(false)}
      onFocus={() => setExpanded(true)}
      onBlur={() => setExpanded(false)}
      aria-pressed={isFavorite}
      aria-label={
        isFavorite
          ? `Remove “${topicName}” from My Agenda`
          : `Add “${topicName}” to My Agenda`
      }
      title={label}
      animate={{ width: expanded ? 208 : 36 }}
      whileTap={{ scale: 0.96 }}
      transition={{
        width: { duration: 0.22, ease: "easeOut" },
        scale: { duration: 0.12 },
      }}
      className={cx(
        "inline-flex h-10 items-center justify-start gap-2 overflow-hidden whitespace-nowrap rounded-lg border border-amber-300 bg-amber-50 px-2 shadow-sm transition-colors duration-200 hover:bg-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2",
        className,
      )}
    >
      <motion.span
        animate={{
          rotate: expanded ? 0 : 0,
          scale: expanded ? 1.05 : 1,
        }}
        className="flex size-5 shrink-0 items-center justify-center"
      >
        <Star
          className={cx(
            "size-5 text-yellow-500 transition-all duration-200",
            isFavorite && "fill-yellow-400",
          )}
          strokeWidth={2.2}
          aria-hidden="true"
        />
      </motion.span>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.span
            key="favorite-label"
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.16 }}
            className="pr-1 text-xs font-bold text-amber-900"
            aria-hidden="true"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
