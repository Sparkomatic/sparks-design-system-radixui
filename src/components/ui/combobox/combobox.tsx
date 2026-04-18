// Origin: Composes Radix Popover — @radix-ui/react-popover
// Implements the ARIA combobox pattern:
// https://www.w3.org/WAI/ARIA/apg/patterns/combobox/

import * as React from "react"
import * as Popover from "@radix-ui/react-popover"
import { Check, ChevronDown, X } from "lucide-react"
import { cn } from "@/lib/utils"

// ── Context ────────────────────────────────────────────────────────────────

interface ComboboxContextValue {
  open: boolean
  setOpen: (v: boolean) => void
  inputValue: string
  setInputValue: (v: string) => void
  selectedValue: string
  selectItem: (value: string, label: string) => void
  highlightedValue: string | null
  setHighlightedValue: (v: string | null) => void
  inputId: string
  listboxId: string
  /** Registry of all mounted items: value → label. Insertion order = render order. */
  registry: React.MutableRefObject<Map<string, string>>
}

const ComboboxContext = React.createContext<ComboboxContextValue | null>(null)

function useComboboxContext(component: string) {
  const ctx = React.useContext(ComboboxContext)
  if (!ctx) throw new Error(`<${component}> must be used inside <Combobox>`)
  return ctx
}

// ── Helpers ────────────────────────────────────────────────────────────────

function getVisibleItems(
  registry: Map<string, string>,
  inputValue: string
): Array<{ value: string; label: string }> {
  const search = inputValue.toLowerCase()
  return Array.from(registry.entries())
    .filter(([, label]) => label.toLowerCase().includes(search))
    .map(([value, label]) => ({ value, label }))
}

// ── Combobox (Root) ────────────────────────────────────────────────────────

export interface ComboboxProps {
  /** Controlled selected value */
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
}

function Combobox({ value = "", onValueChange, children }: ComboboxProps) {
  const [open, setOpenState] = React.useState(false)
  const [inputValue, setInputValueState] = React.useState("")
  const [selectedValue, setSelectedValue] = React.useState(value)
  const [highlightedValue, setHighlightedValue] = React.useState<string | null>(null)
  const registry = React.useRef<Map<string, string>>(new Map())
  const inputId = React.useId()
  const listboxId = React.useId()

  // Sync controlled value from outside
  React.useEffect(() => {
    setSelectedValue(value)
    const label = registry.current.get(value)
    if (label !== undefined) setInputValueState(label)
  }, [value])

  const setOpen = React.useCallback((v: boolean) => {
    setOpenState(v)
    if (!v) setHighlightedValue(null)
  }, [])

  const setInputValue = React.useCallback((v: string) => {
    setInputValueState(v)
    // Reset highlight when input changes
    setHighlightedValue(getVisibleItems(registry.current, v)[0]?.value ?? null)
  }, [])

  const selectItem = React.useCallback((itemValue: string, label: string) => {
    setSelectedValue(itemValue)
    setInputValueState(label)
    setOpenState(false)
    setHighlightedValue(null)
    onValueChange?.(itemValue)
  }, [onValueChange])

  return (
    <ComboboxContext.Provider value={{
      open, setOpen,
      inputValue, setInputValue,
      selectedValue, selectItem,
      highlightedValue, setHighlightedValue,
      inputId, listboxId,
      registry,
    }}>
      <Popover.Root open={open} onOpenChange={setOpen}>
        {children}
      </Popover.Root>
    </ComboboxContext.Provider>
  )
}
Combobox.displayName = "Combobox"

// ── ComboboxTrigger (Input wrapper) ────────────────────────────────────────

export interface ComboboxTriggerProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  placeholder?: string
}

