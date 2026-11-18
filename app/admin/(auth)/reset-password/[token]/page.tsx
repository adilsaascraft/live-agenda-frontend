
import { Suspense } from "react";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";

interface ResetPasswordPageProps {
  params: Promise<{ token: string }>;
}

async function ResetPasswordContent({
  params,
}: ResetPasswordPageProps) {
  const { token } = await params;

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border bg-card p-7 shadow-sm sm:p-9">

        <h1 className="mt-3 text-2xl font-bold tracking-tight">
          Set a new password
        </h1>

        <p className="mb-7 mt-2 text-sm text-muted-foreground">
          Choose a strong password for your administrator account.
        </p>

        <ResetPasswordForm token={token} />
      </div>
    </main>
  );
}

function ResetPasswordFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border bg-card p-7 shadow-sm sm:p-9">
        <div className="h-5 w-32 animate-pulse rounded bg-muted" />
        <div className="mt-5 h-8 w-56 animate-pulse rounded bg-muted" />
        <div className="mt-3 h-4 w-full animate-pulse rounded bg-muted" />
        <div className="mt-8 space-y-4">
          <div className="h-11 animate-pulse rounded-md bg-muted" />
          <div className="h-11 animate-pulse rounded-md bg-muted" />
          <div className="h-11 animate-pulse rounded-md bg-muted" />
        </div>
      </div>
    </main>
  );
}

export default function ResetPasswordPage({
  params,
}: ResetPasswordPageProps) {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordContent params={params} />
    </Suspense>
  );
}
