
"use client";

import { memo, useMemo, useState } from "react";
import { Search, SearchX, Users } from "lucide-react";

import { colors } from "@/lib/constants/colors";

import type { AgendaSpeaker } from "../types/agenda.types";
import { pluralize } from "../utils/format.utils";
import { AgendaSearch } from "./AgendaSearch";
import { SpeakerCard } from "./SpeakerCard";

interface SpeakerListProps {
  speakers: readonly AgendaSpeaker[];
  onSelect: (speakerId: string) => void;
}

export const SpeakerList = memo(function SpeakerList({
  speakers,
  onSelect,
}: SpeakerListProps) {
  const [query, setQuery] = useState("");

  const filteredSpeakers = useMemo(() => {
    const searchTerm = query.trim().toLocaleLowerCase();

    if (!searchTerm) return speakers;

    return speakers.filter((speaker) =>
      (speaker?.fullName ?? "")
        .toLocaleLowerCase()
        .includes(searchTerm),
    );
  }, [speakers, query]);

  const hasQuery = query.trim().length > 0;

  return (
    <div className="space-y-3">
      {/* Faculty Search */}
      <AgendaSearch
        value={query}
        onChange={setQuery}
        placeholder="Search faculty by name..."
        ariaLabel="Search faculty by name"
      />

      {/* Results Count */}
      <div
        className="flex flex-wrap items-center justify-between gap-2 rounded-lg border px-3.5 py-2.5"
        style={{
          backgroundColor: colors.purple[50],
          borderColor: colors.purple[200],
        }}
        aria-live="polite"
      >
        {filteredSpeakers.length > 0 ? (
          <>
            <div className="flex items-center gap-2">
              <Users
                className="size-4 shrink-0"
                style={{ color: colors.purple[700] }}
              />

              <p
                className="text-sm font-semibold"
                style={{ color: colors.purple[900] }}
              >
                Showing{" "}
                <span
                  className="font-bold"
                  style={{ color: colors.purple[700] }}
                >
                  {pluralize(filteredSpeakers.length, "faculty member")}
                </span>

                {hasQuery && (
                  <span style={{ color: colors.purple[800] }}>
                    {" "}of {speakers.length}
                  </span>
                )}
              </p>
            </div>

            <div
              className="flex items-center gap-1.5 text-xs font-medium"
              style={{ color: colors.purple[700] }}
            >
              <Search className="size-3.5 shrink-0" />
              <span>Select a faculty member to locate their sessions</span>
            </div>
          </>
        ) : (
          <div
            className="flex items-center gap-2 text-sm font-medium"
            style={{ color: colors.zinc[700] }}
          >
            <SearchX
              className="size-4 shrink-0"
              style={{ color: colors.purple[500] }}
            />
            <span>No faculty members found. Try a different name.</span>
          </div>
        )}
      </div>

      {/* Faculty Cards */}
      {filteredSpeakers.length > 0 ? (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filteredSpeakers.map((speaker) => (
            <li key={speaker.id}>
              <SpeakerCard speaker={speaker} onSelect={onSelect} />
            </li>
          ))}
        </ul>
      ) : (
        <div
          className="flex flex-col items-center justify-center rounded-2xl border border-dashed px-4 py-10 text-center"
          style={{
            borderColor: colors.purple[200],
            backgroundColor: colors.purple[50],
          }}
        >
          <div
            className="mb-3 flex size-12 items-center justify-center rounded-full"
            style={{
              backgroundColor: colors.purple[100],
              color: colors.purple[600],
            }}
          >
            <Search className="size-5" />
          </div>

          <h3
            className="text-base font-bold"
            style={{ color: colors.purple[900] }}
          >
            No faculty found
          </h3>

          <p
            className="mt-1 max-w-sm text-sm"
            style={{ color: colors.purple[700] }}
          >
            We couldn't find any faculty matching "{query}".
            Try searching with another name.
          </p>
        </div>
      )}
    </div>
  );
});
