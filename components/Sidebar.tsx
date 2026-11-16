
"use client";

import { memo, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

import {
  ChevronLeft,
  ChevronRight,
  Building2,
  AudioLines,
  GraduationCap,
  CalendarDays,
  ClipboardList,
  Home,
} from "lucide-react";

import clsx from "clsx";

type Props = {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
};

const NAV_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Hall", href: "/halls", icon: Building2 },
  { name: "Track", href: "/tracks", icon: AudioLines },
  { name: "Faculty", href: "/faculty", icon: GraduationCap },
  { name: "Session", href: "/sessions", icon: CalendarDays },
  { name: "Topic", href: "/topics", icon: ClipboardList },
];

function SidebarComponent({ collapsed, setCollapsed }: Props) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  const [currentYear, setCurrentYear] = useState<number | null>(null);

useEffect(() => {
  setCurrentYear(new Date().getFullYear());
}, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) setCollapsed(true);
  }, [isMobile, setCollapsed]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 76 : 232 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="
        sticky top-0 flex h-screen shrink-0 flex-col
        overflow-hidden bg-sidebar text-sidebar-foreground
      "
    >
      {/* Header */}
      <div
        className={clsx(
          "flex h-[72px] shrink-0 items-center",
          collapsed ? "justify-center px-2" : "justify-between px-5"
        )}
      >
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="
              flex size-9 items-center justify-center
              rounded-xl bg-primary text-lg font-bold
              text-primary-foreground shadow-sm
            ">
              L
            </div>

            <span className="text-[16px] font-bold tracking-tight">
              Live Agenda
            </span>
          </div>
        )}

        {!isMobile && (
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="
              flex size-8 items-center justify-center rounded-lg
              text-muted-foreground hover:bg-accent
              hover:text-accent-foreground
            "
          >
            {collapsed ? (
              <ChevronRight size={18} />
            ) : (
              <ChevronLeft size={18} />
            )}
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1.5 px-3 pt-5">
        {!collapsed && (
          <p className="
            mb-3 px-3 text-[10px] font-semibold
            uppercase tracking-[0.16em] text-muted-foreground
          ">
            Workspace
          </p>
        )}

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.name : undefined}
              aria-current={active ? "page" : undefined}
              className={clsx(
                "group relative flex h-11 shrink-0 items-center rounded-lg transition-all duration-200",
                collapsed ? "justify-center px-0" : "gap-3 px-3",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              {/* Active indicator */}
              {active && (
                <motion.span
                  layoutId="sidebar-active-indicator"
                  className="
                    absolute left-0 top-1/2 h-5 w-[3px]
                    -translate-y-1/2 rounded-r-full
                    bg-primary-foreground
                  "
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                  }}
                />
              )}

              {/* Icon */}
              <Icon
                size={19}
                strokeWidth={active ? 2.3 : 1.8}
                className="shrink-0"
              />

              {/* Label */}
              {!collapsed && (
                <span
                  className={clsx(
                    "text-[13px] transition-colors",
                    active ? "font-semibold" : "font-medium"
                  )}
                >
                  {item.name}
                </span>
              )}

              {/* Collapsed active indicator */}
              {collapsed && active && (
                <span className="
                  absolute bottom-1 right-2 size-1.5
                  rounded-full bg-primary
                " />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
<div
  className={clsx(
    "mt-auto flex h-14 shrink-0 items-center text-[10px] text-muted-foreground",
    collapsed ? "justify-center" : "px-5"
  )}
>
  {!collapsed && (
    <span>
      © {currentYear ?? "2026"} SaaScraft
    </span>
  )}
</div>
    </motion.aside>
  );
}

export default memo(SidebarComponent);
