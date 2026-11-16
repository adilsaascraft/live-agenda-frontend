'use client'

import type { ReactElement } from 'react'
import { MoreHorizontal } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface RowActionsDropdownProps {
  /**
   * Action items.
   *
   * Example:
   * - Edit
   * - Delete
   * - View
   * - Duplicate
   * - Publish
   */
  children: ReactElement | ReactElement[]
}

export function RowActionsDropdown({ children }: RowActionsDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" aria-label="Open actions">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        }
      />

      <DropdownMenuContent align="end" className="min-w-44">
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
