"use client";

import { useEffect, useMemo, useState } from "react";
import type { ElementType, ReactNode } from "react";
import Link from "next/link";
import { MotionConfig, motion } from "framer-motion";
import type { Variants } from "framer-motion";

import {
  Activity,
  AlertCircle,
  AudioLines,
  Building2,
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  CalendarX,
  Clock3,
  GraduationCap,
  Info,
  Layers3,
  ListChecks,
  RefreshCw,
  Trophy,
  UserCheck,
  Users,
} from "lucide-react";

import type {
  AgendaSession,
  DashboardData,
  DashboardSession,
  DashboardTopic,
  DistributionItem,
  FacultyRoleKey,
  StatusCount,
  TopFaculty,
  UpcomingSession,
} from "../dashboard.types";
import {
  buildDashboardMetrics,
  formatDate,
  formatDayMonth,
  formatNow,
  formatNumber,
  formatShortDate,
  getInitials,
  relativeDayLabel,
} from "../dashboard.utils";

interface Props {
  data: DashboardData;
  onRefresh: () => void;
  isRefreshing: boolean;
  refreshError?: string | null;
}

/* ------------------------------------------------------------------ */
/*  Design tokens: every tone is a light tint with a light border      */
/* ------------------------------------------------------------------ */

const TONES = {
  sky: {
    card: "border-sky-100 bg-sky-50/70",
    tile: "border-sky-100 bg-white/70",
    icon: "bg-sky-100 text-sky-600",
    bar: "bg-sky-400",
    text: "text-sky-700",
    chip: "bg-sky-100 text-sky-700",
    ring: "stroke-sky-400",
    track: "stroke-sky-100",
  },
  indigo: {
    card: "border-indigo-100 bg-indigo-50/70",
    tile: "border-indigo-100 bg-white/70",
    icon: "bg-indigo-100 text-indigo-600",
    bar: "bg-indigo-400",
    text: "text-indigo-700",
    chip: "bg-indigo-100 text-indigo-700",
    ring: "stroke-indigo-400",
    track: "stroke-indigo-100",
  },
  violet: {
    card: "border-violet-100 bg-violet-50/70",
    tile: "border-violet-100 bg-white/70",
    icon: "bg-violet-100 text-violet-600",
    bar: "bg-violet-400",
    text: "text-violet-700",
    chip: "bg-violet-100 text-violet-700",
    ring: "stroke-violet-400",
    track: "stroke-violet-100",
  },
  emerald: {
    card: "border-emerald-100 bg-emerald-50/70",
    tile: "border-emerald-100 bg-white/70",
    icon: "bg-emerald-100 text-emerald-600",
    bar: "bg-emerald-400",
    text: "text-emerald-700",
    chip: "bg-emerald-100 text-emerald-700",
    ring: "stroke-emerald-400",
    track: "stroke-emerald-100",
  },
  teal: {
    card: "border-teal-100 bg-teal-50/70",
    tile: "border-teal-100 bg-white/70",
    icon: "bg-teal-100 text-teal-600",
    bar: "bg-teal-400",
    text: "text-teal-700",
    chip: "bg-teal-100 text-teal-700",
    ring: "stroke-teal-400",
    track: "stroke-teal-100",
  },
  amber: {
    card: "border-amber-100 bg-amber-50/70",
    tile: "border-amber-100 bg-white/70",
    icon: "bg-amber-100 text-amber-600",
    bar: "bg-amber-400",
    text: "text-amber-700",
    chip: "bg-amber-100 text-amber-700",
    ring: "stroke-amber-400",
    track: "stroke-amber-100",
  },
  orange: {
    card: "border-orange-100 bg-orange-50/70",
    tile: "border-orange-100 bg-white/70",
    icon: "bg-orange-100 text-orange-600",
    bar: "bg-orange-400",
    text: "text-orange-700",
    chip: "bg-orange-100 text-orange-700",
    ring: "stroke-orange-400",
    track: "stroke-orange-100",
  },
  rose: {
    card: "border-rose-100 bg-rose-50/70",
    tile: "border-rose-100 bg-white/70",
    icon: "bg-rose-100 text-rose-600",
    bar: "bg-rose-400",
    text: "text-rose-700",
    chip: "bg-rose-100 text-rose-700",
    ring: "stroke-rose-400",
    track: "stroke-rose-100",
  },
  cyan: {
    card: "border-cyan-100 bg-cyan-50/70",
    tile: "border-cyan-100 bg-white/70",
    icon: "bg-cyan-100 text-cyan-600",
    bar: "bg-cyan-400",
    text: "text-cyan-700",
    chip: "bg-cyan-100 text-cyan-700",
    ring: "stroke-cyan-400",
    track: "stroke-cyan-100",
  },
  slate: {
    card: "border-slate-200 bg-slate-50/80",
    tile: "border-slate-200 bg-white/70",
    icon: "bg-slate-100 text-slate-500",
    bar: "bg-slate-300",
    text: "text-slate-600",
    chip: "bg-slate-100 text-slate-600",
    ring: "stroke-slate-300",
    track: "stroke-slate-100",
  },
} as const;

