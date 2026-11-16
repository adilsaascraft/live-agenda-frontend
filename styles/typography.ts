/**
 * ============================================================================
 * ExpoCon Design System
 * Typography Tokens
 * ============================================================================
 *
 * This file contains only typography design tokens.
 * It does NOT contain Tailwind classes.
 *
 * Tailwind class composition should happen in styles/text.ts
 */

export const fontFamily = {
  sans: 'font-sans',
  mono: 'font-mono',
} as const

export const fontWeight = {
  thin: 'font-thin',
  extralight: 'font-extralight',
  light: 'font-light',
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold',
  black: 'font-black',
} as const

export const fontSize = {
  xs: 'text-xs', // 12
  sm: 'text-sm', // 14
  base: 'text-base', // 16
  lg: 'text-lg', // 18
  xl: 'text-xl', // 20
  '2xl': 'text-2xl', // 24
  '3xl': 'text-3xl', // 30
  '4xl': 'text-4xl', // 36
  '5xl': 'text-5xl', // 48
  '6xl': 'text-6xl', // 60
} as const

export const lineHeight = {
  none: 'leading-none',
  tight: 'leading-tight',
  snug: 'leading-snug',
  normal: 'leading-normal',
  relaxed: 'leading-relaxed',
  loose: 'leading-loose',
} as const

export const letterSpacing = {
  tighter: 'tracking-tighter',
  tight: 'tracking-tight',
  normal: 'tracking-normal',
  wide: 'tracking-wide',
  wider: 'tracking-wider',
  widest: 'tracking-widest',
} as const

type TypographyToken = {
  size: keyof typeof fontSize
  weight: keyof typeof fontWeight
  lineHeight: keyof typeof lineHeight
  tracking?: keyof typeof letterSpacing
}

export const typography = {
  display: {
    xl: {
      size: '6xl',
      weight: 'bold',
      lineHeight: 'tight',
      tracking: 'tight',
    },
    lg: {
      size: '5xl',
      weight: 'bold',
      lineHeight: 'tight',
      tracking: 'tight',
    },
    md: {
      size: '4xl',
      weight: 'bold',
      lineHeight: 'tight',
      tracking: 'tight',
    },
    sm: {
      size: '3xl',
      weight: 'bold',
      lineHeight: 'tight',
    },
  },

  heading: {
    h1: {
      size: '4xl',
      weight: 'bold',
      lineHeight: 'tight',
      tracking: 'tight',
    },

    h2: {
      size: '3xl',
      weight: 'bold',
      lineHeight: 'tight',
    },

    h3: {
      size: '2xl',
      weight: 'semibold',
      lineHeight: 'snug',
    },

    h4: {
      size: 'xl',
      weight: 'semibold',
      lineHeight: 'snug',
    },

    h5: {
      size: 'lg',
      weight: 'semibold',
      lineHeight: 'snug',
    },

    h6: {
      size: 'base',
      weight: 'semibold',
      lineHeight: 'normal',
    },
  },

  hero: {
    title: {
      size: '6xl',
      weight: 'black',
      lineHeight: 'tight',
      tracking: 'tight',
    },

    subtitle: {
      size: 'xl',
      weight: 'normal',
      lineHeight: 'relaxed',
    },
  },

  body: {
    xl: {
      size: 'xl',
      weight: 'normal',
      lineHeight: 'relaxed',
    },

    lg: {
      size: 'lg',
      weight: 'normal',
      lineHeight: 'relaxed',
    },

    md: {
      size: 'base',
      weight: 'normal',
      lineHeight: 'relaxed',
    },

    sm: {
      size: 'sm',
      weight: 'normal',
      lineHeight: 'relaxed',
    },

    xs: {
      size: 'xs',
      weight: 'normal',
      lineHeight: 'normal',
    },
  },

  label: {
    lg: {
      size: 'base',
      weight: 'medium',
      lineHeight: 'normal',
    },

    md: {
      size: 'sm',
      weight: 'medium',
      lineHeight: 'normal',
    },

    sm: {
      size: 'xs',
      weight: 'medium',
      lineHeight: 'normal',
    },
  },

  button: {
    lg: {
      size: 'base',
      weight: 'semibold',
      lineHeight: 'normal',
    },

    md: {
      size: 'sm',
      weight: 'semibold',
      lineHeight: 'normal',
    },

    sm: {
      size: 'xs',
      weight: 'semibold',
      lineHeight: 'normal',
    },
  },

  card: {
    title: {
      size: 'lg',
      weight: 'semibold',
      lineHeight: 'snug',
    },

    subtitle: {
      size: 'sm',
      weight: 'normal',
      lineHeight: 'normal',
    },

    description: {
      size: 'sm',
      weight: 'normal',
      lineHeight: 'relaxed',
    },
  },

  table: {
    header: {
      size: 'sm',
      weight: 'semibold',
      lineHeight: 'normal',
      tracking: 'wide',
    },

    cell: {
      size: 'sm',
      weight: 'normal',
      lineHeight: 'normal',
    },
  },

  badge: {
    sm: {
      size: 'xs',
      weight: 'semibold',
      lineHeight: 'normal',
      tracking: 'wide',
    },

    md: {
      size: 'sm',
      weight: 'semibold',
      lineHeight: 'normal',
      tracking: 'wide',
    },
  },

  caption: {
    lg: {
      size: 'sm',
      weight: 'normal',
      lineHeight: 'normal',
    },

    md: {
      size: 'xs',
      weight: 'normal',
      lineHeight: 'normal',
    },

    sm: {
      size: 'xs',
      weight: 'normal',
      lineHeight: 'none',
    },
  },

  form: {
    label: {
      size: 'sm',
      weight: 'medium',
      lineHeight: 'normal',
    },

    helper: {
      size: 'xs',
      weight: 'normal',
      lineHeight: 'normal',
    },

    error: {
      size: 'xs',
      weight: 'medium',
      lineHeight: 'normal',
    },

    placeholder: {
      size: 'sm',
      weight: 'normal',
      lineHeight: 'normal',
    },
  },

  empty: {
    title: {
      size: 'xl',
      weight: 'semibold',
      lineHeight: 'snug',
    },

    description: {
      size: 'sm',
      weight: 'normal',
      lineHeight: 'relaxed',
    },
  },
} satisfies Record<string, Record<string, TypographyToken>>

export type Typography = typeof typography
export type TypographyTokenType = TypographyToken
export type FontSize = keyof typeof fontSize
export type FontWeight = keyof typeof fontWeight
export type FontFamily = keyof typeof fontFamily
export type LineHeight = keyof typeof lineHeight
export type LetterSpacing = keyof typeof letterSpacing
