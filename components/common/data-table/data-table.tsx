
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
  minTableWidth?: number | string
}

export function DataTable<TData extends RowData, TValue>({
  columns,
  data,
  className,
  isLoading = false,
  emptyMessage = 'No data found.',
  minTableWidth = '100%',
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    defaultColumn: {
      size: 180,
      minSize: 80,
      maxSize: 600,
    },
  })

  const totalWidth = table
    .getVisibleLeafColumns()
    .reduce((total, column) => total + column.getSize(), 0)

  const getColumnStyle = (size: number) => ({
    width: `${size}px`,
    minWidth: `${size}px`,
    maxWidth: `${size}px`,
  })

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border bg-background text-foreground shadow-sm',
        className,
      )}
    >
      {/* Horizontal Scroll Container */}
      <div
        className="
          custom-scroll
          w-full
          overflow-x-auto
          overflow-y-hidden
          overscroll-x-contain
          scroll-smooth
          touch-pan-x
        "
        style={{
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <Table
          className="table-fixed bg-background text-foreground"
          style={{
            width: `${Math.max(totalWidth, 0)}px`,
            minWidth: minTableWidth,
          }}
        >
          {/* Header */}
          <TableHeader className="sticky top-0 z-10 bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b bg-gray-50 hover:bg-gray-50"
              >
                {headerGroup.headers.map((header) => {
                  const size = header.getSize()

                  return (
                    <TableHead
                      key={header.id}
                      style={getColumnStyle(size)}
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
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>

          {/* Body */}
          <TableBody className="bg-background">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  className="bg-background hover:bg-background"
                >
                  {table.getVisibleLeafColumns().map((column) => (
                    <TableCell
                      key={column.id}
                      style={getColumnStyle(column.getSize())}
                      className="h-14 px-4 align-middle"
                    >
                      <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length > 0 ? (
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
                      style={getColumnStyle(cell.column.getSize())}
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
                  colSpan={table.getVisibleLeafColumns().length}
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