const ComboboxTrigger = React.forwardRef<HTMLDivElement, ComboboxTriggerProps>(
  ({ placeholder, className, ...props }, ref) => {
    const {
      open, setOpen,
      inputValue, setInputValue,
      selectedValue, selectItem,
      highlightedValue, setHighlightedValue,
      inputId, listboxId,
      registry,
    } = useComboboxContext("ComboboxTrigger")

    const inputRef = React.useRef<HTMLInputElement>(null)

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
      const visible = getVisibleItems(registry.current, inputValue)

      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault()
          if (!open) { setOpen(true); break }
          const idx = visible.findIndex(i => i.value === highlightedValue)
          const next = visible[Math.min(idx + 1, visible.length - 1)]
          if (next) setHighlightedValue(next.value)
          break
        }
        case "ArrowUp": {
          e.preventDefault()
          const idx = visible.findIndex(i => i.value === highlightedValue)
          const prev = visible[Math.max(idx - 1, 0)]
          if (prev) setHighlightedValue(prev.value)
          break
        }
        case "Enter": {
          e.preventDefault()
          if (highlightedValue) {
            const label = registry.current.get(highlightedValue) ?? ""
            selectItem(highlightedValue, label)
          }
          break
        }
        case "Escape": {
          e.preventDefault()
          setOpen(false)
          // Restore input to the current selection's label
          const currentLabel = registry.current.get(selectedValue) ?? ""
          setInputValue(currentLabel)
          break
        }
        case "Tab": {
          setOpen(false)
          break
        }
      }
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      setInputValue(e.target.value)
      if (!open) setOpen(true)
    }

    function handleClear(e: React.MouseEvent) {
      e.stopPropagation()
      selectItem("", "")
      inputRef.current?.focus()
    }

    const activeDescendant = highlightedValue
      ? `${listboxId}-${highlightedValue}`
      : undefined

    return (
      <Popover.Anchor asChild>
        <div
          ref={ref}
          className={cn(
            "relative flex h-10 w-full items-center gap-1 rounded-md border border-border bg-background px-3 text-sm",
            "focus-within:outline-2 focus-within:outline-offset-1 focus-within:outline-ring",
            className
          )}
          {...props}
        >
          <input
            ref={inputRef}
            id={inputId}
            role="combobox"
            aria-expanded={open}
            aria-autocomplete="list"
            aria-controls={listboxId}
            aria-activedescendant={activeDescendant}
            autoComplete="off"
            spellCheck={false}
            value={inputValue}
            placeholder={placeholder}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => { if (!open) setOpen(true) }}
            className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />

          {selectedValue ? (
            <button
              type="button"
              aria-label="Clear selection"
              tabIndex={-1}
              onClick={handleClear}
              className="shrink-0 rounded text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" aria-hidden />
            </button>
          ) : (
            <ChevronDown
              aria-hidden
              className={cn(
                "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-150",
                open && "rotate-180"
              )}
            />
          )}
        </div>
      </Popover.Anchor>
    )
  }
)
ComboboxTrigger.displayName = "ComboboxTrigger"

// ── ComboboxContent ────────────────────────────────────────────────────────

export interface ComboboxContentProps
  extends React.ComponentPropsWithoutRef<"div"> {}

const ComboboxContent = React.forwardRef<HTMLDivElement, ComboboxContentProps>(
  ({ className, children, ...props }, ref) => {
    const { listboxId } = useComboboxContext("ComboboxContent")

    return (
      <Popover.Portal>
        <Popover.Content
          asChild
          sideOffset={4}
          align="start"
          // Keep focus on the input when dropdown opens
          onOpenAutoFocus={e => e.preventDefault()}
          onCloseAutoFocus={e => e.preventDefault()}
          style={{ width: "var(--radix-popover-trigger-width)" }}
        >
          <div
            ref={ref}
            role="listbox"
            id={listboxId}
            className={cn(
              "z-50 max-h-60 overflow-auto rounded-md border border-border bg-popover p-1 shadow-md",
              "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
              "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
              className
            )}
            {...props}
          >
            {children}
          </div>
        </Popover.Content>
      </Popover.Portal>
    )
  }
)
ComboboxContent.displayName = "ComboboxContent"

// ── ComboboxItem ───────────────────────────────────────────────────────────

