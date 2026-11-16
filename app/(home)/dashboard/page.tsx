
"use client";

import { AlertCircle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useRequireAuth } from "@/features/auth/auth.hooks";
import { useDashboard } from "@/features/dashboard/dashboard.hooks";

import DashboardOverview from "@/features/dashboard/components/DashboardOverview";
import DashboardSkeleton from "@/features/dashboard/components/DashboardSkeleton";

export default function DashboardPage() {
  const { isAuthenticated, isInitializing } = useRequireAuth();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useDashboard();

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <DashboardSkeleton />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="w-full rounded-xl border bg-card p-8 text-center shadow-sm">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertCircle className="size-6" />
          </div>

          <h2 className="mt-4 text-lg font-semibold">
            Unable to load dashboard
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            {error || "We couldn't retrieve your dashboard information."}
          </p>

          <Button
            onClick={() => void refetch()}
            className="mt-6 gap-2"
          >
            <RefreshCw className="size-4" />
            Try again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-full p-4">
      <DashboardOverview
        data={data}
        onRefresh={() => void refetch()}
        isRefreshing={isLoading}
      />
    </main>
  );
}
