"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPassword } from "../auth.service";
import { getAuthErrorMessage } from "../auth.utils";

const schema = z.object({
  email: z.email("Enter a valid email address."),
});

type FormValues = z.infer<typeof schema>;

export function ForgotPasswordForm() {
  const [serverError, setServerError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: FormValues) {
    setServerError("");
    try {
      const response = await forgotPassword(values);
      if (!response.success) throw new Error(response.message);
      setSubmitted(true);
    } catch (error) {
      setServerError(getAuthErrorMessage(error));
    }
  }

  if (submitted) {
    return (
      <div className="space-y-4 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="size-6" />
        </div>
        <h2 className="text-lg font-semibold">Check your email</h2>
        <p className="text-sm leading-6 text-muted-foreground">
          If an account exists for that email address, password reset instructions have been sent.
        </p>
        <Link href="/admin/login" className="inline-block text-sm font-semibold text-primary hover:underline">
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {serverError && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{serverError}</div>}
      <div className="space-y-2">
        <Label htmlFor="email">Admin email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="admin@example.com"
          {...register("email")}
          className="h-11"
        />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting} className="h-11 w-full gap-2">
        {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Mail className="size-4" />}
        {isSubmitting ? "Sending instructions..." : "Send reset instructions"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Remember your password? <Link href="/admin/login" className="font-semibold text-primary hover:underline">Sign in</Link>
      </p>
    </form>
  );
}
