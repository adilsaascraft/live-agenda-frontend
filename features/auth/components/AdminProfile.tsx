"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../auth.hooks";
import { useRequireAuth } from "../auth.hooks";
import { getAdminProfile } from "../auth.service";
import { getAuthErrorMessage } from "../auth.utils";

export function AdminProfile() {
  const { admin, signOut } = useAuth();
  const { isAuthenticated, isInitializing } = useRequireAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    let active = true;
    setLoading(true);

    getAdminProfile()
      .catch((reason: unknown) => {
        if (active) setError(getAuthErrorMessage(reason));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  if (isInitializing || loading) {
    return <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">Loading admin profile...</div>;
  }

  if (!isAuthenticated) return null;

  return (
    <section className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Signed in as</p>
          <h2 className="mt-1 text-xl font-semibold">{admin?.name ?? "Administrator"}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{admin?.email}</p>
          {admin?.createdAt && (
            <p className="mt-3 text-xs text-muted-foreground">
              Admin since {new Date(admin.createdAt).toLocaleDateString()}
            </p>
          )}
          {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
        </div>
        <button
          type="button"
          onClick={() => void signOut()}
          className="h-10 rounded-lg border px-4 text-sm font-medium transition hover:bg-muted"
        >
          Sign out
        </button>
      </div>
    </section>
  );
}
