
"use client";

import { useId, useMemo, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  Layers,
  MapPin,
  RotateCcw,
  Tag,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { colors, gradients } from "@/lib/constants/colors";

import { FILTER_ALL } from "../constants/agenda.constants";
import type {
  AgendaFilterOptions,
  AgendaFilters as Filters,
  SelectOption,
} from "../types/agenda.types";

interface FilterSelectProps {
  label: string;
  allLabel: string;
  value: string | null;
  options: readonly SelectOption[];
  icon: ReactNode;
  onChange: (value: string | null) => void;
}

function FilterSelect({
  label,
  allLabel,
  value,
  options,
  icon,
  onChange,
}: FilterSelectProps) {
  const labelId = useId();

  const items = useMemo(
    () => [{ value: FILTER_ALL, label: allLabel }, ...options],
    [allLabel, options],
  );

  const labelOf = (selected: string | null): string =>
    items.find((item) => item.value === (selected ?? FILTER_ALL))?.label ??
    allLabel;

  return (
    <div className="min-w-0 space-y-1.5">
      <span
        id={labelId}
        className="text-xs font-semibold text-muted-foreground"
      >
        {label}
      </span>

      <Select
        items={items}
        value={value ?? FILTER_ALL}
        onValueChange={(next) =>
          onChange(!next || next === FILTER_ALL ? null : next)
        }
        disabled={options.length === 0}
      >
        <SelectTrigger
          aria-labelledby={labelId}
          className="h-11 w-full rounded-lg border border-slate-200 bg-background transition-all duration-200 hover:border-violet-400 focus-visible:border-violet-500 focus-visible:ring-2 focus-visible:ring-violet-100"
        >
          <span className="flex min-w-0 items-center gap-2">
            <span
              className="shrink-0"
              style={{ color: colors.violet[600] }}
              aria-hidden="true"
            >
              {icon}
            </span>

            <SelectValue>
              {(selected: string | null) => labelOf(selected)}
            </SelectValue>
          </span>
        </SelectTrigger>

        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

interface AgendaFiltersProps {
  options: AgendaFilterOptions;
  filters: Filters;
  /** True when any filter or the search box is active. */
  canReset: boolean;
  onChange: (patch: Partial<Filters>) => void;
  onReset: () => void;
}

export function AgendaFilters({
  options,
  filters,
  canReset,
  onChange,
  onReset,
}: AgendaFiltersProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
      <div className="ml-2 grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:ml-4 lg:ml-6">
        <FilterSelect
          label="Session Date"
          allLabel="All days"
          value={filters.dateKey}
          options={options.dates}
          icon={<CalendarDays className="size-4" />}
          onChange={(dateKey) => onChange({ dateKey })}
        />

        <FilterSelect
          label="Hall"
          allLabel="All halls"
          value={filters.hallId}
          options={options.halls}
          icon={<MapPin className="size-4" />}
          onChange={(hallId) => onChange({ hallId })}
        />

        <FilterSelect
          label="Track"
          allLabel="All tracks"
          value={filters.trackId}
          options={options.tracks}
          icon={<Layers className="size-4" />}
          onChange={(trackId) => onChange({ trackId })}
        />

        <FilterSelect
          label="Topic Type"
          allLabel="All types"
          value={filters.topicType}
          options={options.topicTypes}
          icon={<Tag className="size-4" />}
          onChange={(topicType) => onChange({ topicType })}
        />
      </div>

      {/* Reserved width prevents the filters from shifting when Reset appears. */}
      <div className="flex lg:h-11 lg:w-28 lg:shrink-0 lg:justify-end">
        <AnimatePresence>
          {canReset && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 8 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 8 }}
              transition={{ duration: 0.18 }}
            >
              <Button
                type="button"
                variant="outline"
                onClick={onReset}
                className="h-11 gap-2 rounded-lg border-2 border-violet-600 bg-background px-4 font-semibold text-violet-700 shadow-sm transition-all duration-200 hover:border-violet-800 hover:text-white hover:shadow-md active:scale-[0.97]"
                style={
                  {
                    "--reset-hover-background": gradients.royalPurple,
                  } as React.CSSProperties
                }
                onMouseEnter={(event) => {
                  event.currentTarget.style.background =
                    gradients.royalPurple;
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.background = "transparent";
                }}
              >
                <RotateCcw className="size-4" aria-hidden="true" />
                Reset All
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
