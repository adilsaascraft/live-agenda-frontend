'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { cn } from '@/lib/utils'

import type { DataTablePaginationProps } from './types'

export function DataTablePagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  disabled = false,
}: DataTablePaginationProps) {
  if (totalPages <= 1) return null

  const startItem = totalItems === 0 ? 0 : (page - 1) * pageSize + 1

  const endItem = Math.min(page * pageSize, totalItems)

  const canPrevious = page > 1
  const canNext = page < totalPages

  const getPages = () => {
    const pages: (number | '...')[] = []

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    pages.push(1)

    if (page > 3) {
      pages.push('...')
    }

    const start = Math.max(2, page - 1)
    const end = Math.min(totalPages - 1, page + 1)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (page < totalPages - 2) {
      pages.push('...')
    }

    pages.push(totalPages)

    return pages
  }

  return (
    <div className="mt-6 flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-sm md:flex-row md:items-center md:justify-between">
      {/* Results */}
      <p className="text-sm text-muted-foreground">
        Showing <span className="font-medium text-foreground">{startItem}</span>{' '}
        to <span className="font-medium text-foreground">{endItem}</span> of{' '}
        <span className="font-medium text-foreground">{totalItems}</span>{' '}
        results
      </p>

      {/* Controls */}
      <div className="flex items-center gap-2 self-end md:self-auto">
        {/* Previous */}
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={!canPrevious || disabled}
          onClick={() => onPageChange(page - 1)}
          className="text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Page Numbers */}
        {getPages().map((item, index) =>
          item === '...' ? (
            <span
              key={`ellipsis-${index}`}
              className="px-2 text-muted-foreground"
            >
              ...
            </span>
          ) : (
            <Button
              key={item}
              type="button"
              variant={item === page ? 'default' : 'outline'}
              size="icon"
              disabled={disabled}
              onClick={() => onPageChange(item)}
              className={cn(
                'h-9 w-9',
                item !== page && 'text-muted-foreground hover:text-foreground',
                item === page && 'pointer-events-none',
              )}
            >
              {item}
            </Button>
          ),
        )}

        {/* Next */}
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={!canNext || disabled}
          onClick={() => onPageChange(page + 1)}
          className="text-muted-foreground hover:text-foreground"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
