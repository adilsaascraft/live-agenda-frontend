"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Clock, Tag } from "lucide-react";

import type { AgendaTopic } from "../types/agenda.types";
import { getTopicElementId } from "../utils/agenda.utils";
import { cx } from "../utils/cx";
import { formatTimeRange } from "../utils/format.utils";
import { FavoriteButton } from "./FavoriteButton";
import { useHighlight } from "./HighlightContext";
import { ParticipantGroups } from "./ParticipantGroups";
import { StatusBadge } from "./StatusBadge";

interface TopicCardProps {
  topic: AgendaTopic;
}

export const TopicCard = memo(function TopicCard({ topic }: TopicCardProps) {
  const elementId = getTopicElementId(topic.id);
  const isTarget = useHighlight().elementId === elementId;

  return (
    <motion.article
      id={elementId}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cx(
        "relative scroll-mt-24 rounded-xl border bg-card p-4 pr-14 shadow-xs transition-shadow duration-300",
        isTarget && "ring-2 ring-primary/50 shadow-md",
      )}
    >
      <FavoriteButton
        topicId={topic.id}
        topicName={topic.name}
        className="absolute right-3 top-3"
      />

      <h4 className="text-base font-semibold leading-snug text-card-foreground">{topic.name}</h4>

      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 font-medium text-foreground/80">
          <Clock className="size-3.5" aria-hidden="true" />
          {formatTimeRange(topic.startTime, topic.endTime)}
        </span>
        {topic.type && (
          <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-medium text-foreground/80">
            <Tag className="size-3.5" aria-hidden="true" />
            {topic.type}
          </span>
        )}
        <StatusBadge slot={topic} />
      </div>

      <ParticipantGroups topic={topic} cardId={elementId} />
    </motion.article>
  );
});
