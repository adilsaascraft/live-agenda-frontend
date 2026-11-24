
"use client";

import { useRef, type KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Users, type LucideIcon } from "lucide-react";

import { AGENDA_TABS, type AgendaTabValue } from "../constants/agenda.constants";
import { gradients } from "@/lib/constants/colors";

export const getTabId = (value: AgendaTabValue): string =>
  `agenda-tab-${value}`;

export const getPanelId = (value: AgendaTabValue): string =>
  `agenda-panel-${value}`;

const TAB_ICONS: Record<AgendaTabValue, LucideIcon> = {
  schedule: CalendarDays,
  speakers: Users,
};

interface AgendaTabsProps {
  value: AgendaTabValue;
  onValueChange: (value: AgendaTabValue) => void;
}

/** Accessible tablist with a sliding active indicator. */
export function AgendaTabs({ value, onValueChange }: AgendaTabsProps) {
  const buttons = useRef<
    Partial<Record<AgendaTabValue, HTMLButtonElement | null>>
  >({});

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const last = AGENDA_TABS.length - 1;
    let next: number;

    switch (event.key) {
      case "ArrowRight":
        next = index === last ? 0 : index + 1;
        break;
      case "ArrowLeft":
        next = index === 0 ? last : index - 1;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = last;
        break;
      default:
        return;
    }

    event.preventDefault();

    const target = AGENDA_TABS[next].value;
    onValueChange(target);
    buttons.current[target]?.focus();
  };

  return (
    <div
      role="tablist"
      aria-label="Agenda sections"
      className="relative flex w-full gap-1.5 rounded-xl bg-muted p-1.5 sm:inline-flex sm:w-auto"
    >
      {AGENDA_TABS.map((tab, index) => {
        const selected = tab.value === value;
        const Icon = TAB_ICONS[tab.value];

        return (
          <button
            key={tab.value}
            ref={(element) => {
              buttons.current[tab.value] = element;
            }}
            type="button"
            role="tab"
            id={getTabId(tab.value)}
            aria-selected={selected}
            aria-controls={getPanelId(tab.value)}
            tabIndex={selected ? 0 : -1}
            onClick={() => onValueChange(tab.value)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className="relative flex min-h-12 flex-1 items-center justify-center gap-2.5 rounded-lg px-6 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:min-w-40 sm:flex-none sm:px-8"
          >
            {selected && (
              <motion.span
                layoutId="agenda-tab-indicator"
                className="absolute inset-0 rounded-lg shadow-md"
                style={{ background: gradients.primary }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 38,
                }}
              />
            )}

            <span
              className={
                selected
                  ? "relative z-10 flex items-center gap-2.5 text-white"
                  : "relative z-10 flex items-center gap-2.5 text-muted-foreground transition-colors hover:text-foreground"
              }
            >
              <Icon className="size-4" aria-hidden="true" />
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
