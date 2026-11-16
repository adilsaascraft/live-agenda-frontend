import type { Variants } from 'framer-motion'
/**
 * ============================================================================
 * ExpoCon Design System
 * Motion Tokens
 * ============================================================================
 *
 * Shared Framer Motion animation tokens.
 *
 * Every animation in ExpoCon should be built from these primitives.
 *
 * Design Principles
 * -----------------
 * • Fast but elegant
 * • Smooth and physical
 * • Premium enterprise feel
 * • Consistent throughout the application
 * • Motion should enhance UX, never distract
 *
 * Usage:
 *
 * <motion.div
 *   variants={fadeUp}
 *   initial="hidden"
 *   animate="visible"
 * />
 */

import type { Transition } from 'framer-motion'

/* ============================================================================
 * Duration Tokens
 * ========================================================================== */

export const duration = {
  /**
   * Instant feedback.
   *
   * Example:
   * Ripple
   * Small UI interactions
   */
  instant: 0.1,

  /**
   * Small interactions.
   *
   * Example:
   * Buttons
   * Icons
   */
  fast: 0.2,

  /**
   * Default application duration.
   */
  normal: 0.3,

  /**
   * Large UI transitions.
   */
  slow: 0.5,

  /**
   * Hero / marketing animations.
   */
  slower: 0.8,
} as const

/* ============================================================================
 * Easing Tokens
 * ========================================================================== */

export const easing = {
  /**
   * Material-style easing.
   */
  default: [0.4, 0, 0.2, 1],

  /**
   * Smooth natural easing.
   */
  smooth: [0.25, 0.1, 0.25, 1],

  /**
   * Sharp UI transitions.
   */
  sharp: [0.4, 0, 0.6, 1],

  /**
   * Gentle overshoot.
   */
  bounce: [0.34, 1.56, 0.64, 1],
} as const

/* ============================================================================
 * Transition Presets
 * ========================================================================== */

export const transitions = {
  /**
   * Default transition.
   */
  default: {
    duration: duration.normal,
    ease: easing.default,
  } satisfies Transition,

  /**
   * Fast UI interactions.
   */
  fast: {
    duration: duration.fast,
    ease: easing.default,
  } satisfies Transition,

  /**
   * Large transitions.
   */
  slow: {
    duration: duration.slow,
    ease: easing.default,
  } satisfies Transition,

  /**
   * Smooth premium feel.
   */
  smooth: {
    duration: duration.normal,
    ease: easing.smooth,
  } satisfies Transition,

  /**
   * Soft bounce.
   */
  bounce: {
    duration: 0.6,
    ease: easing.bounce,
  } satisfies Transition,
}

/* ============================================================================
 * Spring Presets
 * ========================================================================== */

export const springs = {
  /**
   * General UI spring.
   */
  default: {
    type: 'spring',
    stiffness: 300,
    damping: 30,
  } satisfies Transition,

  /**
   * Softer movement.
   */
  soft: {
    type: 'spring',
    stiffness: 180,
    damping: 22,
  } satisfies Transition,

  /**
   * Fast responsive movement.
   */
  snappy: {
    type: 'spring',
    stiffness: 420,
    damping: 28,
  } satisfies Transition,

  /**
   * Premium dialog / sheet animation.
   *
   * Gives the feeling that the surface
   * gently floats toward the user.
   */
  modal: {
    type: 'spring',
    stiffness: 260,
    damping: 24,
    mass: 0.9,
  } satisfies Transition,
}

/* ============================================================================
 * Hover Effects
 * ========================================================================== */

export const hover = {
  /**
   * Cards gently lift.
   */
  card: {
    y: -4,
    transition: transitions.default,
  },

  /**
   * Primary buttons.
   */
  button: {
    scale: 1.03,
    transition: transitions.fast,
  },

  /**
   * Images.
   */
  image: {
    scale: 1.04,
    transition: transitions.smooth,
  },

  /**
   * Small icon rotation.
   */
  icon: {
    rotate: 8,
    transition: transitions.fast,
  },
} as const

/* ============================================================================
 * Tap Effects
 * ========================================================================== */

export const tap = {
  /**
   * Button press.
   */
  button: {
    scale: 0.97,
  },

  /**
   * Icon press.
   */
  icon: {
    scale: 0.9,
  },
} as const

/* ============================================================================
 * Reusable Motion Variants
 * ========================================================================== */

/**
 * Simple fade.
 */
export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },

  visible: {
    opacity: 1,
    transition: transitions.default,
  },

  exit: {
    opacity: 0,
    transition: transitions.fast,
  },
}

