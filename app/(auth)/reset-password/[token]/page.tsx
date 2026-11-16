import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";

interface ResetPasswordPageProps {
  params: Promise<{ token: string }>;
}

export default async function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  const { token } = await params;

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border bg-card p-7 shadow-sm sm:p-9">
        <p className="text-sm font-semibold tracking-wide text-primary">LIVE AGENDA</p>
        <h1 className="mt-3 text-2xl font-bold tracking-tight">Set a new password</h1>
        <p className="mb-7 mt-2 text-sm text-muted-foreground">Choose a strong password for your administrator account.</p>
        <ResetPasswordForm token={token} />
      </div>
    </main>
  );
}
