
'use client'

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type RowData,
} from '@tanstack/react-table'

import { cn } from '@/lib/utils'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface DataTableProps<TData extends RowData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]

  className?: string

  isLoading?: boolean

  emptyMessage?: string
}

export function DataTable<TData extends RowData, TValue>({
  columns,
  data,
  className,
  isLoading = false,
  emptyMessage = 'No data found.',
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border bg-background text-foreground shadow-sm',
        className,
      )}
    >
      {/* Horizontal Scroll */}

      <div className="custom-scroll overflow-x-auto">
        <Table className="w-max min-w-full bg-background text-foreground">
          {/* Header */}

          <TableHeader className="sticky top-0 z-10 bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b bg-gray-50 hover:bg-gray-50"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{
                      width: header.getSize(),
                      minWidth: header.column.columnDef.minSize,
                      maxWidth: header.column.columnDef.maxSize,
                    }}
                    className="
    h-14
    whitespace-normal
    break-words
    px-4
    text-sm
    font-semibold
    text-gray-700
    bg-gray-50
  "
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          {/* Body */}

          <TableBody className="bg-background">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow
                  key={index}
                  className="bg-background hover:bg-background"
                >
                  {columns.map((_, columnIndex) => (
                    <TableCell
                      key={columnIndex}
                      className="
                        h-14
                        px-6
                        align-middle
                        bg-background
                      "
                    >
                      <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="
                    bg-background
                    text-foreground
                    transition-colors
                    hover:bg-muted/40
                  "
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        width: cell.column.getSize(),
                        minWidth: cell.column.columnDef.minSize,
                        maxWidth: cell.column.columnDef.maxSize,
                      }}
                      className="
    whitespace-normal
    break-words
    px-4
    py-3
    align-middle
    text-sm
    text-foreground
  "
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="bg-background hover:bg-background">
                <TableCell
                  colSpan={columns.length}
                  className="
                    h-32
                    bg-background
                    text-center
                    text-sm
                    text-muted-foreground
                  "
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
