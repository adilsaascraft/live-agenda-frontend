"use client";

import { AlertCircle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useRequireAuth } from "@/features/auth/auth.hooks";
import { useDashboard } from "@/features/dashboard/dashboard.hooks";

import DashboardOverview from "@/features/dashboard/components/DashboardOverview";
import DashboardSkeleton from "@/features/dashboard/components/DashboardSkeleton";

export default function DashboardPage() {
  const { isAuthenticated, isInitializing } = useRequireAuth();

  // Don't call the API until auth has resolved.
  const { data, isLoading, isRefreshing, isError, error, refetch } =
    useDashboard(isAuthenticated && !isInitializing);

  // Initial load, auth still resolving, or redirecting an unauthenticated user.
  if (!data && !isError) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <DashboardSkeleton />
      </div>
    );
  }

  // Only show the full error screen when there is nothing to show.
  if (!data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-sky-100 bg-sky-50/70 p-8 text-center shadow-sm">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertCircle className="size-6" />
          </div>

          <h2 className="mt-4 text-lg font-semibold">Unable to load dashboard</h2>

          <p className="mt-2 text-sm text-muted-foreground">
            {error || "We couldn't retrieve your dashboard information."}
          </p>

          <Button
            onClick={() => void refetch()}
            disabled={isLoading}
            className="mt-6 gap-2"
          >
            <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
            Try again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="w-full">
      <DashboardOverview
        data={data}
        onRefresh={() => void refetch()}
        isRefreshing={isRefreshing}
        refreshError={error}
      />
    </main>
  );
}
