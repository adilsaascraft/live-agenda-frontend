
"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/features/auth/auth.hooks";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function DashboardNavbar() {
  const router = useRouter();

  const { isAuthenticated, signOut } = useAuth();

  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);

      // Calls existing logout service:
      // 1. Backend logout API
      // 2. Revokes refresh token
      // 3. Clears local authentication state
      // 4. Redirects to /login
      await signOut();

      setLogoutDialogOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-[#F8FAFC] via-[#DCE3EC] to-[#EEF2F7] shadow-md">
      <div className="flex h-16 w-full items-center justify-between px-4 md:px-[30px]">

        {/* Logo */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            aria-label="Go to dashboard"
            className="rounded-lg bg-transparent p-1 transition-transform duration-300 hover:scale-105 active:scale-95"
          >
            <Image
              src="/logo.png"
              alt="AROICON 2026 Logo"
              width={150}
              height={50}
              className="h-auto w-[150px] object-contain"
              priority
            />
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">

          {isAuthenticated && (
            <AlertDialog
              open={logoutDialogOpen}
              onOpenChange={setLogoutDialogOpen}
            >
              <AlertDialogTrigger
                disabled={loading}
                className="inline-flex items-center justify-center rounded-lg border border-primary bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                Logout
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Confirm Logout
                  </AlertDialogTitle>

                  <AlertDialogDescription>
                    Are you sure you want to logout? This will end your current session.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel disabled={loading}>
                    Cancel
                  </AlertDialogCancel>

                  <AlertDialogAction
                    onClick={handleLogout}
                    disabled={loading}
                    className="bg-red-600 text-primary-foreground hover:bg-red-700"
                  >
                    {loading ? "Logging out..." : "Confirm Logout"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

        </div>
      </div>
    </header>
  );
}
