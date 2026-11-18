"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { CircleCheck, LoaderCircle, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import {
  getShareErrorMessage,
  shareAgendaViaWhatsApp,
} from "../services/agenda-share.service";
import { validateShareForm, type ShareFormErrors } from "../utils/share.utils";
import { pluralize } from "../utils/format.utils";
import { WhatsAppIcon } from "./WhatsAppIcon";

type ShareStatus =
  | { state: "idle" }
  | { state: "loading" }
  | { state: "success"; phone: string }
  | { state: "error"; message: string };

interface ShareAgendaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topicIds: readonly string[];
}

export function ShareAgendaDialog({ open, onOpenChange, topicIds }: ShareAgendaDialogProps) {
  const nameId = useId();
  const phoneId = useId();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<ShareFormErrors>({});
  const [status, setStatus] = useState<ShareStatus>({ state: "idle" });
  const controller = useRef<AbortController | null>(null);

  // Cancel any in-flight request on unmount.
  useEffect(() => () => controller.current?.abort(), []);

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      controller.current?.abort();
      setErrors({});
      setStatus({ state: "idle" });
    }
    onOpenChange(next);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status.state === "loading") return;

    const result = validateShareForm({ name, phone });
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    setStatus({ state: "loading" });

    controller.current?.abort();
    const current = new AbortController();
    controller.current = current;

    try {
      await shareAgendaViaWhatsApp(
        { name: result.value.name, phone: result.value.phone, topicIds: [...topicIds] },
        current.signal,
      );
      setStatus({ state: "success", phone: result.value.phone });
    } catch (error) {
      if (current.signal.aborted) return;
      setStatus({ state: "error", message: getShareErrorMessage(error) });
    }
  };

  const loading = status.state === "loading";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <span className="mb-1 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <WhatsAppIcon className="size-7" />
          </span>
          <DialogTitle>Share My Agenda</DialogTitle>
          <DialogDescription>
            We’ll send your {pluralize(topicIds.length, "saved topic")} as a PDF to your WhatsApp
            number.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor={nameId} className="text-sm font-medium">
              Your name
            </label>
            <Input
              id={nameId}
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              placeholder="e.g. Dr. Anita Sharma"
              disabled={loading}
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? `${nameId}-error` : undefined}
            />
            {errors.name && (
              <p id={`${nameId}-error`} className="text-xs text-destructive">
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor={phoneId} className="text-sm font-medium">
              WhatsApp mobile number
            </label>
            <Input
              id={phoneId}
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              autoComplete="tel"
              placeholder="98765 43210 or +44 7911 123456"
              disabled={loading}
              aria-invalid={errors.phone ? true : undefined}
              aria-describedby={`${phoneId}-hint${errors.phone ? ` ${phoneId}-error` : ""}`}
            />
            <p id={`${phoneId}-hint`} className="text-xs text-muted-foreground">
              Indian numbers work as they are. For other countries, include the country code.
            </p>
            {errors.phone && (
              <p id={`${phoneId}-error`} className="text-xs text-destructive">
                {errors.phone}
              </p>
            )}
          </div>

          <div role="status" aria-live="polite" className="min-h-0">
            {status.state === "error" && (
              <p className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                {status.message}
              </p>
            )}
            {status.state === "success" && (
              <p className="flex items-start gap-2 rounded-lg bg-primary/10 p-3 text-sm text-primary">
                <CircleCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                Your agenda has been sent to {status.phone}.
              </p>
            )}
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              {status.state === "success" ? "Close" : "Cancel"}
            </Button>
            <Button type="submit" disabled={loading || topicIds.length === 0} className="gap-2">
              {loading ? (
                <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <WhatsAppIcon className="size-4" />
              )}
              {loading ? "Sending…" : "Share on WhatsApp"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
