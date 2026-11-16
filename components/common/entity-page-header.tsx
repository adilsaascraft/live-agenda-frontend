'use client'

import type { ReactNode } from 'react'

interface EntityPageHeaderProps {
  /**
   * Page icon.
   */
  icon: ReactNode

  /**
   * Page title.
   */
  title: string

  /**
   * Short page description.
   */
  description?: string

  /**
   * Optional actions.
   *
   * Examples:
   * - Add button
   * - Import button
   * - Export button
   * - Filters
   * - Search
   */
  actions?: ReactNode

  /**
   * Optional secondary content.
   *
   * Examples:
   * - Tabs
   * - Statistics
   * - Filter chips
   */
  children?: ReactNode
}

export function EntityPageHeader({
  icon,
  title,
  description,
  actions,
  children,
}: EntityPageHeaderProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        {/* Left */}
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border bg-muted">
            {icon}
          </div>

          <div className="space-y-1 ">
            <h1 className="text-2xl text-foreground font-bold tracking-tight ">
              {title}
            </h1>

            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </div>

        {/* Right */}
        {actions && (
          <div className="flex flex-wrap justify-end gap-2">{actions}</div>
        )}
      </div>

      {/* Tabs / Filters / Stats */}
      {children && (
        <div className="flex flex-wrap items-center gap-3">{children}</div>
      )}
    </div>
  )
}
