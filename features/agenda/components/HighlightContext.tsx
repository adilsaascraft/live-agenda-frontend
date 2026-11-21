
"use client";

import { createContext, useContext } from "react";

import { NO_HIGHLIGHT, type HighlightState } from "../hooks/useSpeakerNavigation";

export type AgendaHighlightContextValue = HighlightState & {
  searchQuery: string;
};

export const HighlightContext = createContext<AgendaHighlightContextValue>({
  ...NO_HIGHLIGHT,
  searchQuery: "",
});

export const useHighlight = (): AgendaHighlightContextValue =>
  useContext(HighlightContext);
