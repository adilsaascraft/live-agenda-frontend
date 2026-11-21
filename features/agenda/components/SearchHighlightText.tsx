
"use client";

import { Fragment } from "react";
import { normalizeSearchText, tokenizeQuery } from "../utils/agenda.utils";
import { useHighlight } from "./HighlightContext";

interface SearchHighlightTextProps {
  text: string;
  className?: string;
}

interface TextRange {
  start: number;
  end: number;
}

export function SearchHighlightText({
  text,
  className,
}: SearchHighlightTextProps) {
  const { searchQuery } = useHighlight();
  const tokens = tokenizeQuery(searchQuery);

  if (!text || tokens.length === 0) {
    return <span className={className}>{text}</span>;
  }

  // Normalize while keeping the positions of the original characters.
  const normalizedCharacters: string[] = [];
  const originalPositions: number[] = [];

  for (let i = 0; i < text.length; i++) {
    const normalizedCharacter = text[i]
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

    for (const character of normalizedCharacter) {
      normalizedCharacters.push(character);
      originalPositions.push(i);
    }
  }

  const normalizedText = normalizedCharacters.join("");
  const ranges: TextRange[] = [];

  for (const token of tokens) {
    const normalizedToken = normalizeSearchText(token);
    if (!normalizedToken) continue;

    let searchFrom = 0;

    while (searchFrom < normalizedText.length) {
      const matchIndex = normalizedText.indexOf(
        normalizedToken,
        searchFrom,
      );

      if (matchIndex === -1) break;

      const start = originalPositions[matchIndex];
      const end =
        originalPositions[matchIndex + normalizedToken.length - 1] + 1;

      ranges.push({ start, end });
      searchFrom = matchIndex + normalizedToken.length;
    }
  }

  if (ranges.length === 0) {
    return <span className={className}>{text}</span>;
  }

  // Merge overlapping or adjacent ranges.
  ranges.sort((a, b) => a.start - b.start);

  const mergedRanges: TextRange[] = [];

  for (const range of ranges) {
    const last = mergedRanges[mergedRanges.length - 1];

    if (last && range.start <= last.end) {
      last.end = Math.max(last.end, range.end);
    } else {
      mergedRanges.push({ ...range });
    }
  }

  const segments: React.ReactNode[] = [];
  let cursor = 0;

  for (const range of mergedRanges) {
    if (cursor < range.start) {
      segments.push(text.slice(cursor, range.start));
    }

    segments.push(
      <mark
  key={`highlight-${range.start}-${range.end}`}
  className="rounded-sm bg-yellow-200 px-0.5 text-inherit dark:bg-yellow-900/60"
>
  {text.slice(range.start, range.end)}
</mark>
    );

    cursor = range.end;
  }

  if (cursor < text.length) {
    segments.push(text.slice(cursor));
  }

  return (
    <span className={className}>
      {segments.map((segment, index) => (
        <Fragment key={index}>{segment}</Fragment>
      ))}
    </span>
  );
}
