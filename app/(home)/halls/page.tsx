"use client";

import { useEffect, useMemo, useState } from "react";
import { Building2, Plus } from "lucide-react";

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

import { hallConfig } from "@/features/hall/config";
import { hallResource } from "@/features/hall/resource";
import { hallSchema } from "@/features/hall/schema";

import type {
  Hall,
  CreateHallPayload,
} from "@/features/hall/type";

const PAGE_SIZE = 20;

export default function HallPage() {
  const [page, setPage] = useState(1);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [editing, setEditing] = useState<Hall | null>(null);
  const [deleting, setDeleting] = useState<Hall | null>(null);

  const {
    data,
    isPending,
    isFetching,
    isError,
    error,
    refetch,
  } = useMasterDataList(hallResource, {
    page,
    limit: PAGE_SIZE,
  });

  const createMutation = useMasterDataCreate(hallResource);
  const updateMutation = useMasterDataUpdate(hallResource);
  const deleteMutation = useMasterDataDelete(hallResource);

  const rows = data?.items ?? [];
  const pagination = data?.pagination;

  const columns = useMemo(
    () =>
      createMasterDataColumns<Hall, "hallName">({
        header: hallConfig.field.label,
        accessorKey: "hallName",
        statusAccessorKey: "status",

        onEdit: (hall) => {
          setEditing(hall);
          setDialogOpen(true);
        },

        onDelete: (hall) => {
          setDeleting(hall);
          setConfirmOpen(true);
        },
      }),
    [],
  );

  const defaultValues = useMemo<CreateHallPayload>(
    () => ({
      hallName: editing?.hallName ?? "",
      status: editing?.status ?? "Active",
    }),
    [editing],
  );

  // If the last record on the current page is deleted,
  // move back to the last available page.
  useEffect(() => {
    if (!pagination) return;

    const lastPage = Math.max(1, pagination.totalPages);

    if (page > lastPage) {
      setPage(lastPage);
    }
  }, [page, pagination]);

  const handleSubmit = async (values: CreateHallPayload) => {
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
    return <EntitySkeleton title={hallConfig.entity.plural} />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Unable to load halls"
        description={
          error instanceof Error
            ? error.message
            : "Something went wrong while loading halls."
        }
        retry={() => void refetch()}
      />
    );
  }

  return (
    <>
      <div className="space-y-6">
        <EntityPageHeader
          icon={<Building2 className="h-5 w-5 text-primary" />}
          title={hallConfig.entity.plural}
          description="Create and manage the halls used in the event agenda."
          actions={
            <Button
              onClick={() => {
                setEditing(null);
                setDialogOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Add Hall
            </Button>
          }
        />

        <DataTable
          columns={columns}
          data={rows}
          isLoading={isFetching}
          emptyMessage="No halls have been added yet."
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
        config={hallConfig}
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
        <MasterDataForm<CreateHallPayload>
          field={hallConfig.field}
          statusField={{
            key: "status",
            label: "Status",
            placeholder: "Select status",
            options: [
              { value: "Active", label: "Active" },
              { value: "Inactive", label: "Inactive" },
            ],
          }}
          schema={hallSchema}
          defaultValues={defaultValues}
          submitLabel={editing ? "Update Hall" : "Create Hall"}
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
        title="Delete Hall"
        description={
          deleting
            ? `Are you sure you want to delete "${deleting.hallName}"? This action cannot be undone.`
            : "This action cannot be undone."
        }
        confirmText="Delete Hall"
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