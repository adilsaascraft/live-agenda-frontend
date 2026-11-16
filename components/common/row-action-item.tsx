'use client'

import type { ReactNode } from 'react'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

interface RowActionItemProps {
  icon?: ReactNode

  children: ReactNode

  onClick?: () => void

  disabled?: boolean

  destructive?: boolean
}

export function RowActionItem({
  icon,
  children,
  onClick,
  disabled,
  destructive,
}: RowActionItemProps) {
  return (
    <DropdownMenuItem
      disabled={disabled}
      onClick={onClick}
      className={
        destructive ? 'text-destructive focus:text-destructive' : undefined
      }
    >
      {icon && (
        <span className="mr-2 flex h-4 w-4 items-center justify-center">
          {icon}
        </span>
      )}

      {children}
    </DropdownMenuItem>
  )
}
