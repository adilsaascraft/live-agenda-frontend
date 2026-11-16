
"use client";

import { useCallback, useMemo, useState } from "react";
import { CalendarDays, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ConfirmDialog } from "@/components/common/confirm-dialog";

import { DataTable } from "@/components/common/data-table/data-table";
import { DataTablePagination } from "@/components/common/data-table/data-table-pagination";
import { DataTableSearch } from "@/components/common/data-table/data-table-search";

import { EntityPageHeader } from "@/components/common/entity-page-header";
import EntitySkeleton from "@/components/common/entity-skeleton";
import { ErrorState } from "@/components/common/error-state";

import {
  useCreateSession,
  useDeleteSession,
  useSessionFaculties,
  useSessionHalls,
  useSessions,
  useSessionTracks,
  useUpdateSession,
} from "@/features/session/session.hooks";

import { SESSION_CONFIG } from "@/features/session/session.config";
import { createSessionColumns } from "@/features/session/components/SessionColumns";
import { SessionDialog } from "@/features/session/components/SessionDialog";
import { SessionForm } from "@/features/session/components/SessionForm";

import type {
  Session,
  SessionFormValues,
} from "@/features/session/session.types";

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

const SESSION_SORT_OPTIONS = [
  { label: "Session Date", value: "sessionDate" },
  { label: "Session Name", value: "sessionName" },
  { label: "Start Time", value: "startTime" },
  { label: "End Time", value: "endTime" },
  { label: "Created At", value: "createdAt" },
  { label: "Updated At", value: "updatedAt" },
];

const SORT_ORDER_OPTIONS = [
  { label: "Descending", value: "desc" },
  { label: "Ascending", value: "asc" },
] as const;

