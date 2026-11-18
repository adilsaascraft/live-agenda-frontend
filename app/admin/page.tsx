
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuthBootstrap } from "@/features/auth/auth.hooks";
import { useAuthStore } from "@/features/auth/auth.store";
import { AUTH_ROUTES } from "@/features/auth/auth.constants";

const CIRCUMFERENCE = 2 * Math.PI * 43;
const PROGRESS_INTERVAL = 180; // 4x slower than 45ms

const RAY_CHARACTERS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function generateRayId() {
  const bytes = new Uint8Array(16);
  window.crypto.getRandomValues(bytes);

  return Array.from(
    bytes,
    (byte) => RAY_CHARACTERS[byte % RAY_CHARACTERS.length]
  ).join("");
}

function SecurityIcon({
  className = "size-7",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 3L19 6V11C19 15.5 16.1 19 12 21C7.9 19 5 15.5 5 11V6L12 3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />

      <path
        d="M9 12L11 14L15 10"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CircularVerification({
  percentage,
}: {
  percentage: number;
}) {
  const strokeOffset =
    CIRCUMFERENCE * (1 - percentage / 100);

  return (
    <div className="relative flex size-[130px] items-center justify-center">
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 size-full -rotate-90"
      >
        <circle
          cx="50"
          cy="50"
          r="43"
          fill="none"
          stroke="#e8eef7"
          strokeWidth="5"
        />

        <circle
          cx="50"
          cy="50"
          r="43"
          fill="none"
          stroke="#2563eb"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={strokeOffset}
          className="checkpoint-circle"
        />
      </svg>

      <div className="relative flex flex-col items-center justify-center gap-1">
        <SecurityIcon className="size-6 text-blue-600" />

        <span className="text-[19px] font-bold tabular-nums text-slate-800">
          {percentage}%
        </span>
      </div>
    </div>
  );
}

function VerificationLoader({
  percentage,
}: {
  percentage: number;
}) {
  return (
    <div className="mt-9 rounded-xl border border-slate-200 bg-slate-50/80 p-5 sm:p-6">

      {/* Circular verification */}
      <div className="flex flex-col items-center text-center">
        <CircularVerification percentage={percentage} />

        <h2 className="mt-5 text-[15px] font-semibold text-slate-800">
          {percentage === 100
            ? "Verification completed"
            : "Verifying your connection"}
        </h2>

        <p className="mt-2 max-w-[290px] text-xs leading-5 text-slate-500">
          {percentage === 100
            ? "Your security verification animation has completed."
            : "Please wait while we check your connection and prepare your secure workspace."}
        </p>
      </div>

      {/* Synchronized horizontal progress */}
      <div className="mt-7">
        <div
          className="relative h-[5px] w-full overflow-hidden rounded-full bg-slate-200"
          role="progressbar"
          aria-label="Visual verification progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percentage}
        >
          <div
            className="checkpoint-horizontal h-full rounded-full bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500"
            style={{
              width: `${percentage}%`,
            }}
          />
        </div>
      </div>

      {/* Progress status */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`size-1.5 rounded-full ${
              percentage === 100
                ? "bg-emerald-500"
                : "animate-pulse bg-blue-500"
            }`}
          />

          <span className="text-[11px] font-medium text-slate-500">
            {percentage === 100
              ? "Security check completed"
              : "Secure connection check"}
          </span>
        </div>

        <span className="text-[11px] font-semibold tabular-nums text-blue-600">
          {percentage}/100
        </span>
      </div>
    </div>
  );
}

export default function Home() {
  const router = useRouter();

  // Verify the session (runs once; shared with the protected layout).
  useAuthBootstrap();

  const [currentYear, setCurrentYear] = useState<number | null>(null);

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  const isInitializing = useAuthStore(
    (state) => state.isInitializing
  );

  const [percentage, setPercentage] = useState(1);

  const [rayId, setRayId] = useState(
    "0000000000000000"
  );

  // Generate unique 16-character Ray ID.
  useEffect(() => {
    setRayId(generateRayId());
  }, []);

  // Fake progress: 1% to 100%, then permanently stop.
  useEffect(() => {
    const interval = window.setInterval(() => {
      setPercentage((current) => {
        if (current >= 100) {
          window.clearInterval(interval);
          return 100;
        }

        return current + 1;
      });
    }, PROGRESS_INTERVAL);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
  setCurrentYear(new Date().getFullYear());
}, []);

  // Existing authentication redirect.
  useEffect(() => {
    if (isInitializing) return;

    router.replace(
      isAuthenticated
        ? AUTH_ROUTES.dashboard
        : AUTH_ROUTES.login
    );
  }, [isInitializing, isAuthenticated, router]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f6f8fb] px-5 py-10 text-slate-900">

      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,#ffffff_0%,#f6f8fb_75%)]" />

      {/* Main container */}
      <section className="relative w-full max-w-[460px] animate-checkpoint-enter">

        <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-[0_8px_40px_rgba(15,23,42,0.055)]">

          {/* Top accent */}
          <div className="h-[3px] w-full bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-400" />

          <div className="p-7 sm:p-9">

            {/* Brand */}
            <div className="mb-9 flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-blue-600 text-xl font-bold text-white shadow-sm shadow-blue-200">
                L
              </div>

              <div>
                <h1 className="text-[17px] font-bold tracking-tight text-slate-900">
                  Live Agenda
                </h1>

                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400">
                  Admin Workspace
                </p>
              </div>
            </div>

            {/* Heading */}
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1">
                <span
                  className={`size-1.5 rounded-full ${
                    percentage === 100
                      ? "bg-emerald-500"
                      : "animate-pulse bg-blue-600"
                  }`}
                />

                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-blue-700">
                  Security Checkpoint
                </span>
              </div>

              <h2 className="text-[26px] font-bold tracking-tight text-slate-900 sm:text-[29px]">
                Checking your browser
              </h2>

              <p className="mt-3 text-[13px] leading-6 text-slate-500">
                Live Agenda is checking your connection
                before allowing access to your workspace.
                This helps protect your account and data.
              </p>
            </div>

            {/* Verification animation */}
            <VerificationLoader percentage={percentage} />

            {/* Security information */}
            <div className="mt-7 border-t border-slate-100 pt-5">
              <div className="flex flex-wrap items-center justify-between gap-4">

                {/* Ray ID */}
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                    Ray ID
                  </p>

                  <p className="mt-1 font-mono text-[11px] font-medium tracking-[0.12em] text-slate-600">
                    {rayId}
                  </p>
                </div>

                {/* Branding */}
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-md bg-emerald-50">
                    <SecurityIcon className="size-4 text-emerald-600" />
                  </div>

                  <div>
                    <p className="text-[10px] font-medium text-slate-400">
                      Security by
                    </p>

                    <p className="text-xs font-semibold text-slate-700">
                      Live Agenda
                      <span className="text-blue-600">
                        {" "}· SaaScraft
                      </span>
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
<p className="mt-5 text-center text-[11px] text-slate-400">
  © {currentYear ?? ""} Live Agenda. All rights reserved.
</p>
      </section>

      {/* Global animation styles */}
      <style jsx global>{`
        @keyframes checkpointEnter {
          from {
            opacity: 0;
            transform: translateY(14px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .checkpoint-circle {
          transition: stroke-dashoffset 180ms linear;
        }

        .animate-checkpoint-enter {
          animation: checkpointEnter 0.65s ease-out both;
        }

        @media (prefers-reduced-motion: reduce) {
          .checkpoint-circle,
          .animate-pulse,
          .animate-checkpoint-enter {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </main>
  );
}