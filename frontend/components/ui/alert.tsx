import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { CircleCheck, CircleAlert } from 'lucide-react'

import { cn } from '@/lib/utils'

const alertVariants = cva(
  'relative w-full rounded-lg border px-4 py-3 text-sm flex items-start gap-3',
  {
    variants: {
      variant: {
        default:
          'bg-card text-card-foreground border-border',

        success:
          'bg-emerald-50 text-emerald-900 border-emerald-200 ' +
          'dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-900',

        danger:
          'bg-red-50 text-red-900 border-red-200 ' +
          'dark:bg-red-950 dark:text-red-200 dark:border-red-900',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function Alert({
  className,
  variant,
  children,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {/* Icon */}
      {variant === 'success' && (
        <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
      )}

      {variant === 'danger' && (
        <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-900 dark:text-red-400" />
      )}

      {/* Content */}
      <div className="flex flex-col gap-0.5">
        {children}
      </div>
    </div>
  )
}

function AlertTitle({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        'text-sm font-medium leading-tight',
        className,
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        'text-xs leading-relaxed opacity-90',
        className,
      )}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription }
