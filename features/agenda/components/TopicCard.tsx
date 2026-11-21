
"use client";

import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Clock, FileText, Tag } from "lucide-react";
import { SearchHighlightText } from "./SearchHighlightText";
import { colors, gradients } from "@/lib/constants/colors";

import type { AgendaTopic } from "../types/agenda.types";
import { getTopicElementId } from "../utils/agenda.utils";
import { getAgendaDateTime } from "../utils/agenda-date-time";
import { cx } from "../utils/cx";
import { formatTimeRange } from "../utils/format.utils";
import { FavoriteButton } from "./FavoriteButton";
import { useHighlight } from "./HighlightContext";
import { ParticipantGroups } from "./ParticipantGroups";
import { StatusBadge } from "./StatusBadge";
import { AgendaCountdown } from "./AgendaCountdown";

interface TopicCardProps {
  topic: AgendaTopic;
  sessionDate: string;
}

const TOPIC_TYPE_STYLES: Record<
  string,
  {
    backgroundColor: string;
    borderColor: string;
    color: string;
  }
> = {
  Talk: {
    backgroundColor: colors.blue[50],
    borderColor: colors.blue[200],
    color: colors.blue[800],
  },

  Debate: {
    backgroundColor: colors.violet[50],
    borderColor: colors.violet[200],
    color: colors.violet[800],
  },

  "Panel Discussion": {
    backgroundColor: colors.teal[50],
    borderColor: colors.teal[200],
    color: colors.teal[800],
  },
};

const DEFAULT_TOPIC_TYPE_STYLE = {
  backgroundColor: colors.slate[100],
  borderColor: colors.slate[200],
  color: colors.slate[700],
};

export const TopicCard = memo(function TopicCard({
  topic,
  sessionDate,
}: TopicCardProps) {
  const elementId = getTopicElementId(topic.id);

  const {
    elementId: highlightedElementId,
    searchElementIds = [],
  } = useHighlight();

  const reduceMotion = useReducedMotion();

  // Supports both speaker navigation and multiple search matches.
  const isTarget =
    highlightedElementId === elementId ||
    searchElementIds.includes(elementId);

  const typeStyle =
    TOPIC_TYPE_STYLES[topic.type ?? ""] ?? DEFAULT_TOPIC_TYPE_STYLE;

  const topicDateTime = getAgendaDateTime(
    sessionDate,
    topic.startTime,
    topic.endTime,
  );

  const highlightAnimation =
  isTarget && !reduceMotion
    ? {
        borderColor: [
          colors.orange[400],
          colors.orange[600],
          colors.orange[400],
        ],
      }
    : {
        borderColor: isTarget
          ? colors.orange[500]
          : colors.blue[200],
      };

  return (
    <motion.article
      id={elementId}
      initial="rest"
      animate={highlightAnimation}
      whileHover="hover"
      transition={
        isTarget && !reduceMotion
          ? {
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
            }
          : {
              duration: 0.22,
              ease: "easeOut",
            }
      }
      className={cx(
        "relative scroll-mt-24 overflow-hidden rounded-xl border p-3.5 pl-5 pr-14 shadow-sm transition-all duration-200 sm:p-4 sm:pl-6 sm:pr-16",
        "hover:-translate-y-px hover:border-blue-300 hover:shadow-md",
      )}
      style={{
        background: gradients.tealOcean,
        borderColor: isTarget ? colors.violet[400] : colors.blue[200],
      }}
    >
      {/* Animated left gradient accent */}
      <motion.div
        variants={{
          rest: { background: gradients.sunsetGold },
          hover: { background: gradients.forestGreen },
        }}
        transition={{ duration: 0.25 }}
        className="absolute inset-y-0 left-0 z-10 w-1"
        aria-hidden="true"
      />

      {/* Favorite button */}
      <FavoriteButton
        topicId={topic.id}
        topicName={topic.name}
        className="absolute right-3 top-3 z-20"
      />

      {/* Topic type, status and countdown */}
      <div className="flex flex-wrap items-center gap-1.5">
        {topic.type && (
          <span
            className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-bold"
            style={typeStyle}
          >
            <Tag className="size-3.5" aria-hidden="true" />
            {topic.type}
          </span>
        )}

        <StatusBadge slot={topic} />

        <AgendaCountdown
          startAt={topicDateTime.startAt}
          endAt={topicDateTime.endAt}
        />
      </div>

      {/* Topic title */}
      <h4
  className="mt-2.5 flex items-start gap-2 text-base font-bold leading-snug tracking-tight sm:text-lg"
  style={{ color: colors.navy[900] }}
>
  <FileText className="mt-0.5 size-5 shrink-0 text-zinc-500" />
  <span>
    <SearchHighlightText text={topic.name} />
  </span>
</h4>

      {/* Topic time */}
      <div
        className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold"
        style={{ color: colors.slate[700] }}
      >
        <Clock
          className="size-4 shrink-0"
          style={{ color: colors.amber[700] }}
          aria-hidden="true"
        />
        {formatTimeRange(topic.startTime, topic.endTime)}
      </div>

      {/* Participants */}
      <div
        className="mt-3 border-t pt-2.5"
        style={{ borderColor: colors.blue[200] }}
      >
        <ParticipantGroups topic={topic} cardId={elementId} />
      </div>
    </motion.article>
  );
});
