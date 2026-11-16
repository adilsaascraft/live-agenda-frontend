'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Search } from 'lucide-react'

import { Input } from '@/components/ui/input'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export interface SearchableSelectOption {
  value: string
  label: string
}

interface SearchableSelectProps {
  value?: string

  onValueChange: (value: string | null) => void

  options: SearchableSelectOption[]

  placeholder?: string

  searchPlaceholder?: string

  emptyMessage?: string

  disabled?: boolean

  allowNone?: boolean

  noneLabel?: string

  className?: string

  contentClassName?: string
}

export function SearchableSelect({
  value = '',
  onValueChange,
  options,
  placeholder = 'Select option',
  searchPlaceholder = 'Search...',
  emptyMessage = 'No options found.',
  disabled = false,
  allowNone = false,
  noneLabel = 'None',
  className,
  contentClassName,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim())
    }, 250)

    return () => {
      window.clearTimeout(timer)
    }
  }, [search])

  useEffect(() => {
    if (!open) {
      setSearch('')
      setDebouncedSearch('')

      return
    }

    const timer = window.setTimeout(() => {
      searchInputRef.current?.focus()
      searchInputRef.current?.select()
    }, 0)

    return () => {
      window.clearTimeout(timer)
    }
  }, [open])

  const filteredOptions = useMemo(() => {
    if (!debouncedSearch) {
      return options
    }

    const query = debouncedSearch.toLowerCase()

    return options.filter((option) =>
      option.label.toLowerCase().includes(query),
    )
  }, [options, debouncedSearch])

  const selectedOption = options.find((option) => option.value === value)

  return (
    <Select
      value={value}
      onValueChange={onValueChange}
      open={open}
      onOpenChange={setOpen}
      disabled={disabled}
    >
      <SelectTrigger className={className ?? 'h-10 w-full'}>
        <SelectValue>{selectedOption?.label ?? placeholder}</SelectValue>
      </SelectTrigger>

      <SelectContent className={contentClassName}>
        <div
          className="border-b p-2"
          onPointerDown={(event) => {
            event.stopPropagation()
          }}
          onKeyDown={(event) => {
            event.stopPropagation()
          }}
        >
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              ref={searchInputRef}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={searchPlaceholder}
              className="h-9 pl-9"
              autoComplete="off"
              onPointerDown={(event) => {
                event.stopPropagation()
              }}
              onKeyDown={(event) => {
                event.stopPropagation()

                if (event.key === 'Escape') {
                  setOpen(false)
                }
              }}
            />
          </div>
        </div>

        <div className="max-h-60 overflow-y-auto p-1">
          {allowNone && <SelectItem value="">{noneLabel}</SelectItem>}

          {filteredOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}

          {filteredOptions.length === 0 && (
            <div className="px-3 py-6 text-center text-sm text-muted-foreground">
              {emptyMessage}
            </div>
          )}
        </div>
      </SelectContent>
    </Select>
  )
}
