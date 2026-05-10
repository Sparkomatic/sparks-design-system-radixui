// Origin: Radix primitive — @radix-ui/react-dropdown-menu
import "./dropdown-menu.css"
import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { ChevronRight } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// ── Variants ───────────────────────────────────────────────────────────────

const dropdownMenuItemVariants = cva(
  // Layout — flex, cursor, outline suppressed (Radix handles focus via data-highlighted)
  "dropdown-menu-item flex items-center ts-ui cursor-default select-none outline-none transition-colors",
  {
    variants: {
      variant: {
        default:     "",
        destructive: "dropdown-menu-item-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

// ── Re-exports (no styling needed) ────────────────────────────────────────

const DropdownMenu        = DropdownMenuPrimitive.Root
DropdownMenu.displayName  = "DropdownMenu"

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
DropdownMenuTrigger.displayName = "DropdownMenuTrigger"

const DropdownMenuPortal  = DropdownMenuPrimitive.Portal
const DropdownMenuGroup   = DropdownMenuPrimitive.Group
const DropdownMenuSub     = DropdownMenuPrimitive.Sub
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

// ── Content ────────────────────────────────────────────────────────────────

export interface DropdownMenuContentProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content> {}

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  DropdownMenuContentProps
>(({ className, sideOffset = 6, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "dropdown-menu-content",
        "min-w-[160px] z-50",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = "DropdownMenuContent"

// ── Item ───────────────────────────────────────────────────────────────────

export interface DropdownMenuItemProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>,
    VariantProps<typeof dropdownMenuItemVariants> {
  icon?:     React.ReactNode
  shortcut?: string
}

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  DropdownMenuItemProps
>(({ className, variant, icon, shortcut, children, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(dropdownMenuItemVariants({ variant }), className)}
    {...props}
  >
    {icon && (
      <span className="dropdown-menu-item-icon size-5 flex items-center justify-center" aria-hidden>
        {icon}
      </span>
    )}
    <span className="flex-1 truncate">{children}</span>
    {shortcut && (
      <span className="dropdown-menu-shortcut ts-caption" aria-hidden>
        {shortcut}
      </span>
    )}
  </DropdownMenuPrimitive.Item>
))
DropdownMenuItem.displayName = "DropdownMenuItem"

// ── Label ──────────────────────────────────────────────────────────────────

export interface DropdownMenuLabelProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> {}

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  DropdownMenuLabelProps
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn("dropdown-menu-label ts-label", className)}
    {...props}
  />
))
DropdownMenuLabel.displayName = "DropdownMenuLabel"

// ── Separator ──────────────────────────────────────────────────────────────

export interface DropdownMenuSeparatorProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator> {}

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  DropdownMenuSeparatorProps
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("dropdown-menu-separator", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = "DropdownMenuSeparator"

// ── Sub Trigger ────────────────────────────────────────────────────────────

export interface DropdownMenuSubTriggerProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger>,
    VariantProps<typeof dropdownMenuItemVariants> {
  icon?: React.ReactNode
}

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  DropdownMenuSubTriggerProps
>(({ className, variant, icon, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(dropdownMenuItemVariants({ variant }), className)}
    {...props}
  >
    {icon && (
      <span className="dropdown-menu-item-icon size-5 flex items-center justify-center" aria-hidden>
        {icon}
      </span>
    )}
    <span className="flex-1 truncate">{children}</span>
    <span className="dropdown-menu-item-icon size-5 flex items-center justify-center ml-auto" aria-hidden>
      <ChevronRight size={16} />
    </span>
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName = "DropdownMenuSubTrigger"

// ── Sub Content ────────────────────────────────────────────────────────────

export interface DropdownMenuSubContentProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent> {}

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  DropdownMenuSubContentProps
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "dropdown-menu-content",
      "min-w-[160px] z-50",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
      className
    )}
    {...props}
  />
))
DropdownMenuSubContent.displayName = "DropdownMenuSubContent"

// ── Shortcut (standalone) ──────────────────────────────────────────────────

const DropdownMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={cn("dropdown-menu-shortcut ts-caption ml-auto", className)}
    aria-hidden
    {...props}
  />
)
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

// ── Exports ────────────────────────────────────────────────────────────────

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuRadioGroup,
  DropdownMenuContent,
  DropdownMenuItem,
  dropdownMenuItemVariants,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuShortcut,
}
