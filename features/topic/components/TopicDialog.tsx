
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { TopicForm } from "./TopicForm";

import type {
  Topic,
  TopicFaculty,
  TopicFormValues,
  TopicSession,
} from "../topic.types";

interface TopicDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topic: Topic | null;
  sessions: TopicSession[];
  faculties: TopicFaculty[];
  isLoadingOptions?: boolean;
  isPending?: boolean;
  error?: string | null;
  onSubmit: (values: TopicFormValues) => void;
}

export function TopicDialog({
  open,
  onOpenChange,
  topic,
  sessions,
  faculties,
  isLoadingOptions = false,
  isPending = false,
  error,
  onSubmit,
}: TopicDialogProps) {
  const isEditing = Boolean(topic);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-center text-md font-bold">
            {isEditing ? "Edit Topic" : "Add Topic"}
          </DialogTitle>

          <DialogDescription className="text-center">
            {isEditing
              ? "Update the topic details and assign its participants."
              : "Create a topic and assign its session and participants."}
          </DialogDescription>
        </DialogHeader>

        <TopicForm
          key={topic?._id ?? "new-topic"}
          topic={topic}
          sessions={sessions}
          faculties={faculties}
          isLoadingOptions={isLoadingOptions}
          isPending={isPending}
          error={error}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
