
"use client";

import Link from "next/link";
import { CalendarDays, Heart } from "lucide-react";

import { colors, gradients } from "@/lib/constants/colors";

const COPYRIGHT_YEAR = 2026;

export function Footer() {
  return (
    <footer
      className="w-full border-t px-4 py-5 sm:px-6"
      style={{
        background: gradients.obsidian,
        borderColor: colors.slate[600],
      }}
    >
      <div className="mx-auto flex max-w-screen-2xl flex-col items-center justify-between gap-4 sm:flex-row">
        {/* Brand and Copyright */}
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-3">
          <Link
            href="https://eagenda.live"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2"
            aria-label="eagenda.live"
          >
            <span
              className="flex size-8 items-center justify-center rounded-lg shadow-sm transition-transform duration-200 group-hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg, #F97316, #EA580C)",
                color: colors.white[50],
              }}
            >
              <CalendarDays className="size-4" />
            </span>

            <span
              className="text-sm font-bold tracking-tight"
              style={{ color: colors.white[50] }}
            >
              eagenda<span style={{ color: colors.orange[400] }}>.live</span>
            </span>
          </Link>

          <span
            className="hidden h-4 w-px sm:block"
            style={{ backgroundColor: colors.slate[500] }}
          />

          <p
            className="text-xs"
            style={{ color: colors.slate[200] }}
          >
            © {COPYRIGHT_YEAR} All rights reserved.
          </p>
        </div>

        {/* Attribution */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs">
          <span style={{ color: colors.slate[300] }}>
            Crafted with
          </span>

          <Heart
            className="size-3.5 fill-current"
            style={{ color: colors.orange[400] }}
            aria-label="love"
          />

          <span style={{ color: colors.slate[300] }}>
            by
          </span>

          <Link
            href="https://saascraft.studio"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold transition-colors duration-200 hover:underline"
            style={{ color: colors.sky[300] }}
          >
            SaaScraft Studio India Pvt Ltd
          </Link>
        </div>
      </div>
    </footer>
  );
}
