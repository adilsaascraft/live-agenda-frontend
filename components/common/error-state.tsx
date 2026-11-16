'use client'

import { AlertTriangle, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { text } from '@/styles/text'
import { typography } from '@/styles/typography'

interface ErrorStateProps {
  title?: string
  description?: string
  error?: Error
  retry?: () => void
  className?: string
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'An unexpected error occurred. Please try again.',
  error,
  retry,
  className,
}: ErrorStateProps) {
  return (
    <section
      className={cn(
        'flex min-h-[450px] flex-col items-center justify-center px-6 text-center',
        className,
      )}
    >
      {/* Icon */}

      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="h-10 w-10" />
      </div>

      {/* Title */}

      <h2 className={text(typography.empty.title)}>{title}</h2>

      {/* Description */}

      <p
        className={cn(
          text(typography.empty.description),
          'mt-3 max-w-md text-muted-foreground',
        )}
      >
        {description}
      </p>

      {/* Retry */}

      {retry && (
        <Button onClick={retry} className="mt-8">
          <RotateCcw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      )}

      {/* Development Error */}

      {process.env.NODE_ENV === 'development' && error && (
        <details className="mt-8 w-full max-w-3xl rounded-lg border p-4 text-left">
          <summary className="cursor-pointer font-medium">
            Error Details
          </summary>

          <pre className="mt-3 overflow-auto text-xs whitespace-pre-wrap break-all">
            {error.stack ?? error.message}
          </pre>
        </details>
      )}
    </section>
  )
}
