
"use client";

import { memo, useCallback, useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Bookmark } from "lucide-react";

interface AgendaFloatingNavigationProps {
  onOpenMyAgenda: () => void;
}

const SECTION_SELECTOR = "[data-agenda-date-section]";

const SCROLL_THRESHOLD = 120;

const AgendaFloatingNavigation = memo(
  function AgendaFloatingNavigation({
    onOpenMyAgenda,
  }: AgendaFloatingNavigationProps) {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [hasScrolled, setHasScrolled] = useState(false);
    const [isAtBottom, setIsAtBottom] = useState(false);

    const updateScrollState = useCallback(() => {
      const scrollTop = window.scrollY;
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      const progress =
        scrollableHeight <= 0
          ? 0
          : Math.min(100, Math.max(0, (scrollTop / scrollableHeight) * 100));

      const atBottom =
        window.innerHeight + scrollTop >=
        document.documentElement.scrollHeight - 2;

      setScrollProgress(Math.round(progress));
      setHasScrolled(scrollTop > SCROLL_THRESHOLD);
      setIsAtBottom(atBottom);
    }, []);

    const getDateSections = useCallback(() => {
      return Array.from(
        document.querySelectorAll<HTMLElement>(SECTION_SELECTOR),
      );
    }, []);

    const scrollToSection = useCallback(
      (section: HTMLElement) => {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      },
      [],
    );

    const navigateDown = useCallback(() => {
      const sections = getDateSections();

      if (!sections.length) return;

      const scrollPosition = window.scrollY + 120;

      const nextSection = sections.find(
        (section) => section.offsetTop > scrollPosition,
      );

      if (nextSection) {
        scrollToSection(nextSection);
      } else {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: "smooth",
        });
      }
    }, [getDateSections, scrollToSection]);

    const navigateUp = useCallback(() => {
      const sections = getDateSections();

      if (!sections.length) {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
        return;
      }

      const scrollPosition = window.scrollY + 120;

      const previousSections = sections.filter(
        (section) => section.offsetTop < scrollPosition,
      );

      const previousSection =
        previousSections.length > 1
          ? previousSections[previousSections.length - 2]
          : null;

      if (previousSection) {
        scrollToSection(previousSection);
      } else {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    }, [getDateSections, scrollToSection]);

    useEffect(() => {
      updateScrollState();

      window.addEventListener("scroll", updateScrollState, {
        passive: true,
      });
      window.addEventListener("resize", updateScrollState);

      return () => {
        window.removeEventListener("scroll", updateScrollState);
        window.removeEventListener("resize", updateScrollState);
      };
    }, [updateScrollState]);

    const progressRadius = 17;
    const progressCircumference = 2 * Math.PI * progressRadius;
    const progressOffset =
      progressCircumference -
      (scrollProgress / 100) * progressCircumference;

    return (
  <div className="fixed bottom-5 right-4 z-50 flex flex-col items-end gap-2 sm:bottom-6 sm:right-6">
    {/* My Saved Agenda */}
    <button
  type="button"
  onClick={onOpenMyAgenda}
  aria-label="Open my saved agenda"
  className="group flex h-11 items-center gap-2 rounded-full border border-orange-200 bg-white px-5 text-sm font-bold text-orange-900 shadow-lg shadow-orange-900/10 transition-all hover:-translate-y-0.5 hover:border-orange-700 hover:bg-orange-700 hover:text-white active:scale-95 dark:border-orange-900/50 dark:bg-neutral-900 dark:text-orange-300 dark:hover:border-orange-700 dark:hover:bg-orange-700 dark:hover:text-white"
>
  <Bookmark className="size-4 fill-orange-500/15 text-orange-600 transition-colors group-hover:fill-white group-hover:text-white" />
  <span>My Agenda</span>
</button>

    {/* Scroll Navigation */}
    {hasScrolled && (
      <div className="flex flex-col items-center gap-2">
        {/* Scroll Progress Circle */}
        <div
          className="relative flex size-13 items-center justify-center rounded-full border border-orange-200 bg-white shadow-lg dark:border-orange-900/50 dark:bg-neutral-900"
          role="progressbar"
          aria-label="Page scroll progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={scrollProgress}
        >
          <svg
            className="absolute inset-0 size-full -rotate-90"
            viewBox="0 0 40 40"
            aria-hidden="true"
          >
            <circle
              cx="20"
              cy="20"
              r={progressRadius}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="text-orange-100 dark:text-neutral-700"
            />

            <circle
              cx="20"
              cy="20"
              r={progressRadius}
              fill="none"
              stroke="url(#agendaScrollGradient)"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeDasharray={progressCircumference}
              strokeDashoffset={progressOffset}
              className="transition-[stroke-dashoffset] duration-200"
            />

            <defs>
              <linearGradient
                id="agendaScrollGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#FB923C" />
                <stop offset="50%" stopColor="#F97316" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
            </defs>
          </svg>

          <span className="relative text-xs font-extrabold tabular-nums text-orange-900 dark:text-orange-300">
            {scrollProgress}%
          </span>
        </div>

        {/* Navigation Arrow */}
        <button
          type="button"
          onClick={isAtBottom ? navigateUp : navigateDown}
          aria-label={
            isAtBottom
              ? "Navigate to previous agenda section"
              : "Navigate to next agenda section"
          }
          title={isAtBottom ? "Previous section" : "Next section"}
          className="flex size-13 items-center justify-center rounded-full border border-orange-200 bg-white text-orange-700 shadow-lg shadow-orange-900/10 transition-all hover:-translate-y-0.5 hover:border-orange-600 hover:bg-orange-100 hover:text-orange-900 active:scale-95 dark:border-orange-900/50 dark:bg-neutral-900 dark:text-orange-300 dark:hover:border-orange-700 dark:hover:bg-orange-950"
        >
          {isAtBottom ? (
            <ArrowUp className="size-5" />
          ) : (
            <ArrowDown className="size-5" />
          )}
        </button>
      </div>
    )}
  </div>
);
  },
);

AgendaFloatingNavigation.displayName = "AgendaFloatingNavigation";

export default AgendaFloatingNavigation;
