
"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import {
  CalendarDays,
  Clock3,
  Users,
  Phone,
  Pencil,
  Trash2,
  FileText,
} from "lucide-react";

import { RowActionsDropdown } from "@/components/common/row-actions-dropdown";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

import type {
  Topic,
  TopicFaculty,
  TopicReference,
  TopicSession,
} from "../topic.types";

interface TopicColumnsOptions {
  onEdit: (topic: Topic) => void;
  onDelete: (topic: Topic) => void;
}

function getSessionName(
  session: TopicReference<TopicSession>,
): string {
  if (!session || typeof session === "string") return "—";
  return session.sessionName || "—";
}

function AssignmentHeader({ children }: { children: string }) {
  return (
    <div className="flex min-w-28 items-center gap-2 rounded-md border border-border/70 bg-muted/60 px-3 py-2 text-xs font-bold text-foreground">
      <Users className="size-3.5 shrink-0 text-muted-foreground" />
      <span>{children}</span>
    </div>
  );
}

function AssignmentCell({
  faculty,
}: {
  faculty: TopicReference<TopicFaculty>[];
}) {
  if (!Array.isArray(faculty) || faculty.length === 0) {
    return (
      <span className="text-sm italic text-muted-foreground">
        No faculty assigned
      </span>
    );
  }

  return (
    <div className="flex max-w-xs flex-col gap-2">
      {faculty.map((person, index) => {
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
                : person?._id || index
            }
            className="rounded-md border border-sky-100 bg-sky-50 px-3 py-2"
          >
            <div className="flex items-start gap-2">
              {/* Fixed icon column */}
              <div className="flex w-4 shrink-0 flex-col items-center gap-1.5">
                <Users className="mt-0.5 size-4 text-sky-600" />

                {mobile && (
                  <Phone className="size-3.5 text-sky-600" />
                )}
              </div>

              {/* Name and mobile */}
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
}

export function createTopicColumns({
  onEdit,
  onDelete,
}: TopicColumnsOptions): ColumnDef<Topic>[] {
  return [
    // Topic
    {
      accessorKey: "topicName",
      header: () => (
        <div className="flex items-center gap-2">
          <FileText className="size-4 text-muted-foreground" />
          Topic
        </div>
      ),
      size: 230,
      minSize: 180,
      maxSize: 320,
      cell: ({ row }) => (
        <div className="flex min-w-0 items-start gap-2">
          <FileText className="mt-0.5 size-4 shrink-0 text-muted-foreground md:hidden" />

          <div className="min-w-0">
            <p className="font-semibold">
              {row.original.topicName || "Untitled topic"}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {row.original.topicType || "—"}
            </p>
          </div>
        </div>
      ),
    },

    // Session
    {
      accessorKey: "sessionId",
      header: () => (
        <div className="flex items-center gap-2">
          <CalendarDays className="size-4 text-muted-foreground" />
          Session
        </div>
      ),
      size: 190,
      minSize: 150,
      maxSize: 260,
      cell: ({ row }) => (
        <div className="flex min-w-0 items-start gap-2">
          <CalendarDays className="mt-0.5 size-4 shrink-0 text-muted-foreground md:hidden" />

          <span className="text-sm">
            {getSessionName(row.original.sessionId)}
          </span>
        </div>
      ),
    },

    // Schedule
    {
      id: "schedule",
      header: () => (
        <div className="flex items-center gap-2">
          <Clock3 className="size-4 text-muted-foreground" />
          Schedule
        </div>
      ),
      size: 180,
      minSize: 150,
      maxSize: 220,
      cell: ({ row }) => (
        <div className="flex items-center gap-2 whitespace-nowrap">
          <Clock3 className="size-4 shrink-0 text-muted-foreground md:hidden" />

          <span className="text-sm">
            {row.original.startTime || "—"} –{" "}
            {row.original.endTime || "—"}
          </span>
        </div>
      ),
    },

    // Faculty
    {
      id: "faculty",
      header: () => <AssignmentHeader>Faculty</AssignmentHeader>,
      size: 220,
      minSize: 170,
      maxSize: 300,
      enableSorting: false,
      cell: ({ row }) => (
        <AssignmentCell faculty={row.original.facultyId} />
      ),
    },

    // Moderator
    {
      id: "moderator",
      header: () => <AssignmentHeader>Moderator</AssignmentHeader>,
      size: 220,
      minSize: 170,
      maxSize: 300,
      enableSorting: false,
      cell: ({ row }) => (
        <AssignmentCell faculty={row.original.moderatorId} />
      ),
    },

    // Panelist
    {
      id: "panelist",
      header: () => <AssignmentHeader>Panelist</AssignmentHeader>,
      size: 220,
      minSize: 170,
      maxSize: 300,
      enableSorting: false,
      cell: ({ row }) => (
        <AssignmentCell faculty={row.original.panelistId} />
      ),
    },

    // Expert Panelist
    {
      id: "expertPanelist",
      header: () => (
        <AssignmentHeader>Expert Panelist</AssignmentHeader>
      ),
      size: 220,
      minSize: 170,
      maxSize: 300,
      enableSorting: false,
      cell: ({ row }) => (
        <AssignmentCell faculty={row.original.expertPanelistId} />
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
      cell: ({ row }: { row: Row<Topic> }) => (
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
