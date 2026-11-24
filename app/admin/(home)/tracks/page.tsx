"use client";

import { useCallback, useMemo, useState } from "react";
import { Layers, Plus } from "lucide-react";

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
  useCreateTrack,
  useDeleteTrack,
  useTrackFaculties,
  useTracks,
  useUpdateTrack,
} from "@/features/track/track.hooks";

import {
  TRACK_CONFIG,
  TRACK_STATUS_OPTIONS,
} from "@/features/track/track.config";
import { createTrackColumns } from "@/features/track/components/TrackColumns";
import { TrackDialog } from "@/features/track/components/TrackDialog";
import { TrackForm } from "@/features/track/components/TrackForm";

import type {
  Track,
  TrackFormValues,
  TrackStatus,
} from "@/features/track/track.types";

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

const TRACK_SORT_OPTIONS = [
  { label: "Created At", value: "createdAt" },
  { label: "Track Name", value: "trackName" },
  { label: "Status", value: "status" },
  { label: "Updated At", value: "updatedAt" },
];

const SORT_ORDER_OPTIONS = [
  { label: "Descending", value: "desc" },
  { label: "Ascending", value: "asc" },
] as const;

const STATUS_FILTER_OPTIONS = [
  { label: "All Statuses", value: "all" },
  ...TRACK_STATUS_OPTIONS,
] as const;

