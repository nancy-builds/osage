import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full border border-border/40 \
  px-2.5 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 \
  bg-muted/40 text-foreground/80 \
  [&>svg]:size-3 [&>svg]:pointer-events-none \
  transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
        secondary:
          'border-transparent bg-primary/10 text-primary',
        destructive:
          'border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span'

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
