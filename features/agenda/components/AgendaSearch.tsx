"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";

import { SEARCH_DEBOUNCE_MS } from "../constants/agenda.constants";

interface AgendaSearchProps {
  /** Committed (debounced) query owned by the page. */
  value: string;
  onChange: (value: string) => void;
}

/**
 * Typing updates a local draft instantly; the page only receives the value
 * after SEARCH_DEBOUNCE_MS. External resets (Reset button, speaker
 * navigation) flow back into the draft.
 */
export function AgendaSearch({ value, onChange }: AgendaSearchProps) {
  const [draft, setDraft] = useState(value);
  const lastEmitted = useRef(value);

  // Pull external changes (e.g. Reset) into the draft.
  useEffect(() => {
    if (value !== lastEmitted.current) {
      lastEmitted.current = value;
      setDraft(value);
    }
  }, [value]);

  // Push local edits to the page after the debounce delay.
  useEffect(() => {
    if (draft === lastEmitted.current) return;
    const timer = setTimeout(() => {
      lastEmitted.current = draft;
      onChange(draft);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [draft, onChange]);

  const clear = () => {
    lastEmitted.current = "";
    setDraft("");
    onChange("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape" && draft) {
      event.preventDefault();
      clear();
    }
  };

  return (
    <div className="group relative rounded-xl transition-shadow duration-200 focus-within:shadow-md">
      <Search
        className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary"
        aria-hidden="true"
      />
      <Input
        type="text"
        inputMode="search"
        enterKeyHint="search"
        autoComplete="off"
        spellCheck={false}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search sessions, topics, halls, tracks or speakers"
        aria-label="Search the agenda"
        className="h-12 w-full rounded-xl pl-12 pr-12 text-base"
      />
      <AnimatePresence>
        {draft && (
          <motion.button
            type="button"
            onClick={clear}
            aria-label="Clear search"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.12 }}
            className="absolute right-3 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="size-4" aria-hidden="true" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