export interface ComboboxItemProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "value"> {
  value: string
  /** Filter label. Defaults to children if it is a plain string. */
  label?: string
  disabled?: boolean
}

const ComboboxItem = React.forwardRef<HTMLDivElement, ComboboxItemProps>(
  ({ value, label, disabled = false, children, className, ...props }, ref) => {
    const {
      inputValue,
      selectedValue,
      selectItem,
      highlightedValue,
      setHighlightedValue,
      listboxId,
      registry,
    } = useComboboxContext("ComboboxItem")

    const resolvedLabel = label ?? (typeof children === "string" ? children : value)

    // Register on mount, unregister on unmount
    React.useEffect(() => {
      registry.current.set(value, resolvedLabel)
      return () => { registry.current.delete(value) }
    }, [value, resolvedLabel, registry])

    const isVisible = resolvedLabel.toLowerCase().includes(inputValue.toLowerCase())
    const isSelected = selectedValue === value
    const isHighlighted = highlightedValue === value

    return (
      <div
        ref={ref}
        role="option"
        id={`${listboxId}-${value}`}
        aria-selected={isSelected}
        aria-disabled={disabled}
        data-highlighted={isHighlighted || undefined}
        data-selected={isSelected || undefined}
        data-disabled={disabled || undefined}
        style={{ display: isVisible ? undefined : "none" }}
        onClick={() => { if (!disabled) selectItem(value, resolvedLabel) }}
        onMouseEnter={() => { if (!disabled) setHighlightedValue(value) }}
        className={cn(
          "relative flex cursor-pointer select-none items-center justify-between rounded-sm px-2 py-1.5 text-sm outline-none",
          "data-[highlighted]:bg-muted",
          "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          className
        )}
        {...props}
      >
        <span>{children}</span>
        {isSelected && <Check className="h-4 w-4 shrink-0" aria-hidden />}
      </div>
    )
  }
)
ComboboxItem.displayName = "ComboboxItem"

// ── ComboboxEmpty ──────────────────────────────────────────────────────────

export interface ComboboxEmptyProps {
  children?: React.ReactNode
  className?: string
}

function ComboboxEmpty({
  children = "No results found.",
  className,
}: ComboboxEmptyProps) {
  const { inputValue, registry } = useComboboxContext("ComboboxEmpty")

  const hasVisible = Array.from(registry.current.values()).some(label =>
    label.toLowerCase().includes(inputValue.toLowerCase())
  )

  if (hasVisible) return null

  return (
    <div className={cn("py-6 text-center text-sm text-muted-foreground", className)}>
      {children}
    </div>
  )
}
ComboboxEmpty.displayName = "ComboboxEmpty"

// ── ComboboxGroup ──────────────────────────────────────────────────────────

export interface ComboboxGroupProps
  extends React.ComponentPropsWithoutRef<"div"> {}

const ComboboxGroup = React.forwardRef<HTMLDivElement, ComboboxGroupProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} role="group" className={cn("pb-1 last:pb-0", className)} {...props} />
  )
)
ComboboxGroup.displayName = "ComboboxGroup"

// ── ComboboxGroupLabel ─────────────────────────────────────────────────────

export interface ComboboxGroupLabelProps
  extends React.ComponentPropsWithoutRef<"div"> {}

const ComboboxGroupLabel = React.forwardRef<HTMLDivElement, ComboboxGroupLabelProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "px-2 py-1.5 text-xs font-medium uppercase tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  )
)
ComboboxGroupLabel.displayName = "ComboboxGroupLabel"

// ── ComboboxSeparator ──────────────────────────────────────────────────────

export interface ComboboxSeparatorProps
  extends React.ComponentPropsWithoutRef<"div"> {}

const ComboboxSeparator = React.forwardRef<HTMLDivElement, ComboboxSeparatorProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
)
ComboboxSeparator.displayName = "ComboboxSeparator"

// ── Exports ────────────────────────────────────────────────────────────────

export {
  Combobox,
  ComboboxTrigger,
  ComboboxContent,
  ComboboxItem,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxSeparator,
}
