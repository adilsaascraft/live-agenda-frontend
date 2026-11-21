
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookmarkCheck, Share2 } from "lucide-react";
import { colors, gradients } from "@/lib/constants/colors";
import {
  EMPTY_AGENDA_FILTERS,
  SPEAKER_HIGHLIGHT_MS,
  type AgendaTabValue,
  AgendaSheetMode,
} from "../constants/agenda.constants";
import AgendaFloatingNavigation from "./AgendaFloatingNavigation";
import {
  filterAgenda,
  getSessionElementId,
  getTopicElementId,
  hasActiveFilters,
  normalizeSearchText,
  resolveFavorites,
  tokenizeQuery,
} from "../utils/agenda.utils";
import { useAgenda } from "../hooks/useAgenda";
import { useFavorites } from "../hooks/useFavorites";
import { usePrintAgenda } from "../hooks/usePrintAgenda";
import { useSpeakerNavigation } from "../hooks/useSpeakerNavigation";
import type {
  AgendaCriteria,
  AgendaFilters as Filters,
} from "../types/agenda.types";
import { pluralize } from "../utils/format.utils";
import { AgendaEmptyState } from "./AgendaEmptyState";
import { AgendaError } from "./AgendaError";
import { AgendaFilters } from "./AgendaFilters";
import { AgendaHeader } from "./AgendaHeader";
import AgendaLoadingScreen  from "./AgendaLoading";
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
  const { model, isLoading, isRefetching, errorMessage, refetch } =
    useAgenda();

  const favorites = useFavorites();
  const printAgenda = usePrintAgenda();

  const [tab, setTab] = useState<AgendaTabValue>("schedule");
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Filters>(EMPTY_AGENDA_FILTERS);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [agendaMode, setAgendaMode] = useState<AgendaSheetMode>("saved");

  const [activeSearchHighlight, setActiveSearchHighlight] = useState<{
  elementIds: string[];
  people: { speakerId: string; elementId: string }[];
  searchQuery: string;
}>({
  elementIds: [],
  people: [],
  searchQuery: "",
});

  /* ------------------------ derived data (memoised) ----------------------- */

  const criteria = useMemo<AgendaCriteria>(
    () => ({ ...filters, query }),
    [filters, query],
  );

  const filtered = useMemo(
    () => (model ? filterAgenda(model.sessions, criteria) : []),
    [model, criteria],
  );


  const searchHighlight = useMemo(() => {
  const tokens = tokenizeQuery(query);

  if (tab !== "schedule" || tokens.length === 0) {
    return { elementIds: [], people: [] };
  }

  const matchesAll = (value: string) => {
    const normalized = normalizeSearchText(value);
    return tokens.every((token) => normalized.includes(token));
  };

  const elementIds = new Set<string>();
  const people = new Map<
    string,
    { speakerId: string; elementId: string }
  >();

  const addMatchingPeople = (
    entries: readonly { id: string; fullName: string }[],
    cardId: string,
  ) => {
    for (const person of entries) {
      if (!matchesAll(person.fullName)) continue;

      const key = `${person.id}:${cardId}`;

      people.set(key, {
        speakerId: person.id,
        elementId: cardId,
      });
    }
  };

  for (const { session, topics } of filtered) {
    const sessionMatches = matchesAll(session.searchText);
    const sessionElementId = getSessionElementId(session.id);

    if (sessionMatches) {
      elementIds.add(sessionElementId);

      addMatchingPeople(
        session.chairpersons,
        sessionElementId,
      );
    }

    for (const topic of topics) {
      const topicMatches =
        matchesAll(topic.searchText) ||
        (!sessionMatches &&
          matchesAll(`${topic.searchText} ${session.searchText}`));

      if (!topicMatches) continue;

      const topicElementId = getTopicElementId(topic.id);

      elementIds.add(topicElementId);

      const participants = Object.values(topic.participants).flat();

      addMatchingPeople(participants, topicElementId);
    }
  }

  return {
    elementIds: [...elementIds],
    people: [...people.values()],
  };
}, [filtered, query, tab]);


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

  const favoriteCount = favoriteResolution
    ? favoriteResolution.items.length
    : favorites.count;

  // Saved ids that no longer exist in the latest API response are dropped —
  // only after a successful load, so a failed request can never wipe favourites.
  const missingIds = favoriteResolution?.missingIds;
  const { removeMany } = favorites;

  useEffect(() => {
    if (missingIds && missingIds.length > 0) {
      removeMany(missingIds);
    }
  }, [missingIds, removeMany]);


  const fullAgendaItems = useMemo(
  () => (model ? Array.from(model.topicIndex.values()) : []),
  [model],
);

