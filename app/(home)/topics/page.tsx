
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { BookOpen, Plus } from "lucide-react";

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
  useCreateTopic,
  useDeleteTopic,
  useTopicFaculties,
  useTopicSessions,
  useTopics,
  useUpdateTopic,
} from "@/features/topic/topic.hooks";

import { createTopicColumns } from "@/features/topic/components/TopicColumns";
import { TopicDialog } from "@/features/topic/components/TopicDialog";

import {
  TOPIC_CONFIG,
  TOPIC_SORT_OPTIONS,
} from "@/features/topic/topic.config";

import type {
  Topic,
  TopicFormValues,
} from "@/features/topic/topic.types";

export default function TopicsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string>(
    TOPIC_CONFIG.defaultSortBy,
  );
  const [order, setOrder] = useState<"asc" | "desc">(
    TOPIC_CONFIG.defaultOrder,
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [editing, setEditing] = useState<Topic | null>(null);
  const [deleting, setDeleting] = useState<Topic | null>(null);

  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    setPage(1);
  }, [search, sortBy, order]);

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
  } = useTopics({
    page,
    limit: TOPIC_CONFIG.pageSize,
    search,
    sortBy,
    order,
  });

  // These are deliberately unpaginated lookup queries.
  const sessionsQuery = useTopicSessions();
  const facultiesQuery = useTopicFaculties();

  const createMutation = useCreateTopic();
  const updateMutation = useUpdateTopic();
  const deleteMutation = useDeleteTopic();

  const topics = response?.data?.topics ?? [];
  const pagination = response?.pagination;

  const sessions = sessionsQuery.data?.data?.sessions ?? [];
  const faculties = facultiesQuery.data?.data?.faculties ?? [];

  const isSaving =
    createMutation.isPending || updateMutation.isPending;

  const isLoadingOptions =
    sessionsQuery.isPending || facultiesQuery.isPending;

  const lookupError = sessionsQuery.error || facultiesQuery.error;

  /* -------------------------------------------------------------------------- */
  /* Search                                                                     */
  /* -------------------------------------------------------------------------- */

  const handleSearchChange = useCallback((value: string) => {
    setPage(1);
    setSearch(value.trim());
  }, []);

  /* -------------------------------------------------------------------------- */
  /* Dialog handlers                                                            */
  /* -------------------------------------------------------------------------- */

  const openCreateDialog = useCallback(() => {
    setEditing(null);
    setActionError(null);
    setDialogOpen(true);
  }, []);

  const openEditDialog = useCallback((topic: Topic) => {
    setEditing(topic);
    setActionError(null);
    setDialogOpen(true);
  }, []);

  const closeTopicDialog = (open: boolean) => {
    if (isSaving) return;

    setDialogOpen(open);

    if (!open) {
      setEditing(null);
      setActionError(null);
    }
  };

  const openDeleteDialog = useCallback((topic: Topic) => {
    setDeleting(topic);
    setActionError(null);
    setConfirmOpen(true);
  }, []);

  /* -------------------------------------------------------------------------- */
  /* Columns                                                                    */
  /* -------------------------------------------------------------------------- */

  const columns = useMemo(
    () =>
      createTopicColumns({
        onEdit: openEditDialog,
        onDelete: openDeleteDialog,
      }),
    [openEditDialog, openDeleteDialog],
  );

  /* -------------------------------------------------------------------------- */
  /* Create / Update                                                            */
  /* -------------------------------------------------------------------------- */

  const handleSubmit = async (values: TopicFormValues) => {
    setActionError(null);

    const payload = {
      sessionId: values.sessionId,
      topicName: values.topicName.trim(),
      startTime: values.startTime.trim().toUpperCase(),
      endTime: values.endTime.trim().toUpperCase(),
      topicType: values.topicType,
      facultyId: values.facultyId ?? [],
      moderatorId: values.moderatorId ?? [],
      panelistId: values.panelistId ?? [],
      expertPanelistId: values.expertPanelistId ?? [],
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
          : "Unable to save topic. Please try again.",
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

      if (topics.length === 1 && page > 1) {
        setPage((currentPage) => currentPage - 1);
      }

      setConfirmOpen(false);
      setDeleting(null);
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Unable to delete topic. Please try again.",
      );

      throw error;
    }
  };

  /* -------------------------------------------------------------------------- */
  /* Loading / Error                                                            */
  /* -------------------------------------------------------------------------- */

  if (isPending && !response) {
    return <EntitySkeleton title="Topics" />;
  }

  if (isError && !response) {
    return (
      <ErrorState
        title="Failed to load topics"
        description="Something went wrong while loading topics."
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
        <EntityPageHeader
          icon={<BookOpen className="size-5 text-primary" />}
          title="Topics"
          description="Manage session topics, schedules and assigned faculty members."
          actions={
            <Button onClick={openCreateDialog} className="h-11 px-5">
              <Plus className="size-4" />
              Add Topic
            </Button>
          }
        />

        {/* Search, sorting and result count */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="w-full lg:max-w-md">
            <DataTableSearch
              value={search}
              onChange={handleSearchChange}
              placeholder="Search topic name or type..."
              debounce={TOPIC_CONFIG.searchDebounce}
              isLoading={isFetching}
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <span className="whitespace-nowrap text-sm text-muted-foreground">
                Sort by
              </span>

              <Select
                value={sortBy}
                onValueChange={(value) =>
                  setSortBy(value ?? TOPIC_CONFIG.defaultSortBy)
                }
              >
                <SelectTrigger className="h-10 w-full sm:w-48">
                  <SelectValue placeholder="Sort topics" />
                </SelectTrigger>

                <SelectContent>
                  {TOPIC_SORT_OPTIONS.map((option) => (
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

            <Select
              value={order}
              onValueChange={(value) =>
                setOrder(value as "asc" | "desc")
              }
            >
              <SelectTrigger className="h-10 w-full sm:w-36">
                <SelectValue placeholder="Order" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="desc">Descending</SelectItem>
                <SelectItem value="asc">Ascending</SelectItem>
              </SelectContent>
            </Select>

            <div className="whitespace-nowrap text-sm text-muted-foreground">
              {search
                ? `${pagination?.total ?? 0} matching topics`
                : `${pagination?.total ?? 0} topics`}
            </div>
          </div>
        </div>

        {/* Table */}
        <DataTable
          columns={columns}
          data={topics}
          isLoading={isFetching}
          emptyMessage={
            search
              ? "No topics match your search."
              : "No topics found. Create your first topic."
          }
        />

        {/* Server-side pagination */}
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

      {/* Create / Edit dialog */}
      <TopicDialog
        open={dialogOpen}
        onOpenChange={closeTopicDialog}
        topic={editing}
        sessions={sessions}
        faculties={faculties}
        isLoadingOptions={isLoadingOptions}
        isPending={isSaving}
        error={
          actionError ||
          (lookupError
            ? "Unable to load sessions or faculty members. Close and reopen the form after checking the connection."
            : null)
        }
        onSubmit={handleSubmit}
      />

      {/* Delete confirmation */}
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
        title="Delete Topic"
        description={
          deleting
            ? `Are you sure you want to delete "${deleting.topicName}"? This action cannot be undone.`
            : "Are you sure you want to delete this topic?"
        }
        confirmText="Delete Topic"
        confirmVariant="destructive"
        isPending={deleteMutation.isPending}
        onConfirm={handleDelete}
      />

      {/* Delete error */}
      {actionError && !dialogOpen && confirmOpen && (
        <p role="alert" className="text-sm text-destructive">
          {actionError}
        </p>
      )}
    </>
  );
}
