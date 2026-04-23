// Origin: Radix primitive — @radix-ui/react-slot
import "./button.css"
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// ── Variants ───────────────────────────────────────────────────────────────
const buttonVariants = cva(
  // Layout only — colours, spacing, radius, and border live in button.css classes
  "inline-flex items-center justify-center whitespace-nowrap font-medium border-solid transition-colors disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current cursor-pointer",
  {
    variants: {
      variant: {
        primary:     "button-primary",
        secondary:   "button-secondary",
        tertiary:    "button-tertiary",
        utility:     "button-utility",
        destructive: "button-destructive",
      },
      size: {
        sm: "button-size-sm",
        md: "button-size-md",
        lg: "button-size-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

// ── Types ──────────────────────────────────────────────────────────────────
export interface ButtonProps
  extends React.ComponentPropsWithoutRef<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  leadingIcon?: React.ReactNode
  trailingIcon?: React.ReactNode
}

// ── Component ──────────────────────────────────────────────────────────────
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, leadingIcon, trailingIcon, disabled, children, ...props }, ref) => {
    const baseClass = cn(buttonVariants({ variant, size }), className)

    if (asChild) {
      return (
        <Slot ref={ref} className={baseClass} disabled={disabled} {...props}>
          {children}
        </Slot>
      )
    }

    return (
      <button
        ref={ref}
        data-loading={loading || undefined}
        disabled={disabled || loading}
        className={baseClass}
        {...props}
      >
        {loading && (
          <span className="animate-spin size-4 border-2 border-current border-t-transparent rounded-full" aria-hidden />
        )}
        {!loading && leadingIcon}
        {children}
        {!loading && trailingIcon}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
