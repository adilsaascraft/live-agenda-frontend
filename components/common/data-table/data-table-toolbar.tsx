'use client'

import { motion } from 'framer-motion'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { cn } from '@/lib/utils'

import type { DataTableToolbarProps } from './types'

import { DataTableSearch } from './data-table-search'
import { DataTableSort } from './data-table-sort'

export function DataTableToolbar({
  search,
  sort,
  filters,
  className,
  rightAction,
}: DataTableToolbarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.2,
        ease: 'easeOut',
      }}
      className={cn('rounded-xl border p-4 shadow-sm', className)}
    >
      <div className="flex flex-col gap-4">
        {/* ------------------------------------------------------------------ */}
        {/* Main Toolbar                                                       */}
        {/* ------------------------------------------------------------------ */}

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* ---------------------------------------------------------------- */}
          {/* Left Section                                                     */}
          {/* ---------------------------------------------------------------- */}

          <div className="flex flex-1 flex-col gap-3 lg:flex-row lg:items-center">
            {search && (
              <div className="w-full lg:max-w-md">
                <DataTableSearch {...search} />
              </div>
            )}

            {filters?.filters?.length ? (
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                {filters.filters.map((filter) => {
                  const selectedOption = filter.options.find(
                    (option) => option.value === filter.value,
                  )

                  return (
                    <div key={filter.key} className="w-full sm:w-52">
                      <Select
                        value={filter.value}
                        onValueChange={(value) =>
                          filters.onChange(filter.key, value ?? '')
                        }
                        disabled={filters.disabled}
                      >
                        <SelectTrigger className="h-10 w-full text-muted-foreground hover:text-foreground">
                          <SelectValue>
                            {selectedOption?.label ??
                              filter.placeholder ??
                              filter.label}
                          </SelectValue>
                        </SelectTrigger>

                        <SelectContent>
                          {filter.options.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                              className="text-muted-foreground focus:text-foreground"
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )
                })}
              </div>
            ) : null}
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* Right Section                                                    */}
          {/* ---------------------------------------------------------------- */}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {rightAction}

            {sort && (
              <div className="w-full sm:w-60">
                <DataTableSort {...sort} />
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
