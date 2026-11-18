"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { SPEAKER_HIGHLIGHT_MS } from "../constants/agenda.constants";
import type { AgendaModel, SpeakerAppearance } from "../types/agenda.types";

export interface HighlightState {
  speakerId: string | null;
  /** DOM id of the card whose speaker chip should be highlighted. */
  elementId: string | null;
}

export const NO_HIGHLIGHT: HighlightState = { speakerId: null, elementId: null };

export interface ActiveSpeakerNav {
  speakerId: string;
  fullName: string;
  /** Zero-based index of the appearance currently shown. */
  index: number;
  total: number;
}

const POLL_INTERVAL_MS = 50;
const MAX_POLLS = 40; // ≈ 2s for the schedule tab / filters to render

interface Options {
  model: AgendaModel | undefined;
  /**
   * Called before navigating: must switch to the schedule tab and clear
   * search/filters so the target card is guaranteed to be rendered.
   */
  prepare: () => void;
}

/**
 * Speaker → schedule navigation.
 * Behaviour: jumps to the speaker's FIRST appearance (earliest date/time);
 * when they have several, a navigator lets the user step through them all.
 * Cards are located by stable DOM ids, retried briefly while the schedule
 * tab mounts, and the speaker's chip is highlighted for a few seconds.
 */
export function useSpeakerNavigation({ model, prepare }: Options) {
  const [active, setActive] = useState<{ speakerId: string; index: number } | null>(null);
  const [highlight, setHighlight] = useState<HighlightState>(NO_HIGHLIGHT);
  const pollTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const highlightTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const clearTimers = useCallback(() => {
    clearTimeout(pollTimer.current);
    clearTimeout(highlightTimer.current);
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const reveal = useCallback(
    (speakerId: string, appearance: SpeakerAppearance) => {
      clearTimers();
      setHighlight(NO_HIGHLIGHT);

      let attempts = 0;
      const attempt = () => {
        const element = document.getElementById(appearance.elementId);
        if (element) {
          const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          element.scrollIntoView({
            behavior: reduceMotion ? "auto" : "smooth",
            block: "center",
          });
          setHighlight({ speakerId, elementId: appearance.elementId });
          highlightTimer.current = setTimeout(
            () => setHighlight(NO_HIGHLIGHT),
            SPEAKER_HIGHLIGHT_MS,
          );
          return;
        }
        attempts += 1;
        if (attempts < MAX_POLLS) pollTimer.current = setTimeout(attempt, POLL_INTERVAL_MS);
      };
      pollTimer.current = setTimeout(attempt, 0);
    },
    [clearTimers],
  );

  const goToAppearance = useCallback(
    (speakerId: string, requestedIndex: number) => {
      const speaker = model?.speakerIndex.get(speakerId);
      if (!speaker || speaker.appearances.length === 0) return;

      const total = speaker.appearances.length;
      const index = ((requestedIndex % total) + total) % total;

      prepare();
      setActive({ speakerId, index });
      reveal(speakerId, speaker.appearances[index]);
    },
    [model, prepare, reveal],
  );

  const goToSpeaker = useCallback(
    (speakerId: string) => goToAppearance(speakerId, 0),
    [goToAppearance],
  );

  const step = useCallback(
    (delta: 1 | -1) => {
      if (active) goToAppearance(active.speakerId, active.index + delta);
    },
    [active, goToAppearance],
  );

  const dismiss = useCallback(() => {
    clearTimers();
    setActive(null);
    setHighlight(NO_HIGHLIGHT);
  }, [clearTimers]);

  const speaker = active ? model?.speakerIndex.get(active.speakerId) : undefined;
  const navigation: ActiveSpeakerNav | null =
    active && speaker
      ? {
          speakerId: speaker.id,
          fullName: speaker.fullName,
          index: active.index,
          total: speaker.appearances.length,
        }
      : null;

  return { highlight, navigation, goToSpeaker, next: () => step(1), previous: () => step(-1), dismiss };
}
