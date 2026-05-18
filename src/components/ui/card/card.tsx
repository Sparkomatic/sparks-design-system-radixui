// Origin: Layout component — no Radix primitive
import "./card.css"
import * as React from "react"
import { cn } from "@/lib/utils"

// ── Card (root) ────────────────────────────────────────────────────────────

export interface CardProps extends React.ComponentPropsWithoutRef<"div"> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("card es-shadow-raised flex flex-col overflow-hidden", className)}
      {...props}
    />
  )
)
Card.displayName = "Card"

// ── CardImage ──────────────────────────────────────────────────────────────

export interface CardImageProps extends React.ComponentPropsWithoutRef<"div"> {}

const CardImage = React.forwardRef<HTMLDivElement, CardImageProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("card-image relative w-full shrink-0 overflow-hidden", className)}
      {...props}
    />
  )
)
CardImage.displayName = "CardImage"

// ── CardContent ────────────────────────────────────────────────────────────

export interface CardContentProps extends React.ComponentPropsWithoutRef<"div"> {}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("card-content flex flex-col", className)}
      {...props}
    />
  )
)
CardContent.displayName = "CardContent"

// ── CardHeader ─────────────────────────────────────────────────────────────

export interface CardHeaderProps extends React.ComponentPropsWithoutRef<"div"> {}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("card-header flex flex-col", className)}
      {...props}
    />
  )
)
CardHeader.displayName = "CardHeader"

// ── CardTitle ──────────────────────────────────────────────────────────────

export interface CardTitleProps extends React.ComponentPropsWithoutRef<"h3"> {}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("card-title", className)}
      {...props}
    />
  )
)
CardTitle.displayName = "CardTitle"

// ── CardSubtitle ───────────────────────────────────────────────────────────

export interface CardSubtitleProps extends React.ComponentPropsWithoutRef<"p"> {}

const CardSubtitle = React.forwardRef<HTMLParagraphElement, CardSubtitleProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("card-subtitle", className)}
      {...props}
    />
  )
)
CardSubtitle.displayName = "CardSubtitle"

// ── CardDescription ────────────────────────────────────────────────────────

export interface CardDescriptionProps extends React.ComponentPropsWithoutRef<"p"> {}

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("card-description", className)}
      {...props}
    />
  )
)
CardDescription.displayName = "CardDescription"

// ── CardFooter ─────────────────────────────────────────────────────────────

export interface CardFooterProps extends React.ComponentPropsWithoutRef<"div"> {}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("card-footer", className)}
      {...props}
    />
  )
)
CardFooter.displayName = "CardFooter"

// ── Exports ────────────────────────────────────────────────────────────────

export {
  Card,
  CardImage,
  CardContent,
  CardHeader,
  CardTitle,
  CardSubtitle,
  CardDescription,
  CardFooter,
}
