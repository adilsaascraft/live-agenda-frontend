"use client";

import * as React from "react";
import { format, parse, isValid } from "date-fns";
import { CalendarIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

/* ================= HELPERS ================= */

function formatInput(value: string) {
  const digits = value.replace(/\D/g, "");

  let result = "";

  if (digits.length > 0) {
    result += digits.slice(0, 2);
  }

  if (digits.length > 2) {
    result += "/" + digits.slice(2, 4);
  }

  if (digits.length > 4) {
    result += "/" + digits.slice(4, 8);
  }

  return result;
}

function toSafeDate(input: unknown): Date | undefined {
  if (!input) return undefined;

  if (input instanceof Date && !isNaN(input.getTime())) {
    return input;
  }

  const parsed = new Date(input as any);

  return isNaN(parsed.getTime()) ? undefined : parsed;
}

/* ================= TYPES ================= */

type Props = {
  disabled?: boolean;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
};

/* ================= COMPONENT ================= */

export function DatePicker({
  value,
  onChange,
  disabled = false,
  placeholder,
  className,
}: Props) {
  const [internalDate, setInternalDate] = React.useState<Date>()
  const [isOpen, setIsOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState('')

  const safeValue = toSafeDate(value)
  const date = safeValue ?? internalDate

  const setDate = React.useCallback(
    (newDate: Date | undefined) => {
      setInternalDate(newDate)
      onChange?.(newDate)
    },
    [onChange],
  )

  /* ================= SYNC INPUT ================= */

  React.useEffect(() => {
    if (!date) {
      setInputValue('')
      return
    }

    setInputValue(format(date, 'dd/MM/yyyy'))
  }, [date])

  /* ================= INPUT ================= */

  const resetInput = React.useCallback(() => {
    if (!date) {
      setInputValue('')
      return
    }

    setInputValue(format(date, 'dd/MM/yyyy'))
  }, [date])

  const handleInputBlur = () => {
    const trimmed = inputValue.trim()

    if (!trimmed) {
      setDate(undefined)
      return
    }

    const parsed = parse(trimmed, 'dd/MM/yyyy', new Date())

    if (!isValid(parsed)) {
      resetInput()
      return
    }

    if (format(parsed, 'dd/MM/yyyy') !== trimmed) {
      resetInput()
      return
    }

    parsed.setHours(0, 0, 0, 0)

    setDate(parsed)
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur()
    }
  }

  /* ================= DATE ================= */

  const updateDatePart = (selected: Date) => {
    const newDate = new Date(selected)

    newDate.setHours(0, 0, 0, 0)

    setDate(newDate)
    setIsOpen(false)
  }

  /* ================= UI ================= */

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <div className="relative w-full">
        <Input
          disabled={disabled}
          value={inputValue}
          maxLength={10}
          onChange={(e) => {
            const formatted = formatInput(e.target.value)
            setInputValue(formatted)
          }}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          placeholder={placeholder ?? 'DD/MM/YYYY'}
          className={cn('pr-10', className)}
        />

        <PopoverTrigger
          disabled={disabled}
          className={cn(
            'absolute right-1 top-1 inline-flex h-8 w-8 items-center justify-center rounded-md',
            'hover:bg-accent hover:text-accent-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          )}
        >
          <CalendarIcon className="h-4 w-4" />
        </PopoverTrigger>
      </div>

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selectedDate) => {
            if (selectedDate) {
              updateDatePart(selectedDate)
            }
          }}
        />
      </PopoverContent>
    </Popover>
  )
}