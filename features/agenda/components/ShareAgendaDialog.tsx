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
import { colors, gradients } from "@/lib/constants/colors";

import {
  getShareErrorMessage,
  shareAgendaViaWhatsApp,
} from "../services/agenda-share.service";
import { validateShareForm, type ShareFormErrors } from "../utils/share.utils";
import { pluralize } from "../utils/format.utils";
import { WhatsAppIcon } from "./WhatsAppIcon";
import type { AgendaSheetMode } from "../constants/agenda.constants";

type ShareStatus =
  | { state: "idle" }
  | { state: "loading" }
  | { state: "success"; phone: string }
  | { state: "error"; message: string };


interface ShareAgendaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topicIds: readonly string[];
  mode: AgendaSheetMode;
}  

export function ShareAgendaDialog({
  open,
  onOpenChange,
  topicIds,
  mode,
}: ShareAgendaDialogProps) {
  const nameId = useId();
  const phoneId = useId();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<ShareFormErrors>({});
  const [status, setStatus] = useState<ShareStatus>({ state: "idle" });

  const controller = useRef<AbortController | null>(null);

  useEffect(() => () => controller.current?.abort(), []);

  const isFullAgenda = mode === "full";

const dialogTitle = isFullAgenda
  ? "Share Full Agenda"
  : "Share My Agenda";


  const topicLabel = isFullAgenda ? "topics" : "saved topics";

const description = `Send your ${topicIds.length} ${topicLabel} as a PDF directly to your WhatsApp number.`;

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
        {
          name: result.value.name,
          phone: result.value.phone,
          topicIds: [...topicIds],
          mode,
        },
        current.signal,
      );

      setStatus({ state: "success", phone: result.value.phone });
    } catch (error) {
      if (current.signal.aborted) return;

      setStatus({
        state: "error",
        message: getShareErrorMessage(error),
      });
    }
  };

  const loading = status.state === "loading";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="overflow-hidden rounded-2xl border p-0 shadow-2xl sm:max-w-md"
        style={{
          borderColor: `${colors.purple[200]}80`,
          background: colors.white[50],
        }}
      >
        {/* Header */}
       <DialogHeader
  className="border-b px-5 py-3.5"
  style={{
    background: colors.purple[50],
    borderColor: `${colors.purple[200]}60`,
  }}
>
  {/* Icon + Title on same row */}
  <div className="flex items-center gap-3">
    <span
      className="flex size-10 shrink-0 items-center justify-center rounded-xl text-white shadow-md"
      style={{ background: gradients.emeraldLuxe }}
    >
      <WhatsAppIcon className="size-7" />
    </span>
    <DialogTitle className="text-base font-extrabold tracking-tight text-purple-950">{dialogTitle}</DialogTitle>
  </div>

  

  {/* Description */}
  <DialogDescription className="mt-1 text-xs font-medium leading-relaxed text-purple-700">
    {description}
  </DialogDescription>
</DialogHeader>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4 p-5">
          {/* Name */}
          <div className="space-y-1.5">
            <label
              htmlFor={nameId}
              className="text-xs font-bold text-purple-950"
            >
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
              className="h-11 rounded-xl border-purple-200 bg-white font-medium shadow-sm placeholder:text-zinc-400 focus-visible:border-purple-400 focus-visible:ring-purple-200"
            />

            {errors.name && (
              <p id={`${nameId}-error`} className="text-xs font-medium text-destructive">
                {errors.name}
              </p>
            )}
          </div>

          {/* WhatsApp number */}
          <div className="space-y-1.5">
            <label
              htmlFor={phoneId}
              className="text-xs font-bold text-purple-950"
            >
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
              className="h-11 rounded-xl border-purple-200 bg-white font-medium shadow-sm placeholder:text-zinc-400 focus-visible:border-purple-400 focus-visible:ring-purple-200"
            />

            <p
              id={`${phoneId}-hint`}
              className="text-[11px] leading-relaxed text-zinc-500"
            >
              Indian numbers work as they are. For other countries, include the country code.
            </p>

            {errors.phone && (
              <p
                id={`${phoneId}-error`}
                className="text-xs font-medium text-destructive"
              >
                {errors.phone}
              </p>
            )}
          </div>

          {/* Status message */}
          <div role="status" aria-live="polite" className="min-h-0">
            {status.state === "error" && (
              <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3">
                <TriangleAlert
                  className="mt-0.5 size-4 shrink-0 text-red-500"
                  aria-hidden="true"
                />
                <p className="text-xs font-semibold leading-relaxed text-red-700">
                  {status.message}
                </p>
              </div>
            )}

            {status.state === "success" && (
              <div className="flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                <CircleCheck
                  className="mt-0.5 size-4 shrink-0 text-emerald-600"
                  aria-hidden="true"
                />
                <p className="text-xs font-semibold leading-relaxed text-emerald-700">
                  Your {isFullAgenda ? "full agenda" : "saved agenda"} has been accepted for WhatsApp delivery to {status.phone}.
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              className="h-12 flex-1 rounded-xl border-purple-200 bg-purple-50 font-bold text-purple-800 transition-all hover:bg-purple-100 hover:text-purple-950"
            >
              {status.state === "success" ? "Close" : "Cancel"}
            </Button>

            <Button
  type="submit"
  disabled={loading || topicIds.length === 0}
  className="h-12 flex-1 gap-2 border-0 font-bold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-40"
  style={{
    background: gradients.emeraldLuxe,
  }}
>
  {loading ? (
    <LoaderCircle className="size-5 shrink-0 animate-spin" />
  ) : (
    <WhatsAppIcon className="size-8 shrink-0" />
  )}

  <span className="whitespace-nowrap">
    {loading ? "Sending…" : "Share on WhatsApp"}
  </span>
</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}