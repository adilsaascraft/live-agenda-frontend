"use client";

import type { ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TrackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing?: boolean;
  isPending?: boolean;
  children: ReactNode;
}

export function TrackDialog({
  open,
  onOpenChange,
  isEditing = false,
  isPending = false,
  children,
}: TrackDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (isPending) return;
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent
        showCloseButton={!isPending}
        className="
          flex
          h-[90vh]
          max-h-[90vh]
          w-[95vw]
          flex-col
          overflow-hidden
          p-3
          sm:max-w-2xl
        "
      >
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle className="text-center text-lg font-bold">
            {isEditing ? "Edit Track" : "Add Track"}
          </DialogTitle>

          <DialogDescription className="text-center">
            {isEditing
              ? "Update the track details and assigned track leaders."
              : "Enter the details to create a new track."}
          </DialogDescription>
        </DialogHeader>

        <div className="custom-scroll flex-1 overflow-y-auto px-6 py-6">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