const activeAgendaItems =
  agendaMode === "full" ? fullAgendaItems : (favoriteItems ?? []);

const activeAgendaTopicIds = useMemo(
  () => activeAgendaItems.map((item) => item.topic.id),
  [activeAgendaItems],
);



useEffect(() => {
  if (
    tab !== "schedule" ||
    !query.trim() ||
    searchHighlight.elementIds.length === 0
  ) {
    setActiveSearchHighlight({
      elementIds: [],
      people: [],
      searchQuery: "",
    });

    return;
  }

  setActiveSearchHighlight({
    ...searchHighlight,
    searchQuery: query,
  });

  const timer = window.setTimeout(() => {
    setActiveSearchHighlight({
      elementIds: [],
      people: [],
      searchQuery: "",
    });
  }, SPEAKER_HIGHLIGHT_MS);

  return () => window.clearTimeout(timer);
}, [query, tab, searchHighlight]);

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

  const speakerNav = useSpeakerNavigation({
    model,
    prepare: prepareForSpeakerNavigation,
  });

  const { dismiss: dismissSpeakerNav } = speakerNav;

  const handleTabChange = useCallback(
    (next: AgendaTabValue) => {
      setTab(next);

      if (next === "speakers") {
        dismissSpeakerNav();
      }
    },
    [dismissSpeakerNav],
  );

  
  const openFullAgenda = useCallback(() => {
  setAgendaMode("full");
  setSheetOpen(true);
}, []);

const openSavedAgenda = useCallback(() => {
  setAgendaMode("saved");
  setSheetOpen(true);
}, []);

  const openShare = () => {
    setSheetOpen(false);
    setShareOpen(true);
  };

  
  const handleShareOpenChange = (open: boolean) => {
  setShareOpen(open);

  if (!open && activeAgendaItems.length > 0) {
    setSheetOpen(true);
  }
};


const combinedHighlight = {
  ...speakerNav.highlight,
  searchElementIds: activeSearchHighlight.elementIds,
  searchPeople: activeSearchHighlight.people,
  searchQuery: activeSearchHighlight.searchQuery,
};

  /* -------------------------------- render -------------------------------- */

  /* ----------------------- strict initial loading ----------------------- */

if (isLoading) {
  return <AgendaLoadingScreen />;
}

/* -------------------------------- render -------------------------------- */

let content;

