"use client";

import { Skeleton } from "@/components/ui/skeleton";

const shell = "rounded-2xl border border-sky-100 bg-sky-50/70 p-5";
const bone = "bg-sky-100/80";

function PanelSkeleton({ rows = 4, tall = false }: { rows?: number; tall?: boolean }) {
  return (
    <div className={`${shell} space-y-4`}>
      <div className="flex items-center gap-3">
        <Skeleton className={`size-9 rounded-xl ${bone}`} />
        <div className="space-y-2">
          <Skeleton className={`h-4 w-36 ${bone}`} />
          <Skeleton className={`h-3 w-48 max-w-full ${bone}`} />
        </div>
      </div>
      {Array.from({ length: rows }).map((_, row) => (
        <Skeleton key={row} className={`${tall ? "h-14" : "h-10"} w-full rounded-xl ${bone}`} />
      ))}
    </div>
  );
}

export default function DashboardSkeleton() {
  return (
    <div className="space-y-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-2">
          <Skeleton className={`h-4 w-32 ${bone}`} />
          <Skeleton className={`h-8 w-52 ${bone}`} />
          <Skeleton className={`h-4 w-72 max-w-full ${bone}`} />
        </div>
        <Skeleton className={`h-10 w-64 rounded-xl ${bone}`} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className={shell}>
            <Skeleton className={`mb-4 size-10 rounded-xl ${bone}`} />
            <Skeleton className={`mb-2 h-4 w-24 ${bone}`} />
            <Skeleton className={`h-8 w-16 ${bone}`} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <PanelSkeleton rows={4} />
        <PanelSkeleton rows={2} tall />
        <PanelSkeleton rows={4} />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <PanelSkeleton rows={5} />
        <PanelSkeleton rows={5} />
        <PanelSkeleton rows={3} />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <PanelSkeleton rows={4} tall />
        <PanelSkeleton rows={6} />
      </div>
    </div>
  );
}