type SortOrder = (typeof SORT_ORDER_OPTIONS)[number]["value"];

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function serializeSessionDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  // Preserve the selected calendar date at India local midnight.
  return `${year}-${month}-${day}T00:00:00+05:30`;
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function SessionsPage() {
  /* ------------------------------------------------------------------------ */
  /* State                                                                    */
  /* ------------------------------------------------------------------------ */

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [sortBy, setSortBy] = useState("sessionDate");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [editing, setEditing] = useState<Session | null>(null);
  const [deleting, setDeleting] = useState<Session | null>(null);

  const [actionError, setActionError] = useState<string | null>(null);

  /* ------------------------------------------------------------------------ */
  /* Queries                                                                  */
  /* ------------------------------------------------------------------------ */

  const {
    data: response,
    isPending,
    isFetching,
    isError,
    error,
    refetch,
  } = useSessions({
    page,
    limit: SESSION_CONFIG.pageSize,
    search,
    sortBy,
    sortOrder,
  });

  const hallsQuery = useSessionHalls();
  const tracksQuery = useSessionTracks();
  const facultiesQuery = useSessionFaculties();

  /* ------------------------------------------------------------------------ */
  /* Mutations                                                                */
  /* ------------------------------------------------------------------------ */

  const createMutation = useCreateSession();
  const updateMutation = useUpdateSession();
  const deleteMutation = useDeleteSession();

  /* ------------------------------------------------------------------------ */
  /* Derived Data                                                             */
  /* ------------------------------------------------------------------------ */

  const sessions = response?.data?.sessions ?? [];
  const pagination = response?.pagination;

  const halls = hallsQuery.data?.data?.halls ?? [];
  const tracks = tracksQuery.data?.data?.tracks ?? [];
  const faculties = facultiesQuery.data?.data?.faculties ?? [];

  const isSaving =
    createMutation.isPending || updateMutation.isPending;

  const isLookupLoading =
    hallsQuery.isPending ||
    tracksQuery.isPending ||
    facultiesQuery.isPending;

  const lookupError =
    hallsQuery.error ||
    tracksQuery.error ||
    facultiesQuery.error;

  /* ------------------------------------------------------------------------ */
  /* Search                                                                   */
  /* ------------------------------------------------------------------------ */

  // DataTableSearch handles the debounce internally, just like Faculties.
  const handleSearchChange = useCallback((value: string) => {
    setPage(1);
    setSearch(value.trim());
  }, []);

  /* ------------------------------------------------------------------------ */
  /* Sorting                                                                  */
  /* ------------------------------------------------------------------------ */

  const handleSortByChange = useCallback((value: string | null) => {
    if (!value) return;

    setPage(1);
    setSortBy(value);
  }, []);

  const handleSortOrderChange = useCallback((value: string | null) => {
    if (value !== "asc" && value !== "desc") return;

    setPage(1);
    setSortOrder(value);
  }, []);

  /* ------------------------------------------------------------------------ */
  /* Dialog Handlers                                                          */
  /* ------------------------------------------------------------------------ */

  const openCreateDialog = useCallback(() => {
    setEditing(null);
    setActionError(null);
    setDialogOpen(true);
  }, []);

  const openEditDialog = useCallback((session: Session) => {
    setEditing(session);
    setActionError(null);
    setDialogOpen(true);
  }, []);

  const closeSessionDialog = (open: boolean) => {
    if (isSaving) return;

    setDialogOpen(open);

    if (!open) {
      setEditing(null);
      setActionError(null);
    }
  };

  const openDeleteDialog = useCallback((session: Session) => {
    setDeleting(session);
    setActionError(null);
    setConfirmOpen(true);
  }, []);

  /* ------------------------------------------------------------------------ */
  /* Columns                                                                  */
  /* ------------------------------------------------------------------------ */

  const columns = useMemo(
    () =>
      createSessionColumns({
        onEdit: openEditDialog,
        onDelete: openDeleteDialog,
      }),
    [openEditDialog, openDeleteDialog],
  );

  /* ------------------------------------------------------------------------ */
  /* Create / Update                                                          */
  /* ------------------------------------------------------------------------ */

  const handleSubmit = async (values: SessionFormValues) => {
    setActionError(null);

    if (!values.sessionDate) {
      setActionError("Please select a session date.");
      return;
    }

    const payload = {
      sessionName: values.sessionName.trim(),
      hallId: values.hallId,
      trackId: values.trackId,
      sessionDate: serializeSessionDate(values.sessionDate),
      startTime: values.startTime.trim().toUpperCase(),
      endTime: values.endTime.trim().toUpperCase(),
      chairperson: values.chairperson,
    };

    try {
      if (editing) {
        await updateMutation.mutateAsync({
          id: editing._id,
          payload,
        });
      } else {
        await createMutation.mutateAsync(payload);
        setPage(1);
      }

      setDialogOpen(false);
      setEditing(null);
      setActionError(null);
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Unable to save session. Please try again.",
      );
    }
  };

  /* ------------------------------------------------------------------------ */
  /* Delete                                                                   */
  /* ------------------------------------------------------------------------ */

  const handleDelete = async () => {
    if (!deleting) return;

    try {
      await deleteMutation.mutateAsync(deleting._id);

      // If the deleted record was the only one on this page,
      // move back to the previous page.
      if (sessions.length === 1 && page > 1) {
        setPage((currentPage) => currentPage - 1);
      }

      setConfirmOpen(false);
      setDeleting(null);
      setActionError(null);
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Unable to delete session. Please try again.",
      );

      throw error;
    }
  };

  /* ------------------------------------------------------------------------ */
  /* Loading                                                                  */
  /* ------------------------------------------------------------------------ */

  if (isPending && !response) {
    return <EntitySkeleton title="Sessions" />;
  }

  /* ------------------------------------------------------------------------ */
  /* Error                                                                    */
  /* ------------------------------------------------------------------------ */

  if (isError && !response) {
    return (
      <ErrorState
        title="Failed to load sessions"
        description="Something went wrong while loading sessions."
        error={error}
        retry={() => {
          void refetch();
        }}
      />
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <>
      <div className="space-y-6">
        {/* Page Header */}
        <EntityPageHeader
          icon={<CalendarDays className="size-5 text-primary" />}
          title="Sessions"
          description="Manage event sessions, halls, tracks and chairpersons."
          actions={
            <Button onClick={openCreateDialog}>
              <Plus className="size-4" />
              Add Session
            </Button>
          }
        />

        {/* ---------------------------------------------------------------- */}
        {/* Search and Sorting                                                */}
        {/* ---------------------------------------------------------------- */}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Same shared search component and width as Faculty page */}
          <div className="w-full sm:max-w-md">
            <DataTableSearch
              value={search}
              onChange={handleSearchChange}
              placeholder="Search session name or time..."
              debounce={500}
              isLoading={isFetching}
            />
          </div>

          {/* Shadcn Select sorting controls */}
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <div className="w-full sm:w-48">
              <Select
                value={sortBy}
                onValueChange={handleSortByChange}
                disabled={isFetching}
              >
                <SelectTrigger
                  className="h-10 w-full"
                  aria-label="Sort sessions by"
                >
                  <SelectValue>
                    {SESSION_SORT_OPTIONS.find(
                      (option) => option.value === sortBy,
                    )?.label ?? "Sort by"}
                  </SelectValue>
                </SelectTrigger>

                <SelectContent>
                  {SESSION_SORT_OPTIONS.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-40">
              <Select
                value={sortOrder}
                onValueChange={handleSortOrderChange}
                disabled={isFetching}
              >
                <SelectTrigger
                  className="h-10 w-full"
                  aria-label="Sort direction"
                >
                  <SelectValue>
                    {SORT_ORDER_OPTIONS.find(
                      (option) => option.value === sortOrder,
                    )?.label ?? "Descending"}
                  </SelectValue>
                </SelectTrigger>

                <SelectContent>
                  {SORT_ORDER_OPTIONS.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Result Count                                                      */}
        {/* ---------------------------------------------------------------- */}

        <div className="text-sm text-muted-foreground">
          {search
            ? `${pagination?.total ?? 0} matching sessions`
            : `${pagination?.total ?? 0} sessions`}
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Table                                                             */}
        {/* ---------------------------------------------------------------- */}

        <DataTable
          columns={columns}
          data={sessions}
          isLoading={isFetching}
          emptyMessage={
            search
              ? "No sessions match your search."
              : "No sessions found. Create your first session."
          }
        />

        {/* ---------------------------------------------------------------- */}
        {/* Pagination                                                        */}
        {/* ---------------------------------------------------------------- */}

        {pagination && (
          <DataTablePagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            totalItems={pagination.total}
            pageSize={pagination.limit}
            onPageChange={setPage}
            disabled={isFetching}
          />
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Create / Edit Dialog                                               */}
      {/* ------------------------------------------------------------------ */}

      <SessionDialog
        open={dialogOpen}
        onOpenChange={closeSessionDialog}
        isEditing={Boolean(editing)}
        isPending={isSaving}
      >
        {actionError && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive"
          >
            {actionError}
          </div>
        )}

        {isLookupLoading ? (
          <div className="space-y-3 py-8">
            <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
            <div className="h-10 animate-pulse rounded bg-muted" />
            <div className="h-10 animate-pulse rounded bg-muted" />
            <div className="h-32 animate-pulse rounded bg-muted" />
          </div>
        ) : lookupError ? (
          <div className="space-y-3 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
            <p className="text-sm text-destructive">
              Unable to load halls, tracks or faculties. Please retry.
            </p>

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                void hallsQuery.refetch();
                void tracksQuery.refetch();
                void facultiesQuery.refetch();
              }}
            >
              Retry lookup requests
            </Button>
          </div>
        ) : (
          <SessionForm
            key={editing?._id ?? "new-session"}
            session={editing}
            halls={halls}
            tracks={tracks}
            faculties={faculties}
            isPending={isSaving}
            onSubmit={handleSubmit}
            onCancel={() => closeSessionDialog(false)}
          />
        )}
      </SessionDialog>

      {/* ------------------------------------------------------------------ */}
      {/* Delete Confirmation                                                */}
      {/* ------------------------------------------------------------------ */}

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={(open) => {
          if (deleteMutation.isPending) return;

          setConfirmOpen(open);

          if (!open) {
            setDeleting(null);
            setActionError(null);
          }
        }}
        title="Delete Session"
        description={
          deleting
            ? `Are you sure you want to delete "${deleting.sessionName}"? This action cannot be undone.`
            : "Are you sure you want to delete this session?"
        }
        confirmText="Delete Session"
        confirmVariant="destructive"
        isPending={deleteMutation.isPending}
        onConfirm={handleDelete}
      />

      {/* Delete Error */}
      {actionError && !dialogOpen && confirmOpen && (
        <p role="alert" className="text-sm text-destructive">
          {actionError}
        </p>
      )}
    </>
  );
}