type SortOrder = (typeof SORT_ORDER_OPTIONS)[number]["value"];
type StatusFilter = "all" | TrackStatus;

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function TracksPage() {
  /* ------------------------------------------------------------------------ */
  /* State                                                                    */
  /* ------------------------------------------------------------------------ */

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [editing, setEditing] = useState<Track | null>(null);
  const [deleting, setDeleting] = useState<Track | null>(null);

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
  } = useTracks({
    page,
    limit: TRACK_CONFIG.pageSize,
    search,
    status: statusFilter === "all" ? undefined : statusFilter,
    sortBy,
    sortOrder,
  });

  const facultiesQuery = useTrackFaculties();

  /* ------------------------------------------------------------------------ */
  /* Mutations                                                                */
  /* ------------------------------------------------------------------------ */

  const createMutation = useCreateTrack();
  const updateMutation = useUpdateTrack();
  const deleteMutation = useDeleteTrack();

  /* ------------------------------------------------------------------------ */
  /* Derived Data                                                             */
  /* ------------------------------------------------------------------------ */

  const tracks = response?.data?.tracks ?? [];
  const pagination = response?.pagination;

  const faculties = facultiesQuery.data?.data?.faculties ?? [];

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const isLookupLoading = facultiesQuery.isPending;
  const lookupError = facultiesQuery.error;

  /* ------------------------------------------------------------------------ */
  /* Search                                                                   */
  /* ------------------------------------------------------------------------ */

  // DataTableSearch handles the debounce internally, just like Sessions.
  const handleSearchChange = useCallback((value: string) => {
    setPage(1);
    setSearch(value.trim());
  }, []);

  /* ------------------------------------------------------------------------ */
  /* Filtering and Sorting                                                    */
  /* ------------------------------------------------------------------------ */

  const handleStatusFilterChange = useCallback((value: string | null) => {
    if (value !== "all" && value !== "Active" && value !== "Inactive") return;

    setPage(1);
    setStatusFilter(value);
  }, []);

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

  const openEditDialog = useCallback((track: Track) => {
    setEditing(track);
    setActionError(null);
    setDialogOpen(true);
  }, []);

  const closeTrackDialog = (open: boolean) => {
    if (isSaving) return;

    setDialogOpen(open);

    if (!open) {
      setEditing(null);
      setActionError(null);
    }
  };

  const openDeleteDialog = useCallback((track: Track) => {
    setDeleting(track);
    setActionError(null);
    setConfirmOpen(true);
  }, []);

  /* ------------------------------------------------------------------------ */
  /* Columns                                                                  */
  /* ------------------------------------------------------------------------ */

  const columns = useMemo(
    () =>
      createTrackColumns({
        onEdit: openEditDialog,
        onDelete: openDeleteDialog,
      }),
    [openEditDialog, openDeleteDialog],
  );

  /* ------------------------------------------------------------------------ */
  /* Create / Update                                                          */
  /* ------------------------------------------------------------------------ */

  const handleSubmit = async (values: TrackFormValues) => {
    setActionError(null);

    const payload = {
      trackName: values.trackName.trim(),
      status: values.status,
      trackLeaderIds: values.trackLeaderIds,
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
          : "Unable to save track. Please try again.",
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
      if (tracks.length === 1 && page > 1) {
        setPage((currentPage) => currentPage - 1);
      }

      setConfirmOpen(false);
      setDeleting(null);
      setActionError(null);
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Unable to delete track. Please try again.",
      );

      throw error;
    }
  };

  /* ------------------------------------------------------------------------ */
  /* Loading                                                                  */
  /* ------------------------------------------------------------------------ */

  if (isPending && !response) {
    return <EntitySkeleton title="Tracks" />;
  }

  /* ------------------------------------------------------------------------ */
  /* Error                                                                    */
  /* ------------------------------------------------------------------------ */

  if (isError && !response) {
    return (
      <ErrorState
        title="Failed to load tracks"
        description="Something went wrong while loading tracks."
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

  const hasActiveFilters = Boolean(search) || statusFilter !== "all";

  return (
    <>
      <div className="space-y-6">
        {/* Page Header */}
        <EntityPageHeader
          icon={<Layers className="size-5 text-primary" />}
          title="Tracks"
          description="Manage event tracks and their track leaders."
          actions={
            <Button onClick={openCreateDialog} className="h-11 px-5">
              <Plus className="size-4" />
              Add Track
            </Button>
          }
        />

        {/* ---------------------------------------------------------------- */}
        {/* Search, Filter and Sorting                                        */}
        {/* ---------------------------------------------------------------- */}

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="w-full lg:max-w-md">
            <DataTableSearch
              value={search}
              onChange={handleSearchChange}
              placeholder="Search track name..."
              debounce={500}
              isLoading={isFetching}
            />
          </div>

          <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
            {/* Status filter */}
            <div className="w-full sm:w-44">
              <Select
                value={statusFilter}
                onValueChange={handleStatusFilterChange}
                disabled={isFetching}
              >
                <SelectTrigger
                  className="h-10 w-full"
                  aria-label="Filter tracks by status"
                >
                  <SelectValue>
                    {STATUS_FILTER_OPTIONS.find(
                      (option) => option.value === statusFilter,
                    )?.label ?? "All Statuses"}
                  </SelectValue>
                </SelectTrigger>

                <SelectContent>
                  {STATUS_FILTER_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort by */}
            <div className="w-full sm:w-44">
              <Select
                value={sortBy}
                onValueChange={handleSortByChange}
                disabled={isFetching}
              >
                <SelectTrigger
                  className="h-10 w-full"
                  aria-label="Sort tracks by"
                >
                  <SelectValue>
                    {TRACK_SORT_OPTIONS.find(
                      (option) => option.value === sortBy,
                    )?.label ?? "Sort by"}
                  </SelectValue>
                </SelectTrigger>

                <SelectContent>
                  {TRACK_SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort order */}
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
                    <SelectItem key={option.value} value={option.value}>
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
          {hasActiveFilters
            ? `${pagination?.total ?? 0} matching tracks`
            : `${pagination?.total ?? 0} tracks`}
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Table                                                             */}
        {/* ---------------------------------------------------------------- */}

        <DataTable
          columns={columns}
          data={tracks}
          isLoading={isFetching}
          emptyMessage={
            hasActiveFilters
              ? "No tracks match your filters."
              : "No tracks found. Create your first track."
          }
          className="w-full"
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

      <TrackDialog
        open={dialogOpen}
        onOpenChange={closeTrackDialog}
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
              Unable to load faculties. Please retry.
            </p>

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                void facultiesQuery.refetch();
              }}
            >
              Retry lookup request
            </Button>
          </div>
        ) : (
          <TrackForm
            key={editing?._id ?? "new-track"}
            track={editing}
            faculties={faculties}
            isPending={isSaving}
            onSubmit={handleSubmit}
            onCancel={() => closeTrackDialog(false)}
          />
        )}
      </TrackDialog>

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
        title="Delete Track"
        description={
          deleting
            ? `Are you sure you want to delete "${deleting.trackName}"? Sessions using this track will show it as deleted. This action cannot be undone.`
            : "Are you sure you want to delete this track?"
        }
        confirmText="Delete Track"
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
