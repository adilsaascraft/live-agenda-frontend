"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import { Search, X, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { TRACK_STATUS_OPTIONS } from "../track.config";
import { trackSchema, type TrackFormValues } from "../track.schema";

import type { Track, TrackLeader } from "../track.types";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface TrackFormProps {
  track?: Track | null;
  faculties: TrackLeader[];
  isPending?: boolean;
  onSubmit: (values: TrackFormValues) => Promise<void>;
  onCancel: () => void;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

/**
 * Safely extracts an ID from:
 * - Populated MongoDB reference
 * - Unpopulated MongoDB ObjectId string
 * - Null / undefined
 * - Object without a valid _id
 */
function getReferenceId(value: unknown): string {
  if (typeof value === "string") {
    return value.trim();
  }

  if (!value || typeof value !== "object") {
    return "";
  }

  const reference = value as { _id?: unknown };

  return typeof reference._id === "string" ? reference._id.trim() : "";
}

/**
 * Creates safe form defaults for create and edit modes.
 */
function getTrackDefaults(track?: Track | null): TrackFormValues {
  const leaderIds = (track?.trackLeaderIds ?? [])
    .map((item) => getReferenceId(item))
    .filter(Boolean);

  return {
    trackName: track?.trackName ?? "",
    status: track?.status ?? "Active",
    trackLeaderIds: [...new Set(leaderIds)],
  };
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TrackForm({
  track,
  faculties,
  isPending = false,
  onSubmit,
  onCancel,
}: TrackFormProps) {
  const [facultySearch, setFacultySearch] = useState("");

  // ---------------------------------------------------------------------------
  // Safe lookup data
  // ---------------------------------------------------------------------------

  const validFaculties = useMemo(
    () =>
      (faculties ?? []).filter(
        (faculty): faculty is TrackLeader =>
          Boolean(
            faculty && typeof faculty._id === "string" && faculty._id.trim(),
          ),
      ),
    [faculties],
  );

  // ---------------------------------------------------------------------------
  // Form initialization
  // ---------------------------------------------------------------------------

  const defaultValues = useMemo(() => getTrackDefaults(track), [track]);

  const form = useForm<TrackFormValues>({
    resolver: zodResolver(trackSchema) as Resolver<TrackFormValues>,
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
    setFacultySearch("");
  }, [defaultValues, form]);

  // ---------------------------------------------------------------------------
  // Watched values
  // ---------------------------------------------------------------------------

  const selectedLeaders = form.watch("trackLeaderIds") ?? [];

  // ---------------------------------------------------------------------------
  // Missing / deleted reference detection
  // ---------------------------------------------------------------------------

  const originalLeaders = track?.trackLeaderIds ?? [];

  const hasUnavailableLeaders = Boolean(
    track &&
      originalLeaders.some((item) => {
        const id = getReferenceId(item);

        return !id || !validFaculties.some((faculty) => faculty._id === id);
      }),
  );

  // ---------------------------------------------------------------------------
  // Faculty search
  // ---------------------------------------------------------------------------

  const filteredFaculties = useMemo(() => {
    const search = facultySearch.trim().toLowerCase();

    if (!search) return validFaculties;

    return validFaculties.filter((faculty) =>
      [faculty.fullName, faculty.email, faculty.mobile].some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(search),
      ),
    );
  }, [validFaculties, facultySearch]);

  // ---------------------------------------------------------------------------
  // Track leader selection
  // ---------------------------------------------------------------------------

  const toggleLeader = (facultyId: string, checked: boolean) => {
    const id = facultyId.trim();

    if (!id) return;

    const current = form.getValues("trackLeaderIds") ?? [];

    const next = checked
      ? [...new Set([...current, id])]
      : current.filter((selectedId) => selectedId !== id);

    form.setValue("trackLeaderIds", next, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------

  const handleFormSubmit = async (values: TrackFormValues) => {
    const cleanedValues: TrackFormValues = {
      ...values,
      trackName: values.trackName.trim(),
      trackLeaderIds: [
        ...new Set(
          (values.trackLeaderIds ?? [])
            .filter(
              (id): id is string => typeof id === "string" && Boolean(id.trim()),
            )
            .map((id) => id.trim()),
        ),
      ],
    };

    await onSubmit(cleanedValues);
  };

  // ---------------------------------------------------------------------------
  // UI
  // ---------------------------------------------------------------------------

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6"
      >
        {/* ----------------------------------------------------------------- */}
        {/* Track Name                                                        */}
        {/* ----------------------------------------------------------------- */}

        <FormField
          control={form.control}
          name="trackName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Track Name</FormLabel>

              <FormControl>
                <Input
                  {...field}
                  autoFocus
                  placeholder="Enter track name"
                  disabled={isPending}
                  maxLength={100}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* ----------------------------------------------------------------- */}
        {/* Status                                                            */}
        {/* ----------------------------------------------------------------- */}

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => {
            const selectedStatus = TRACK_STATUS_OPTIONS.find(
              (option) => option.value === field.value,
            );

            return (
              <FormItem>
                <FormLabel>Status</FormLabel>

                <Select
                  value={field.value ?? ""}
                  onValueChange={(value) => field.onChange(value ?? "")}
                  disabled={isPending}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue>
                        {selectedStatus?.label ?? "Select status"}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    {TRACK_STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <p className="text-xs text-muted-foreground">
                  Only active tracks can be selected when creating sessions.
                </p>

                <FormMessage />
              </FormItem>
            );
          }}
        />

        {/* ----------------------------------------------------------------- */}
        {/* Track Leaders (optional)                                          */}
        {/* ----------------------------------------------------------------- */}

        <FormField
          control={form.control}
          name="trackLeaderIds"
          render={() => (
            <FormItem>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <FormLabel>
                  Track Leaders{" "}
                  <span className="font-normal text-muted-foreground">
                    (optional)
                  </span>
                </FormLabel>

                <span className="text-xs text-muted-foreground">
                  {selectedLeaders.length} selected
                </span>
              </div>

              {hasUnavailableLeaders && (
                <div className="flex items-start gap-2 rounded-md border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-amber-700 dark:text-amber-400">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />

                  <p>
                    One or more previously assigned track leaders are
                    unavailable. Please select replacement faculty members.
                  </p>
                </div>
              )}

              {/* Faculty Search */}
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  value={facultySearch}
                  onChange={(event) => setFacultySearch(event.target.value)}
                  placeholder="Search name, email or mobile..."
                  className="pl-9 pr-10"
                  aria-label="Search faculties"
                  disabled={isPending}
                />

                {facultySearch && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 size-8 -translate-y-1/2"
                    onClick={() => setFacultySearch("")}
                    aria-label="Clear search"
                    disabled={isPending}
                  >
                    <X className="size-4" />
                  </Button>
                )}
              </div>

              {/* Selected Track Leaders */}
              {selectedLeaders.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedLeaders.map((id) => {
                    const faculty = validFaculties.find(
                      (item) => item._id === id,
                    );

                    return (
                      <button
                        key={id}
                        type="button"
                        disabled={isPending}
                        onClick={() => toggleLeader(id, false)}
                        className="inline-flex items-center gap-1.5 rounded-full border bg-muted px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted/70"
                      >
                        <span>{faculty?.fullName ?? "Unavailable faculty"}</span>

                        <X className="size-3.5" />
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Faculty List */}
              <div className="max-h-64 space-y-1 overflow-y-auto rounded-lg border p-2">
                {filteredFaculties.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    {facultySearch
                      ? "No faculties match your search."
                      : "No faculties available."}
                  </p>
                ) : (
                  filteredFaculties.map((faculty) => {
                    const checked = selectedLeaders.includes(faculty._id);

                    return (
                      <label
                        key={faculty._id}
                        className="flex cursor-pointer items-start gap-3 rounded-md p-3 transition-colors hover:bg-muted/60"
                      >
                        <Checkbox
                          checked={checked}
                          disabled={isPending}
                          onCheckedChange={(value) =>
                            toggleLeader(faculty._id, value === true)
                          }
                          className="mt-1"
                        />

                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-medium">
                            {faculty.fullName}
                          </span>

                          <span className="block truncate text-xs text-muted-foreground">
                            {faculty.email}
                          </span>

                          <span className="block text-xs text-muted-foreground">
                            {faculty.mobile}
                          </span>
                        </span>
                      </label>
                    );
                  })
                )}
              </div>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* ----------------------------------------------------------------- */}
        {/* Form Actions                                                      */}
        {/* ----------------------------------------------------------------- */}

        <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
            className="h-11 px-5"
          >
            Cancel
          </Button>

          <Button type="submit" disabled={isPending} className="h-11 px-5">
            {isPending
              ? "Saving..."
              : track
                ? "Update Track"
                : "Create Track"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
