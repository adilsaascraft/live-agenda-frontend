
"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import { format, isValid } from "date-fns";
import {
  CalendarDays,
  Clock,
  Pencil,
  Trash2,
  Users,
  Building2,
  Layers,
  FileText,
  Phone,
} from "lucide-react";

import { RowActionsDropdown } from "@/components/common/row-actions-dropdown";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

import type {
  Session,
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

function formatSessionDate(value: string): string {
  if (!value) return "—";

  const date = new Date(value);

  return isValid(date) ? format(date, "dd MMM yyyy") : "—";
}

export function createSessionColumns({
  onEdit,
  onDelete,
}: SessionColumnsOptions): ColumnDef<Session>[] {
  return [
    // Session Name
    {
      accessorKey: "sessionName",
      header: () => (
        <div className="flex items-center gap-2">
          <FileText className="size-4 text-muted-foreground" />
          Session Name
        </div>
      ),
      size: 220,
      minSize: 180,
      maxSize: 300,
      cell: ({ row }) => (
        <div className="flex min-w-0 items-center gap-2">
          <FileText className="size-4 shrink-0 text-muted-foreground md:hidden" />
          <span className="font-semibold">
            {row.original.sessionName || "Untitled session"}
          </span>
        </div>
      ),
    },

    // Hall
    {
      id: "hall",
      header: () => (
        <div className="flex items-center gap-2">
          <Building2 className="size-4 text-muted-foreground" />
          Hall
        </div>
      ),
      size: 160,
      minSize: 130,
      maxSize: 220,
      cell: ({ row }) => {
        const hall = row.original.hallId;

        return (
          <div className="flex items-center gap-2">
            <Building2 className="size-4 shrink-0 text-muted-foreground md:hidden" />
            <span
              className={
                !hall
                  ? "italic text-muted-foreground"
                  : undefined
              }
            >
              {getHallName(hall)}
            </span>
          </div>
        );
      },
    },

    // Track
    {
      id: "track",
      header: () => (
        <div className="flex items-center gap-2">
          <Layers className="size-4 text-muted-foreground" />
          Track
        </div>
      ),
      size: 160,
      minSize: 130,
      maxSize: 220,
      cell: ({ row }) => {
        const track = row.original.trackId;

        return (
          <div className="flex items-center gap-2">
            <Layers className="size-4 shrink-0 text-muted-foreground md:hidden" />
            <span
              className={
                !track
                  ? "italic text-muted-foreground"
                  : undefined
              }
            >
              {getTrackName(track)}
            </span>
          </div>
        );
      },
    },

    // Session Date
    {
      accessorKey: "sessionDate",
      header: () => (
        <div className="flex items-center gap-2">
          <CalendarDays className="size-4 text-muted-foreground" />
          Session Date
        </div>
      ),
      size: 160,
      minSize: 140,
      maxSize: 200,
      cell: ({ row }) => (
        <div className="flex items-center gap-2 whitespace-nowrap">
          <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
          {formatSessionDate(row.original.sessionDate)}
        </div>
      ),
    },

    // Time
    {
      id: "time",
      header: () => (
        <div className="flex items-center gap-2">
          <Clock className="size-4 text-muted-foreground" />
          Time
        </div>
      ),
      size: 180,
      minSize: 150,
      maxSize: 220,
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

  
    // Chairpersons
{
  id: "chairperson",
  header: () => (
    <div className="flex items-center gap-2">
      <Users className="size-4 text-muted-foreground" />
      Chairpersons
    </div>
  ),
  size: 280,
  minSize: 220,
  maxSize: 380,
  cell: ({ row }) => {
    const chairpersons = row.original.chairperson;

    if (!Array.isArray(chairpersons) || chairpersons.length === 0) {
      return (
        <div className="flex items-center gap-2">
          <Users className="size-4 shrink-0 text-muted-foreground md:hidden" />
          <span className="text-sm italic text-muted-foreground">
            No chairperson assigned
          </span>
        </div>
      );
    }

    return (
      <div className="flex max-w-xs flex-col gap-2">
        {chairpersons.map((person, index) => {
          const isString = typeof person === "string";

          const name = isString
            ? "Faculty unavailable"
            : person?.fullName || "Deleted faculty";

          const mobile = isString ? "" : person?.mobile || "";

          const isUnavailable =
            name.startsWith("Deleted") ||
            name.includes("unavailable");

          return (
            <div
              key={
                isString
                  ? `${person}-${index}`
                  : person._id || index
              }
              className="rounded-md border border-sky-100 bg-sky-50 px-3 py-2"
            >
              <div className="flex items-start gap-2">
                {/* Icons */}
                <div className="flex shrink-0 flex-col gap-1.5">
                  <Users className="mt-0.5 size-4 text-sky-600" />

                  {mobile && (
                    <Phone className="size-3.5 text-sky-600" />
                  )}
                </div>

                {/* Details */}
                <div className="flex min-w-0 flex-col gap-1">
                  <span
                    className={
                      isUnavailable
                        ? "text-sm italic text-muted-foreground"
                        : "text-sm font-medium text-sky-950"
                    }
                  >
                    {name}
                  </span>

                  {mobile && (
                    <span className="text-xs leading-4 text-sky-700">
                      {mobile}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  },
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
