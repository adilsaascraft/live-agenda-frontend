//app/(home)/layout.tsx
"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import {
  useAuthBootstrap,
  useRequireAuth,
} from "@/features/auth/auth.hooks";

import Sidebar from "@/components/Sidebar";
import DashboardNavbar from "@/components/DashboardNavbar";
import MobileNavbar from "@/components/MobileNavbar";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  // Verify the session once (shared with the root page) and redirect to
  // /login when there is no valid session.
  useAuthBootstrap();
  const { isAuthenticated, isInitializing } = useRequireAuth();

  // Nothing protected (navbar, sidebar, pages) is rendered until the
  // session is verified. Unauthenticated users see this only while the
  // redirect to /login is in progress.
  if (isInitializing || !isAuthenticated) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-background"
        role="status"
        aria-live="polite"
      >
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="size-6 animate-spin" />
          <p className="text-sm">Verifying your session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ================= NAVBAR ================= */}

      <DashboardNavbar />

      {/* ================= MOBILE NAVBAR ================= */}

      <div className="sticky top-[56px] z-40 block lg:hidden">
        <MobileNavbar />
      </div>

      {/* ================= DESKTOP LAYOUT ================= */}

      <div className="flex">
        {/* ================= SIDEBAR ================= */}

        <aside
          className="fixed left-0 top-14 z-30 hidden border-r bg-background lg:block"
          style={{
            width: collapsed ? 78 : 240,
            height: "calc(100vh - 56px)",
          }}
        >
          <Sidebar
            collapsed={collapsed}
            setCollapsed={setCollapsed}
          />
        </aside>

        {/* ================= MAIN CONTENT ================= */}

        <main
  className={`min-w-0 flex-1 p-4 transition-all duration-300 ${
    collapsed ? "lg:ml-[78px]" : "lg:ml-[240px]"
  }`}
>
  {children}
</main>
      </div>
    </div>
  );
}