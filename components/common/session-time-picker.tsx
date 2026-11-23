"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SessionTimePickerProps {
  id: string;
  labelId: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  invalid?: boolean;
}

type Period = "AM" | "PM";

interface ParsedTime {
  hour: string;
  minute: string;
  period: Period;
}

/**
 * Parse backend time formats:
 * 10:30 AM
 * 02:45 PM
 * 14:30
 */
function parseTime(value: string): ParsedTime {
  if (!value?.trim()) {
    return {
      hour: "",
      minute: "",
      period: "AM",
    };
  }

  const normalized = value.trim();

  // 12-hour format
  const twelveHourMatch = normalized.match(
    /^(0?[1-9]|1[0-2]):([0-5]\d)\s*(AM|PM)$/i,
  );

  if (twelveHourMatch) {
    return {
      hour: twelveHourMatch[1].padStart(2, "0"),
      minute: twelveHourMatch[2],
      period: twelveHourMatch[3].toUpperCase() as Period,
    };
  }

  // 24-hour format
  const twentyFourHourMatch = normalized.match(
    /^([01]?\d|2[0-3]):([0-5]\d)$/,
  );

  if (twentyFourHourMatch) {
    const hour24 = Number(twentyFourHourMatch[1]);

    return {
      hour: String(hour24 % 12 || 12).padStart(2, "0"),
      minute: twentyFourHourMatch[2],
      period: hour24 >= 12 ? "PM" : "AM",
    };
  }

  return {
    hour: "",
    minute: "",
    period: "AM",
  };
}

/**
 * Convert to backend format:
 * 09:05 AM
 * 02:45 PM
 */
function formatTime(hour: string, minute: string, period: Period): string {
  if (!hour || !minute) return "";

  return `${hour}:${minute} ${period}`;
}

export function SessionTimePicker({
  id,
  labelId,
  value,
  onChange,
  disabled = false,
  invalid = false,
}: SessionTimePickerProps) {
  const parsed = React.useMemo(() => parseTime(value), [value]);

  const [hour, setHour] = React.useState(parsed.hour);
  const [minute, setMinute] = React.useState(parsed.minute);
  const [period, setPeriod] = React.useState<Period>(parsed.period);

  const minuteInputRef = React.useRef<HTMLInputElement>(null);

  // Synchronize with parent value
  React.useEffect(() => {
    setHour(parsed.hour);
    setMinute(parsed.minute);
    setPeriod(parsed.period);
  }, [parsed.hour, parsed.minute, parsed.period]);

  const updateTime = (
    nextHour: string,
    nextMinute: string,
    nextPeriod: Period,
  ) => {
    if (!nextHour || !nextMinute) {
      onChange("");
      return;
    }

    onChange(formatTime(nextHour, nextMinute, nextPeriod));
  };

  // -----------------------------------------------
  // Hour
  // -----------------------------------------------

  const handleHourChange = (input: string) => {
    const digits = input.replace(/\D/g, "").slice(0, 2);

    if (digits && Number(digits) > 12) return;

    setHour(digits);
    updateTime(digits, minute, period);
  };

  const handleHourBlur = () => {
    if (!hour) return;

    const paddedHour = hour.padStart(2, "0");

    setHour(paddedHour);
    updateTime(paddedHour, minute, period);
  };

  // -----------------------------------------------
  // Minute
  // -----------------------------------------------

  const handleMinuteChange = (input: string) => {
    const digits = input.replace(/\D/g, "").slice(0, 2);

    if (digits && Number(digits) > 59) return;

    setMinute(digits);
    updateTime(hour, digits, period);
  };

  const handleMinuteBlur = () => {
    if (!minute) return;

    const paddedMinute = minute.padStart(2, "0");

    setMinute(paddedMinute);
    updateTime(hour, paddedMinute, period);
  };

  // -----------------------------------------------
  // AM / PM
  // -----------------------------------------------

  const handlePeriodChange = (nextPeriod: Period) => {
    setPeriod(nextPeriod);
    updateTime(hour, minute, nextPeriod);
  };

  // -----------------------------------------------
  // UI
  // -----------------------------------------------

  return (
    <div
      id={id}
      role="group"
      aria-labelledby={labelId}
      aria-invalid={invalid}
      className={[
        "flex h-9 w-full items-center overflow-hidden rounded-md border bg-background",
        "transition-colors",
        "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1",
        invalid ? "border-destructive" : "border-input",
        disabled ? "pointer-events-none opacity-50" : "",
      ].join(" ")}
    >
      {/* Hour */}
      <Input
        type="text"
        inputMode="numeric"
        placeholder="HH"
        value={hour}
        onChange={(e) => handleHourChange(e.target.value)}
        onBlur={handleHourBlur}
        disabled={disabled}
        maxLength={2}
        className="h-full w-[42px] rounded-none border-0 bg-transparent px-1 text-center tabular-nums shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
      />

      {/* Colon */}
      <span className="select-none text-muted-foreground">:</span>

      {/* Minute */}
      <Input
        ref={minuteInputRef}
        type="text"
        inputMode="numeric"
        placeholder="MM"
        value={minute}
        onChange={(e) => handleMinuteChange(e.target.value)}
        onBlur={handleMinuteBlur}
        disabled={disabled}
        maxLength={2}
        className="h-full w-[42px] rounded-none border-0 bg-transparent px-1 text-center tabular-nums shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
      />

      {/* AM / PM */}
      <Select
        value={period}
        onValueChange={(nextValue) =>
          handlePeriodChange(nextValue as Period)
        }
        disabled={disabled}
      >
        <SelectTrigger
          className="h-full w-[68px] rounded-none border-0 bg-transparent px-2 shadow-none focus:ring-0 focus:ring-offset-0"
        >
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="AM">AM</SelectItem>
          <SelectItem value="PM">PM</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}