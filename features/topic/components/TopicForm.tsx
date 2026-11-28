
"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import {
  Check,
  Search,
  Users,
  X,
  CalendarDays,
  Clock3,
  MapPin,
  Layers3,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { formatDateOnly } from "@/lib/formatIndianDate";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { topicSchema } from "../topic.schema";
import { TOPIC_FORM_DEFAULTS, TOPIC_TYPES } from "../topic.config";

import type {
  Topic,
  TopicFaculty,
  TopicFormValues,
  TopicReference,
  TopicSession,
} from "../topic.types";
import { SessionTimePicker } from "@/components/common/session-time-picker";

interface TopicFormProps {
  topic: Topic | null;
  sessions: TopicSession[];
  faculties: TopicFaculty[];
  isLoadingOptions?: boolean;
  isPending?: boolean;
  error?: string | null;
  onSubmit: (values: TopicFormValues) => void;
  onCancel: () => void;
}

type FacultyField =
  | "facultyId"
  | "moderatorId"
  | "panelistId"
  | "expertPanelistId";

const FACULTY_FIELDS: {
  name: FacultyField;
  label: string;
  description: string;
}[] = [
  {
    name: "facultyId",
    label: "Faculty",
    description: "Assign faculty members to this topic.",
  },
  {
    name: "moderatorId",
    label: "Moderators",
    description: "Select moderators for this topic.",
  },
  {
    name: "panelistId",
    label: "Panelists",
    description: "Select panel members for this topic.",
  },
  {
    name: "expertPanelistId",
    label: "Expert Panelists",
    description: "Select expert panel members.",
  },
];

function getIds(
  values: TopicReference<TopicFaculty>[],
): string[] {
  if (!Array.isArray(values)) return [];

  return values
    .map((item) =>
      typeof item === "string" ? item : item?._id,
    )
    .filter((id): id is string => Boolean(id));
}

function getSessionId(
  session: TopicReference<TopicSession>,
): string {
  if (!session) return "";
  return typeof session === "string" ? session : session._id;
}

