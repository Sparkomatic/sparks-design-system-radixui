// Origin: Layout component — no Radix primitive, native <table> with ARIA
import "./data-table.css"
import * as React from "react"
import { cn } from "@/lib/utils"

// ── Sort Icon ──────────────────────────────────────────────────────────────────
function SortIcon({ direction }: { direction?: "asc" | "desc" | null }) {
  return (
    <span className="data-table-sort-icon" aria-hidden>
      <svg
        className={cn("data-table-sort-triangle", direction === "asc" && "data-table-sort-triangle--active")}
        width="8"
        height="5"
        viewBox="0 0 8 5"
        fill="none"
      >
        <path d="M4 0L8 5H0L4 0Z" fill="currentColor" />
      </svg>
      <svg
        className={cn("data-table-sort-triangle", direction === "desc" && "data-table-sort-triangle--active")}
        width="8"
        height="5"
        viewBox="0 0 8 5"
        fill="none"
      >
        <path d="M4 5L0 0H8L4 5Z" fill="currentColor" />
      </svg>
    </span>
  )
}

// ── DataTable ──────────────────────────────────────────────────────────────────
export interface DataTableProps extends React.ComponentPropsWithoutRef<"div"> {}

const DataTableRoot = React.forwardRef<HTMLDivElement, DataTableProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("data-table-root", className)} {...props}>
      <table className="data-table">{children}</table>
    </div>
  )
)
DataTableRoot.displayName = "DataTable"

// ── Header ─────────────────────────────────────────────────────────────────────
const DataTableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.ComponentPropsWithoutRef<"thead">
>(({ className, ...props }, ref) => <thead ref={ref} {...props} />)
DataTableHeader.displayName = "DataTableHeader"

// ── Body ───────────────────────────────────────────────────────────────────────
const DataTableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.ComponentPropsWithoutRef<"tbody">
>(({ className, ...props }, ref) => <tbody ref={ref} {...props} />)
DataTableBody.displayName = "DataTableBody"

// ── Row ────────────────────────────────────────────────────────────────────────
export interface DataTableRowProps extends React.ComponentPropsWithoutRef<"tr"> {
  selected?: boolean
  onSelect?: (selected: boolean) => void
}

const DataTableRow = React.forwardRef<HTMLTableRowElement, DataTableRowProps>(
  ({ className, selected, onSelect, children, ...props }, ref) => (
    <tr
      ref={ref}
      data-selected={selected || undefined}
      tabIndex={onSelect !== undefined ? 0 : undefined}
      aria-selected={selected !== undefined ? selected : undefined}
      className={cn("data-table-row", className)}
      onClick={onSelect ? () => onSelect(!selected) : undefined}
      onKeyDown={
        onSelect
          ? (e) => {
              if (e.key === " " || e.key === "Enter") {
                e.preventDefault()
                onSelect(!selected)
              }
            }
          : undefined
      }
      {...props}
    >
      {children}
    </tr>
  )
)
DataTableRow.displayName = "DataTableRow"

// ── HeaderCell ─────────────────────────────────────────────────────────────────
export interface DataTableHeaderCellProps extends React.ComponentPropsWithoutRef<"th"> {
  sortDirection?: "asc" | "desc" | null
  onSort?: () => void
}

const DataTableHeaderCell = React.forwardRef<HTMLTableCellElement, DataTableHeaderCellProps>(
  ({ className, children, sortDirection, onSort, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        "data-table-header-cell ts-ui",
        onSort && "data-table-header-cell--sortable",
        className
      )}
      aria-sort={
        onSort
          ? sortDirection === "asc"
            ? "ascending"
            : sortDirection === "desc"
            ? "descending"
            : "none"
          : undefined
      }
      onClick={onSort}
      {...props}
    >
      <span className="data-table-header-cell-content">
        {children}
        {onSort && <SortIcon direction={sortDirection} />}
      </span>
    </th>
  )
)
DataTableHeaderCell.displayName = "DataTableHeaderCell"

// ── Cell ───────────────────────────────────────────────────────────────────────
export interface DataTableCellProps extends React.ComponentPropsWithoutRef<"td"> {
  muted?: boolean
}

