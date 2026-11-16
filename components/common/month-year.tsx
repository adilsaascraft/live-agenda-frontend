'use client'

import { Control, FieldPath, FieldValues } from 'react-hook-form'
import { cn } from '@/lib/utils'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface MonthYearFieldProps<T extends FieldValues> {
  control: Control<T>

  monthName: FieldPath<T>
  yearName: FieldPath<T>

  monthLabel?: string
  yearLabel?: string

  monthPlaceholder?: string
  yearPlaceholder?: string

  startYear?: number
  endYear?: number

  disabled?: boolean
  required?: boolean

  className?: string
}

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export function MonthYearField<T extends FieldValues>({
  control,
  monthName,
  yearName,
  monthLabel = 'Month',
  yearLabel = 'Year',
  monthPlaceholder = 'Select Month',
  yearPlaceholder = 'Select Year',
  startYear = 2020,
  endYear = 2050,
  disabled = false,
  required = false,
  className,
}: MonthYearFieldProps<T>) {
  const years = Array.from({ length: endYear - startYear + 1 }, (_, index) =>
    (startYear + index).toString(),
  )

  return (
    <div className={cn('grid grid-cols-1 gap-4 md:grid-cols-2', className)}>
      {/* Month */}
      <FormField
        control={control}
        name={monthName}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {monthLabel}
              {required && <span className="ml-1 text-destructive">*</span>}
            </FormLabel>

            <Select
              value={field.value ?? ''}
              onValueChange={field.onChange}
              disabled={disabled}
            >
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={monthPlaceholder} />
                </SelectTrigger>
              </FormControl>

              <SelectContent className="max-h-72">
                {MONTHS.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <FormMessage />
          </FormItem>
        )}
      />

      {/* Year */}
      <FormField
        control={control}
        name={yearName}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {yearLabel}
              {required && <span className="ml-1 text-destructive">*</span>}
            </FormLabel>

            <Select
              value={field.value ?? ''}
              onValueChange={field.onChange}
              disabled={disabled}
            >
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={yearPlaceholder} />
                </SelectTrigger>
              </FormControl>

              <SelectContent className="max-h-72">
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
