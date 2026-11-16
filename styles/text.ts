import { cn } from '@/lib/utils'
import {
  typography,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  type TypographyTokenType,
} from './typography'

/**
 * ============================================================================
 * ExpoCon Design System
 * Text Utility
 * ============================================================================
 *
 * Converts typography tokens into Tailwind classes.
 *
 * Example:
 *
 * className={text(typography.heading.h1)}
 *
 * className={text(typography.body.md)}
 *
 * className={text(typography.card.title, "text-primary")}
 *
 */

function resolveToken(token: TypographyTokenType) {
  return cn(
    fontSize[token.size],
    fontWeight[token.weight],
    lineHeight[token.lineHeight],
    token.tracking ? letterSpacing[token.tracking] : undefined,
  )
}

/**
 * Generic text helper
 */
export function text(token: TypographyTokenType, className?: string) {
  return cn(resolveToken(token), className)
}

/**
 * Optional shortcuts
 */
export const typographyClasses = {
  display: {
    xl: resolveToken(typography.display.xl),
    lg: resolveToken(typography.display.lg),
    md: resolveToken(typography.display.md),
    sm: resolveToken(typography.display.sm),
  },

  heading: {
    h1: resolveToken(typography.heading.h1),
    h2: resolveToken(typography.heading.h2),
    h3: resolveToken(typography.heading.h3),
    h4: resolveToken(typography.heading.h4),
    h5: resolveToken(typography.heading.h5),
    h6: resolveToken(typography.heading.h6),
  },

  hero: {
    title: resolveToken(typography.hero.title),
    subtitle: resolveToken(typography.hero.subtitle),
  },

  body: {
    xl: resolveToken(typography.body.xl),
    lg: resolveToken(typography.body.lg),
    md: resolveToken(typography.body.md),
    sm: resolveToken(typography.body.sm),
    xs: resolveToken(typography.body.xs),
  },

  label: {
    lg: resolveToken(typography.label.lg),
    md: resolveToken(typography.label.md),
    sm: resolveToken(typography.label.sm),
  },

  button: {
    lg: resolveToken(typography.button.lg),
    md: resolveToken(typography.button.md),
    sm: resolveToken(typography.button.sm),
  },

  card: {
    title: resolveToken(typography.card.title),
    subtitle: resolveToken(typography.card.subtitle),
    description: resolveToken(typography.card.description),
  },

  table: {
    header: resolveToken(typography.table.header),
    cell: resolveToken(typography.table.cell),
  },

  badge: {
    sm: resolveToken(typography.badge.sm),
    md: resolveToken(typography.badge.md),
  },

  caption: {
    lg: resolveToken(typography.caption.lg),
    md: resolveToken(typography.caption.md),
    sm: resolveToken(typography.caption.sm),
  },

  form: {
    label: resolveToken(typography.form.label),
    helper: resolveToken(typography.form.helper),
    error: resolveToken(typography.form.error),
    placeholder: resolveToken(typography.form.placeholder),
  },

  empty: {
    title: resolveToken(typography.empty.title),
    description: resolveToken(typography.empty.description),
  },
} as const
