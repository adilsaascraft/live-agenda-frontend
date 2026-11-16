'use client'

import { ArrowUpDown } from 'lucide-react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import type { DataTableSortProps } from './types'

export function DataTableSort({
  value,
  options,
  onChange,
  placeholder = 'Sort by',
  disabled = false,
}: DataTableSortProps) {
  const selectedOption = options.find((option) => option.value === value)

  return (
    <div className="relative w-full">
      <ArrowUpDown
        className="
          pointer-events-none
          absolute
          left-3
          top-1/2
          z-10
          h-4
          w-4
          -translate-y-1/2
          text-muted-foreground
        "
      />

      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="h-10 w-full pl-10">
          <SelectValue>{selectedOption?.label ?? placeholder}</SelectValue>
        </SelectTrigger>

        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
