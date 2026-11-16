"use client";

import type { Row, ColumnDef } from "@tanstack/react-table";
import { format, isValid } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";

import { RowActionsDropdown } from "@/components/common/row-actions-dropdown";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

import type { MasterDataEntity } from "@/shared/master-data/types";

interface CreateMasterDataColumnsOptions<
  TEntity extends MasterDataEntity,
  TFieldKey extends keyof TEntity,
> {
  header: string;
  accessorKey: TFieldKey;
  statusAccessorKey?: keyof TEntity;
  onEdit(row: TEntity): void;
  onDelete(row: TEntity): void;
}

function formatDate(value: string): string {
  const date = new Date(value);

  return isValid(date)
    ? format(date, "dd MMM yyyy")
    : "—";
}

export function createMasterDataColumns<
  TEntity extends MasterDataEntity,
  TFieldKey extends keyof TEntity,
>({
  header,
  accessorKey,
  statusAccessorKey,
  onEdit,
  onDelete,
}: CreateMasterDataColumnsOptions<TEntity, TFieldKey>): ColumnDef<TEntity>[] {
  const columns: ColumnDef<TEntity>[] = [
    {
      accessorKey: String(accessorKey),
      header,
      cell: ({ row }) => (
        <span className="font-semibold">
          {String(row.original[accessorKey] ?? "—")}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
    {
      accessorKey: "updatedAt",
      header: "Updated At",
      cell: ({ row }) => formatDate(row.original.updatedAt),
    },
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }: { row: Row<TEntity> }) => (
        <RowActionsDropdown>
          <DropdownMenuItem
            onClick={() => onEdit(row.original)}
            className="h-10 cursor-pointer gap-2.5 font-medium"
          >
            <Pencil className="size-4" />
            <span>Edit</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            variant="destructive"
            onClick={() => onDelete(row.original)}
            className="h-10 cursor-pointer gap-2.5 font-medium"
          >
            <Trash2 className="size-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </RowActionsDropdown>
      ),
    },
  ];

  if (statusAccessorKey) {
    columns.splice(1, 0, {
      id: "status",
      header: "Status",
      enableSorting: false,
      cell: ({ row }) => {
        const status = String(
          row.original[statusAccessorKey] ?? "Unknown",
        );

        const isActive = status.toLowerCase() === "active";

        return (
          <span
            className={[
              "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
              isActive
                ? "border-primary/20 bg-primary/10 text-primary"
                : "border-border bg-muted text-muted-foreground",
            ].join(" ")}
          >
            {status}
          </span>
        );
      },
    });
  }

  return columns;
}