"use client";

import { useCallback, useMemo, useState } from "react";

import {
  Plus,
  UsersRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { ConfirmDialog } from "@/components/common/confirm-dialog";

import { DataTable } from "@/components/common/data-table/data-table";
import { DataTablePagination } from "@/components/common/data-table/data-table-pagination";
import { DataTableSearch } from "@/components/common/data-table/data-table-search";

import { EntityPageHeader } from "@/components/common/entity-page-header";
import EntitySkeleton from "@/components/common/entity-skeleton";
import { ErrorState } from "@/components/common/error-state";

import {
  useFacultyCreate,
  useFacultyDelete,
  useFacultyList,
  useFacultyUpdate,
} from "@/features/faculty/hooks";

import { createFacultyColumns } from "@/features/faculty/components/FacultyColumns";
import { FacultyForm } from "@/features/faculty/components/FacultyForm";

import { FACULTY_CONFIG } from "@/features/faculty/config";

import type { FacultyFormValues } from "@/features/faculty/schema";
import type { Faculty } from "@/features/faculty/type";

export default function FacultiesPage() {
  /* -------------------------------------------------------------------------- */
  /* State                                                                      */
  /* -------------------------------------------------------------------------- */

  const [page, setPage] = useState(1);

  // This is the applied (debounced) search value.
  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [editing, setEditing] = useState<Faculty | null>(null);
  const [deleting, setDeleting] = useState<Faculty | null>(null);

  const [actionError, setActionError] = useState<string | null>(null);

  /* -------------------------------------------------------------------------- */
  /* Queries                                                                    */
  /* -------------------------------------------------------------------------- */

  const {
    data: response,
    isPending,
    isFetching,
    isError,
    error,
    refetch,
  } = useFacultyList({
    page,
    limit: FACULTY_CONFIG.pageSize,
    search,
  });

  const createMutation = useFacultyCreate();
  const updateMutation = useFacultyUpdate();
  const deleteMutation = useFacultyDelete();

  const faculties = response?.data?.faculties ?? [];
  const pagination = response?.pagination;

  const isSaving =
    createMutation.isPending || updateMutation.isPending;

  /* -------------------------------------------------------------------------- */
  /* Search                                                                     */
  /* -------------------------------------------------------------------------- */

  /**
   * Called by DataTableSearch after its debounce interval.
   *
   * Search is performed by the backend.
   * We never filter the returned faculties locally.
   */
  const handleSearchChange = useCallback((value: string) => {
    const normalizedValue = value.trim();

    setPage(1);
    setSearch(normalizedValue);
  }, []);

  /* -------------------------------------------------------------------------- */
  /* Dialog Handlers                                                            */
  /* -------------------------------------------------------------------------- */

  const openCreateDialog = () => {
    setEditing(null);
    setActionError(null);
    setDialogOpen(true);
  };

  const openEditDialog = useCallback((faculty: Faculty) => {
    setEditing(faculty);
    setActionError(null);
    setDialogOpen(true);
  }, []);

  const closeFacultyDialog = (open: boolean) => {
    if (isSaving) return;

    setDialogOpen(open);

    if (!open) {
      setEditing(null);
      setActionError(null);
    }
  };

  const openDeleteDialog = useCallback((faculty: Faculty) => {
    setDeleting(faculty);
    setActionError(null);
    setConfirmOpen(true);
  }, []);

  /* -------------------------------------------------------------------------- */
  /* Columns                                                                    */
  /* -------------------------------------------------------------------------- */

  const columns = useMemo(
    () =>
      createFacultyColumns({
        onEdit: openEditDialog,
        onDelete: openDeleteDialog,
      }),
    [openEditDialog, openDeleteDialog],
  );

  /* -------------------------------------------------------------------------- */
  /* Create / Update                                                            */
  /* -------------------------------------------------------------------------- */

  const handleSubmit = async (values: FacultyFormValues) => {
    setActionError(null);

    try {
      if (editing) {
        await updateMutation.mutateAsync({
          id: editing._id,
          payload: values,
        });
      } else {
        await createMutation.mutateAsync(values);

        // Show the newly created faculty from the first page.
        setPage(1);
      }

      setDialogOpen(false);
      setEditing(null);
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Unable to save faculty. Please try again.",
      );
    }
  };

  /* -------------------------------------------------------------------------- */
  /* Delete                                                                     */
  /* -------------------------------------------------------------------------- */

  const handleDelete = async () => {
    if (!deleting) return;

    setActionError(null);

    try {
      await deleteMutation.mutateAsync(deleting._id);

      /**
       * If the deleted faculty was the only record on the current page,
       * move to the previous page.
       */
      if (faculties.length === 1 && page > 1) {
        setPage((currentPage) => currentPage - 1);
      }

      setConfirmOpen(false);
      setDeleting(null);
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Unable to delete faculty. Please try again.",
      );

      throw error;
    }
  };

  /* -------------------------------------------------------------------------- */
  /* Loading                                                                    */
  /* -------------------------------------------------------------------------- */

  if (isPending) {
    return <EntitySkeleton title="Faculties" />;
  }

  /* -------------------------------------------------------------------------- */
  /* Error                                                                      */
  /* -------------------------------------------------------------------------- */

  if (isError) {
    return (
      <ErrorState
        title="Failed to load faculties"
        description="Something went wrong while loading faculties."
        error={error}
        retry={() => {
          void refetch();
        }}
      />
    );
  }

  /* -------------------------------------------------------------------------- */
  /* Render                                                                     */
  /* -------------------------------------------------------------------------- */

  return (
    <>
      <div className="space-y-6">
        {/* Page Header */}
        <EntityPageHeader
          icon={<UsersRound className="size-5 text-primary" />}
          title="Faculties"
          description="Manage faculty members and their contact information."
          actions={
            <Button onClick={openCreateDialog}>
              <Plus className="size-4" />
              Add Faculty
            </Button>
          }
        />

        {/* Search and Result Count */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:max-w-md">
            <DataTableSearch
              value={search}
              onChange={handleSearchChange}
              placeholder="Search name, email or mobile..."
              debounce={FACULTY_CONFIG.searchDebounce}
              isLoading={isFetching}
            />
          </div>

          <div className="text-sm text-muted-foreground">
            {search
              ? `${pagination?.total ?? 0} matching faculties`
              : `${pagination?.total ?? 0} faculties`}
          </div>
        </div>

        {/* Table */}
        <DataTable
          columns={columns}
          data={faculties}
          isLoading={isFetching}
          emptyMessage={
            search
              ? "No faculties match your search."
              : "No faculties found. Add your first faculty."
          }
        />

        {/* Server-side Pagination */}
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

      {/* -------------------------------------------------------------------- */}
      {/* Create / Edit Dialog                                                 */}
      {/* -------------------------------------------------------------------- */}

      <Dialog
        open={dialogOpen}
        onOpenChange={closeFacultyDialog}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Faculty" : "Add Faculty"}
            </DialogTitle>

            <DialogDescription>
              {editing
                ? "Update the faculty member's contact information."
                : "Enter the details to create a new faculty member."}
            </DialogDescription>
          </DialogHeader>

          {actionError && (
            <div
              role="alert"
              className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive"
            >
              {actionError}
            </div>
          )}

          <FacultyForm
            key={editing?._id ?? "new-faculty"}
            faculty={editing}
            isPending={isSaving}
            onSubmit={handleSubmit}
            onCancel={() => closeFacultyDialog(false)}
          />
        </DialogContent>
      </Dialog>

      {/* -------------------------------------------------------------------- */}
      {/* Delete Confirmation                                                  */}
      {/* -------------------------------------------------------------------- */}

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
        title="Delete Faculty"
        description={
          deleting
            ? `Are you sure you want to delete ${deleting.fullName}? This action cannot be undone.`
            : "Are you sure you want to delete this faculty?"
        }
        confirmText="Delete Faculty"
        confirmVariant="destructive"
        isPending={deleteMutation.isPending}
        onConfirm={handleDelete}
      />

      {/* Delete Error */}
      {actionError && !dialogOpen && confirmOpen && (
        <p
          role="alert"
          className="text-sm text-destructive"
        >
          {actionError}
        </p>
      )}
    </>
  );
}