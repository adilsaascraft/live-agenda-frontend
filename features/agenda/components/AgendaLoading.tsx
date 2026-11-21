
"use client";

import { useEffect, useState } from "react";
import { colors, gradients } from "@/lib/constants/colors";

const TICKS = 60;
const RADIUS = 46;
const MAX_DURATION_MS = 10000;
const REMOUNT_GRACE_MS = 2000;

const STAGES = [
  "Loading sessions",
  "Loading halls",
  "Loading speakers",
  "Loading topics",
];

const r = (n: number) => Number(n.toFixed(3));
const ease = (t: number) => 1 - Math.pow(1 - t, 1.8);

let startedAt: number | null = null;
let lastUnmountAt = 0;

export default function AgendaLoadingScreen({
  duration = MAX_DURATION_MS,
}: {
  duration?: number;
}) {
  const total = Math.min(duration, MAX_DURATION_MS);
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const now = Date.now();

    if (startedAt === null || now - lastUnmountAt > REMOUNT_GRACE_MS) {
      startedAt = now;
    }

    const update = () => {
      const t = Math.min((Date.now() - (startedAt ?? now)) / total, 1);
      setPercentage(Math.round(ease(t) * 100));
      return t;
    };

    update();

    const id = window.setInterval(() => {
      if (update() >= 1) window.clearInterval(id);
    }, 100);

    return () => {
      window.clearInterval(id);
      lastUnmountAt = Date.now();
    };
  }, [total]);

  const done = percentage >= 100;
  const litTicks = Math.round((percentage / 100) * TICKS);

  const stage = done
    ? "Agenda ready"
    : STAGES[Math.min(Math.floor(percentage / 25), STAGES.length - 1)];

  return (
    <main
      className="relative flex h-dvh w-full items-center justify-center overflow-hidden px-5"
      style={{
        background: gradients.obsidian,
        color: colors.white[50],
      }}
    >
      {/* Ambient background lighting */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 45%, color-mix(in srgb, ${colors.orange[400]} 12%, transparent), transparent 65%)`,
        }}
      />

      {/* Secondary ambient glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background: `radial-gradient(ellipse at 50% 100%, color-mix(in srgb, ${colors.orange[400]} 10%, transparent), transparent 55%)`,
        }}
      />

      {/* Decorative top light */}
      <div
        className="pointer-events-none absolute top-0 h-px w-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${colors.orange[400]}, transparent)`,
          opacity: 0.35,
        }}
      />

      {/* Main content */}
      <div className="relative z-10 flex w-full max-w-md flex-col items-center">
        {/* Brand */}
        <div className="mb-8 flex flex-col items-center">
          <div className="flex items-center gap-3">
            <div
              className="flex size-10 items-center justify-center rounded-xl"
              style={{
                background: `linear-gradient(135deg, ${colors.orange[400]}, ${colors.orange[600]})`,
                color: colors.white[50],
                boxShadow: `0 0 30px color-mix(in srgb, ${colors.orange[400]} 20%, transparent)`,
              }}
            >
              <span className="text-lg font-black">L</span>
            </div>

            <span className="text-lg font-bold tracking-tight">
              Live <span style={{ color: colors.orange[400] }}>Agenda</span>
            </span>
          </div>

          {/* Brand separator */}
          <div
            className="mt-5 h-px w-20"
            style={{
              background: `linear-gradient(90deg, transparent, ${colors.orange[400]}, transparent)`,
            }}
          />
        </div>

        {/* Loader card */}
        <div
          className="relative flex w-full flex-col items-center rounded-3xl border px-6 py-8 sm:px-9 sm:py-10"
          style={{
            background: `color-mix(in srgb, ${colors.white[50]} 4%, transparent)`,
            borderColor: `color-mix(in srgb, ${colors.orange[400]} 18%, transparent)`,
            boxShadow: `0 25px 80px color-mix(in srgb, ${colors.slate[900]} 40%, transparent), 0 0 50px color-mix(in srgb, ${colors.orange[400]} 5%, transparent)`,
            backdropFilter: "blur(18px)",
          }}
        >
          {/* Card top accent */}
          <div
            className="absolute inset-x-10 top-0 h-px"
            style={{
              background: `linear-gradient(90deg, transparent, ${colors.orange[400]}, transparent)`,
            }}
          />

          {/* Heading */}
          <div className="mb-8 text-center">
            <p
              className="mb-2 text-[10px] font-bold uppercase tracking-[0.35em]"
              style={{ color: colors.orange[400] }}
            >
              Conference Experience
            </p>

            <h1 className="text-xl font-bold tracking-wide sm:text-2xl">
              Conference Agenda
            </h1>

            <p
              className="mt-2 text-xs tracking-wide"
              style={{ color: colors.slate[400] }}
            >
              Preparing your event experience
            </p>
          </div>

          {/* Circular progress */}
          <div
            className="relative aspect-square w-[min(240px,42vh,68vw)]"
            role="progressbar"
            aria-label="Loading agenda"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percentage}
          >
            <svg viewBox="0 0 100 100" className="absolute inset-0 size-full">
              <defs>
                <linearGradient
                  id="agendaLoadingTickGradient"
                  x1="0%"
                  y1="100%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor={colors.orange[400]} />
                  <stop offset="100%" stopColor={colors.orange[600]} />
                </linearGradient>
              </defs>

              {/* Background ticks */}
              {Array.from({ length: TICKS }, (_, i) => {
                const angle = (i / TICKS) * 2 * Math.PI - Math.PI / 2;
                const isHour = i % 5 === 0;
                const inner = RADIUS - (isHour ? 7 : 4.5);

                return (
                  <line
                    key={`bg-${i}`}
                    x1={r(50 + Math.cos(angle) * inner)}
                    y1={r(50 + Math.sin(angle) * inner)}
                    x2={r(50 + Math.cos(angle) * RADIUS)}
                    y2={r(50 + Math.sin(angle) * RADIUS)}
                    strokeWidth={isHour ? 1.6 : 1}
                    strokeLinecap="round"
                    stroke={colors.slate[700]}
                  />
                );
              })}

              {/* Active ticks */}
              {Array.from({ length: TICKS }, (_, i) => {
                if (i >= litTicks) return null;

                const angle = (i / TICKS) * 2 * Math.PI - Math.PI / 2;
                const isHour = i % 5 === 0;
                const inner = RADIUS - (isHour ? 7 : 4.5);
                const isHead = i === litTicks - 1 && !done;

                return (
                  <line
                    key={`active-${i}`}
                    x1={r(50 + Math.cos(angle) * inner)}
                    y1={r(50 + Math.sin(angle) * inner)}
                    x2={r(50 + Math.cos(angle) * RADIUS)}
                    y2={r(50 + Math.sin(angle) * RADIUS)}
                    strokeWidth={isHour ? 1.9 : 1.3}
                    strokeLinecap="round"
                    stroke={isHead ? colors.white[50] : "url(#agendaLoadingTickGradient)"}
                  />
                );
              })}
            </svg>

            {/* Center percentage */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-extrabold tabular-nums tracking-tighter">
                {percentage}
                <span
                  className="ml-0.5 text-xl font-bold"
                  style={{ color: colors.orange[400] }}
                >
                  %
                </span>
              </span>

              <span
                className="mt-1 text-[9px] font-semibold uppercase tracking-[0.25em]"
                style={{ color: colors.slate[400] }}
              >
                Loading
              </span>
            </div>
          </div>

          {/* Status */}
          <div className="mt-7 flex min-h-6 items-center justify-center gap-2.5">
            <span
              className={`size-2 rounded-full ${
                done ? "bg-emeremerald-500" : "animate-pulse"
              }`}
              style={!done ? { backgroundColor: colors.orange[400] } : undefined}
            />

            <p
              className="text-sm font-medium transition-all duration-300"
              style={{ color: colors.slate[300] }}
              aria-live="polite"
            >
              {stage}
            </p>
          </div>

          {/* Linear progress */}
          <div
            className="mt-5 h-1 w-full overflow-hidden rounded-full"
            style={{ backgroundColor: colors.slate[800] }}
          >
            <div
              className="h-full rounded-full transition-[width] duration-200"
              style={{
                width: `${percentage}%`,
                background: `linear-gradient(90deg, ${colors.orange[400]}, ${colors.orange[600]})`,
                boxShadow: `0 0 12px color-mix(in srgb, ${colors.orange[400]} 35%, transparent)`,
              }}
            />
          </div>

          {/* Progress details */}
          <div className="mt-3 flex w-full items-center justify-between">
            <span
              className="text-[10px] font-medium"
              style={{ color: colors.slate[500] }}
            >
              {done ? "Ready to explore" : "Please wait"}
            </span>

            <span
              className="text-[10px] font-bold tabular-nums"
              style={{ color: colors.orange[400] }}
            >
              {percentage} / 100
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-7 flex flex-col items-center gap-2">
          <p
            className="text-[10px] font-medium uppercase tracking-[0.3em]"
            style={{ color: colors.slate[500] }}
          >
            Powered by Live Agenda
          </p>

          <div className="flex items-center gap-1.5">
            <span
              className="size-1 rounded-full"
              style={{ backgroundColor: colors.orange[400] }}
            />
            <span
              className="size-1 rounded-full opacity-50"
              style={{ backgroundColor: colors.orange[400] }}
            />
            <span
              className="size-1 rounded-full opacity-25"
              style={{ backgroundColor: colors.orange[400] }}
            />
          </div>
        </div>
      </div>

      {/* Bottom ambient accent */}
      <div
        className="pointer-events-none absolute bottom-0 h-px w-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${colors.orange[400]}, transparent)`,
          opacity: 0.2,
        }}
      />
    </main>
  );
}
