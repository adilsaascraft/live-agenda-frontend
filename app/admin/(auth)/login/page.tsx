import Link from "next/link";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border bg-card p-7 shadow-sm sm:p-9">
        <div className="mb-8">
          <h1 className="mt-3 text-2xl font-bold tracking-tight">Admin sign in</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to manage your conference agenda.</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
