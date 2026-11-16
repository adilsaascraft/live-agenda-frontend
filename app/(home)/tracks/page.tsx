"use client";

import { useEffect, useMemo, useState } from "react";
import { Layers3, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { DataTable } from "@/components/common/data-table/data-table";
import { DataTablePagination } from "@/components/common/data-table/data-table-pagination";
import { EntityPageHeader } from "@/components/common/entity-page-header";
import EntitySkeleton from "@/components/common/entity-skeleton";
import { ErrorState } from "@/components/common/error-state";

import { MasterDataDialog } from "@/shared/master-data/components/MasterDataDialog";
import { MasterDataForm } from "@/shared/master-data/components/MasterDataForm";
import { createMasterDataColumns } from "@/shared/master-data/components/MasterDataColumns";

import { useMasterDataCreate } from "@/shared/master-data/useMasterDataCreate";
import { useMasterDataDelete } from "@/shared/master-data/useMasterDataDelete";
import { useMasterDataList } from "@/shared/master-data/useMasterDataList";
import { useMasterDataUpdate } from "@/shared/master-data/useMasterDataUpdate";

import { trackConfig } from "@/features/track/config";
import { trackResource } from "@/features/track/resource";
import { trackSchema } from "@/features/track/schema";

import type {
  Track,
  CreateTrackPayload,
} from "@/features/track/type";

const PAGE_SIZE = 20;

export default function TrackPage() {
  const [page, setPage] = useState(1);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [editing, setEditing] = useState<Track | null>(null);
  const [deleting, setDeleting] = useState<Track | null>(null);

  const {
    data,
    isPending,
    isFetching,
    isError,
    error,
    refetch,
  } = useMasterDataList(trackResource, {
    page,
    limit: PAGE_SIZE,
  });

  const createMutation = useMasterDataCreate(trackResource);
  const updateMutation = useMasterDataUpdate(trackResource);
  const deleteMutation = useMasterDataDelete(trackResource);

  const rows = data?.items ?? [];
  const pagination = data?.pagination;

  const columns = useMemo(
    () =>
      createMasterDataColumns<Track, "trackName">({
        header: trackConfig.field.label,
        accessorKey: "trackName",
        statusAccessorKey: "status",

        onEdit: (track) => {
          setEditing(track);
          setDialogOpen(true);
        },

        onDelete: (track) => {
          setDeleting(track);
          setConfirmOpen(true);
        },
      }),
    [],
  );

  const defaultValues = useMemo<CreateTrackPayload>(
    () => ({
      trackName: editing?.trackName ?? "",
      status: editing?.status ?? "Active",
    }),
    [editing],
  );

  useEffect(() => {
    if (!pagination) return;

    const lastPage = Math.max(1, pagination.totalPages);

    if (page > lastPage) {
      setPage(lastPage);
    }
  }, [page, pagination]);

  const handleSubmit = async (values: CreateTrackPayload) => {
    if (editing) {
      await updateMutation.mutateAsync({
        _id: editing._id,
        payload: values,
      });
    } else {
      await createMutation.mutateAsync(values);
      setPage(1);
    }

    setDialogOpen(false);
    setEditing(null);
  };

  const isSaving =
    createMutation.isPending || updateMutation.isPending;

  if (isPending) {
    return <EntitySkeleton title={trackConfig.entity.plural} />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Unable to load tracks"
        description={
          error instanceof Error
            ? error.message
            : "Something went wrong while loading tracks."
        }
        retry={() => void refetch()}
      />
    );
  }

  return (
    <>
      <div className="space-y-6">
        <EntityPageHeader
          icon={<Layers3 className="h-5 w-5 text-primary" />}
          title={trackConfig.entity.plural}
          description="Create and manage the tracks used to organize agenda sessions."
          actions={
            <Button
              onClick={() => {
                setEditing(null);
                setDialogOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Add Track
            </Button>
          }
        />

        <DataTable
          columns={columns}
          data={rows}
          isLoading={isFetching}
          emptyMessage="No tracks have been added yet."
        />

        {pagination && (
          <DataTablePagination
            page={page}
            totalPages={pagination.totalPages}
            totalItems={pagination.total}
            pageSize={pagination.limit}
            onPageChange={setPage}
            disabled={isFetching}
          />
        )}
      </div>

      <MasterDataDialog
        config={trackConfig}
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);

          if (!open) {
            setEditing(null);
          }
        }}
        isEditing={Boolean(editing)}
        isPending={isSaving}
      >
        <MasterDataForm<CreateTrackPayload>
          field={trackConfig.field}
          statusField={{
            key: "status",
            label: "Status",
            placeholder: "Select status",
            options: [
              { value: "Active", label: "Active" },
              { value: "Inactive", label: "Inactive" },
            ],
          }}
          schema={trackSchema}
          defaultValues={defaultValues}
          submitLabel={editing ? "Update Track" : "Create Track"}
          isPending={isSaving}
          onSubmit={handleSubmit}
        />
      </MasterDataDialog>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={(open) => {
          setConfirmOpen(open);

          if (!open) {
            setDeleting(null);
          }
        }}
        title="Delete Track"
        description={
          deleting
            ? `Are you sure you want to delete "${deleting.trackName}"? This action cannot be undone.`
            : "This action cannot be undone."
        }
        confirmText="Delete Track"
        confirmVariant="destructive"
        isPending={deleteMutation.isPending}
        onConfirm={async () => {
          if (!deleting) return;

          await deleteMutation.mutateAsync({
            _id: deleting._id,
          });

          setConfirmOpen(false);
          setDeleting(null);
        }}
      />
    </>
  );
}