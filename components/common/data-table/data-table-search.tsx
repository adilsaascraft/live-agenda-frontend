'use client'

import { Loader2, Search, X } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { useDebounce } from './use-debounce'
import type { DataTableSearchProps } from './types'

export function DataTableSearch({
  value,
  onChange,
  placeholder = 'Search...',
  debounce = 500,
  disabled = false,
  isLoading = false,
}: DataTableSearchProps) {
  const [search, setSearch] = useState(value)

  const debouncedSearch = useDebounce(search, debounce)

  useEffect(() => {
    onChange(debouncedSearch)
  }, [debouncedSearch, onChange])

  useEffect(() => {
    setSearch(value)
  }, [value])

  return (
    <div className="relative w-full bg-foreground/5 dark:bg-foreground/10">
      <Search
        className="
          pointer-events-none
          absolute
          left-3
          top-1/2
          h-4
          w-4
          -translate-y-1/2
          text-muted-foreground
        "
      />

      <Input
        value={search}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => setSearch(e.target.value)}
        className="
          h-10
          rounded-lg
          border
          bg-background
          text-foreground
          pl-10
          pr-10
          transition-colors
          focus-visible:ring-2
        "
      />

      {isLoading ? (
        <Loader2
          className="
            pointer-events-none
            absolute
            right-3
            top-1/2
            h-4
            w-4
            -translate-y-1/2
            animate-spin
            text-muted-foreground
          "
        />
      ) : (
        search && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={disabled}
            onClick={() => setSearch('')}
            className="
              absolute
              right-1
              top-1/2
              h-8
              w-8
              -translate-y-1/2
            "
          >
            <X className="h-4 w-4 text-muted-foreground" />

            <span className="sr-only">Clear search</span>
          </Button>
        )
      )}
    </div>
  )
}
