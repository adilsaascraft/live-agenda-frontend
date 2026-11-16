import type { ReactNode } from 'react'

/* -------------------------------------------------------------------------- */
/* Search                                                                      */
/* -------------------------------------------------------------------------- */

export interface DataTableSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  debounce?: number
  disabled?: boolean
  isLoading?: boolean
}

/* -------------------------------------------------------------------------- */
/* Sort                                                                        */
/* -------------------------------------------------------------------------- */

export interface DataTableSortOption {
  label: string
  value: string
}

export interface DataTableSortProps {
  value: string | null
  options: DataTableSortOption[]
  onChange: (value: string | null) => void
  placeholder?: string
  disabled?: boolean
}

/* -------------------------------------------------------------------------- */
/* Filter                                                                      */
/* -------------------------------------------------------------------------- */

export interface DataTableFilterOption {
  label: string
  value: string
}

export interface DataTableFilter {
  key: string
  label: string
  value: string
  placeholder?: string
  options: DataTableFilterOption[]
}

export interface DataTableFiltersProps {
  filters: DataTableFilter[]
  onChange: (key: string, value: string) => void
  disabled?: boolean
}

/* -------------------------------------------------------------------------- */
/* Toolbar                                                                     */
/* -------------------------------------------------------------------------- */

export interface DataTableToolbarProps {
  search?: DataTableSearchProps

  sort?: DataTableSortProps

  filters?: DataTableFiltersProps

  rightAction?: ReactNode

  className?: string
}

/* -------------------------------------------------------------------------- */
/* Pagination                                                                  */
/* -------------------------------------------------------------------------- */

export interface DataTablePaginationProps {
  page: number

  totalPages: number

  totalItems: number

  pageSize: number

  onPageChange: (page: number) => void

  disabled?: boolean
}
