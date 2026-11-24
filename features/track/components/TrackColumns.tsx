"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import {
  Layers,
  Pencil,
  Phone,
  ToggleRight,
  Trash2,
  Users,
} from "lucide-react";

import { RowActionsDropdown } from "@/components/common/row-actions-dropdown";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

import type { Track, TrackStatus } from "../track.types";

interface TrackColumnsOptions {
  onEdit: (track: Track) => void;
  onDelete: (track: Track) => void;
}

function getStatusClassName(status: TrackStatus | undefined): string {
  return status === "Active"
    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
    : "border-rose-200 bg-rose-50 text-rose-700";
}

export function createTrackColumns({
  onEdit,
  onDelete,
}: TrackColumnsOptions): ColumnDef<Track>[] {
  return [
    // Track Name
    {
      accessorKey: "trackName",
      header: () => (
        <div className="flex items-center gap-2">
          <Layers className="size-4 text-muted-foreground" />
          Track Name
        </div>
      ),
      size: 240,
      minSize: 180,
      maxSize: 320,
      cell: ({ row }) => (
        <div className="flex min-w-0 items-center gap-2">
          <Layers className="size-4 shrink-0 text-muted-foreground md:hidden" />
          <span className="font-semibold">
            {row.original.trackName || "Untitled track"}
          </span>
        </div>
      ),
    },

    // Track Leaders
    {
      id: "trackLeaders",
      header: () => (
        <div className="flex items-center gap-2">
          <Users className="size-4 text-muted-foreground" />
          Track Leaders
        </div>
      ),
      size: 300,
      minSize: 220,
      maxSize: 400,
      cell: ({ row }) => {
        const leaders = row.original.trackLeaderIds;

        if (!Array.isArray(leaders) || leaders.length === 0) {
          return (
            <div className="flex items-center gap-2">
              <Users className="size-4 shrink-0 text-muted-foreground md:hidden" />
              <span className="text-sm italic text-muted-foreground">
                No track leader assigned
              </span>
            </div>
          );
        }

        return (
          <div className="flex max-w-xs flex-col gap-2">
            {leaders.map((person, index) => {
              const isString = typeof person === "string";

              const name = isString
                ? "Faculty unavailable"
                : person?.fullName || "Deleted faculty";

              const mobile = isString ? "" : person?.mobile || "";

              const isUnavailable =
                name.startsWith("Deleted") || name.includes("unavailable");

              return (
                <div
                  key={isString ? `${person}-${index}` : person._id || index}
                  className="rounded-md border border-sky-100 bg-sky-50 px-3 py-2"
                >
                  <div className="flex items-start gap-2">
                    {/* Icons */}
                    <div className="flex shrink-0 flex-col gap-1.5">
                      <Users className="mt-0.5 size-4 text-sky-600" />

                      {mobile && <Phone className="size-3.5 text-sky-600" />}
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

    // Status
    {
      accessorKey: "status",
      header: () => (
        <div className="flex items-center gap-2">
          <ToggleRight className="size-4 text-muted-foreground" />
          Status
        </div>
      ),
      size: 140,
      minSize: 110,
      maxSize: 170,
      cell: ({ row }) => (
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusClassName(
            row.original.status,
          )}`}
        >
          {row.original.status || "—"}
        </span>
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
      cell: ({ row }: { row: Row<Track> }) => (
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
