
"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import { CalendarDays, Clock3, Users, Pencil, Trash2 } from "lucide-react";

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

function getFacultyNames(
  faculty: TopicReference<TopicFaculty>[],
): string {
  if (!Array.isArray(faculty) || faculty.length === 0) return "—";

  return (
    faculty
      .map((item) =>
        item && typeof item !== "string" ? item.fullName : null,
      )
      .filter(Boolean)
      .join(", ") || "—"
  );
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
    return <span className="text-sm text-muted-foreground">—</span>;
  }

  return (
    <div className="max-w-56 space-y-1">
      {faculty.map((item, index) => {
        if (!item || typeof item === "string") return null;

        return (
          <div
            key={item._id || index}
            className="rounded-md border border-border/60 bg-muted/30 px-2.5 py-1.5 text-xs font-medium"
          >
            {item.fullName}
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
    {
      accessorKey: "topicName",
      header: "Topic",
      cell: ({ row }) => (
        <div className="min-w-48">
          <p className="font-semibold">{row.original.topicName}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {row.original.topicType}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "sessionId",
      header: "Session",
      cell: ({ row }) => (
        <div className="flex min-w-48 items-start gap-2">
          <CalendarDays className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <span className="text-sm">
            {getSessionName(row.original.sessionId)}
          </span>
        </div>
      ),
    },
    {
      id: "schedule",
      header: "Schedule",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 whitespace-nowrap">
          <Clock3 className="size-4 shrink-0 text-muted-foreground" />
          <span className="text-sm">
            {row.original.startTime} – {row.original.endTime}
          </span>
        </div>
      ),
    },
    {
      id: "faculty",
      header: () => <AssignmentHeader>Faculty</AssignmentHeader>,
      enableSorting: false,
      cell: ({ row }) => (
        <AssignmentCell faculty={row.original.facultyId} />
      ),
    },
    {
      id: "moderator",
      header: () => <AssignmentHeader>Moderator</AssignmentHeader>,
      enableSorting: false,
      cell: ({ row }) => (
        <AssignmentCell faculty={row.original.moderatorId} />
      ),
    },
    {
      id: "panelist",
      header: () => <AssignmentHeader>Panelist</AssignmentHeader>,
      enableSorting: false,
      cell: ({ row }) => (
        <AssignmentCell faculty={row.original.panelistId} />
      ),
    },
    {
      id: "expertPanelist",
      header: () => <AssignmentHeader>Expert Panelist</AssignmentHeader>,
      enableSorting: false,
      cell: ({ row }) => (
        <AssignmentCell faculty={row.original.expertPanelistId} />
      ),
    },
    {
  id: "actions",
  header: "Actions",
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
