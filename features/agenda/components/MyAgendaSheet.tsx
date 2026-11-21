
"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  CalendarDays,
  Clock,
  Layers,
  MapPin,
  Printer,
  Tag,
  Trash2,
} from "lucide-react";

import { WhatsAppIcon } from "@/features/agenda/components/WhatsAppIcon";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatDate } from "@/features/dashboard/dashboard.utils";
import { colors, gradients } from "@/lib/constants/colors";

import { AGENDA_EVENT } from "../constants/agenda.constants";
import type { AgendaTopicLookup } from "../types/agenda.types";
import { formatTimeRange, pluralize } from "../utils/format.utils";
import { AgendaEmptyState } from "./AgendaEmptyState";
import { ParticipantGroups } from "./ParticipantGroups";

export type AgendaSheetMode = "saved" | "full";

interface FavoriteCardProps {
  lookup: AgendaTopicLookup;
  mode: AgendaSheetMode;
  onRemove: (topicId: string) => void;
}

function FavoriteCard({ lookup, mode, onRemove }: FavoriteCardProps) {
  const { topic, session } = lookup;
  const canRemove = mode === "saved";

  return (
    <motion.li
      layout="position"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden rounded-2xl border-[1px] solid p-3 shadow-sm"
      style={{
        backgroundColor: colors.amber[100],
        borderColor: colors.emerald[900],
      }}
    >
      {/* Topic Header */}
      <div
        className="rounded-xl p-3 text-white shadow-sm"
        style={{ background: gradients.royalPurple }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-2.5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/15">
              <BookOpen className="size-4" aria-hidden="true" />
            </span>

            <div className="min-w-0">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/75">
                Topic
              </p>

              <h3 className="text-sm font-semibold leading-snug text-white">
                {topic.name}
              </h3>
            </div>
          </div>

          {canRemove && (
            <button
              type="button"
              onClick={() => onRemove(topic.id)}
              aria-label={`Remove “${topic.name}” from My Agenda`}
              className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-rose-500/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <Trash2 className="size-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* Topic Metadata */}
      <div className="mt-2 flex flex-wrap gap-2 px-1">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
          style={{
            backgroundColor: colors.purple[100],
            color: colors.purple[800],
          }}
        >
          <Clock className="size-3.5" aria-hidden="true" />
          {formatTimeRange(topic.startTime, topic.endTime)}
        </span>

        {topic.type && (
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
            style={{
              backgroundColor: colors.orange[100],
              color: colors.orange[800],
            }}
          >
            <Tag className="size-3.5" aria-hidden="true" />
            {topic.type}
          </span>
        )}
      </div>

      {/* Session Section */}
      <div
        className="mt-3 rounded-xl border p-3"
        style={{
          backgroundColor: colors.blue[50],
          borderColor: `${colors.blue[200]}80`,
        }}
      >
        <div className="flex items-start gap-2.5">
          <span
            className="flex size-8 shrink-0 items-center justify-center rounded-lg"
            style={{
              background: gradients.oceanBlue,
              color: colors.white[50],
            }}
          >
            <Layers className="size-4" aria-hidden="true" />
          </span>

          <div className="min-w-0 flex-1">
            <p
              className="mb-1 text-[10px] font-semibold uppercase tracking-[0.12em]"
style={{ color: colors.blue[700] }}
            >
              Session
            </p>

            <p className="text-sm font-semibold leading-snug text-foreground">
              {session.name}
            </p>
          </div>
        </div>

        <div
          className="mt-3 space-y-2 border-t pt-3"
          style={{ borderColor: `${colors.blue[200]}80` }}
        >
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <CalendarDays
              className="size-3.5 shrink-0"
              aria-hidden="true"
            />
            {formatDate(session.sessionDate)}
          </p>

          {session.hall && (
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
              {session.hall.name}
            </p>
          )}

          {session.track && (
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <Layers className="size-3.5 shrink-0" aria-hidden="true" />
              {session.track.name}
            </p>
          )}
        </div>
      </div>

      {/* Participants Footer */}
      <div
        className="mt-3 rounded-xl border p-3"
        style={{
          backgroundColor: colors.emerald[50],
          borderColor: `${colors.emerald[200]}80`,
        }}
      >
        <ParticipantGroups
          topic={topic}
          cardId={`favorite-${topic.id}`}
        />
      </div>
    </motion.li>
  );
}

interface MyAgendaSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: AgendaSheetMode;
  items: readonly AgendaTopicLookup[];
  onRemove: (topicId: string) => void;
  onPrint: () => void;
  onShare: () => void;
}

export function MyAgendaSheet({
  open,
  onOpenChange,
  mode,
  items,
  onRemove,
  onPrint,
  onShare,
}: MyAgendaSheetProps) {
  const isEmpty = items.length === 0;
  const isSavedMode = mode === "saved";

  const agendaTitle = isSavedMode ? "My Agenda" : "Full Agenda";
  const topicLabel = isSavedMode ? "saved topic" : "topic";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[500px] sm:w-[600px]">
        <SheetHeader
          className="border-b px-4 py-3 pr-14"
          style={{
            background: colors.purple[50],
            borderColor: `${colors.purple[200]}60`,
          }}
        >
          <SheetTitle className="flex items-center gap-2 text-sm font-extrabold tracking-tight">
            <span
              className="flex size-7 items-center justify-center rounded-lg text-white shadow-sm"
              style={{ background: gradients.royalPurple }}
            >
              <CalendarDays className="size-3.5" />
            </span>

            <span className="font-extrabold text-purple-950">
              {agendaTitle}
            </span>
          </SheetTitle>

          <SheetDescription className="mt-1 pl-9 text-xs font-semibold text-purple-700">
            {isEmpty
              ? AGENDA_EVENT.name
              : `${pluralize(items.length, topicLabel)} · ${AGENDA_EVENT.name}`}
          </SheetDescription>
        </SheetHeader>

        {/* Independent scroll area */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-8 pt-4">
          {isEmpty ? (
            <AgendaEmptyState
              variant={isSavedMode ? "no-favorites" : "no-topics"}
              compact
            />
          ) : (
            <ul className="space-y-3">
              <AnimatePresence initial={false}>
                {items.map((lookup) => (
                  <FavoriteCard
                    key={lookup.topic.id}
                    lookup={lookup}
                    mode={mode}
                    onRemove={onRemove}
                  />
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>

        {/* Fixed action footer */}
        <div
          className="sticky bottom-0 flex gap-3 border-t bg-background p-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
          style={{ borderColor: `${colors.purple[200]}60` }}
        >
          {/* Print PDF */}
          <Button
            type="button"
            onClick={onPrint}
            disabled={isEmpty}
            className="h-12 flex-1 gap-2 border-0 text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-40"
            style={{
              background: gradients.royalPurple,
            }}
          >
            <Printer className="size-8" aria-hidden="true" />
            Print PDF
          </Button>

          {/* WhatsApp share */}
          <Button
            type="button"
            onClick={onShare}
            disabled={isEmpty}
            className="h-12 flex-1 gap-2 border-0 text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-40"
            style={{
              background: gradients.emeraldLuxe,
            }}
          >
            <WhatsAppIcon className="size-8 shrink-0" />
            Share on WhatsApp
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