type Tone = keyof typeof TONES;

const ROLE_TONE: Record<FacultyRoleKey, Tone> = {
  faculty: "sky",
  moderator: "violet",
  panelist: "emerald",
  expertPanelist: "amber",
};

const TOPIC_TYPE_TONE: Record<string, Tone> = {
  Talk: "sky",
  Debate: "amber",
  "Panel Discussion": "violet",
};

const AVATAR_TONES: Tone[] = ["sky", "violet", "emerald", "amber", "rose", "teal", "indigo", "orange", "cyan", "slate"];

/* ------------------------------------------------------------------ */
/*  Motion                                                             */
/* ------------------------------------------------------------------ */

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.38, ease: "easeOut" } },
};

function AnimatedBar({
  percent,
  barClass,
  trackClass = "bg-white/80",
  delay = 0,
}: {
  percent: number;
  barClass: string;
  trackClass?: string;
  delay?: number;
}) {
  return (
    <div className={`h-2 overflow-hidden rounded-full ${trackClass}`}>
      <motion.div
        className={`h-full rounded-full ${barClass}`}
        initial={{ width: 0 }}
        animate={{ width: `${Math.max(0, Math.min(percent, 100))}%` }}
        transition={{ duration: 0.7, delay: 0.25 + delay, ease: "easeOut" }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hooks                                                              */
/* ------------------------------------------------------------------ */

function useNow(intervalMs = 30_000): Date {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
}

/* ------------------------------------------------------------------ */
/*  Building blocks                                                    */
/* ------------------------------------------------------------------ */

function Panel({
  title,
  subtitle,
  icon: Icon,
  tone,
  action,
  className = "",
  children,
}: {
  title: string;
  subtitle?: string;
  icon: ElementType;
  tone: Tone;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  const t = TONES[tone];

  return (
    <motion.section
      variants={itemVariants}
      className={`min-w-0 rounded-2xl border p-5 shadow-sm ${t.card} ${className}`}
    >
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${t.icon}`}>
            <Icon className="size-[18px]" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold tracking-tight text-slate-800">{title}</h2>
            {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
          </div>
        </div>
        {action}
      </div>
      {children}
    </motion.section>
  );
}

function EmptyState({ message, tone = "sky" }: { message: string; tone?: Tone }) {
  return (
    <div
      className={`flex min-h-28 items-center justify-center rounded-xl border border-dashed px-4 text-center text-sm text-slate-500 ${TONES[tone].tile}`}
    >
      {message}
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  tone,
  href,
}: {
  title: string;
  value: number;
  description: string;
  icon: ElementType;
  tone: Tone;
  href?: string;
}) {
  const t = TONES[tone];

  const content = (
    <div
      className={`h-full rounded-2xl border p-5 shadow-sm transition-shadow hover:shadow-md ${t.card}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-800 tabular-nums">
            {formatNumber(value)}
          </p>
        </div>
        <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${t.icon}`}>
          <Icon className="size-5" />
        </div>
      </div>
      <p className={`mt-4 truncate text-xs font-medium ${t.text}`}>{description}</p>
    </div>
  );

  return (
    <motion.div variants={itemVariants} whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
      {href ? (
        <Link href={href} className="block h-full rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400">
          {content}
        </Link>
      ) : (
        content
      )}
    </motion.div>
  );
}

/* ---------------------------- Resource status ---------------------------- */

function StatusRing({ percent, tone }: { percent: number; tone: Tone }) {
  const t = TONES[tone];
  const radius = 26;

  return (
    <div className="relative size-[68px] shrink-0">
      <svg viewBox="0 0 68 68" className="size-full -rotate-90" aria-hidden="true">
        <circle cx="34" cy="34" r={radius} fill="none" strokeWidth="7" className={t.track} />
        <motion.circle
          cx="34"
          cy="34"
          r={radius}
          fill="none"
          strokeWidth="7"
          strokeLinecap="round"
          className={t.ring}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: percent / 100 }}
          transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold tabular-nums text-slate-700">
        {Math.round(percent)}%
      </span>
    </div>
  );
}

function StatusRow({
  label,
  icon: Icon,
  tone,
  status,
}: {
  label: string;
  icon: ElementType;
  tone: Tone;
  status: StatusCount;
}) {
  const t = TONES[tone];
  const percent = status.total > 0 ? (status.active / status.total) * 100 : 0;

  return (
    <div className={`flex items-center gap-4 rounded-xl border p-4 ${t.tile}`}>
      <StatusRing percent={percent} tone={tone} />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <Icon className={`size-4 ${t.text}`} />
          <span className="text-sm font-semibold text-slate-800">{label}</span>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          {formatNumber(status.active)} of {formatNumber(status.total)} in use
        </p>
        <div className="mt-2.5 flex flex-wrap gap-2 text-xs font-medium">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-emerald-700">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            {formatNumber(status.active)} Active
          </span>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 ${
              status.inactive > 0 ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-500"
            }`}
          >
            <span className={`size-1.5 rounded-full ${status.inactive > 0 ? "bg-rose-500" : "bg-slate-400"}`} />
            {formatNumber(status.inactive)} Inactive
          </span>
        </div>
      </div>
    </div>
  );
}

/* --------------------------- Schedule overview --------------------------- */

function ScheduleMetric({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  icon: ElementType;
  tone: Tone;
}) {
  const t = TONES[tone];

  return (
    <div className={`rounded-xl border p-3 ${t.tile}`}>
      <div className={`mb-2 flex size-8 items-center justify-center rounded-lg ${t.icon}`}>
        <Icon className="size-4" />
      </div>
      <p className="text-2xl font-semibold tabular-nums text-slate-800">{formatNumber(value)}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}

/* ----------------------------- Distributions ----------------------------- */

function DistributionPanel({
  title,
  subtitle,
  icon,
  tone,
  items,
  unit,
  footnote,
}: {
  title: string;
  subtitle: string;
  icon: ElementType;
  tone: Tone;
  items: DistributionItem[];
  unit: string;
  footnote?: string;
}) {
  const t = TONES[tone];
  const total = items.reduce((sum, item) => sum + item.count, 0);
  const max = Math.max(...items.map((item) => item.count), 1);

  return (
    <Panel title={title} subtitle={subtitle} icon={icon} tone={tone}>
      {items.length === 0 ? (
        <EmptyState message="Nothing to show yet." tone={tone} />
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={item.label} className="space-y-1.5">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="truncate font-medium text-slate-700">{item.label}</span>
                <span className="shrink-0 tabular-nums text-slate-500">
                  <span className="font-semibold text-slate-800">{formatNumber(item.count)}</span>
                  <span className="ml-2 text-xs">
                    {total > 0 ? Math.round((item.count / total) * 100) : 0}%
                  </span>
                </span>
              </div>
              <AnimatedBar
                percent={(item.count / max) * 100}
                barClass={t.bar}
                delay={index * 0.05}
              />
            </div>
          ))}

          <div className={`flex items-center justify-between border-t pt-3 text-xs text-slate-500 ${t.card.split(" ")[0]}`}>
            <span>
              {formatNumber(total)} {unit} in total
            </span>
            {footnote && <span>{footnote}</span>}
          </div>
        </div>
      )}
    </Panel>
  );
}

/* ----------------------------- Session pieces ---------------------------- */

function DateBadge({ sessionDate, tone }: { sessionDate: string; tone: Tone }) {
  const { day, month } = formatDayMonth(sessionDate);

  return (
    <div className={`flex size-12 shrink-0 flex-col items-center justify-center rounded-xl ${TONES[tone].icon}`}>
      <span className="text-base font-semibold leading-none tabular-nums">{day}</span>
      <span className="mt-0.5 text-[11px] font-medium leading-none">{month}</span>
    </div>
  );
}

function PhaseBadge({ phase, label }: { phase: UpcomingSession["phase"]; label: string }) {
  if (phase === "live") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
        <span className="relative flex size-1.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60 motion-reduce:animate-none" />
          <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
        </span>
        Live now
      </span>
    );
  }

  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
        phase === "today" ? "bg-amber-100 text-amber-700" : "bg-sky-100 text-sky-700"
      }`}
    >
      {label}
    </span>
  );
}

function chairLabel(session: AgendaSession): string | null {
  if (session.chairpersons.length === 0) return null;
  const [first, ...rest] = session.chairpersons;
  return rest.length > 0 ? `${first.fullName} +${rest.length}` : first.fullName;
}

function UpcomingSessionItem({ session, now }: { session: UpcomingSession; now: Date }) {
  const chair = chairLabel(session);
  const label = relativeDayLabel(session.dateKey, session.sessionDate, now);

  return (
    <motion.li
      whileHover={{ x: 3 }}
      transition={{ duration: 0.15 }}
      className="flex gap-3 rounded-xl border border-sky-100 bg-white/70 p-3.5"
    >
      <DateBadge sessionDate={session.sessionDate} tone="sky" />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="truncate text-sm font-semibold text-slate-800">{session.name}</p>
          <PhaseBadge phase={session.phase} label={label} />
        </div>

        <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-slate-500">
          <Clock3 className="size-3.5" />
          {session.startTime} to {session.endTime}
        </p>

        <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-0.5 font-medium text-indigo-700">
            <Building2 className="size-3" />
            {session.hall}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-2 py-0.5 font-medium text-teal-700">
            <AudioLines className="size-3" />
            {session.track}
          </span>
          {chair && (
            <span className="inline-flex max-w-full items-center gap-1 truncate rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-600">
              <UserCheck className="size-3 shrink-0" />
              <span className="truncate">Chair: {chair}</span>
            </span>
          )}
        </div>
      </div>
    </motion.li>
  );
}

/* ------------------------------- Top faculty ------------------------------ */

const ROLE_SHORT: Record<FacultyRoleKey, string> = {
  faculty: "Faculty",
  moderator: "Moderator",
  panelist: "Panelist",
  expertPanelist: "Expert",
};

function TopFacultyRow({ faculty, rank, max }: { faculty: TopFaculty; rank: number; max: number }) {
  const tone = AVATAR_TONES[(rank - 1) % AVATAR_TONES.length];
  const t = TONES[tone];
  const roles = Object.entries(faculty.roles) as Array<[FacultyRoleKey, number]>;

  return (
    <motion.li
      whileHover={{ x: 3 }}
      transition={{ duration: 0.15 }}
      className="flex items-center gap-3 rounded-xl border border-rose-100 bg-white/70 p-3"
    >
      <div className="relative shrink-0">
        <div className={`flex size-10 items-center justify-center rounded-full text-sm font-semibold ${t.icon}`}>
          {getInitials(faculty.fullName)}
        </div>
        <span className="absolute -bottom-1 -right-1 flex size-[18px] items-center justify-center rounded-full border border-white bg-slate-700 text-[10px] font-semibold text-white tabular-nums">
          {rank}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-medium text-slate-800">{faculty.fullName}</p>
          <span className="shrink-0 rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-semibold tabular-nums text-rose-700">
            {faculty.total} {faculty.total === 1 ? "assignment" : "assignments"}
          </span>
        </div>

        <p className="truncate text-xs text-slate-500">{faculty.email || "Faculty member"}</p>

        <div className="mt-1.5 flex items-center gap-2">
          <div className="flex-1">
            <AnimatedBar percent={(faculty.total / max) * 100} barClass="bg-rose-400" trackClass="bg-rose-100/70" delay={rank * 0.04} />
          </div>
          {roles.length > 0 && (
            <div className="flex shrink-0 gap-1">
              {roles.map(([key, count]) => (
                <span
                  key={key}
                  className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${TONES[ROLE_TONE[key]].chip}`}
                >
                  {ROLE_SHORT[key]}
                  {count > 1 ? ` x${count}` : ""}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.li>
  );
}

