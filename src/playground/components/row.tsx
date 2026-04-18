import * as React from "react"
import { cn } from "@/lib/utils"

interface RowProps {
  label: string
  children: React.ReactNode
  className?: string
  /** Use when items need a dark background to be seen clearly */
  dark?: boolean
}

/**
 * A labelled row of component instances within a Section.
 * Each Row maps to a Figma variant group, size group, or state group.
 */
export function Row({ label, children, className, dark }: RowProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <div
        className={cn(
          "flex flex-wrap items-center gap-3 rounded-lg p-4",
          dark ? "bg-foreground" : "bg-surface border border-border",
          className
        )}
      >
        {children}
      </div>
    </div>
  )
}
