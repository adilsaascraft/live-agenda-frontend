"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, Clock, Layers, MapPin, Printer, Share2, Tag, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatDate } from "@/features/dashboard/dashboard.utils";

import { AGENDA_EVENT } from "../constants/agenda.constants";
import type { AgendaTopicLookup } from "../types/agenda.types";
import { formatTimeRange, pluralize } from "../utils/format.utils";
import { AgendaEmptyState } from "./AgendaEmptyState";
import { ParticipantGroups } from "./ParticipantGroups";

interface FavoriteCardProps {
  lookup: AgendaTopicLookup;
  onRemove: (topicId: string) => void;
}

function FavoriteCard({ lookup, onRemove }: FavoriteCardProps) {
  const { topic, session } = lookup;

  return (
    <motion.li
      layout="position"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.2 }}
      className="rounded-xl border bg-card p-4 shadow-xs"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold leading-snug text-card-foreground">{topic.name}</h3>
        <button
          type="button"
          onClick={() => onRemove(topic.id)}
          aria-label={`Remove “${topic.name}” from My Agenda`}
          className="-mr-1 -mt-1 inline-flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Trash2 className="size-4" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 font-medium">
          <Clock className="size-3.5" aria-hidden="true" />
          {formatTimeRange(topic.startTime, topic.endTime)}
        </span>
        {topic.type && (
          <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-medium">
            <Tag className="size-3.5" aria-hidden="true" />
            {topic.type}
          </span>
        )}
      </div>

      <div className="mt-3 space-y-1.5 rounded-lg bg-muted/60 p-3 text-xs">
        <p className="text-sm font-semibold text-foreground">{session.name}</p>
        <p className="flex items-center gap-1.5 text-muted-foreground">
          <CalendarDays className="size-3.5 shrink-0" aria-hidden="true" />
          {formatDate(session.sessionDate)}
        </p>
        {session.hall && (
          <p className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
            {session.hall.name}
          </p>
        )}
        {session.track && (
          <p className="flex items-center gap-1.5 text-muted-foreground">
            <Layers className="size-3.5 shrink-0" aria-hidden="true" />
            {session.track.name}
          </p>
        )}
      </div>

      <ParticipantGroups topic={topic} cardId={`favorite-${topic.id}`} />
    </motion.li>
  );
}

interface MyAgendaSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: readonly AgendaTopicLookup[];
  onRemove: (topicId: string) => void;
  onPrint: () => void;
  onShare: () => void;
}

export function MyAgendaSheet({
  open,
  onOpenChange,
  items,
  onRemove,
  onPrint,
  onShare,
}: MyAgendaSheetProps) {
  const isEmpty = items.length === 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md md:max-w-lg">
        <SheetHeader className="border-b p-5 pr-14">
          <SheetTitle>My Agenda</SheetTitle>
          <SheetDescription>
            {isEmpty
              ? AGENDA_EVENT.name
              : `${pluralize(items.length, "saved topic")} · ${AGENDA_EVENT.name}`}
          </SheetDescription>
        </SheetHeader>

        {/* Scrolls independently; the footer below is a separate flex row, so it never covers cards. */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-8 pt-4">
          {isEmpty ? (
            <AgendaEmptyState variant="no-favorites" compact />
          ) : (
            <ul className="space-y-3">
              <AnimatePresence initial={false}>
                {items.map((lookup) => (
                  <FavoriteCard key={lookup.topic.id} lookup={lookup} onRemove={onRemove} />
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>

        <div className="sticky bottom-0 flex gap-3 border-t bg-background p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <Button
            type="button"
            variant="outline"
            onClick={onPrint}
            disabled={isEmpty}
            className="flex-1 gap-2"
          >
            <Printer className="size-4" aria-hidden="true" />
            Print
          </Button>
          <Button type="button" onClick={onShare} disabled={isEmpty} className="flex-1 gap-2">
            <Share2 className="size-4" aria-hidden="true" />
            Share
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
