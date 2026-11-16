/**
 * ============================================================================
 * ExpoCon Design System
 * Breakpoint Tokens
 * ============================================================================
 *
 * Responsive breakpoints used across the application.
 *
 * These values match Tailwind CSS defaults.
 */

/**
 * ============================================================================
 * Primitive Breakpoints
 * ============================================================================
 */

export const breakpoints = {
  xs: '475px',

  sm: '640px',

  md: '768px',

  lg: '1024px',

  xl: '1280px',

  '2xl': '1536px',
} as const

/**
 * ============================================================================
 * Semantic Breakpoints
 * ============================================================================
 */

export const screen = {
  mobile: breakpoints.sm,

  tablet: breakpoints.md,

  laptop: breakpoints.lg,

  desktop: breakpoints.xl,

  wide: breakpoints['2xl'],
} as const

/**
 * ============================================================================
 * Responsive Container Widths
 * ============================================================================
 */

export const container = {
  sm: 'max-w-screen-sm',

  md: 'max-w-screen-md',

  lg: 'max-w-screen-lg',

  xl: 'max-w-screen-xl',

  '2xl': 'max-w-screen-2xl',

  full: 'max-w-full',
} as const

/**
 * ============================================================================
 * Responsive Grid Columns
 * ============================================================================
 */

export const gridColumns = {
  cards: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',

  events: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3',

  organizers: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',

  venues: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',

  suppliers: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',

  dashboard: 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-4',
} as const

/**
 * ============================================================================
 * Responsive Visibility Helpers
 * ============================================================================
 */

export const visibility = {
  mobileOnly: 'block md:hidden',

  tabletOnly: 'hidden md:block lg:hidden',

  desktopOnly: 'hidden lg:block',

  mobileAndTablet: 'block lg:hidden',

  tabletAndDesktop: 'hidden md:block',
} as const

/**
 * ============================================================================
 * Responsive Flex Direction
 * ============================================================================
 */

export const flexDirection = {
  stack: 'flex-col lg:flex-row',

  reverse: 'flex-col-reverse lg:flex-row',

  center: 'flex-col items-center lg:flex-row',
} as const

/**
 * ============================================================================
 * Responsive Gap
 * ============================================================================
 */

export const responsiveGap = {
  xs: 'gap-2 md:gap-3',

  sm: 'gap-3 md:gap-4',

  md: 'gap-4 lg:gap-6',

  lg: 'gap-6 xl:gap-8',

  xl: 'gap-8 xl:gap-10',
} as const

/**
 * ============================================================================
 * Types
 * ============================================================================
 */

export type Breakpoints = typeof breakpoints
export type Screen = typeof screen
