/** "02:20 PM – 03:00 PM". Falls back gracefully when a time is missing. */
export function formatTimeRange(start: string, end: string): string {
  if (start && end) return `${start} – ${end}`;
  return start || end || "Time TBA";
}

export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`;
}
