"use client";

import { useId, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { FILTER_ALL } from "../constants/agenda.constants";
import type { AgendaFilterOptions, AgendaFilters as Filters, SelectOption } from "../types/agenda.types";

interface FilterSelectProps {
  label: string;
  allLabel: string;
  value: string | null;
  options: readonly SelectOption[];
  onChange: (value: string | null) => void;
}

function FilterSelect({ label, allLabel, value, options, onChange }: FilterSelectProps) {
  const labelId = useId();
  const items = useMemo(
    () => [{ value: FILTER_ALL, label: allLabel }, ...options],
    [allLabel, options],
  );
  const labelOf = (selected: string | null): string =>
    items.find((item) => item.value === (selected ?? FILTER_ALL))?.label ?? allLabel;

  return (
    <div className="min-w-0 space-y-1.5">
      <span id={labelId} className="text-xs font-medium text-muted-foreground">
        {label}
      </span>
      <Select
        items={items}
        value={value ?? FILTER_ALL}
        onValueChange={(next) => onChange(!next || next === FILTER_ALL ? null : next)}
        disabled={options.length === 0}
      >
        <SelectTrigger aria-labelledby={labelId} className="h-11 w-full">
          <SelectValue>{(selected: string | null) => labelOf(selected)}</SelectValue>
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

export function AgendaFilters({ options, filters, canReset, onChange, onReset }: AgendaFiltersProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
      <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <FilterSelect
          label="Session Date"
          allLabel="All days"
          value={filters.dateKey}
          options={options.dates}
          onChange={(dateKey) => onChange({ dateKey })}
        />
        <FilterSelect
          label="Hall"
          allLabel="All halls"
          value={filters.hallId}
          options={options.halls}
          onChange={(hallId) => onChange({ hallId })}
        />
        <FilterSelect
          label="Track"
          allLabel="All tracks"
          value={filters.trackId}
          options={options.tracks}
          onChange={(trackId) => onChange({ trackId })}
        />
        <FilterSelect
          label="Topic Type"
          allLabel="All types"
          value={filters.topicType}
          options={options.topicTypes}
          onChange={(topicType) => onChange({ topicType })}
        />
      </div>

      {/* Reserved width on large screens so showing Reset never shifts the selects. */}
      <div className="flex lg:h-11 lg:w-24 lg:shrink-0 lg:justify-end">
        <AnimatePresence>
          {canReset && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 8 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.18 }}
            >
              <Button type="button" variant="ghost" onClick={onReset} className="h-11 gap-2">
                <RotateCcw className="size-4" aria-hidden="true" />
                Reset
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
