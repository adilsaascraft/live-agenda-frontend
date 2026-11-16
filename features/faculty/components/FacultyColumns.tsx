"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import { format, isValid } from "date-fns";
import { Mail, Pencil, Phone, Trash2 } from "lucide-react";

import { RowActionsDropdown } from "@/components/common/row-actions-dropdown";
import { RowActionItem } from "@/components/common/row-action-item";

import type { Faculty } from "../type";

interface FacultyColumnsOptions {
  onEdit: (faculty: Faculty) => void;
  onDelete: (faculty: Faculty) => void;
}

function formatDate(value?: string): string {
  if (!value) return "—";

  const date = new Date(value);

  return isValid(date)
    ? format(date, "dd MMM yyyy")
    : "—";
}

export function createFacultyColumns({
  onEdit,
  onDelete,
}: FacultyColumnsOptions): ColumnDef<Faculty>[] {
  return [
    {
      accessorKey: "fullName",
      header: "Faculty Name",
      cell: ({ row }) => (
        <span className="font-semibold">
          {row.original.fullName}
        </span>
      ),
    },
    {
      accessorKey: "email",
      header: "Email Address",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Mail className="size-4 shrink-0 text-muted-foreground" />

          <span>{row.original.email}</span>
        </div>
      ),
    },
    {
      accessorKey: "mobile",
      header: "Mobile Number",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Phone className="size-4 shrink-0 text-muted-foreground" />

          <span>{row.original.mobile}</span>
        </div>
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
      cell: ({ row }: { row: Row<Faculty> }) => (
        <RowActionsDropdown>
          <RowActionItem
            icon={<Pencil className="size-4" />}
            onClick={() => onEdit(row.original)}
          >
            Edit
          </RowActionItem>

          <RowActionItem
            icon={<Trash2 className="size-4" />}
            onClick={() => onDelete(row.original)}
            destructive
          >
            Delete
          </RowActionItem>
        </RowActionsDropdown>
      ),
    },
  ];
}