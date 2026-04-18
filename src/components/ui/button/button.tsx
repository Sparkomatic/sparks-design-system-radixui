import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// ── Variants ───────────────────────────────────────────────────────────────
// NOTE: Minimal Tailwind classes only — no design tokens yet.
// Replace these with token-driven values once a Figma design is brought in.
const buttonVariants = cva(
  // Base — applied to every variant
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current cursor-pointer",
  {
    variants: {
      variant: {
        default:     "bg-foreground text-background hover:bg-foreground/90",
        outline:     "border border-foreground text-foreground hover:bg-foreground hover:text-background",
        ghost:       "text-foreground hover:bg-foreground/10",
        destructive: "bg-red-600 text-white hover:bg-red-700",
      },
      size: {
        sm: "h-8  px-3 text-xs rounded-md",
        md: "h-10 px-4 text-sm rounded-md",
        lg: "h-12 px-6 text-base rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

// ── Types ──────────────────────────────────────────────────────────────────
export interface ButtonProps
  extends React.ComponentPropsWithoutRef<"button">,
    VariantProps<typeof buttonVariants> {
  /** Renders the button's child as the root element (e.g. a link). */
  asChild?: boolean
}

// ── Component ──────────────────────────────────────────────────────────────
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
