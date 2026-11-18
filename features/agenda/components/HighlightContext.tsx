"use client";

import { createContext, useContext } from "react";

import { NO_HIGHLIGHT, type HighlightState } from "../hooks/useSpeakerNavigation";

/**
 * Which card + speaker is currently highlighted after speaker navigation.
 * Provided once by the page; person chips and cards read it, so no prop
 * drilling through the (memoised) card tree.
 */
export const HighlightContext = createContext<HighlightState>(NO_HIGHLIGHT);

export const useHighlight = (): HighlightState => useContext(HighlightContext);
