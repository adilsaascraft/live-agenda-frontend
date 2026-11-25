export const AGENDA_EVENT = {
  name: process.env.NEXT_PUBLIC_AGENDA_EVENT_NAME ?? "Conference 2026",
  startDate: process.env.NEXT_PUBLIC_AGENDA_START_DATE ?? "",
  endDate: process.env.NEXT_PUBLIC_AGENDA_END_DATE ?? "",
  dateRangeLabel:
    process.env.NEXT_PUBLIC_AGENDA_DATE_RANGE_LABEL ?? "",
  venue:
    process.env.NEXT_PUBLIC_AGENDA_VENUE ?? "",
  location:
    process.env.NEXT_PUBLIC_AGENDA_LOCATION ?? "",
} as const;