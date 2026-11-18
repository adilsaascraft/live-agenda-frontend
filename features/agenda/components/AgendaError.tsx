"use client";

import { motion } from "framer-motion";
import { LoaderCircle, RotateCcw, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";

interface AgendaErrorProps {
  message: string | null;
  isRetrying: boolean;
  onRetry: () => void;
}

export function AgendaError({ message, isRetrying, onRetry }: AgendaErrorProps) {
  return (
    <motion.div
      role="alert"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-4 rounded-2xl border border-destructive/30 bg-destructive/5 px-6 py-12 text-center"
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <TriangleAlert className="size-6" aria-hidden="true" />
      </span>
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">We couldn’t load the agenda</h2>
        <p className="mx-auto max-w-md text-sm text-muted-foreground">
          {message ?? "Something went wrong. Please try again."}
        </p>
      </div>
      <Button type="button" onClick={onRetry} disabled={isRetrying} className="gap-2">
        {isRetrying ? (
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <RotateCcw className="size-4" aria-hidden="true" />
        )}
        {isRetrying ? "Retrying…" : "Try again"}
      </Button>
    </motion.div>
  );
}
