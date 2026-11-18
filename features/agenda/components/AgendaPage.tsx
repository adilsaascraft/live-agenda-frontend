"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import {
  EMPTY_AGENDA_FILTERS,
  type AgendaTabValue,
} from "../constants/agenda.constants";
import { useAgenda } from "../hooks/useAgenda";
import { useFavorites } from "../hooks/useFavorites";
import { usePrintAgenda } from "../hooks/usePrintAgenda";
import { useSpeakerNavigation } from "../hooks/useSpeakerNavigation";
import type { AgendaCriteria, AgendaFilters as Filters } from "../types/agenda.types";
import { filterAgenda, hasActiveFilters, resolveFavorites } from "../utils/agenda.utils";
import { pluralize } from "../utils/format.utils";
import { AgendaEmptyState } from "./AgendaEmptyState";
import { AgendaError } from "./AgendaError";
import { AgendaFilters } from "./AgendaFilters";
import { AgendaHeader } from "./AgendaHeader";
import { AgendaLoading } from "./AgendaLoading";
import { AgendaProviders } from "./AgendaProviders";
import { AgendaSchedule } from "./AgendaSchedule";
import { AgendaSearch } from "./AgendaSearch";
import { AgendaTabs, getPanelId, getTabId } from "./AgendaTabs";
import { HighlightContext } from "./HighlightContext";
import { MyAgendaSheet } from "./MyAgendaSheet";
import { PrintableAgenda } from "./PrintableAgenda";
import { ShareAgendaDialog } from "./ShareAgendaDialog";
import { SpeakerList } from "./SpeakerList";
import { SpeakerNavigator } from "./SpeakerNavigator";

function AgendaExperience() {
  const { model, isLoading, isRefetching, errorMessage, refetch } = useAgenda();
  const favorites = useFavorites();
  const printAgenda = usePrintAgenda();

  const [tab, setTab] = useState<AgendaTabValue>("schedule");
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Filters>(EMPTY_AGENDA_FILTERS);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  /* ------------------------ derived data (memoised) ----------------------- */

  const criteria = useMemo<AgendaCriteria>(() => ({ ...filters, query }), [filters, query]);

  const filtered = useMemo(
    () => (model ? filterAgenda(model.sessions, criteria) : []),
    [model, criteria],
  );

  const visibleTopicCount = useMemo(
    () => filtered.reduce((total, entry) => total + entry.topics.length, 0),
    [filtered],
  );

  const favoriteResolution = useMemo(
    () => (model ? resolveFavorites(model, favorites.ids) : null),
    [model, favorites.ids],
  );
  const favoriteItems = favoriteResolution?.items;
  const favoriteTopicIds = useMemo(
    () => (favoriteItems ?? []).map((item) => item.topic.id),
    [favoriteItems],
  );
  const favoriteCount = favoriteResolution ? favoriteResolution.items.length : favorites.count;

  // Saved ids that no longer exist in the latest API response are dropped —
  // only after a successful load, so a failed request can never wipe favourites.
  const missingIds = favoriteResolution?.missingIds;
  const { removeMany } = favorites;
  useEffect(() => {
    if (missingIds && missingIds.length > 0) removeMany(missingIds);
  }, [missingIds, removeMany]);

  /* ------------------------------- actions -------------------------------- */

  const canReset = hasActiveFilters(filters) || query.trim() !== "";

  const resetAll = useCallback(() => {
    setQuery("");
    setFilters(EMPTY_AGENDA_FILTERS);
  }, []);

  const patchFilters = useCallback((patch: Partial<Filters>) => {
    setFilters((previous) => ({ ...previous, ...patch }));
  }, []);

  const prepareForSpeakerNavigation = useCallback(() => {
    setTab("schedule");
    resetAll();
  }, [resetAll]);

  const speakerNav = useSpeakerNavigation({ model, prepare: prepareForSpeakerNavigation });
  const { dismiss: dismissSpeakerNav } = speakerNav;

  const handleTabChange = useCallback(
    (next: AgendaTabValue) => {
      setTab(next);
      if (next === "speakers") dismissSpeakerNav();
    },
    [dismissSpeakerNav],
  );

  const openShare = () => {
    setSheetOpen(false);
    setShareOpen(true);
  };

  const handleShareOpenChange = (open: boolean) => {
    setShareOpen(open);
    // Return the person to their agenda once the dialog is dismissed.
    if (!open && favoriteCount > 0) setSheetOpen(true);
  };

  /* -------------------------------- render -------------------------------- */

  let content;
  if (isLoading) {
    content = <AgendaLoading />;
  } else if (!model) {
    content = <AgendaError message={errorMessage} isRetrying={isRefetching} onRetry={() => void refetch()} />;
  } else if (model.sessions.length === 0) {
    content = <AgendaEmptyState variant="no-topics" />;
  } else if (tab === "schedule") {
    content = (
      <div className="space-y-5">
        <AgendaSearch value={query} onChange={setQuery} />
        <AgendaFilters
          options={model.filterOptions}
          filters={filters}
          canReset={canReset}
          onChange={patchFilters}
          onReset={resetAll}
        />
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {filtered.length > 0
            ? `Showing ${pluralize(filtered.length, "session")} · ${pluralize(visibleTopicCount, "topic")}`
            : "No sessions to show"}
        </p>
        {filtered.length > 0 ? (
          <AgendaSchedule filtered={filtered} />
        ) : (
          <AgendaEmptyState
            variant={query.trim() ? "no-results" : "no-matches"}
            onAction={resetAll}
          />
        )}
      </div>
    );
  } else if (model.speakers.length === 0) {
    content = <AgendaEmptyState variant="no-speakers" />;
  } else {
    content = <SpeakerList speakers={model.speakers} onSelect={speakerNav.goToSpeaker} />;
  }

  return (
    <HighlightContext value={speakerNav.highlight}>
      <div className="min-h-dvh bg-background text-foreground">
        <main className="mx-auto w-full max-w-5xl px-4 pb-24 pt-4 sm:px-6 sm:pt-6 lg:pt-8">
          <AgendaHeader favoriteCount={favoriteCount} onOpenMyAgenda={() => setSheetOpen(true)} />

          <div className="mt-6 space-y-5">
            <AgendaTabs value={tab} onValueChange={handleTabChange} />

            <div role="tabpanel" id={getPanelId(tab)} aria-labelledby={getTabId(tab)}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`${tab}-${isLoading ? "loading" : model ? "ready" : "error"}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.18 }}
                >
                  {content}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </main>

        <AnimatePresence>
          {speakerNav.navigation && speakerNav.navigation.total > 1 && tab === "schedule" && (
            <SpeakerNavigator
              navigation={speakerNav.navigation}
              onPrevious={speakerNav.previous}
              onNext={speakerNav.next}
              onClose={speakerNav.dismiss}
            />
          )}
        </AnimatePresence>

        <MyAgendaSheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          items={favoriteItems ?? []}
          onRemove={favorites.remove}
          onPrint={printAgenda}
          onShare={openShare}
        />
        <ShareAgendaDialog
          open={shareOpen}
          onOpenChange={handleShareOpenChange}
          topicIds={favoriteTopicIds}
        />
        <PrintableAgenda items={favoriteItems ?? []} />
      </div>
    </HighlightContext>
  );
}

export function AgendaPage() {
  return (
    <AgendaProviders>
      <AgendaExperience />
    </AgendaProviders>
  );
}