/**
 * Fade upward.
 *
 * Default animation for:
 * - Cards
 * - Forms
 * - Sections
 */
export const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: springs.soft,
  },

  exit: {
    opacity: 0,
    y: 10,
    transition: transitions.fast,
  },
}

/**
 * Fade downward.
 */
export const fadeDown: Variants = {
  hidden: {
    opacity: 0,
    y: -20,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: springs.soft,
  },

  exit: {
    opacity: 0,
    y: -10,
    transition: transitions.fast,
  },
}

/**
 * Fade from left.
 */
export const fadeLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -24,
  },

  visible: {
    opacity: 1,
    x: 0,
    transition: springs.soft,
  },

  exit: {
    opacity: 0,
    x: -12,
    transition: transitions.fast,
  },
}

/**
 * Fade from right.
 */
export const fadeRight: Variants = {
  hidden: {
    opacity: 0,
    x: 24,
  },

  visible: {
    opacity: 1,
    x: 0,
    transition: springs.soft,
  },

  exit: {
    opacity: 0,
    x: 12,
    transition: transitions.fast,
  },
}

/**
 * Gentle zoom.
 *
 * Best for:
 * - Dialogs
 * - Sheets
 * - Popovers
 */
export const zoomIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.96,
  },

  visible: {
    opacity: 1,
    scale: 1,
    transition: springs.modal,
  },

  exit: {
    opacity: 0,
    scale: 0.98,
    transition: transitions.fast,
  },
}

/**
 * Small pop animation.
 *
 * Best for:
 * - Badges
 * - Small cards
 * - Icons
 */
export const pop: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.85,
  },

  visible: {
    opacity: 1,
    scale: 1,
    transition: springs.default,
  },

  exit: {
    opacity: 0,
    scale: 0.9,
    transition: transitions.fast,
  },
}


/* ============================================================================
 * Dialog Animations
 * ========================================================================== */

/**
 * Overlay
 *
 * A soft backdrop that fades independently of the dialog.
 */
export const dialogOverlay: Variants = {
  hidden: {
    opacity: 0,
  },

  visible: {
    opacity: 1,

    transition: {
      duration: 0.18,
    },
  },

  exit: {
    opacity: 0,

    transition: {
      duration: 0.15,
    },
  },
}

/**
 * Floating Dialog
 *
 * The dialog feels like it gently floats
 * toward the user.
 *
 * No rotation.
 * No gimmicks.
 * Pure premium motion.
 */
export const dialog: Variants = {
  hidden: {
    opacity: 0,

    scale: 0.94,

    y: 24,

    filter: 'blur(10px)',
  },

  visible: {
    opacity: 1,

    scale: 1,

    y: 0,

    filter: 'blur(0px)',

    transition: springs.modal,
  },

  exit: {
    opacity: 0,

    scale: 0.97,

    y: 12,

    filter: 'blur(4px)',

    transition: transitions.fast,
  },
}

/* ============================================================================
 * Table Animations
 * ========================================================================== */

/**
 * Individual table row.
 *
 * Gives tables a premium feel without
 * looking animated.
 */
export const tableRow: Variants = {
  hidden: {
    opacity: 0,

    y: 8,
  },

  visible: {
    opacity: 1,

    y: 0,

    transition: transitions.default,
  },

  exit: {
    opacity: 0,

    y: 4,

    transition: transitions.fast,
  },
}

/* ============================================================================
 * Page Animations
 * ========================================================================== */

/**
 * Default page transition.
 *
 * Used when navigating between pages.
 */
export const page: Variants = {
  hidden: {
    opacity: 0,

    y: 16,
  },

  visible: {
    opacity: 1,

    y: 0,

    transition: {
      duration: 0.35,

      ease: easing.default,
    },
  },

  exit: {
    opacity: 0,

    y: 12,

    transition: transitions.fast,
  },
}

/* ============================================================================
 * Stagger Animations
 * ========================================================================== */

export const stagger = {
  /**
   * Default stagger.
   */
  container: {
    hidden: {},

    visible: {
      transition: {
        staggerChildren: 0.08,

        delayChildren: 0.05,
      },
    },

    exit: {
      transition: {
        staggerChildren: 0.03,

        staggerDirection: -1,
      },
    },
  } satisfies Variants,

  /**
   * Faster stagger.
   */
  fast: {
    hidden: {},

    visible: {
      transition: {
        staggerChildren: 0.04,
      },
    },

    exit: {
      transition: {
        staggerChildren: 0.02,

        staggerDirection: -1,
      },
    },
  } satisfies Variants,
}