/* ------------------------------ Recent activity --------------------------- */

function RecentSessionRow({ session }: { session: DashboardSession }) {
  const hall =
    typeof session.hallId === "object" && session.hallId?.hallName ? session.hallId.hallName : null;

  return (
    <li className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white/70 p-3">
      <DateBadge sessionDate={session.sessionDate} tone="cyan" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-800">{session.sessionName}</p>
        <p className="mt-0.5 truncate text-xs text-slate-500">
          {session.startTime} to {session.endTime}
          {hall ? ` in ${hall}` : ""}
        </p>
      </div>
    </li>
  );
}

function RecentTopicRow({ topic }: { topic: DashboardTopic }) {
  const session = typeof topic.sessionId === "object" && topic.sessionId ? topic.sessionId : null;
  const tone = TOPIC_TYPE_TONE[topic.topicType] ?? "slate";
  const t = TONES[tone];

  const people = [
    topic.facultyId,
    topic.moderatorId,
    topic.panelistId,
    topic.expertPanelistId,
  ].reduce((sum, list) => sum + (list?.length ?? 0), 0);

  return (
    <li className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white/70 p-3">
      <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${t.icon}`}>
        <Activity className="size-4" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-medium text-slate-800">{topic.topicName}</p>
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${t.chip}`}>
            {topic.topicType}
          </span>
        </div>
        <p className="mt-0.5 truncate text-xs text-slate-500">
          {session?.sessionName ?? "No session"}
          {topic.startTime && topic.endTime ? `, ${topic.startTime} to ${topic.endTime}` : ""}
          {people > 0 ? `, ${people} ${people === 1 ? "person" : "people"}` : ""}
        </p>
      </div>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function DashboardOverview({ data, onRefresh, isRefreshing, refreshError }: Props) {
  const { summary, statusOverview, lists } = data;

  const now = useNow();
  const metrics = useMemo(() => buildDashboardMetrics(data, now), [data, now]);

  const { schedule, completeness } = metrics;
  const maxByDate = Math.max(...schedule.byDate.map((d) => d.count), 1);
  const maxTopFaculty = Math.max(...metrics.topFaculty.map((f) => f.total), 1);
  const maxRole = Math.max(...metrics.roles.map((r) => r.unique), 1);
  const topicCount = (label: string) => metrics.topicTypes.find((t) => t.label === label)?.count ?? 0;

  const partial = !completeness.sessions || !completeness.topics;

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        className="w-full space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Heading */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
        >
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-800 sm:text-3xl">
              Agenda dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Sessions, topics, faculty and venues for your event at a glance.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden rounded-xl border border-sky-100 bg-sky-50/70 px-4 py-2 text-right sm:block">
              <p className="text-xs text-slate-500">Indian Standard Time (IST)</p>
              <p className="text-sm font-medium tabular-nums text-slate-700">{formatNow(now)}</p>
            </div>

            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-sky-100 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-sky-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw className={`size-4 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Refreshing" : "Refresh"}
            </button>
          </div>
        </motion.div>

        {refreshError && (
          <motion.div
            variants={itemVariants}
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-rose-100 bg-rose-50/70 px-4 py-3 text-sm text-rose-700"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <span>Couldn&apos;t refresh the dashboard: {refreshError}. Showing the last loaded data.</span>
          </motion.div>
        )}

        {partial && (
          <motion.div
            variants={itemVariants}
            className="flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50/70 px-4 py-3 text-sm text-amber-800"
          >
            <Info className="mt-0.5 size-4 shrink-0" />
            <span>
              The API returned {completeness.knownSessions} of {summary.totalSessions} sessions and{" "}
              {completeness.knownTopics} of {summary.totalTopics} topics, so some figures use the
              server totals and may count repeat assignments.
            </span>
          </motion.div>
        )}

        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard
            title="Total sessions"
            value={summary.totalSessions}
            description={`${schedule.today} today, ${schedule.upcoming} upcoming`}
            icon={CalendarDays}
            tone="sky"
            href="/sessions"
          />
          <StatCard
            title="Total topics"
            value={summary.totalTopics}
            description={`${topicCount("Talk")} talks, ${topicCount("Debate")} debates, ${topicCount("Panel Discussion")} panels`}
            icon={Layers3}
            tone="violet"
          />
          <StatCard
            title="Faculty"
            value={summary.totalFaculty}
            description={`${metrics.uniquePeople} placed on the agenda`}
            icon={GraduationCap}
            tone="amber"
            href="/faculty"
          />
          <StatCard
            title="Halls"
            value={summary.totalHalls}
            description={`${statusOverview.halls.active} active, ${metrics.halls.length} in use`}
            icon={Building2}
            tone="emerald"
            href="/halls"
          />
          <StatCard
            title="Tracks"
            value={summary.totalTracks}
            description={`${statusOverview.tracks.active} active, ${metrics.tracks.length} in use`}
            icon={AudioLines}
            tone="orange"
            href="/tracks"
          />
        </div>

        {/* Schedule, resources, faculty roles */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <Panel title="Schedule overview" subtitle="Session distribution by date" icon={CalendarClock} tone="sky">
            <div className="grid grid-cols-3 gap-3">
              <ScheduleMetric label="Today" value={schedule.today} icon={CalendarCheck} tone="emerald" />
              <ScheduleMetric label="Upcoming" value={schedule.upcoming} icon={CalendarClock} tone="sky" />
              <ScheduleMetric label="Past" value={schedule.past} icon={CalendarX} tone="slate" />
            </div>

            <div className="mt-4 space-y-3 rounded-xl border border-sky-100 bg-white/70 p-4">
              {schedule.byDate.length === 0 ? (
                <p className="text-center text-sm text-slate-500">No dated sessions yet.</p>
              ) : (
                schedule.byDate.map((item, index) => (
                  <div key={item.dateKey} className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <span className="flex items-center gap-2 font-medium text-slate-700">
                        {formatShortDate(item.sessionDate)}
                        {item.isToday && (
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                            Today
                          </span>
                        )}
                      </span>
                      <span className="tabular-nums text-slate-500">
                        <span className="font-semibold text-slate-800">{item.count}</span>{" "}
                        {item.count === 1 ? "session" : "sessions"}
                      </span>
                    </div>
                    <AnimatedBar
                      percent={(item.count / maxByDate) * 100}
                      barClass={item.isToday ? "bg-emerald-400" : item.isPast ? "bg-slate-300" : "bg-sky-400"}
                      trackClass="bg-sky-100/70"
                      delay={index * 0.06}
                    />
                  </div>
                ))
              )}
            </div>
          </Panel>

          <Panel title="Resource status" subtitle="Active and inactive resources" icon={Activity} tone="emerald">
            <div className="space-y-4">
              <StatusRow label="Halls" icon={Building2} tone="indigo" status={statusOverview.halls} />
              <StatusRow label="Tracks" icon={AudioLines} tone="teal" status={statusOverview.tracks} />
            </div>
          </Panel>

          <Panel title="Faculty assignments" subtitle="Assignment distribution by role" icon={Users} tone="violet">
            {metrics.roles.every((r) => r.unique === 0) ? (
              <EmptyState message="No faculty assigned to topics yet." tone="violet" />
            ) : (
              <div className="space-y-4">
                {metrics.roles.map((role, index) => {
                  const t = TONES[ROLE_TONE[role.key]];
                  const repeats = role.assignments - role.unique;

                  return (
                    <div key={role.key} className="space-y-1.5">
                      <div className="flex items-center justify-between gap-3 text-sm">
                        <span className="flex items-center gap-2 font-medium text-slate-700">
                          <span className={`size-2.5 rounded-full ${t.bar}`} />
                          {role.label}
                        </span>
                        <span className="tabular-nums text-slate-500">
                          <span className="font-semibold text-slate-800">{formatNumber(role.unique)}</span>
                          {metrics.rolesExact && repeats > 0 && (
                            <span className="ml-2 text-xs">{role.assignments} slots</span>
                          )}
                        </span>
                      </div>
                      <AnimatedBar
                        percent={(role.unique / maxRole) * 100}
                        barClass={t.bar}
                        delay={index * 0.06}
                      />
                    </div>
                  );
                })}

                <div className="flex items-center justify-between border-t border-violet-100 pt-3 text-xs text-slate-500">
                  <span>
                    {formatNumber(metrics.uniquePeople)} of {formatNumber(summary.totalFaculty)} faculty on the agenda
                  </span>
                  <span>{metrics.rolesExact ? "Unique per role" : "Includes repeats"}</span>
                </div>
              </div>
            )}
          </Panel>
        </div>

        {/* Distributions */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <DistributionPanel
            title="Sessions by hall"
            subtitle="Number of sessions assigned to each hall"
            icon={Building2}
            tone="indigo"
            items={metrics.halls}
            unit="sessions"
            footnote={`${metrics.halls.length} of ${summary.totalHalls} halls used`}
          />
          <DistributionPanel
            title="Sessions by track"
            subtitle="Number of sessions assigned to each track"
            icon={AudioLines}
            tone="teal"
            items={metrics.tracks}
            unit="sessions"
            footnote={`${metrics.tracks.length} of ${summary.totalTracks} tracks used`}
          />
          <DistributionPanel
            title="Topics by type"
            subtitle="Breakdown of configured topic types"
            icon={ListChecks}
            tone="amber"
            items={metrics.topicTypes}
            unit="topics"
          />
        </div>

        {/* Upcoming + top faculty */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <Panel title="Upcoming sessions" subtitle="Your next scheduled sessions" icon={CalendarClock} tone="sky">
            {metrics.upcomingSessions.length === 0 ? (
              <EmptyState message="No upcoming sessions. Add a session to see it here." />
            ) : (
              <ul className="space-y-3">
                {metrics.upcomingSessions.map((session) => (
                  <UpcomingSessionItem key={session.id} session={session} now={now} />
                ))}
              </ul>
            )}
          </Panel>

          <Panel
            title="Top assigned faculty"
            subtitle="Faculty members with the most agenda assignments"
            icon={Trophy}
            tone="rose"
          >
            {metrics.topFaculty.length === 0 ? (
              <EmptyState message="No faculty have been assigned to topics yet." tone="rose" />
            ) : (
              <ul className="space-y-3">
                {metrics.topFaculty.map((faculty, index) => (
                  <TopFacultyRow key={faculty.id} faculty={faculty} rank={index + 1} max={maxTopFaculty} />
                ))}
              </ul>
            )}
          </Panel>
        </div>

        {/* Recent activity */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <Panel title="Recently added sessions" subtitle="Newest sessions created" icon={Clock3} tone="cyan">
            {lists.recentSessions.length === 0 ? (
              <EmptyState message="No sessions created yet." tone="cyan" />
            ) : (
              <ul className="space-y-3">
                {lists.recentSessions.map((session) => (
                  <RecentSessionRow key={session._id} session={session} />
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="Recently added topics" subtitle="Newest agenda topics" icon={Layers3} tone="slate">
            {lists.recentTopics.length === 0 ? (
              <EmptyState message="No topics created yet." tone="slate" />
            ) : (
              <ul className="space-y-3">
                {lists.recentTopics.map((topic) => (
                  <RecentTopicRow key={topic._id} topic={topic} />
                ))}
              </ul>
            )}
          </Panel>
        </div>

        <motion.p variants={itemVariants} className="text-right text-xs text-slate-400">
          Data generated {formatDate(data.generatedAt)}
        </motion.p>
      </motion.div>
    </MotionConfig>
  );
}
