"use client";

import { motion } from "framer-motion";
import { Activity, CalendarDays, MapPin, Star } from "lucide-react";

import { Button } from "@/components/ui/button";

import { AGENDA_EVENT } from "../constants/agenda.constants";

interface AgendaHeaderProps {
  favoriteCount: number;
  onOpenMyAgenda: () => void;
}

export function AgendaHeader({ favoriteCount, onOpenMyAgenda }: AgendaHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary via-primary/90 to-primary/70 p-6 text-primary-foreground shadow-lg sm:p-8 lg:p-10"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-primary-foreground/10 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 left-1/3 size-72 rounded-full bg-primary-foreground/5 blur-3xl"
      />

      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <Button
          type="button"
          variant="secondary"
          onClick={onOpenMyAgenda}
          aria-label={`My Agenda, ${favoriteCount} saved ${favoriteCount === 1 ? "topic" : "topics"}`}
          className="order-1 gap-2 self-end sm:order-2 sm:self-start"
        >
          <Star className="size-4" aria-hidden="true" />
          My Agenda
          <motion.span
            key={favoriteCount}
            initial={{ scale: 0.7, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 18 }}
            className="inline-flex min-w-6 items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-xs font-bold text-primary-foreground"
          >
            {favoriteCount}
          </motion.span>
        </Button>

        <div className="order-2 min-w-0 space-y-4 sm:order-1">
          <p className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-medium uppercase tracking-widest">
            <Activity className="size-3.5" aria-hidden="true" />
            Conference Agenda
          </p>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {AGENDA_EVENT.name}
          </h1>

          <ul className="space-y-2 text-sm sm:text-base">
            <li className="flex items-center gap-2.5 font-medium">
              <CalendarDays className="size-5 shrink-0 opacity-90" aria-hidden="true" />
              {AGENDA_EVENT.dateRangeLabel}
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 size-5 shrink-0 opacity-90" aria-hidden="true" />
              <span>
                <span className="font-medium">{AGENDA_EVENT.venue}</span>
                <span className="block text-primary-foreground/80">{AGENDA_EVENT.location}</span>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </motion.header>
  );
}
