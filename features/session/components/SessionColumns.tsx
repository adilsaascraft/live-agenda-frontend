
"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import { format, isValid } from "date-fns";
import {
  CalendarDays,
  Clock,
  Pencil,
  Trash2,
  Users,
} from "lucide-react";

import { RowActionsDropdown } from "@/components/common/row-actions-dropdown";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

import type {
  Session,
  SessionChairperson,
  SessionHall,
  SessionTrack,
} from "../session.types";

interface SessionColumnsOptions {
  onEdit: (session: Session) => void;
  onDelete: (session: Session) => void;
}

function getHallName(
  value: SessionHall | string | null | undefined,
): string {
  if (!value) return "Deleted hall";

  if (typeof value === "string") return "Hall unavailable";

  return value.hallName || "Deleted hall";
}

function getTrackName(
  value: SessionTrack | string | null | undefined,
): string {
  if (!value) return "Deleted track";

  if (typeof value === "string") return "Track unavailable";

  return value.trackName || "Deleted track";
}

function getChairpersonNames(
  values: (
    | SessionChairperson
    | string
    | null
    | undefined
  )[] | null | undefined,
): string[] {
  if (!Array.isArray(values) || values.length === 0) {
    return ["No chairperson available"];
  }

  return values.map((item) => {
    if (!item) return "Deleted faculty";

    if (typeof item === "string") {
      return "Faculty unavailable";
    }

    return item.fullName || "Deleted faculty";
  });
}

function formatSessionDate(value: string): string {
  if (!value) return "—";

  const date = new Date(value);

  return isValid(date)
    ? format(date, "dd MMM yyyy")
    : "—";
}

export function createSessionColumns({
  onEdit,
  onDelete,
}: SessionColumnsOptions): ColumnDef<Session>[] {
  return [
    {
      accessorKey: "sessionName",
      header: "Session Name",
      cell: ({ row }) => (
        <span className="font-semibold">
          {row.original.sessionName || "Untitled session"}
        </span>
      ),
    },
    {
      id: "hall",
      header: "Hall",
      cell: ({ row }) => {
        const hall = row.original.hallId;
        const isMissing = !hall;

        return (
          <span
            className={
              isMissing
                ? "text-muted-foreground italic"
                : undefined
            }
          >
            {getHallName(hall)}
          </span>
        );
      },
    },
    {
      id: "track",
      header: "Track",
      cell: ({ row }) => {
        const track = row.original.trackId;
        const isMissing = !track;

        return (
          <span
            className={
              isMissing
                ? "text-muted-foreground italic"
                : undefined
            }
          >
            {getTrackName(track)}
          </span>
        );
      },
    },
    {
      accessorKey: "sessionDate",
      header: "Session Date",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 whitespace-nowrap">
          <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
          {formatSessionDate(row.original.sessionDate)}
        </div>
      ),
    },
    {
      id: "time",
      header: "Time",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 whitespace-nowrap">
          <Clock className="size-4 shrink-0 text-muted-foreground" />
          <span>
            {row.original.startTime || "—"} –{" "}
            {row.original.endTime || "—"}
          </span>
        </div>
      ),
    },
    {
      id: "chairperson",
      header: "Chairpersons",
      cell: ({ row }) => {
        const names = getChairpersonNames(
          row.original.chairperson,
        );

        return (
          <div className="flex max-w-xs items-start gap-2">
            <Users className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

            <div className="flex flex-col gap-1">
              {names.map((name, index) => (
                <span
                  key={`${name}-${index}`}
                  className={
                    name.startsWith("Deleted") ||
                    name.includes("unavailable")
                      ? "text-muted-foreground italic"
                      : undefined
                  }
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }: { row: Row<Session> }) => (
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
}
