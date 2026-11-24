
"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { colors, gradients } from "@/lib/constants/colors";

import { SEARCH_DEBOUNCE_MS } from "../constants/agenda.constants";

interface AgendaSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
}

export function AgendaSearch({
  value,
  onChange,
  placeholder = "Search sessions, topics, halls, tracks or speakers",
  ariaLabel = "Search the agenda",
}: AgendaSearchProps) {

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
    <div
      className="group rounded-xl p-[1.5px] transition-shadow duration-200 focus-within:shadow-lg"
      style={{
        background: gradients.primary,
      }}
    >
      <div
        className="relative overflow-hidden rounded-[10px] bg-background transition-colors"
        style={{
          boxShadow: `inset 0 0 0 1px ${colors.sky[100]}`,
        }}
      >
        <Search
          className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2"
          style={{ color: colors.violet[600] }}
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
          placeholder={placeholder}
          aria-label={ariaLabel}
          className="h-12 w-full rounded-[10px] border-0 bg-transparent pl-12 pr-12 text-base shadow-none outline-none ring-0 placeholder:text-muted-foreground focus-visible:border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
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
              whileHover={{
                backgroundColor: colors.violet[50],
                scale: 1.05,
              }}
              whileTap={{ scale: 0.92 }}
              transition={{ duration: 0.15 }}
              className="absolute right-3 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              style={{ color: colors.violet[700] }}
            >
              <X className="size-4" aria-hidden="true" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