const DataTableCell = React.forwardRef<HTMLTableCellElement, DataTableCellProps>(
  ({ className, muted, ...props }, ref) => (
    <td
      ref={ref}
      className={cn("data-table-cell ts-ui", muted && "data-table-cell--muted", className)}
      {...props}
    />
  )
)
DataTableCell.displayName = "DataTableCell"

// ── CheckCell ──────────────────────────────────────────────────────────────────
export interface DataTableCheckCellProps
  extends Omit<React.ComponentPropsWithoutRef<"td">, "onChange"> {
  checked?: boolean
  indeterminate?: boolean
  onCheckedChange?: (checked: boolean) => void
  asHeader?: boolean
}

const DataTableCheckCell = React.forwardRef<HTMLTableCellElement, DataTableCheckCellProps>(
  ({ className, checked, indeterminate, onCheckedChange, asHeader = false, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null)

    React.useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = indeterminate ?? false
      }
    }, [indeterminate])

    const input = (
      <input
        ref={inputRef}
        type="checkbox"
        className="data-table-checkbox"
        checked={checked ?? false}
        onChange={onCheckedChange ? (e) => onCheckedChange(e.target.checked) : undefined}
        onClick={(e) => e.stopPropagation()}
        aria-label={asHeader ? "Select all rows" : "Select row"}
        readOnly={!onCheckedChange}
      />
    )

    if (asHeader) {
      return (
        <th
          ref={ref}
          scope="col"
          className={cn("data-table-check-cell", className)}
          {...(props as React.ComponentPropsWithoutRef<"th">)}
        >
          {input}
        </th>
      )
    }

    return (
      <td ref={ref} className={cn("data-table-check-cell", className)} {...props}>
        {input}
      </td>
    )
  }
)
DataTableCheckCell.displayName = "DataTableCheckCell"

// ── StatusBadge ────────────────────────────────────────────────────────────────
export interface DataTableStatusBadgeProps extends React.ComponentPropsWithoutRef<"span"> {
  status: "active" | "pending" | "archived"
}

const DataTableStatusBadge = React.forwardRef<HTMLSpanElement, DataTableStatusBadgeProps>(
  ({ className, status, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "data-table-status-badge ts-caption",
        `data-table-status-badge--${status}`,
        className
      )}
      {...props}
    >
      {children ?? status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
)
DataTableStatusBadge.displayName = "DataTableStatusBadge"

// ── ActionButton ───────────────────────────────────────────────────────────────
export interface DataTableActionButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  icon: React.ReactNode
}

const DataTableActionButton = React.forwardRef<HTMLButtonElement, DataTableActionButtonProps>(
  ({ className, icon, ...props }, ref) => (
    <button ref={ref} type="button" className={cn("data-table-action-btn", className)} {...props}>
      {icon}
    </button>
  )
)
DataTableActionButton.displayName = "DataTableActionButton"

// ── EmptyState ─────────────────────────────────────────────────────────────────
export interface DataTableEmptyStateProps extends React.ComponentPropsWithoutRef<"tr"> {
  colSpan: number
  message?: React.ReactNode
  icon?: React.ReactNode
}

const DataTableEmptyState = React.forwardRef<HTMLTableRowElement, DataTableEmptyStateProps>(
  ({ className, colSpan, message = "No data", icon, ...props }, ref) => (
    <tr ref={ref} className={cn("data-table-row", className)} {...props}>
      <td className="data-table-empty-cell ts-body" colSpan={colSpan}>
        {icon && <span className="data-table-empty-icon">{icon}</span>}
        {message}
      </td>
    </tr>
  )
)
DataTableEmptyState.displayName = "DataTableEmptyState"

// ── Namespace ──────────────────────────────────────────────────────────────────
const DataTable = Object.assign(DataTableRoot, {
  Header: DataTableHeader,
  Body: DataTableBody,
  Row: DataTableRow,
  HeaderCell: DataTableHeaderCell,
  Cell: DataTableCell,
  CheckCell: DataTableCheckCell,
  StatusBadge: DataTableStatusBadge,
  ActionButton: DataTableActionButton,
  EmptyState: DataTableEmptyState,
})

export { DataTable }
