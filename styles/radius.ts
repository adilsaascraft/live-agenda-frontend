/**
 * ============================================================================
 * ExpoCon Design System
 * Border Radius Tokens
 * ============================================================================
 *
 * Defines border radius tokens for the entire application.
 * Components should use these semantic tokens instead of hardcoding
 * rounded-* classes.
 */

/**
 * ============================================================================
 * Primitive Radius Tokens
 * ============================================================================
 */

export const radius = {
  none: 'rounded-none',

  xs: 'rounded-sm', // 2px
  sm: 'rounded', // 4px
  md: 'rounded-md', // 6px
  lg: 'rounded-lg', // 8px
  xl: 'rounded-xl', // 12px
  '2xl': 'rounded-2xl', // 16px
  '3xl': 'rounded-3xl', // 24px

  full: 'rounded-full',
} as const

/**
 * ============================================================================
 * Semantic Radius Tokens
 * ============================================================================
 */

export const componentRadius = {
  /**
   * Buttons
   */
  button: radius.lg,

  /**
   * Cards
   */
  card: radius.xl,

  /**
   * Dialogs / Modals
   */
  dialog: radius['2xl'],

  /**
   * Drawer
   */
  drawer: radius['2xl'],

  /**
   * Input / Select / Textarea
   */
  input: radius.lg,

  /**
   * Search Box
   */
  search: radius.full,

  /**
   * Badge
   */
  badge: radius.full,

  /**
   * Avatar
   */
  avatar: radius.full,

  /**
   * Images
   */
  image: radius.xl,

  /**
   * Event Banner
   */
  banner: radius['2xl'],

  /**
   * Hero Section
   */
  hero: radius['3xl'],

  /**
   * Tooltip
   */
  tooltip: radius.md,

  /**
   * Dropdown
   */
  dropdown: radius.lg,

  /**
   * Table
   */
  table: radius.lg,

  /**
   * Accordion
   */
  accordion: radius.lg,

  /**
   * Tabs
   */
  tabs: radius.lg,

  /**
   * Toast
   */
  toast: radius.xl,
} as const

/**
 * ============================================================================
 * Types
 * ============================================================================
 */

export type Radius = typeof radius
export type ComponentRadius = typeof componentRadius
