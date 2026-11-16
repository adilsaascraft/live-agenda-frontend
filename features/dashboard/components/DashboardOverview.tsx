
"use client";

import Link from "next/link";

import {
  AudioLines,
  Building2,
  CalendarDays,
  Clock3,
  GraduationCap,
  Layers3,
  RefreshCw,
  Users,
  Activity,
  ArrowUpRight,
  CalendarCheck,
  CalendarClock,
  CalendarX,
} from "lucide-react";

import type {
  DashboardData,
  DashboardSession,
  DistributionItem,
} from "../dashboard.types";

interface Props {
  data: DashboardData;
  onRefresh: () => void;
  isRefreshing: boolean;
}

const numberFormatter = new Intl.NumberFormat("en-IN");

function formatNumber(value: number | undefined): string {
  return numberFormatter.format(value ?? 0);
}

function formatDate(value?: string): string {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getSessionHall(session: DashboardSession): string {
  if (typeof session.hallId === "object" && session.hallId) {
    return session.hallId.hallName;
  }

  return "Hall not assigned";
}

function getSessionTrack(session: DashboardSession): string {
  if (typeof session.trackId === "object" && session.trackId) {
    return session.trackId.trackName;
  }

  return "Track not assigned";
}

function getDistributionLabel(item: DistributionItem): string {
  return item.name || item.label || "Unassigned";
}

function Panel({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="min-w-0 rounded-xl border bg-card shadow-sm">
      <div className="flex items-start justify-between gap-3 border-b px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
          {subtitle && (
            <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  iconClass,
  href,
}: {
  title: string;
  value: number;
  description: string;
  icon: React.ElementType;
  iconClass: string;
  href?: string;
}) {
  const content = (
    <div className="rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight">
            {formatNumber(value)}
          </p>
        </div>

        <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}>
          <Icon className="size-5" />
        </div>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">{description}</p>
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}

function MetricBar({
  label,
  value,
  total,
}: {
  label: string;
  value: number;
  total: number;
}) {
  const percentage = total > 0 ? Math.min((value / total) * 100, 100) : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="truncate text-muted-foreground">{label}</span>
        <span className="shrink-0 font-semibold tabular-nums">
          {formatNumber(value)}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function DistributionPanel({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle: string;
  items: DistributionItem[];
}) {
  const total = items.reduce((sum, item) => sum + item.count, 0);

  return (
    <Panel title={title} subtitle={subtitle}>
      {items.length === 0 ? (
        <EmptyState message="No distribution data available yet." />
      ) : (
        <div className="space-y-5">
          {items.map((item, index) => (
            <MetricBar
              key={`${getDistributionLabel(item)}-${index}`}
              label={getDistributionLabel(item)}
              value={item.count}
              total={Math.max(...items.map((entry) => entry.count), 1)}
            />
          ))}
          <div className="border-t pt-3 text-xs text-muted-foreground">
            Total: {formatNumber(total)}
          </div>
        </div>
      )}
    </Panel>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex min-h-28 items-center justify-center rounded-lg border border-dashed bg-muted/20 px-4 text-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}

function StatusRow({
  label,
  total,
  active,
  inactive,
}: {
  label: string;
  total: number;
  active: number;
  inactive: number;
}) {
  return (
    <div className="space-y-3 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-lg font-semibold tabular-nums">
          {formatNumber(total)}
        </span>
      </div>

      <div className="flex h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="bg-emerald-500"
          style={{
            width: `${total > 0 ? (active / total) * 100 : 0}%`,
          }}
        />
        <div
          className="bg-muted-foreground/30"
          style={{
            width: `${total > 0 ? (inactive / total) * 100 : 0}%`,
          }}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="flex items-center gap-1.5 text-emerald-600">
          <span className="size-2 rounded-full bg-emerald-500" />
          {active} Active
        </span>
        <span className="text-muted-foreground">{inactive} Inactive</span>
      </div>
    </div>
  );
}

function ScheduleMetric({
  label,
  value,
  icon: Icon,
  iconClass,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  iconClass: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border p-4">
      <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${iconClass}`}>
        <Icon className="size-5" />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-semibold tabular-nums">
          {formatNumber(value)}
        </p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

function UpcomingSessionItem({ session }: { session: DashboardSession }) {
  return (
    <div className="flex gap-3 border-b py-4 last:border-0 last:pb-0 first:pt-0">
      <div className="flex size-11 shrink-0 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary">
        <CalendarDays className="size-5" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{session.sessionName}</p>

        <p className="mt-1 text-xs text-muted-foreground">
          {formatDate(session.sessionDate)} · {session.startTime} – {session.endTime}
        </p>

        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Building2 className="size-3.5" />
            {getSessionHall(session)}
          </span>
          <span className="inline-flex items-center gap-1">
            <AudioLines className="size-3.5" />
            {getSessionTrack(session)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function DashboardOverview({
  data,
  onRefresh,
  isRefreshing,
}: Props) {
  const { summary, statusOverview, scheduleOverview, distributions, lists } =
    data;

  const today = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }).format(new Date());

  return (
    <div className="space-y-7">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-primary">Workspace overview</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor your event agenda, sessions, topics, and resources.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-xs text-muted-foreground">Today</p>
            <p className="text-sm font-medium">{today}</p>
          </div>

          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border bg-card px-4 text-sm font-medium transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw className={`size-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="Total Sessions"
          value={summary.totalSessions}
          description="All scheduled sessions"
          icon={CalendarDays}
          iconClass="bg-blue-500/10 text-blue-600"
          href="/sessions"
        />

        <StatCard
          title="Total Topics"
          value={summary.totalTopics}
          description="Topics across all sessions"
          icon={Layers3}
          iconClass="bg-violet-500/10 text-violet-600"
        />

        <StatCard
          title="Faculty"
          value={summary.totalFaculty}
          description="Registered faculty members"
          icon={GraduationCap}
          iconClass="bg-amber-500/10 text-amber-600"
          href="/faculty"
        />

        <StatCard
          title="Halls"
          value={summary.totalHalls}
          description="Available event halls"
          icon={Building2}
          iconClass="bg-emerald-500/10 text-emerald-600"
          href="/halls"
        />

        <StatCard
          title="Tracks"
          value={summary.totalTracks}
          description="Configured event tracks"
          icon={AudioLines}
          iconClass="bg-orange-500/10 text-orange-600"
          href="/tracks"
        />
      </div>

      {/* Schedule and resource status */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Panel
          title="Schedule overview"
          subtitle="Session distribution by date"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">
            <ScheduleMetric
              label="Today's sessions"
              value={scheduleOverview.todaySessions}
              icon={CalendarCheck}
              iconClass="bg-emerald-500/10 text-emerald-600"
            />
            <ScheduleMetric
              label="Upcoming sessions"
              value={scheduleOverview.upcomingSessions}
              icon={CalendarClock}
              iconClass="bg-blue-500/10 text-blue-600"
            />
            <ScheduleMetric
              label="Past sessions"
              value={scheduleOverview.pastSessions}
              icon={CalendarX}
              iconClass="bg-muted text-muted-foreground"
            />
          </div>
        </Panel>

        <Panel
          title="Resource status"
          subtitle="Active and inactive resources"
        >
          <div className="space-y-4">
            <StatusRow
              label="Halls"
              total={statusOverview.halls.total}
              active={statusOverview.halls.active}
              inactive={statusOverview.halls.inactive}
            />
            <StatusRow
              label="Tracks"
              total={statusOverview.tracks.total}
              active={statusOverview.tracks.active}
              inactive={statusOverview.tracks.inactive}
            />
          </div>
        </Panel>

        <Panel
          title="Faculty assignments"
          subtitle="Assignment distribution by role"
        >
          {distributions.facultyAssignmentsByRole.length === 0 ? (
            <EmptyState message="No faculty assignments available yet." />
          ) : (
            <div className="space-y-5">
              {distributions.facultyAssignmentsByRole.map((item) => (
                <MetricBar
                  key={item.role}
                  label={item.role}
                  value={item.count}
                  total={Math.max(
                    ...distributions.facultyAssignmentsByRole.map(
                      (entry) => entry.count,
                    ),
                    1,
                  )}
                />
              ))}
            </div>
          )}
        </Panel>
      </div>

      {/* Distributions */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <DistributionPanel
          title="Sessions by hall"
          subtitle="Number of sessions assigned to each hall"
          items={distributions.sessionsByHall}
        />

        <DistributionPanel
          title="Sessions by track"
          subtitle="Number of sessions assigned to each track"
          items={distributions.sessionsByTrack}
        />

        <DistributionPanel
          title="Topics by type"
          subtitle="Breakdown of configured topic types"
          items={distributions.topicsByType}
        />
      </div>

      {/* Upcoming sessions and top faculty */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Panel
          title="Upcoming sessions"
          subtitle="Your next scheduled sessions"
          action={
            <Link
              href="/sessions"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              View all <ArrowUpRight className="size-3.5" />
            </Link>
          }
        >
          {lists.upcomingSessions.length === 0 ? (
            <EmptyState message="No upcoming sessions found." />
          ) : (
            <div>
              {lists.upcomingSessions.map((session) => (
                <UpcomingSessionItem
                  key={session._id}
                  session={session}
                />
              ))}
            </div>
          )}
        </Panel>

        <Panel
          title="Top assigned faculty"
          subtitle="Faculty members with the most agenda assignments"
        >
          {distributions.topAssignedFaculty.length === 0 ? (
            <EmptyState message="No faculty assignments found." />
          ) : (
            <div className="space-y-4">
              {distributions.topAssignedFaculty.map((faculty, index) => (
                <div
                  key={faculty.facultyId || faculty._id || faculty.email || index}
                  className="flex items-center gap-3"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {faculty.fullName?.charAt(0)?.toUpperCase() || "F"}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {faculty.fullName}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {faculty.email || "Faculty"}
                    </p>
                  </div>

                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold tabular-nums">
                    {faculty.count} assignments
                  </span>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Panel
          title="Recent sessions"
          subtitle="Recently created sessions"
          action={
            <Link
              href="/sessions"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              View all <ArrowUpRight className="size-3.5" />
            </Link>
          }
        >
          {lists.recentSessions.length === 0 ? (
            <EmptyState message="No sessions have been created yet." />
          ) : (
            <div className="space-y-3">
              {lists.recentSessions.map((session) => (
                <div
                  key={session._id}
                  className="flex items-center gap-3 rounded-lg border p-3"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
                    <Clock3 className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {session.sessionName}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDate(session.sessionDate)} · {session.startTime}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>

        <Panel
          title="Recent topics"
          subtitle="Recently added agenda topics"
        >
          {lists.recentTopics.length === 0 ? (
            <EmptyState message="No topics have been created yet." />
          ) : (
            <div className="space-y-3">
              {lists.recentTopics.map((topic) => {
                const sessionName =
                  typeof topic.sessionId === "object" && topic.sessionId
                    ? topic.sessionId.sessionName
                    : null;

                return (
                  <div
                    key={topic._id}
                    className="flex items-center gap-3 rounded-lg border p-3"
                  >
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-600">
                      <Activity className="size-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {topic.topicName}
                      </p>
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {topic.topicType}
                        {sessionName ? ` · ${sessionName}` : ""}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Panel>
      </div>

      <p className="text-right text-xs text-muted-foreground">
        Last updated: {formatDate(data.generatedAt)}
      </p>
    </div>
  );
}