function FacultyAssignmentCard({
  label,
  description,
  faculties,
  value,
  onChange,
  disabled,
}: {
  label: string;
  description: string;
  faculties: TopicFaculty[];
  value: string[];
  onChange: (value: string[]) => void;
  disabled: boolean;
}) {
  const [search, setSearch] = useState("");

  const filteredFaculties = useMemo(() => {
  const term = search.trim().toLowerCase();

  if (!term) return [];

  return faculties.filter((faculty) =>
    [faculty.fullName, faculty.email, faculty.mobile].some((item) =>
      item?.toLowerCase().includes(term),
    ),
  );
}, [faculties, search]);

  const selectedFaculties = value
    .map((id) => faculties.find((faculty) => faculty._id === id))
    .filter((faculty): faculty is TopicFaculty => Boolean(faculty));

  const toggleFaculty = (id: string, checked: boolean) => {
    const next = checked
      ? [...new Set([...value, id])]
      : value.filter((item) => item !== id);

    onChange(next);
  };

  return (
    <section className="space-y-4 rounded-xl border bg-background p-4 shadow-sm">
      {/* Section heading */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h4 className="text-sm font-bold">{label}</h4>
          <p className="mt-1 text-xs text-muted-foreground">
            {description}
          </p>
        </div>

        <span className="rounded-full border bg-muted px-2.5 py-1 text-xs font-semibold">
          {value.length} selected
        </span>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search name, email or mobile..."
          className="h-10 pl-9 pr-10"
          disabled={disabled}
        />

        {search && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 size-8 -translate-y-1/2"
            onClick={() => setSearch("")}
            aria-label={`Clear ${label} search`}
          >
            <X className="size-4" />
          </Button>
        )}
      </div>

      {/* Selected members */}
      {selectedFaculties.length > 0 && (
        <div className="rounded-lg border bg-muted/30 p-3">
          <p className="mb-2 text-xs font-semibold text-muted-foreground">
            Selected {label}
          </p>

          <div className="flex flex-wrap gap-2">
            {selectedFaculties.map((faculty) => (
              <button
                key={faculty._id}
                type="button"
                disabled={disabled}
                onClick={() => toggleFaculty(faculty._id, false)}
                className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:border-destructive/40 hover:text-destructive disabled:opacity-50"
              >
                {faculty.fullName}
                <X className="size-3.5" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Faculty search results */}
{search.trim() ? (
  <div className="max-h-56 space-y-1 overflow-y-auto rounded-lg border bg-muted/20 p-2">
    {filteredFaculties.length === 0 ? (
      <p className="py-6 text-center text-sm text-muted-foreground">
        No matching faculty members found.
      </p>
    ) : (
      filteredFaculties.map((faculty) => {
        const checked = value.includes(faculty._id);

        return (
          <label
            key={faculty._id}
            className="flex cursor-pointer items-start gap-3 rounded-lg border border-transparent p-3 transition-colors hover:border-border hover:bg-background"
          >
            <Checkbox
              checked={checked}
              disabled={disabled}
              onCheckedChange={(checked) =>
                toggleFaculty(faculty._id, checked === true)
              }
              className="mt-1"
            />

            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold">
                {faculty.fullName}
              </span>

              <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                {faculty.email}
              </span>

              {faculty.mobile && (
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {faculty.mobile}
                </span>
              )}
            </span>

            {checked && (
              <Check className="mt-1 size-4 shrink-0 text-primary" />
            )}
          </label>
        );
      })
    )}
  </div>
) : (
  <p className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
    Start typing a name, email or mobile number to search faculty members.
  </p>
)}
    </section>
  );
}

export function TopicForm({
  topic,
  sessions,
  faculties,
  isLoadingOptions = false,
  isPending = false,
  error,
  onSubmit,
  onCancel,
}: TopicFormProps) {
  const form = useForm<TopicFormValues>({
    resolver: zodResolver(topicSchema) as Resolver<TopicFormValues>,
    defaultValues: TOPIC_FORM_DEFAULTS,
  });

  useEffect(() => {
    form.reset({
      sessionId: topic ? getSessionId(topic.sessionId) : "",
      topicName: topic?.topicName ?? "",
      startTime: topic?.startTime ?? "",
      endTime: topic?.endTime ?? "",
      topicType: topic?.topicType ?? "Talk",
      facultyId: topic ? getIds(topic.facultyId) : [],
      moderatorId: topic ? getIds(topic.moderatorId) : [],
      panelistId: topic ? getIds(topic.panelistId) : [],
      expertPanelistId: topic ? getIds(topic.expertPanelistId) : [],
    });
  }, [topic, form]);

  const handleFormSubmit = async (values: TopicFormValues) => {
    await onSubmit({
      ...values,
      topicName: values.topicName.trim(),
      startTime: values.startTime.trim().toUpperCase(),
      endTime: values.endTime.trim().toUpperCase(),
      facultyId: values.facultyId ?? [],
      moderatorId: values.moderatorId ?? [],
      panelistId: values.panelistId ?? [],
      expertPanelistId: values.expertPanelistId ?? [],
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6"
      >
        {error && (
          <div
            role="alert"
            className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive"
          >
            {error}
          </div>
        )}

        {/* Topic details */}
        <section className="space-y-5 rounded-xl border bg-muted/30 p-4 sm:p-5">
          <div className="border-b pb-3">
            <h3 className="text-sm font-bold">Topic Details</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Enter the session, topic information and schedule.
            </p>
          </div>

          {isLoadingOptions && (
            <p className="text-xs text-muted-foreground">
              Loading sessions and faculty members...
            </p>
          )}

          
<FormField
  control={form.control}
  name="sessionId"
  render={({ field }) => {
    const selectedSession = sessions.find(
      (session) => session._id === field.value,
    );

    return (
      <FormItem>
        <FormLabel className="text-sm font-semibold">
          Session *
        </FormLabel>

        <Select
          value={field.value}
          onValueChange={field.onChange}
          disabled={isLoadingOptions || isPending}
        >
          <FormControl>
            <SelectTrigger className="h-11 w-full bg-background">
              <SelectValue placeholder="Select a session">
                {selectedSession?.sessionName}
              </SelectValue>
            </SelectTrigger>
          </FormControl>

          <SelectContent className="max-h-[350px]">
            {sessions.map((session) => (
              <SelectItem
                key={session._id}
                value={session._id}
                className="cursor-pointer py-3"
              >
                <div className="flex w-full min-w-0 flex-col gap-2 py-1">

                  {/* Session name */}
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Layers3 className="size-4" />
                    </div>

                    <span className="text-sm font-semibold text-foreground">
                      {session.sessionName}
                    </span>
                  </div>

                  {/* Session date and time */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pl-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="size-3.5 text-primary" />
                      {formatDateOnly(session.sessionDate)}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <Clock3 className="size-3.5 text-primary" />
                      {session.startTime} – {session.endTime}
                    </span>
                  </div>

                  {/* Hall and track */}
                  <div className="flex flex-wrap items-center gap-2 pl-1">
                    <span className="inline-flex items-center gap-1 rounded-md border bg-muted/50 px-2 py-1 text-[11px] font-medium text-muted-foreground">
                      <MapPin className="size-3" />
                      {session.hallId?.hallName ?? "No Hall"}
                    </span>

                    <span className="inline-flex items-center gap-1 rounded-md border bg-muted/50 px-2 py-1 text-[11px] font-medium text-muted-foreground">
                      <Layers3 className="size-3" />
                      {session.trackId?.trackName ?? "No Track"}
                    </span>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Selected session details */}
        {selectedSession && (
          <div className="rounded-lg border bg-muted/30 p-3 space-y-2">
            <div className="flex items-center gap-2">
              <CalendarDays className="size-4 text-primary shrink-0" />
              <span className="text-sm font-medium">
                {formatDateOnly(selectedSession.sessionDate)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Clock3 className="size-4 text-primary shrink-0" />
              <span className="text-sm text-muted-foreground">
                {selectedSession.startTime} – {selectedSession.endTime}
              </span>
            </div>
          </div>
        )}

        <FormMessage />
      </FormItem>
    );
  }}
/>


          <FormField
  control={form.control}
  name="topicName"
  render={({ field }) => (
    <FormItem>
      <FormLabel className="text-sm font-semibold">
        Topic Name *
      </FormLabel>

      <FormControl>
        <Textarea
          {...field}
          placeholder="Enter topic name"
          maxLength={1000}
          disabled={isPending}
          className="min-h-24 bg-background resize-none"
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

          <FormField
            control={form.control}
            name="topicType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Topic Type *
                </FormLabel>

                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isPending}
                >
                  <FormControl>
                    <SelectTrigger className="h-10 w-full bg-background">
                      <SelectValue placeholder="Select topic type" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    {TOPIC_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        {/* Faculty assignments */}
        <section className="space-y-5">
          <div className="space-y-2 text-center">
            <div className="mx-auto flex size-10 items-center justify-center rounded-full border bg-muted">
              <Users className="size-5 text-primary" />
            </div>

            <h3 className="text-md font-bold">
              Assign Faculty Members
            </h3>

            <p className="text-sm text-muted-foreground">
              All faculty assignments are optional. You can select multiple members in each group.
            </p>
          </div>

          <div className="grid gap-4">
            {FACULTY_FIELDS.map((item) => (
              <FormField
                key={item.name}
                control={form.control}
                name={item.name}
                render={({ field }) => (
                  <FormItem>
                    <FacultyAssignmentCard
                      label={item.label}
                      description={item.description}
                      faculties={faculties}
                      value={field.value ?? []}
                      onChange={field.onChange}
                      disabled={isPending || isLoadingOptions}
                    />
                  </FormItem>
                )}
              />
            ))}
          </div>
        </section>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 border-t pt-4 sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
            className="h-11 px-5"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={isPending || isLoadingOptions}
            className="h-11 px-5"
          >
            {isPending
              ? "Saving..."
              : topic
                ? "Update Topic"
                : "Create Topic"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
