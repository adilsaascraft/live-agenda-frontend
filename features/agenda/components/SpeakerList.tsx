"use client";

import { memo } from "react";

import type { AgendaSpeaker } from "../types/agenda.types";
import { pluralize } from "../utils/format.utils";
import { SpeakerCard } from "./SpeakerCard";

interface SpeakerListProps {
  speakers: readonly AgendaSpeaker[];
  onSelect: (speakerId: string) => void;
}

export const SpeakerList = memo(function SpeakerList({ speakers, onSelect }: SpeakerListProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {pluralize(speakers.length, "speaker")} · select a name to find them in the schedule
      </p>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {speakers.map((speaker) => (
          <li key={speaker.id}>
            <SpeakerCard speaker={speaker} onSelect={onSelect} />
          </li>
        ))}
      </ul>
    </div>
  );
});
