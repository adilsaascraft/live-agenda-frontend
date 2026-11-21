
const IST_TIME_ZONE = "Asia/Kolkata";
const IST_OFFSET_MINUTES = 330;

export type AgendaTimeStatus = "upcoming" | "live" | "completed";

export interface AgendaDateTime {
  startAt: Date;
  endAt: Date;
}

interface TimeParts {
  hours: number;
  minutes: number;
}

function getISTDateParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: IST_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = Number(parts.find((part) => part.type === "year")?.value);
  const month = Number(parts.find((part) => part.type === "month")?.value);
  const day = Number(parts.find((part) => part.type === "day")?.value);

  return { year, month, day };
}

function parseTime(time: string): TimeParts {
  const match = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);

  if (!match) {
    throw new Error(`Invalid agenda time format: ${time}`);
  }

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3].toUpperCase();

  // Validate the supplied time.
  if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59) {
    throw new Error(`Invalid agenda time value: ${time}`);
  }

  // Convert 12-hour format to 24-hour format.
  if (hours === 12) hours = 0;
  if (meridiem === "PM") hours += 12;

  return { hours, minutes };
}

/**
 * Converts the API sessionDate into its IST calendar date,
 * then combines that date with the supplied agenda times.
 *
 * This utility works for:
 * - Session startTime/endTime
 * - Topic startTime/endTime using the parent sessionDate
 */
export function getAgendaDateTime(
  sessionDate: string,
  startTime: string,
  endTime: string,
): AgendaDateTime {
  const sessionDateValue = new Date(sessionDate);

  if (Number.isNaN(sessionDateValue.getTime())) {
    throw new Error(`Invalid session date: ${sessionDate}`);
  }

  const { year, month, day } = getISTDateParts(sessionDateValue);

  const start = parseTime(startTime);
  const end = parseTime(endTime);

  // Construct intended IST wall-clock time.
  // Date.UTC creates the base timestamp, then we subtract
  // the IST offset to get the correct UTC instant.
  const startAt = new Date(
    Date.UTC(year, month - 1, day, start.hours, start.minutes) -
      IST_OFFSET_MINUTES * 60_000,
  );

  let endAt = new Date(
    Date.UTC(year, month - 1, day, end.hours, end.minutes) -
      IST_OFFSET_MINUTES * 60_000,
  );

  // Support overnight sessions and topics.
  if (endAt <= startAt) {
    endAt = new Date(endAt.getTime() + 24 * 60 * 60 * 1000);
  }

  return { startAt, endAt };
}

/**
 * Determines the current status based on the calculated schedule.
 */
export function getAgendaTimeStatus(
  startAt: Date,
  endAt: Date,
  now: Date = new Date(),
): AgendaTimeStatus {
  if (now < startAt) return "upcoming";
  if (now >= endAt) return "completed";

  return "live";
}
