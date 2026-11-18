
"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import { format, isValid } from "date-fns";
import {
  CalendarDays,
  Mail,
  Pencil,
  Phone,
  Trash2,
  UserRound,
} from "lucide-react";

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
    // Faculty Name
    {
      accessorKey: "fullName",
      header: () => (
        <div className="flex items-center gap-2">
          <UserRound className="size-4 text-muted-foreground" />
          Faculty Name
        </div>
      ),
      size: 220,
      minSize: 180,
      maxSize: 300,
      cell: ({ row }) => (
        <div className="flex min-w-0 items-center gap-2">
          <UserRound className="size-4 shrink-0 text-muted-foreground md:hidden" />

          <span className="font-semibold">
            {row.original.fullName || "Unnamed faculty"}
          </span>
        </div>
      ),
    },

    // Email Address
    {
      accessorKey: "email",
      header: () => (
        <div className="flex items-center gap-2">
          <Mail className="size-4 text-muted-foreground" />
          Email Address
        </div>
      ),
      size: 280,
      minSize: 220,
      maxSize: 400,
      cell: ({ row }) => (
        <div className="flex min-w-0 items-center gap-2">
          <Mail className="size-4 shrink-0 text-muted-foreground md:hidden" />

          <span className="break-all">
            {row.original.email || "—"}
          </span>
        </div>
      ),
    },

    // Mobile Number
    {
      accessorKey: "mobile",
      header: () => (
        <div className="flex items-center gap-2">
          <Phone className="size-4 text-muted-foreground" />
          Mobile Number
        </div>
      ),
      size: 170,
      minSize: 140,
      maxSize: 220,
      cell: ({ row }) => (
        <div className="flex items-center gap-2 whitespace-nowrap">
          <Phone className="size-4 shrink-0 text-muted-foreground md:hidden" />

          <span>{row.original.mobile || "—"}</span>
        </div>
      ),
    },

    // Created At
    {
      accessorKey: "createdAt",
      header: () => (
        <div className="flex items-center gap-2">
          <CalendarDays className="size-4 text-muted-foreground" />
          Created At
        </div>
      ),
      size: 160,
      minSize: 140,
      maxSize: 200,
      cell: ({ row }) => (
        <div className="flex items-center gap-2 whitespace-nowrap">
          <CalendarDays className="size-4 shrink-0 text-muted-foreground md:hidden" />

          <span>{formatDate(row.original.createdAt)}</span>
        </div>
      ),
    },

    // Updated At
    {
      accessorKey: "updatedAt",
      header: () => (
        <div className="flex items-center gap-2">
          <CalendarDays className="size-4 text-muted-foreground" />
          Updated At
        </div>
      ),
      size: 160,
      minSize: 140,
      maxSize: 200,
      cell: ({ row }) => (
        <div className="flex items-center gap-2 whitespace-nowrap">
          <CalendarDays className="size-4 shrink-0 text-muted-foreground md:hidden" />

          <span>{formatDate(row.original.updatedAt)}</span>
        </div>
      ),
    },

    // Actions
    {
      id: "actions",
      header: "Actions",
      size: 100,
      minSize: 90,
      maxSize: 120,
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
