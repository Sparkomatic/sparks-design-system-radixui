// Origin: Layout component — no Radix primitive (native <input> element)
import "./text-input.css"
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// ── Variants ───────────────────────────────────────────────────────────────
const textInputVariants = cva(
  "ti-wrapper ts-ui",
  {
    variants: {
      size: {
        sm: "ti-sm",
        md: "ti-md",
        lg: "ti-lg",
      },
      status: {
        default: "",
        error:   "ti-wrapper-error",
        success: "ti-wrapper-success",
      },
    },
    defaultVariants: {
      size: "md",
      status: "default",
    },
  }
)

// ── Types ──────────────────────────────────────────────────────────────────
export interface TextInputProps
  extends Omit<React.ComponentPropsWithoutRef<"input">, "size">,
    VariantProps<typeof textInputVariants> {
  leadingIcon?:  React.ReactNode
  trailingIcon?: React.ReactNode
}

// ── Component ──────────────────────────────────────────────────────────────
const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, size, status, disabled, leadingIcon, trailingIcon, ...props }, ref) => (
    <div
      className={cn(textInputVariants({ size, status }), className)}
      data-disabled={disabled ? "" : undefined}
    >
      {leadingIcon && (
        <span className="ti-icon" aria-hidden="true">
          {leadingIcon}
        </span>
      )}
      <input
        ref={ref}
        type="text"
        className="ti-field"
        disabled={disabled}
        {...props}
      />
      {trailingIcon && (
        <span className="ti-icon" aria-hidden="true">
          {trailingIcon}
        </span>
      )}
    </div>
  )
)
TextInput.displayName = "TextInput"

export { TextInput, textInputVariants }
