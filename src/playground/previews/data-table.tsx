import * as React from "react"
import { MoreHorizontal, Trash2 } from "lucide-react"
import { Section, Row } from "@/playground/components"
import { DataTable } from "@/components/ui/data-table"

const ROWS: { id: string; name: string; email: string; amount: string; status: "active" | "pending" | "archived" }[] = [
  { id: "1", name: "Acme Corp", email: "billing@acme.com", amount: "$1,200.00", status: "active" },
  { id: "2", name: "Beta Ltd", email: "accounts@beta.com", amount: "$850.00", status: "pending" },
  { id: "3", name: "Gamma Inc", email: "finance@gamma.com", amount: "$3,400.00", status: "archived" },
  { id: "4", name: "Delta LLC", email: "pay@delta.com", amount: "$2,100.00", status: "active" },
]

function InteractiveTable() {
  const [selectedRows, setSelectedRows] = React.useState<string[]>([])
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc" | null>(null)

  const toggleRow = (id: string) =>
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]))

  const toggleAll = (checked: boolean) =>
    setSelectedRows(checked ? ROWS.map((r) => r.id) : [])

  return (
    <DataTable>
      <DataTable.Header>
        <DataTable.Row>
          <DataTable.CheckCell
            asHeader
            checked={selectedRows.length === ROWS.length}
            indeterminate={selectedRows.length > 0 && selectedRows.length < ROWS.length}
            onCheckedChange={toggleAll}
          />
          <DataTable.HeaderCell
            sortDirection={sortDirection}
            onSort={() => setSortDirection((d) => (d === "asc" ? "desc" : d === "desc" ? null : "asc"))}
          >
            Name
          </DataTable.HeaderCell>
          <DataTable.HeaderCell>Email</DataTable.HeaderCell>
          <DataTable.HeaderCell>Amount</DataTable.HeaderCell>
          <DataTable.HeaderCell>Status</DataTable.HeaderCell>
          <DataTable.HeaderCell>Actions</DataTable.HeaderCell>
        </DataTable.Row>
      </DataTable.Header>
      <DataTable.Body>
        {ROWS.map((row) => (
          <DataTable.Row
            key={row.id}
            selected={selectedRows.includes(row.id)}
            onSelect={() => toggleRow(row.id)}
          >
            <DataTable.CheckCell
              checked={selectedRows.includes(row.id)}
              onCheckedChange={() => toggleRow(row.id)}
            />
            <DataTable.Cell>{row.name}</DataTable.Cell>
            <DataTable.Cell muted>{row.email}</DataTable.Cell>
            <DataTable.Cell>{row.amount}</DataTable.Cell>
            <DataTable.Cell>
              <DataTable.StatusBadge status={row.status} />
            </DataTable.Cell>
            <DataTable.Cell>
              <div className="flex items-center gap-1">
                <DataTable.ActionButton icon={<MoreHorizontal size={16} />} aria-label="More options" />
                <DataTable.ActionButton icon={<Trash2 size={16} />} aria-label="Delete" />
              </div>
            </DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable.Body>
    </DataTable>
  )
}

export function DataTablePreview() {
  return (
    <Section
      title="Data Table"
      description="Displays tabular data with row selection, sorting, and status badges. Maps to Data Table in Figma."
    >
      <Row label="Interactive">
        <div className="w-full">
          <InteractiveTable />
        </div>
      </Row>

      <Row label="Status badges">
        <DataTable.StatusBadge status="active" />
        <DataTable.StatusBadge status="pending" />
        <DataTable.StatusBadge status="archived" />
      </Row>

      <Row label="Empty state">
        <DataTable style={{ width: "100%", minWidth: 400 }}>
          <DataTable.Header>
            <DataTable.Row>
              <DataTable.HeaderCell>Name</DataTable.HeaderCell>
              <DataTable.HeaderCell>Amount</DataTable.HeaderCell>
              <DataTable.HeaderCell>Status</DataTable.HeaderCell>
            </DataTable.Row>
          </DataTable.Header>
          <DataTable.Body>
            <DataTable.EmptyState colSpan={3} message="No records found" />
          </DataTable.Body>
        </DataTable>
      </Row>
    </Section>
  )
}
