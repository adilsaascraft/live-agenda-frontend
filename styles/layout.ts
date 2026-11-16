/**
 * ============================================================================
 * ExpoCon Design System
 * Layout Tokens
 * ============================================================================
 *
 * Defines reusable layout patterns used throughout the application.
 *
 * These tokens provide a consistent layout language for pages,
 * sections, containers, sidebars, dashboards and forms.
 */

/* ============================================================================
 * Containers
 * ========================================================================== */

export const containers = {
  xs: 'max-w-3xl mx-auto',

  sm: 'max-w-5xl mx-auto',

  md: 'max-w-6xl mx-auto',

  lg: 'max-w-7xl mx-auto',

  xl: 'max-w-[90rem] mx-auto',

  full: 'w-full',
} as const

/* ============================================================================
 * Page Layout
 * ========================================================================== */

export const page = {
  wrapper: 'min-h-screen',

  container: 'mx-auto w-full',

  content: 'space-y-8',

  centered: 'min-h-screen flex items-center justify-center',

  narrow: 'max-w-4xl mx-auto',

  wide: 'max-w-7xl mx-auto',
} as const

/* ============================================================================
 * Sections
 * ========================================================================== */

export const sections = {
  hero: 'py-20',

  default: 'py-16',

  compact: 'py-10',

  relaxed: 'py-24',

  footer: 'py-12',
} as const

/* ============================================================================
 * Header
 * ========================================================================== */

export const header = {
  wrapper: 'sticky top-0 z-50 w-full',

  container: 'flex h-16 items-center justify-between',

  actions: 'flex items-center gap-3',
} as const

/* ============================================================================
 * Sidebar
 * ========================================================================== */

export const sidebar = {
  wrapper: 'w-72 shrink-0',

  content: 'space-y-4',

  navigation: 'space-y-2',
} as const

/* ============================================================================
 * Dashboard
 * ========================================================================== */

export const dashboard = {
  wrapper: 'grid gap-6',

  cards: 'grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-4',

  content: 'grid gap-6 lg:grid-cols-[280px_1fr]',

  statistics: 'grid gap-6 grid-cols-2 xl:grid-cols-4',
} as const

/* ============================================================================
 * Grid Layouts
 * ========================================================================== */

export const grid = {
  cards: 'grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3',

  events: 'grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3',

  venues: 'grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3',

  organizers: 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3',

  suppliers:
    'grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',

  gallery: 'grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4',
} as const

/* ============================================================================
 * Flex Layouts
 * ========================================================================== */

export const flex = {
  between: 'flex items-center justify-between',

  center: 'flex items-center justify-center',

  start: 'flex items-center',

  column: 'flex flex-col',

  columnCenter: 'flex flex-col items-center',

  wrap: 'flex flex-wrap',

  responsive: 'flex flex-col lg:flex-row',
} as const

/* ============================================================================
 * Forms
 * ========================================================================== */

export const form = {
  wrapper: 'space-y-6',

  section: 'space-y-4',

  actions: 'flex justify-end gap-3',

  row: 'grid gap-4 md:grid-cols-2',
} as const

/* ============================================================================
 * Lists
 * ========================================================================== */

export const list = {
  vertical: 'space-y-4',

  compact: 'space-y-2',

  horizontal: 'flex gap-4 overflow-x-auto',

  inline: 'flex flex-wrap gap-2',
} as const

/* ============================================================================
 * Empty States
 * ========================================================================== */

export const empty = {
  wrapper: 'flex flex-col items-center justify-center py-20 text-center',

  icon: 'mb-6',

  content: 'space-y-3',
} as const

/* ============================================================================
 * Loading
 * ========================================================================== */

export const loading = {
  center: 'flex items-center justify-center py-20',

  page: 'flex min-h-screen items-center justify-center',

  section: 'flex items-center justify-center py-10',
} as const

/* ============================================================================
 * Types
 * ========================================================================== */

export type Containers = typeof containers
export type Page = typeof page
export type Sections = typeof sections
export type Dashboard = typeof dashboard
export type Grid = typeof grid
export type Flex = typeof flex
export type Form = typeof form
export type List = typeof list
export type Empty = typeof empty
export type Loading = typeof loading
