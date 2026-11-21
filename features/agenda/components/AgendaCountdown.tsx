"use client";

import { useEffect, useState } from "react";

import { colors } from "@/lib/constants/colors";
import { getAgendaTimeStatus } from "../utils/agenda-date-time";

interface AgendaCountdownProps {
  startAt: Date;
  endAt: Date;
}

interface CountdownValues {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getCountdownValues(target: Date): CountdownValues {
  const difference = Math.max(0, target.getTime() - Date.now());

  const totalSeconds = Math.floor(difference / 1000);

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function AgendaCountdown({
  startAt,
  endAt,
}: AgendaCountdownProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const status = getAgendaTimeStatus(startAt, endAt, now);

  if (status === "completed") {
    return (
      <div
        className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
        style={{
          color: colors.violet[600],
          backgroundColor: colors.violet[50],
        }}
      >
        Completed
      </div>
    );
  }

  if (status === "live") {
    return (
      <div
        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
        style={{
          color: colors.violet[700],
          backgroundColor: colors.violet[50],
        }}
      >
        <span
          className="h-2 w-2 animate-pulse rounded-full"
          style={{ backgroundColor: colors.violet[600] }}
        />
        Live Now
      </div>
    );
  }

  const countdown = getCountdownValues(startAt);

  const units = [
    { value: countdown.days, label: "D" },
    { value: countdown.hours, label: "H" },
    { value: countdown.minutes, label: "M" },
    { value: countdown.seconds, label: "S" },
  ];

  return (
    <div
      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5"
      style={{
        backgroundColor: colors.violet[50],
        color: colors.violet[700],
      }}
      aria-label={`Starts in ${countdown.days} days, ${countdown.hours} hours, ${countdown.minutes} minutes and ${countdown.seconds} seconds`}
    >
      <span className="text-xs font-medium">Starts in</span>

      <div className="flex items-center gap-1">
        {units.map((unit, index) => (
          <span key={unit.label} className="inline-flex items-baseline">
            <span className="font-mono text-xs font-bold tabular-nums">
              {pad(unit.value)}
            </span>
            <span className="ml-0.5 text-[10px] font-medium">
              {unit.label}
            </span>

            {index !== units.length - 1 && (
              <span className="mx-0.5 opacity-50">:</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}