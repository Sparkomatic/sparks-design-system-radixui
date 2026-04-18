import * as React from "react"
import { cn } from "@/lib/utils"

interface SectionProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

/**
 * Top-level grouping for one component's playground page.
 * Maps 1-to-1 with a Figma component.
 */
export function Section({ title, description, children, className }: SectionProps) {
  return (
    <section className={cn("space-y-6", className)}>
      <div className="border-b border-border pb-3">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="space-y-8">{children}</div>
    </section>
  )
}
