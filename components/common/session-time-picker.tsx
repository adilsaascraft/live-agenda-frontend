
"use client";

import { TimePicker } from "@/components/reui/time-picker";

interface SessionTimePickerProps {
  id: string;
  labelId: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  invalid?: boolean;
}

/**
 * Converts the backend format (10:00 AM) into TimePicker format (10:00).
 * TimePicker uses 24-hour HH:mm internally and displays 12-hour time.
 */
function toPickerTime(value: string): string | null {
  if (!value?.trim()) return null;

  const normalized = value.trim();

  // Already in 24-hour HH:mm format.
  const twentyFourHourMatch = normalized.match(
    /^([01]?\d|2[0-3]):([0-5]\d)$/,
  );

  if (twentyFourHourMatch) {
    return `${twentyFourHourMatch[1].padStart(2, "0")}:${twentyFourHourMatch[2]}`;
  }

  // Backend format: 10:00 AM / 10:00 PM.
  const twelveHourMatch = normalized.match(
    /^(0?[1-9]|1[0-2]):([0-5]\d)\s*(AM|PM)$/i,
  );

  if (!twelveHourMatch) return null;

  let hour = Number(twelveHourMatch[1]);
  const minute = twelveHourMatch[2];
  const period = twelveHourMatch[3].toUpperCase();

  if (period === "AM" && hour === 12) {
    hour = 0;
  } else if (period === "PM" && hour !== 12) {
    hour += 12;
  }

  return `${String(hour).padStart(2, "0")}:${minute}`;
}

/**
 * Converts TimePicker format (14:30) into backend format (02:30 PM).
 */
function toApiTime(value: string): string {
  const match = value.match(
    /^([01]\d|2[0-3]):([0-5]\d)$/,
  );

  if (!match) return "";

  const hour = Number(match[1]);
  const minute = match[2];

  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;

  return `${String(displayHour).padStart(2, "0")}:${minute} ${period}`;
}

export function SessionTimePicker({
  id,
  labelId,
  value,
  onChange,
  disabled = false,
  invalid = false,
}: SessionTimePickerProps) {
  return (
    <TimePicker
      id={id}
      hourCycle={12}
      granularity="minute"
      minuteStep={1}
      value={toPickerTime(value)}
      onValueChange={(nextValue) => {
        onChange(nextValue ? toApiTime(nextValue) : "");
      }}
      disabled={disabled}
      invalid={invalid}
      aria-labelledby={labelId}
    />
  );
}
