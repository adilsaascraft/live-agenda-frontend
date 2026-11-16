'use client'

import { Loader2 } from 'lucide-react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

import { Button } from '@/components/ui/button'

interface ConfirmDialogProps<TResult = unknown> {
  /**
   * Controls dialog visibility.
   */
  open: boolean

  /**
   * Dialog state change.
   */
  onOpenChange(open: boolean): void

  /**
   * Dialog title.
   */
  title: string

  /**
   * Dialog description.
   */
  description: string

  /**
   * Confirm callback.
   */
  onConfirm: () => Promise<TResult> | TResult

  /**
   * Mutation loading state.
   */
  isPending?: boolean

  /**
   * Confirm button text.
   */
  confirmText?: string

  /**
   * Cancel button text.
   */
  cancelText?: string

  /**
   * Confirm button variant.
   */
  confirmVariant?:
    | 'default'
    | 'destructive'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'link'
}

export function ConfirmDialog<TResult = unknown>({
  open,
  onOpenChange,

  title,
  description,

  onConfirm,

  isPending = false,

  confirmText = 'Confirm',
  cancelText = 'Cancel',

  confirmVariant = 'destructive',
}: ConfirmDialogProps<TResult>) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (isPending) return

        onOpenChange(nextOpen)
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className={'font-bold text-lg'}>{title}</AlertDialogTitle>

          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            render={
              <Button variant="outline" disabled={isPending}>
                {cancelText}
              </Button>
            }
          />

          <AlertDialogAction
          className={'bg-red-600 hover:bg-red-700'}
            render={
              <Button
                variant={confirmVariant}
                disabled={isPending}
                onClick={async (event) => {
                  event.preventDefault()

                  await onConfirm()
                }}
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}

                {confirmText}
              </Button>
            }
          />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
