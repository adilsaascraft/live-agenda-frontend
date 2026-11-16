import { ReactNode } from 'react'
import Link from 'next/link'
import { SearchX } from 'lucide-react'

import { cn } from '@/lib/utils'

interface EmptyStateProps {
  title: string
  description?: string

  icon?: ReactNode

  action?: {
    label: string
    href: string
  }

  secondaryAction?: ReactNode

  className?: string
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <section
      className={cn(
        'flex min-h-[420px] flex-col items-center justify-center',
        'rounded-xl border bg-background p-8',
        'text-center text-foreground',
        className,
      )}
    >
      {/* Icon */}
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-background text-foreground">
        {icon ?? <SearchX className="h-10 w-10" />}
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold tracking-tight text-foreground">
        {title}
      </h2>

      {/* Description */}
      {description && (
        <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      )}

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {action && (
            <Link
              href={action.href}
              className={cn(
                'inline-flex h-10 items-center justify-center rounded-md',
                'bg-primary px-5 text-sm font-medium text-primary-foreground',
                'transition-colors hover:bg-primary/90',
              )}
            >
              {action.label}
            </Link>
          )}

          {secondaryAction}
        </div>
      )}
    </section>
  )
}
