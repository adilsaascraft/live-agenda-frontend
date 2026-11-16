
"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  type Resolver,
} from "react-hook-form";
import { Search, X, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/common/date-picker";

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

import { SessionTimePicker } from "@/components/common/session-time-picker";

import {
  sessionSchema,
  type SessionFormValues,
} from "../session.schema";

import type {
  Session,
  SessionFaculty,
  SessionHall,
  SessionTrack,
} from "../session.types";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface SessionFormProps {
  session?: Session | null;
  halls: SessionHall[];
  tracks: SessionTrack[];
  faculties: SessionFaculty[];
  isPending?: boolean;
  onSubmit: (values: SessionFormValues) => Promise<void>;
  onCancel: () => void;
}

type ReferenceValue =
  | string
  | { _id?: unknown }
  | null
  | undefined;

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

  return typeof reference._id === "string"
    ? reference._id.trim()
    : "";
}

/**
 * Safely converts an API date into a local Date.
 */
function getLocalDate(
  value: string | Date | null | undefined,
): Date | undefined {
  if (!value) return undefined;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
}

/**
 * Creates safe form defaults for create and edit modes.
 */
function getSessionDefaults(
  session?: Session | null,
): SessionFormValues {
  const chairpersonIds = (session?.chairperson ?? [])
    .map((item) => getReferenceId(item))
    .filter(Boolean);

  return {
    sessionName: session?.sessionName ?? "",
    hallId: getReferenceId(session?.hallId),
    trackId: getReferenceId(session?.trackId),
    sessionDate: getLocalDate(session?.sessionDate) ?? new Date(),
    startTime: session?.startTime ?? "",
    endTime: session?.endTime ?? "",
    chairperson: [...new Set(chairpersonIds)],
  };
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function SessionForm({
  session,
  halls,
  tracks,
  faculties,
  isPending = false,
  onSubmit,
  onCancel,
}: SessionFormProps) {
  const [facultySearch, setFacultySearch] = useState("");

  // ---------------------------------------------------------------------------
  // Safe lookup data
  // ---------------------------------------------------------------------------

  const validHalls = useMemo(
    () =>
      (halls ?? []).filter(
        (hall): hall is SessionHall =>
          Boolean(
            hall &&
              typeof hall._id === "string" &&
              hall._id.trim(),
          ),
      ),
    [halls],
  );

  const validTracks = useMemo(
    () =>
      (tracks ?? []).filter(
        (track): track is SessionTrack =>
          Boolean(
            track &&
              typeof track._id === "string" &&
              track._id.trim(),
          ),
      ),
    [tracks],
  );

  const validFaculties = useMemo(
    () =>
      (faculties ?? []).filter(
        (faculty): faculty is SessionFaculty =>
          Boolean(
            faculty &&
              typeof faculty._id === "string" &&
              faculty._id.trim(),
          ),
      ),
    [faculties],
  );

  // ---------------------------------------------------------------------------
  // Form initialization
  // ---------------------------------------------------------------------------

  const defaultValues = useMemo(
    () => getSessionDefaults(session),
    [session],
  );

  const form = useForm<SessionFormValues>({
    resolver: zodResolver(sessionSchema) as Resolver<SessionFormValues>,
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
    setFacultySearch("");
  }, [defaultValues, form]);

  // ---------------------------------------------------------------------------
  // Watched values
  // ---------------------------------------------------------------------------

  const selectedChairpersons =
    form.watch("chairperson") ?? [];

  const selectedHallId = form.watch("hallId");
  const selectedTrackId = form.watch("trackId");

  // ---------------------------------------------------------------------------
  // Missing / deleted reference detection
  // ---------------------------------------------------------------------------

  const originalHallId = getReferenceId(session?.hallId);
  const originalTrackId = getReferenceId(session?.trackId);

  const hasUnavailableHall = Boolean(
    session &&
      (
        !originalHallId ||
        !validHalls.some((hall) => hall._id === originalHallId)
      ),
  );

  const hasUnavailableTrack = Boolean(
    session &&
      (
        !originalTrackId ||
        !validTracks.some((track) => track._id === originalTrackId)
      ),
  );

  const originalChairpersons = session?.chairperson ?? [];

  const hasUnavailableChairpersons = Boolean(
    session &&
      originalChairpersons.some((item) => {
        const id = getReferenceId(item);

        return (
          !id ||
          !validFaculties.some((faculty) => faculty._id === id)
        );
      }),
  );

  // ---------------------------------------------------------------------------
  // Faculty search
  // ---------------------------------------------------------------------------

  const filteredFaculties = useMemo(() => {
    const search = facultySearch.trim().toLowerCase();

    if (!search) return validFaculties;

    return validFaculties.filter((faculty) =>
      [
        faculty.fullName,
        faculty.email,
        faculty.mobile,
      ].some((value) =>
        String(value ?? "").toLowerCase().includes(search),
      ),
    );
  }, [validFaculties, facultySearch]);

  // ---------------------------------------------------------------------------
  // Chairperson selection
  // ---------------------------------------------------------------------------

  const toggleChairperson = (
    facultyId: string,
    checked: boolean,
  ) => {
    const id = facultyId.trim();

    if (!id) return;

    const current = form.getValues("chairperson") ?? [];

    const next = checked
      ? [...new Set([...current, id])]
      : current.filter((selectedId) => selectedId !== id);

    form.setValue("chairperson", next, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------

  const handleFormSubmit = async (
    values: SessionFormValues,
  ) => {
    const cleanedValues: SessionFormValues = {
      ...values,
      hallId: getReferenceId(values.hallId),
      trackId: getReferenceId(values.trackId),
      chairperson: [
        ...new Set(
          (values.chairperson ?? [])
            .filter(
              (id): id is string =>
                typeof id === "string" && Boolean(id.trim()),
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
        {/* Session Name                                                     */}
        {/* ----------------------------------------------------------------- */}

        <FormField
          control={form.control}
          name="sessionName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Session Name</FormLabel>

              <FormControl>
                <Input
                  {...field}
                  autoFocus
                  placeholder="Enter session name"
                  disabled={isPending}
                  maxLength={100}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />


{/* ----------------------------------------------------------------- */}
{/* Hall and Track                                                    */}
{/* ----------------------------------------------------------------- */}

<div className="grid gap-5 sm:grid-cols-2">
  <FormField
    control={form.control}
    name="hallId"
    render={({ field }) => {
      const selectedHall = validHalls.find(
        (hall) => hall._id === field.value,
      );

      return (
        <FormItem>
          <FormLabel>Hall</FormLabel>

          <Select
            value={field.value ?? ""}
            onValueChange={(value) => field.onChange(value ?? "")}
            disabled={isPending}
          >
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue>
                  {selectedHall?.hallName ??
                    (hasUnavailableHall
                      ? "Previous hall unavailable — select a hall"
                      : "Select hall")}
                </SelectValue>
              </SelectTrigger>
            </FormControl>

            <SelectContent className="max-h-72">
              {validHalls.map((hall) => (
                <SelectItem key={hall._id} value={hall._id}>
                  {hall.hallName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasUnavailableHall && (
            <p className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
              <AlertCircle className="size-3.5 shrink-0" />
              The previously assigned hall is unavailable.
              Please select another hall.
            </p>
          )}

          <FormMessage />
        </FormItem>
      );
    }}
  />

  <FormField
    control={form.control}
    name="trackId"
    render={({ field }) => {
      const selectedTrack = validTracks.find(
        (track) => track._id === field.value,
      );

      return (
        <FormItem>
          <FormLabel>Track</FormLabel>

          <Select
            value={field.value ?? ""}
            onValueChange={(value) => field.onChange(value ?? "")}
            disabled={isPending}
          >
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue>
                  {selectedTrack?.trackName ??
                    (hasUnavailableTrack
                      ? "Previous track unavailable — select a track"
                      : "Select track")}
                </SelectValue>
              </SelectTrigger>
            </FormControl>

            <SelectContent className="max-h-72">
              {validTracks.map((track) => (
                <SelectItem key={track._id} value={track._id}>
                  {track.trackName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasUnavailableTrack && (
            <p className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
              <AlertCircle className="size-3.5 shrink-0" />
              The previously assigned track is unavailable.
              Please select another track.
            </p>
          )}

          <FormMessage />
        </FormItem>
      );
    }}
  />
</div>


        {/* ----------------------------------------------------------------- */}
        {/* Session Date                                                     */}
        {/* ----------------------------------------------------------------- */}

        <FormField
          control={form.control}
          name="sessionDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Session Date</FormLabel>

              <FormControl>
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isPending}
                  placeholder="DD/MM/YYYY"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* ----------------------------------------------------------------- */}
        {/* Start Time and End Time                                          */}
        {/* ----------------------------------------------------------------- */}

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="startTime"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel id="session-start-time-label">
                  Start Time
                </FormLabel>

                <FormControl>
                  <SessionTimePicker
                    id="session-start-time"
                    labelId="session-start-time-label"
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    disabled={isPending}
                    invalid={fieldState.invalid}
                  />
                </FormControl>

                <p className="text-xs text-muted-foreground">
                  Select the session start time.
                </p>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endTime"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel id="session-end-time-label">
                  End Time
                </FormLabel>

                <FormControl>
                  <SessionTimePicker
                    id="session-end-time"
                    labelId="session-end-time-label"
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    disabled={isPending}
                    invalid={fieldState.invalid}
                  />
                </FormControl>

                <p className="text-xs text-muted-foreground">
                  Select the session end time.
                </p>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Chairpersons                                                     */}
        {/* ----------------------------------------------------------------- */}

        <FormField
          control={form.control}
          name="chairperson"
          render={() => (
            <FormItem>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <FormLabel>Chairpersons</FormLabel>

                <span className="text-xs text-muted-foreground">
                  {selectedChairpersons.length} selected
                </span>
              </div>

              {hasUnavailableChairpersons && (
                <div className="flex items-start gap-2 rounded-md border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-amber-700 dark:text-amber-400">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />

                  <p>
                    One or more previously assigned chairpersons
                    are unavailable. Please select replacement
                    faculty members.
                  </p>
                </div>
              )}

              
{/* Faculty Search - matching the Faculty module */}
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


              {/* Selected Chairpersons */}
              {selectedChairpersons.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedChairpersons.map((id) => {
                    const faculty = validFaculties.find(
                      (item) => item._id === id,
                    );

                    return (
                      <button
                        key={id}
                        type="button"
                        disabled={isPending}
                        onClick={() =>
                          toggleChairperson(id, false)
                        }
                        className="inline-flex items-center gap-1.5 rounded-full border bg-muted px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted/70"
                      >
                        <span>
                          {faculty?.fullName ?? "Unavailable faculty"}
                        </span>

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
                    const checked =
                      selectedChairpersons.includes(faculty._id);

                    return (
                      <label
                        key={faculty._id}
                        className="flex cursor-pointer items-start gap-3 rounded-md p-3 transition-colors hover:bg-muted/60"
                      >
                        <Checkbox
                          checked={checked}
                          disabled={isPending}
                          onCheckedChange={(value) =>
                            toggleChairperson(
                              faculty._id,
                              value === true,
                            )
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
        {/* Form Actions                                                     */}
        {/* ----------------------------------------------------------------- */}

        <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={isPending}
          >
            {isPending
              ? "Saving..."
              : session
                ? "Update Session"
                : "Create Session"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
