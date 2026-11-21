"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Activity, CalendarDays, MapPin } from "lucide-react";

import { colors, gradients } from "@/lib/constants/colors";
import { AGENDA_EVENT } from "../constants/agenda.constants";

export function AgendaHeader() {
  const reduceMotion = useReducedMotion();
  const [displayYear, setDisplayYear] = useState("2025");

  const titleMatch = AGENDA_EVENT.name.match(/^(.*?)(\s+\d{4})$/);
  const eventName = titleMatch?.[1] ?? AGENDA_EVENT.name;

  useEffect(() => {
    if (reduceMotion) {
      setDisplayYear("2026");
      return;
    }

    const timer = window.setTimeout(() => {
      setDisplayYear("2026");
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [reduceMotion]);

  return (
    <motion.header
      initial={reduceMotion ? false : { opacity: 0, x: 35 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative isolate max-h-[300px] overflow-hidden rounded-2xl border px-4 py-5 text-white shadow-xl sm:px-6 sm:py-7"
      style={{
        background: gradients.royalPurple,
        borderColor: `${colors.purple[300]}50`,
      }}
    >
      {/* Atmospheric background lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(
              ellipse at 85% 15%,
              ${colors.violet[400]}30,
              transparent 48%
            ),
            radial-gradient(
              ellipse at 0% 100%,
              ${colors.purple[300]}20,
              transparent 45%
            )
          `,
        }}
      />

      {/* Cloud layer 1 */}
      {!reduceMotion && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 top-0 h-full w-[55%]"
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: -100, opacity: [0, 0.12, 0.08] }}
          transition={{
            x: {
              duration: 22,
              repeat: Infinity,
              ease: "linear",
            },
            opacity: {
              duration: 5,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            },
          }}
          style={{
            background: `radial-gradient(
              ellipse at center,
              ${colors.violet[300]}25,
              ${colors.purple[300]}10 40%,
              transparent 72%
            )`,
            filter: "blur(35px)",
          }}
        />
      )}

      {/* Cloud layer 2 */}
      {!reduceMotion && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -left-28 bottom-0 h-[85%] w-[50%]"
          initial={{ x: 0, opacity: 0 }}
          animate={{ x: 160, opacity: [0.03, 0.12, 0.05] }}
          transition={{
            x: {
              duration: 30,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
            },
            opacity: {
              duration: 8,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            },
          }}
          style={{
            background: `radial-gradient(
              ellipse at center,
              ${colors.purple[200]}25,
              ${colors.violet[400]}12 40%,
              transparent 75%
            )`,
            filter: "blur(45px)",
          }}
        />
      )}

      {/* Cloud layer 3 - subtle distant haze */}
      {!reduceMotion && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 top-1/3 h-40 w-80 rounded-full"
          style={{
            background: `radial-gradient(
              ellipse,
              ${colors.purple[200]}15,
              transparent 70%
            )`,
            filter: "blur(45px)",
          }}
          animate={{ x: [0, -100, -180], opacity: [0.1, 0.2, 0.1] }}
          transition={{
            duration: 26,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Cinematic light sweep - right to left */}
      {!reduceMotion && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 w-1/3 skew-x-[-18deg]"
          style={{
            background: `linear-gradient(
              90deg,
              transparent,
              ${colors.zinc[50]}10,
              ${colors.zinc[50]}25,
              transparent
            )`,
          }}
          initial={{ x: "150%", opacity: 0 }}
          animate={{ x: "-150%", opacity: [0, 1, 0] }}
          transition={{
            duration: 1.6,
            delay: 0.5,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Top light accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-8 top-0 h-px"
        style={{
          background: `linear-gradient(
            90deg,
            transparent,
            ${colors.purple[200]}80,
            ${colors.rose[500]}70,
            transparent
          )`,
        }}
      />

      {/* Header content */}
      <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-3 text-center">
        {/* Agenda label */}
<motion.div
  initial={reduceMotion ? false : { opacity: 0, x: 35 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{
    duration: 0.55,
    delay: reduceMotion ? 0 : 0.15,
    ease: "easeOut",
  }}
  className="inline-flex items-center gap-3 rounded-full border px-6 py-3 text-sm font-extrabold uppercase tracking-[0.18em] sm:px-8 sm:py-4 sm:text-base"
  style={{
    backgroundColor: `${colors.purple[900]}75`,
    borderColor: `${colors.purple[200]}50`,
    color: colors.purple[100],
    backdropFilter: "blur(10px)",
  }}
>
  <Activity className="size-5 sm:size-6" aria-hidden="true" />
  Conference Agenda
</motion.div>

        {/* Event title */}
        <motion.h1
          initial={reduceMotion ? false : { opacity: 0, x: 55 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.75,
            delay: reduceMotion ? 0 : 0.25,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="flex flex-wrap items-baseline justify-center text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl"
        >
          <span className="text-white drop-shadow-md">{eventName}</span>

          {/* Year transition: 2025 -> 2026 */}
          <span
            className="relative ml-2 inline-flex min-w-[4.5ch] items-baseline justify-start font-black tracking-tight"
            style={{ color: colors.rose[500] }}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={displayYear}
                initial={
                  reduceMotion
                    ? false
                    : {
                        opacity: 0,
                        y: 18,
                        filter: "blur(8px)",
                        scale: 0.92,
                      }
                }
                animate={{
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  scale: 1,
                  textShadow: [
                    `0 0 8px ${colors.rose[500]}20`,
                    `0 0 22px ${colors.rose[500]}60`,
                    `0 0 12px ${colors.rose[500]}35`,
                  ],
                }}
                exit={
                  reduceMotion
                    ? undefined
                    : {
                        opacity: 0,
                        y: -18,
                        filter: "blur(8px)",
                        scale: 1.04,
                      }
                }
                transition={{
                  opacity: { duration: 0.35 },
                  y: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
                  filter: { duration: 0.4 },
                  scale: { duration: 0.45, ease: "easeOut" },
                  textShadow: {
                    duration: 1.2,
                    ease: "easeInOut",
                  },
                }}
                className="inline-block"
              >
                {displayYear}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.h1>

        {/* Event details */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: 35 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.6,
            delay: reduceMotion ? 0 : 0.55,
            ease: "easeOut",
          }}
          className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 sm:gap-x-5"
        >
          {/* Date */}
          <div
            className="flex items-center gap-2 rounded-xl border px-3 py-2"
            style={{
              backgroundColor: `${colors.zinc[50]}0D`,
              borderColor: `${colors.zinc[50]}20`,
              backdropFilter: "blur(12px)",
            }}
          >
            <span
              className="flex size-8 shrink-0 items-center justify-center rounded-lg shadow-sm"
              style={{
                background: gradients.sunsetGold,
                color: colors.zinc[900],
              }}
            >
              <CalendarDays className="size-4" aria-hidden="true" />
            </span>

            <span className="text-sm font-semibold text-white sm:text-base">
              {AGENDA_EVENT.dateRangeLabel}
            </span>
          </div>

          {/* Venue */}
          <div
            className="flex items-center gap-2 rounded-xl border px-3 py-2"
            style={{
              backgroundColor: `${colors.zinc[50]}0D`,
              borderColor: `${colors.zinc[50]}20`,
              backdropFilter: "blur(12px)",
            }}
          >
            <span
              className="flex size-8 shrink-0 items-center justify-center rounded-lg shadow-sm"
              style={{
                background: gradients.emeraldLuxe,
                color: colors.zinc[50],
              }}
            >
              <MapPin className="size-4" aria-hidden="true" />
            </span>

            <span className="text-left text-sm font-semibold text-white sm:text-base">
              {AGENDA_EVENT.venue}
              <span
                className="block text-xs font-medium sm:text-sm"
                style={{ color: colors.purple[100] }}
              >
                {AGENDA_EVENT.location}
              </span>
            </span>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
}