if (!model) {
  content = (
    <AgendaError
      message={errorMessage}
      isRetrying={isRefetching}
      onRetry={() => void refetch()}
    />
  );
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

        <p
  className="text-sm font-semibold"
  style={{ color: colors.purple[900] }}
  aria-live="polite"
>
  {filtered.length > 0 ? (
    <>
      Showing{" "}
      <span
        className="font-bold"
        style={{ color: colors.purple[700] }}
      >
        {pluralize(filtered.length, "session")}
      </span>
      {" · "}
      <span style={{ color: colors.purple[800] }}>
        {pluralize(visibleTopicCount, "topic")}
      </span>
    </>
  ) : (
    "No sessions to show"
  )}
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
    content = (
      <SpeakerList
        speakers={model.speakers}
        onSelect={speakerNav.goToSpeaker}
      />
    );
  }

  return (
    <HighlightContext value={combinedHighlight}>
      <div className="bg-background text-foreground">
        <main className="w-full px-4 pb-24 pt-4 sm:px-6 sm:pt-6 lg:pt-8">
          {/* Conference header */}
          <AgendaHeader />

          {/* Main agenda actions */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="mt-5 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4"
          >
            {/* Share Full Agenda */}
            <motion.button
              type="button"
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={openFullAgenda}
              className="group inline-flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-purple-200 bg-white px-7 text-sm font-bold text-purple-700 shadow-sm transition-all duration-200 hover:border-purple-400 hover:bg-purple-50 hover:shadow-lg hover:shadow-purple-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 sm:w-auto sm:min-w-56"
            >
              <span className="flex size-9 items-center justify-center rounded-xl bg-purple-100 transition-colors group-hover:bg-purple-200">
                <Share2
                  className="size-5 transition-transform duration-200 group-hover:rotate-12"
                  aria-hidden="true"
                />
              </span>

              <span>Share Full Agenda</span>
            </motion.button>

            {/* My Saved Agenda */}
            <motion.button
              type="button"
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={openSavedAgenda}
              aria-label={`My Saved Agenda, ${favoriteCount} saved ${favoriteCount === 1 ? "topic" : "topics"}`}
              className="group inline-flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-purple-600 px-7 text-sm font-bold text-white shadow-md transition-all duration-200 hover:shadow-lg hover:shadow-purple-300/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 sm:w-auto sm:min-w-56"
              style={{ background: gradients.royalPurple }}
            >
              <span className="flex size-9 items-center justify-center rounded-xl border border-white/20 bg-white/10 transition-colors group-hover:bg-white/20">
                <BookmarkCheck
                  className="size-5 transition-transform duration-200 group-hover:scale-110"
                  aria-hidden="true"
                />
              </span>

              <span>My Saved Agenda</span>

              <motion.span
                key={favoriteCount}
                initial={{ scale: 0.7, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 18,
                }}
                className="inline-flex min-w-7 items-center justify-center rounded-full border border-white/30 bg-white/20 px-2 py-1 text-xs font-extrabold text-white"
              >
                {favoriteCount}
              </motion.span>
            </motion.button>
          </motion.div>


          {/* Animated agenda guidance */}
<div className="mt-4 overflow-hidden rounded-xl border border-purple-100 bg-purple-50/70 py-3">
  <motion.div
    className="flex w-max items-center gap-10 whitespace-nowrap"
    animate={{ x: ["0%", "-50%"] }}
    transition={{
      duration: 24,
      ease: "linear",
      repeat: Infinity,
    }}
  >
    {[0, 1].map((item) => (
      <div
        key={item}
        className="flex items-center gap-10 px-5 text-xs font-medium text-purple-800 sm:text-sm"
        aria-hidden={item === 1}
      >
        <span className="inline-flex items-center gap-2">
          <Share2 className="size-4 shrink-0 text-purple-600" />
          <span>
            <strong>Share Full Agenda:</strong> Share the complete conference
            programme with colleagues and friends.
          </span>
        </span>

        <span className="text-purple-300">✦</span>

        <span className="inline-flex items-center gap-2">
          <BookmarkCheck className="size-4 shrink-0 text-purple-600" />
          <span>
            <strong>My Saved Agenda:</strong> View your personally bookmarked
            sessions and topics in one place.
          </span>
        </span>

        <span className="text-purple-300">✦</span>
      </div>
    ))}
  </motion.div>
</div>

          <div className="mt-6 space-y-5">
            <AgendaTabs
              value={tab}
              onValueChange={handleTabChange}
            />

            <div
              role="tabpanel"
              id={getPanelId(tab)}
              aria-labelledby={getTabId(tab)}
            >
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
          {speakerNav.navigation &&
            speakerNav.navigation.total > 1 &&
            tab === "schedule" && (
              <SpeakerNavigator
                navigation={speakerNav.navigation}
                onPrevious={speakerNav.previous}
                onNext={speakerNav.next}
                onClose={speakerNav.dismiss}
              />
            )}
        </AnimatePresence>

        {/* Saved agenda */}
            <MyAgendaSheet
  open={sheetOpen}
  onOpenChange={setSheetOpen}
  mode={agendaMode}
  items={activeAgendaItems}
  onRemove={favorites.remove}
  onPrint={printAgenda}
  onShare={openShare}
/>

        {/* Share saved topics */}
        {/* Share saved topics */}
<ShareAgendaDialog
  open={shareOpen}
  onOpenChange={handleShareOpenChange}
  topicIds={activeAgendaTopicIds}
  mode={agendaMode}
/>

{/* Floating Agenda Navigation */}
<AgendaFloatingNavigation onOpenMyAgenda={openSavedAgenda} />

<PrintableAgenda items={activeAgendaItems} />

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
