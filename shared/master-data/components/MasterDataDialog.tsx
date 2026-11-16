'use client'

import type { ReactNode } from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import type { MasterDataConfig } from '../config'
import type { AnyRecord, MasterDataEntity } from '../types'

type DialogSize = 'sm' | 'md' | 'lg' | 'xl'

const dialogWidths: Record<DialogSize, string> = {
  sm: 'sm:max-w-md',
  md: 'sm:max-w-lg',
  lg: 'sm:max-w-2xl',
  xl: 'sm:max-w-4xl',
}

interface MasterDataDialogProps<
  TEntity extends MasterDataEntity,
  TCreatePayload extends AnyRecord,
  TUpdatePayload extends AnyRecord,
  TFieldKey extends keyof TCreatePayload,
> {
  /**
   * Master Data configuration.
   */
  config: MasterDataConfig<TEntity, TCreatePayload, TUpdatePayload, TFieldKey>

  /**
   * Dialog state.
   */
  open: boolean

  /**
   * Open state callback.
   */
  onOpenChange: (open: boolean) => void

  /**
   * Editing mode.
   */
  isEditing?: boolean

  

  /**
   * Disable dialog while saving.
   */
  isPending?: boolean

  /**
   * Dialog width.
   */
  size?: DialogSize

  /**
   * Dialog body.
   */
  children: ReactNode
}



export function MasterDataDialog<
  TEntity extends MasterDataEntity,
  TCreatePayload extends AnyRecord,
  TUpdatePayload extends AnyRecord,
  TFieldKey extends keyof TCreatePayload,
>({
  config,
  open,
  onOpenChange,
  isEditing = false,
  isPending = false,
  size = 'md',
  children,
}: MasterDataDialogProps<TEntity, TCreatePayload, TUpdatePayload, TFieldKey>) {


  const title = isEditing
    ? `Edit ${config.entity.singular}`
    : `Add ${config.entity.singular}`

  const description = isEditing
    ? `Update the existing ${config.entity.singular.toLowerCase()} information.`
    : `Create a new ${config.entity.singular.toLowerCase()} for ExpoCon.`


  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (isPending) return

        onOpenChange(nextOpen)
      }}
    >
      <DialogContent
        showCloseButton={!isPending}
        className={dialogWidths[size]}
      >
        <DialogHeader>
          <DialogTitle className={'font-bold text-md text-center'}>{title}</DialogTitle>

          <DialogDescription className={'text-center'}>{description}</DialogDescription>
        </DialogHeader>

        {children}
      </DialogContent>
    </Dialog>
  )
}
