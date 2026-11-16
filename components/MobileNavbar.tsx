
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

import {
  Building2,
  AudioLines,
  GraduationCap,
  CalendarDays,
  ClipboardList,
  Home,
} from "lucide-react";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Hall", href: "/halls", icon: Building2 },
  { name: "Track", href: "/tracks", icon: AudioLines },
  { name: "Faculty", href: "/faculty", icon: GraduationCap },
  { name: "Session", href: "/sessions", icon: CalendarDays },
  { name: "Topic", href: "/topics", icon: ClipboardList },
];

function MobileNavbar() {
  const pathname = usePathname();

  const scrollRef = useRef<HTMLDivElement>(null);

  const itemRefs = useRef<
    Record<string, HTMLAnchorElement | null>
  >({});

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  // Horizontal scrolling with mouse wheel.
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (
      scrollRef.current &&
      Math.abs(e.deltaY) > Math.abs(e.deltaX)
    ) {
      scrollRef.current.scrollLeft += e.deltaY;
    }
  };

  // Automatically center active navigation item.
  useEffect(() => {
    const activeItem = NAV_ITEMS.find((item) =>
      isActive(item.href)
    );

    if (!activeItem) return;

    itemRefs.current[activeItem.href]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [pathname]);

  return (
    <div className="w-full bg-sidebar text-sidebar-foreground">
      <div
        ref={scrollRef}
        onWheel={handleWheel}
        className="
          overflow-x-auto scrollbar-hide scroll-smooth
          px-3
        "
      >
        <nav
          aria-label="Main navigation"
          className="
            flex w-max min-w-full items-center
            justify-between gap-2
          "
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                ref={(element) => {
                  itemRefs.current[item.href] = element;
                }}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={clsx(
                  `
                    relative flex min-h-[58px] shrink-0
                    items-center gap-2 rounded-lg px-3
                    text-[13px] font-medium
                    transition-all duration-200
                  `,
                  active
                    ? "bg-primary text-primary-foreground"
                    : `
                      text-sidebar-foreground/70
                      hover:bg-sidebar-accent
                      hover:text-sidebar-accent-foreground
                    `
                )}
              >
                <Icon
                  size={18}
                  strokeWidth={active ? 2.3 : 1.8}
                  className="shrink-0"
                />

                <span>{item.name}</span>

                {/* Animated active indicator */}
                {active && (
                  <motion.span
                    layoutId="mobile-nav-indicator"
                    className="
                      absolute bottom-0 left-3 right-3
                      h-[2.5px] rounded-t-full
                      bg-primary-foreground
                    "
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 32,
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export default memo(MobileNavbar);
