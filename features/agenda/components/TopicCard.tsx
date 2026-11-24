
"use client";

import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Clock, FileText, Tag } from "lucide-react";
import { SearchHighlightText } from "./SearchHighlightText";
import { colors } from "@/lib/constants/colors";

import type { AgendaTopic } from "../types/agenda.types";
import { getTopicElementId } from "../utils/agenda.utils";
import { formatTimeRange } from "../utils/format.utils";
import { FavoriteButton } from "./FavoriteButton";
import { useHighlight } from "./HighlightContext";
import { ParticipantGroups } from "./ParticipantGroups";

interface TopicCardProps {
  topic: AgendaTopic;
  sessionDate: string;
  topicIndex: number;
}

const TOPIC_ACCENT_COLORS = [
  colors.lime[900],
  colors.navy[900],
  colors.orange[900],
  colors.teal[900],
  colors.blue[900],
  colors.purple[900],
  colors.red[900],
  colors.amber[900],
  colors.green[900],
  colors.indigo[900],
];

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
  topicIndex,
}: TopicCardProps) {
  const elementId = getTopicElementId(topic.id);

  const {
    elementId: highlightedElementId,
    searchElementIds = [],
  } = useHighlight();

  const reduceMotion = useReducedMotion();

  const isTarget =
    highlightedElementId === elementId ||
    searchElementIds.includes(elementId);

  const typeStyle =
    TOPIC_TYPE_STYLES[topic.type ?? ""] ?? DEFAULT_TOPIC_TYPE_STYLE;

  const accentColor =
    TOPIC_ACCENT_COLORS[topicIndex % TOPIC_ACCENT_COLORS.length];

  return (
    <motion.article
      id={elementId}
      initial="rest"
      animate={
        isTarget && !reduceMotion
          ? {
              borderColor: [
                accentColor,
                colors.sky[100],
                accentColor,
              ],
            }
          : {
              borderColor: colors.sky[100],
            }
      }
      transition={
        isTarget && !reduceMotion
          ? {
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
            }
          : {
              duration: 0.2,
            }
      }
      className="relative scroll-mt-24 overflow-hidden rounded-xl border p-3.5 pl-5 pr-14 shadow-sm sm:p-4 sm:pl-6 sm:pr-16"
      style={{
        borderColor: colors.sky[100],
      }}
    >
      {/* Permanent topic-specific left accent */}
      <div
        className="absolute inset-y-0 left-0 z-10 w-1"
        style={{ backgroundColor: accentColor }}
        aria-hidden="true"
      />

      {/* Favorite button */}
      <FavoriteButton
        topicId={topic.id}
        topicName={topic.name}
        className="absolute right-3 top-3 z-20"
      />

      {/* Topic type */}
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
        style={{ borderColor: colors.sky[100] }}
      >
        <ParticipantGroups topic={topic} cardId={elementId} />
      </div>
    </motion.article>
  );
});
