/**
 * ============================================================================
 * ExpoCon Design System
 * Spacing Tokens
 * ============================================================================
 *
 * This file defines spacing tokens only.
 * It does NOT contain component-specific styles.
 */

export const spacing = {
  0: '0',
  px: 'px',

  0.5: '0.125rem', // 2px
  1: '0.25rem', // 4px
  1.5: '0.375rem', // 6px
  2: '0.5rem', // 8px
  2.5: '0.625rem', // 10px
  3: '0.75rem', // 12px
  3.5: '0.875rem', // 14px
  4: '1rem', // 16px
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  7: '1.75rem', // 28px
  8: '2rem', // 32px
  9: '2.25rem', // 36px
  10: '2.5rem', // 40px
  12: '3rem', // 48px
  14: '3.5rem', // 56px
  16: '4rem', // 64px
  20: '5rem', // 80px
  24: '6rem', // 96px
  28: '7rem', // 112px
  32: '8rem', // 128px
} as const

/**
 * ============================================================================
 * Semantic Spacing
 * ============================================================================
 */

export const pageSpacing = {
  x: 'px-4 md:px-6 lg:px-8 xl:px-10',
  y: 'py-6 md:py-8 lg:py-10',
} as const

export const sectionSpacing = {
  xs: 'py-6',
  sm: 'py-8',
  md: 'py-12',
  lg: 'py-16',
  xl: 'py-20',
  '2xl': 'py-24',
} as const

export const containerSpacing = {
  xs: 'max-w-3xl',
  sm: 'max-w-5xl',
  md: 'max-w-6xl',
  lg: 'max-w-7xl',
  xl: 'max-w-[90rem]',
  full: 'max-w-full',
} as const

export const gap = {
  xs: 'gap-2',
  sm: 'gap-3',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
  '2xl': 'gap-10',
} as const

export const padding = {
  xs: 'p-2',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
  xl: 'p-8',
  '2xl': 'p-10',
} as const

export const margin = {
  xs: 'm-2',
  sm: 'm-3',
  md: 'm-4',
  lg: 'm-6',
  xl: 'm-8',
  '2xl': 'm-10',
} as const

/**
 * Common component spacing
 */

export const componentSpacing = {
  card: 'p-6',

  cardCompact: 'p-4',

  dialog: 'p-6',

  drawer: 'p-6',

  inputX: 'px-4',

  inputY: 'py-2.5',

  buttonX: 'px-5',

  buttonY: 'py-2.5',

  navbar: 'px-6 py-4',

  sidebar: 'p-5',

  tableCell: 'px-4 py-3',

  badge: 'px-2 py-1',
} as const

/**
 * Grid spacing
 */

export const grid = {
  cards: 'gap-6',

  list: 'gap-4',

  gallery: 'gap-5',

  dashboard: 'gap-6',
} as const

/**
 * Layout spacing
 */

export const layout = {
  page: 'space-y-8',

  section: 'space-y-6',

  content: 'space-y-4',

  form: 'space-y-5',

  card: 'space-y-4',

  list: 'space-y-3',

  sidebar: 'space-y-2',
} as const

/**
 * Types
 */

export type Spacing = typeof spacing
