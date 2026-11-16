'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-secondary-dark text-muted-foreground">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-5 md:flex-row">
        <p className="text-sm text-muted-foreground">
          © 2024–{new Date().getFullYear()} ExpoCon. All rights reserved.
        </p>

        <nav className="flex items-center gap-6">
          <Link
            href="/policy"
            className="text-sm text-muted-foreground transition-colors duration-200 hover:text-accent-purple"
          >
            Privacy Policy
          </Link>

          <Link
            href="/terms"
            className="text-sm text-muted-foreground transition-colors duration-200 hover:text-accent-purple"
          >
            Terms of Service
          </Link>

          <Link
            href="/cookies"
            className="text-sm text-muted-foreground transition-colors duration-200 hover:text-accent-purple"
          >
            Cookie Policy
          </Link>
        </nav>
      </div>
    </footer>
  )
}
