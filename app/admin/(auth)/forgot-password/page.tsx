import Link from "next/link";
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border bg-card p-7 shadow-sm sm:p-9">
        <h1 className="mt-3 text-2xl font-bold tracking-tight">Forgot password?</h1>
        <p className="mb-7 mt-2 text-sm text-muted-foreground">Enter your admin email and we'll send password reset instructions.</p>
        <ForgotPasswordForm />
      </div>
    </main>
  );
}
