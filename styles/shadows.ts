/**
 * ============================================================================
 * ExpoCon Design System
 * Shadow Tokens
 * ============================================================================
 *
 * Defines elevation and shadow tokens for the application.
 * Components should consume semantic shadows instead of hardcoding
 * Tailwind shadow classes.
 */

/**
 * ============================================================================
 * Primitive Shadow Tokens
 * ============================================================================
 */

export const shadows = {
  none: 'shadow-none',

  xs: 'shadow-xs',

  sm: 'shadow-sm',

  md: 'shadow',

  lg: 'shadow-md',

  xl: 'shadow-lg',

  '2xl': 'shadow-xl',

  inner: 'shadow-inner',
} as const

/**
 * ============================================================================
 * Semantic Shadow Tokens
 * ============================================================================
 */

export const componentShadows = {
  /**
   * Buttons
   */
  button: shadows.sm,

  /**
   * Primary CTA Buttons
   */
  buttonHover: shadows.md,

  /**
   * Cards
   */
  card: shadows.sm,

  /**
   * Featured Cards
   */
  featuredCard: shadows.lg,

  /**
   * Event Cards
   */
  eventCard: shadows.md,

  /**
   * Organizer Cards
   */
  organizerCard: shadows.md,

  /**
   * Venue Cards
   */
  venueCard: shadows.md,

  /**
   * Supplier Cards
   */
  supplierCard: shadows.md,

  /**
   * Images
   */
  image: shadows.sm,

  /**
   * Hero Banner
   */
  hero: shadows.xl,

  /**
   * Header / Navbar
   */
  navbar: shadows.sm,

  /**
   * Sidebar
   */
  sidebar: shadows.sm,

  /**
   * Dropdown
   */
  dropdown: shadows.lg,

  /**
   * Popover
   */
  popover: shadows.lg,

  /**
   * Tooltip
   */
  tooltip: shadows.md,

  /**
   * Modal
   */
  modal: shadows['2xl'],

  /**
   * Drawer
   */
  drawer: shadows.xl,

  /**
   * Toast
   */
  toast: shadows.lg,

  /**
   * Floating Action Button
   */
  floatingAction: shadows.xl,

  /**
   * Search Bar
   */
  search: shadows.sm,

  /**
   * Input
   */
  input: shadows.none,

  /**
   * Table
   */
  table: shadows.none,
} as const

/**
 * ============================================================================
 * Hover Elevation
 * ============================================================================
 */

export const hoverShadows = {
  card: shadows.lg,

  button: shadows.md,

  image: shadows.lg,

  dropdown: shadows.xl,
} as const

/**
 * ============================================================================
 * Focus Elevation
 * ============================================================================
 */

export const focusShadows = {
  input: 'focus:ring-2 focus:ring-primary/20 focus:ring-offset-2',

  button: 'focus:ring-2 focus:ring-primary/20 focus:ring-offset-2',

  card: 'focus:ring-2 focus:ring-primary/10',
} as const

/**
 * ============================================================================
 * Types
 * ============================================================================
 */

export type Shadows = typeof shadows
export type ComponentShadows = typeof componentShadows
