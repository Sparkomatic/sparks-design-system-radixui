import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { MoreHorizontal, Trash2 } from "lucide-react"
import { DataTable } from "./data-table"

// ── Sample data ───────────────────────────────────────────────────────────────

type Status = "active" | "pending" | "archived"

const SAMPLE_ROWS: { id: string; name: string; email: string; amount: string; status: Status }[] = [
  { id: "1", name: "Acme Corp", email: "billing@acme.com", amount: "$1,200.00", status: "active" },
  { id: "2", name: "Beta Ltd", email: "accounts@beta.com", amount: "$850.00", status: "pending" },
  { id: "3", name: "Gamma Inc", email: "finance@gamma.com", amount: "$3,400.00", status: "archived" },
  { id: "4", name: "Delta LLC", email: "pay@delta.com", amount: "$2,100.00", status: "active" },
  { id: "5", name: "Epsilon GmbH", email: "billing@epsilon.de", amount: "$760.00", status: "pending" },
]

const ALL_STATUSES: Status[] = ["active", "pending", "archived"]

// ── Helpers ───────────────────────────────────────────────────────────────────

function InteractiveTable() {
  const [selectedRows, setSelectedRows] = React.useState<string[]>([])
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc" | null>(null)

  const toggleRow = (id: string) =>
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]))

  const toggleAll = (checked: boolean) =>
    setSelectedRows(checked ? SAMPLE_ROWS.map((r) => r.id) : [])

  const cycleSortDirection = () =>
    setSortDirection((d) => (d === "asc" ? "desc" : d === "desc" ? null : "asc"))

  return (
    <DataTable>
      <DataTable.Header>
        <DataTable.Row>
          <DataTable.CheckCell
            asHeader
            checked={selectedRows.length === SAMPLE_ROWS.length}
            indeterminate={selectedRows.length > 0 && selectedRows.length < SAMPLE_ROWS.length}
            onCheckedChange={toggleAll}
          />
          <DataTable.HeaderCell sortDirection={sortDirection} onSort={cycleSortDirection}>
            Name
          </DataTable.HeaderCell>
          <DataTable.HeaderCell>Email</DataTable.HeaderCell>
          <DataTable.HeaderCell>Amount</DataTable.HeaderCell>
          <DataTable.HeaderCell>Status</DataTable.HeaderCell>
          <DataTable.HeaderCell>Actions</DataTable.HeaderCell>
        </DataTable.Row>
      </DataTable.Header>
      <DataTable.Body>
        {SAMPLE_ROWS.map((row) => (
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
                <DataTable.ActionButton icon={<Trash2 size={16} />} aria-label="Delete row" />
              </div>
            </DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable.Body>
    </DataTable>
  )
}

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta<typeof DataTable> = {
  title: "UI/DataTable",
  component: DataTable,
  tags: ["autodocs"],
  parameters: {
    pseudo: {
      hover: ".force-hover",
      focusVisible: ".force-focus",
    },
    layout: "padded",
  },
}

export default meta
type Story = StoryObj<typeof meta>

// ── Default (Playground) ──────────────────────────────────────────────────────

export const Default: Story = {
  parameters: { controls: { disable: true } },
  render: () => <InteractiveTable />,
}

// ── Variants — sub-component parts ───────────────────────────────────────────
// Cell, StatusBadge, CheckCell, and HeaderCell — each part with all its variants.

export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-8" style={{ width: 600 }}>

      {/* Cell — Figma: Type=Text / Type=Number (muted) */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold opacity-50 uppercase tracking-widest mb-1">Cell</p>
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-start gap-2">
            <table><tbody>
              <tr className="data-table-row"><DataTable.Cell>Acme Corp</DataTable.Cell></tr>
            </tbody></table>
            <span className="text-xs opacity-40">Type=Text</span>
          </div>
          <div className="flex flex-col items-start gap-2">
            <table><tbody>
              <tr className="data-table-row"><DataTable.Cell muted>$1,200.00</DataTable.Cell></tr>
            </tbody></table>
            <span className="text-xs opacity-40">Type=Number (muted)</span>
          </div>
        </div>
      </div>

      {/* StatusBadge — Figma: Status=Active / Pending / Archived */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold opacity-50 uppercase tracking-widest mb-1">Status Badge</p>
        <div className="flex items-center gap-4">
          {ALL_STATUSES.map((status) => (
            <div key={status} className="flex flex-col items-center gap-2">
              <DataTable.StatusBadge status={status} />
              <span className="text-xs opacity-40 capitalize">{status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CheckCell — Figma: unchecked / checked / indeterminate */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold opacity-50 uppercase tracking-widest mb-1">Check Cell</p>
        <div className="flex items-center gap-8">
          {[
            { label: "Unchecked",     checked: false, indeterminate: false },
            { label: "Checked",       checked: true,  indeterminate: false },
            { label: "Indeterminate", checked: false, indeterminate: true  },
          ].map(({ label, checked, indeterminate }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <table><tbody>
                <tr className="data-table-row">
                  <DataTable.CheckCell checked={checked} indeterminate={indeterminate} />
                </tr>
              </tbody></table>
              <span className="text-xs opacity-40">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* HeaderCell — Figma: Sort=None / Asc / Desc */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold opacity-50 uppercase tracking-widest mb-1">Header Cell</p>
        <div className="flex items-center gap-8">
          {([
            { label: "No sort",   sort: undefined },
            { label: "Sort=None", sort: null      },
            { label: "Sort=Asc",  sort: "asc"     },
            { label: "Sort=Desc", sort: "desc"    },
          ] as const).map(({ label, sort }) => (
            <div key={label} className="flex flex-col items-start gap-2">
              <table><thead>
                <tr className="data-table-row">
                  <DataTable.HeaderCell
                    onSort={sort !== undefined ? () => {} : undefined}
                    sortDirection={sort}
                  >
                    Column
                  </DataTable.HeaderCell>
                </tr>
              </thead></table>
              <span className="text-xs opacity-40">{label}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  ),
}

// ── States — Row states ───────────────────────────────────────────────────────
// All five row states: Default, Hover, Selected, Selected+Hover, Focus.

export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <DataTable style={{ width: 600 }}>
      <DataTable.Header>
        <DataTable.Row>
          <DataTable.HeaderCell>State</DataTable.HeaderCell>
          <DataTable.HeaderCell>Name</DataTable.HeaderCell>
          <DataTable.HeaderCell>Status</DataTable.HeaderCell>
        </DataTable.Row>
      </DataTable.Header>
      <DataTable.Body>
        <DataTable.Row>
          <DataTable.Cell muted>Default</DataTable.Cell>
          <DataTable.Cell>Acme Corp</DataTable.Cell>
          <DataTable.Cell><DataTable.StatusBadge status="active" /></DataTable.Cell>
        </DataTable.Row>
        <DataTable.Row className="force-hover">
          <DataTable.Cell muted>Hover</DataTable.Cell>
          <DataTable.Cell>Beta Ltd</DataTable.Cell>
          <DataTable.Cell><DataTable.StatusBadge status="pending" /></DataTable.Cell>
        </DataTable.Row>
        <DataTable.Row data-selected="">
          <DataTable.Cell muted>Selected</DataTable.Cell>
          <DataTable.Cell>Gamma Inc</DataTable.Cell>
          <DataTable.Cell><DataTable.StatusBadge status="archived" /></DataTable.Cell>
        </DataTable.Row>
        <DataTable.Row data-selected="" className="force-hover">
          <DataTable.Cell muted>Selected + Hover</DataTable.Cell>
          <DataTable.Cell>Delta LLC</DataTable.Cell>
          <DataTable.Cell><DataTable.StatusBadge status="active" /></DataTable.Cell>
        </DataTable.Row>
        <DataTable.Row className="force-focus" tabIndex={0}>
          <DataTable.Cell muted>Focus</DataTable.Cell>
          <DataTable.Cell>Epsilon GmbH</DataTable.Cell>
          <DataTable.Cell><DataTable.StatusBadge status="pending" /></DataTable.Cell>
        </DataTable.Row>
      </DataTable.Body>
    </DataTable>
  ),
}

// ── Sizes — Empty vs Filled ───────────────────────────────────────────────────
// The two table content states from Figma: State=Filled and State=Empty.

export const Sizes: Story = {
  name: "Empty vs Filled",
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <span className="text-xs opacity-40">Filled</span>
        <DataTable style={{ width: 500 }}>
          <DataTable.Header>
            <DataTable.Row>
              <DataTable.HeaderCell>Name</DataTable.HeaderCell>
              <DataTable.HeaderCell>Amount</DataTable.HeaderCell>
              <DataTable.HeaderCell>Status</DataTable.HeaderCell>
            </DataTable.Row>
          </DataTable.Header>
          <DataTable.Body>
            {SAMPLE_ROWS.slice(0, 3).map((row) => (
              <DataTable.Row key={row.id}>
                <DataTable.Cell>{row.name}</DataTable.Cell>
                <DataTable.Cell>{row.amount}</DataTable.Cell>
                <DataTable.Cell><DataTable.StatusBadge status={row.status} /></DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable.Body>
        </DataTable>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs opacity-40">Empty</span>
        <DataTable style={{ width: 500 }}>
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
      </div>
    </div>
  ),
}

// ── AllVariants ───────────────────────────────────────────────────────────────
// Comprehensive table: all row states, all StatusBadge types, sort states.

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <DataTable>
      <DataTable.Header>
        <DataTable.Row>
          <DataTable.CheckCell asHeader checked={false} />
          <DataTable.HeaderCell sortDirection="asc" onSort={() => {}}>Name</DataTable.HeaderCell>
          <DataTable.HeaderCell sortDirection="desc" onSort={() => {}}>Amount</DataTable.HeaderCell>
          <DataTable.HeaderCell onSort={() => {}}>Email</DataTable.HeaderCell>
          <DataTable.HeaderCell>Status</DataTable.HeaderCell>
          <DataTable.HeaderCell>Actions</DataTable.HeaderCell>
        </DataTable.Row>
      </DataTable.Header>
      <DataTable.Body>
        {/* Default row */}
        <DataTable.Row>
          <DataTable.CheckCell checked={false} />
          <DataTable.Cell>Acme Corp</DataTable.Cell>
          <DataTable.Cell>$1,200.00</DataTable.Cell>
          <DataTable.Cell muted>billing@acme.com</DataTable.Cell>
          <DataTable.Cell><DataTable.StatusBadge status="active" /></DataTable.Cell>
          <DataTable.Cell>
            <DataTable.ActionButton icon={<MoreHorizontal size={16} />} aria-label="More options" />
          </DataTable.Cell>
        </DataTable.Row>
        {/* Hover row */}
        <DataTable.Row className="force-hover">
          <DataTable.CheckCell checked={false} />
          <DataTable.Cell>Beta Ltd</DataTable.Cell>
          <DataTable.Cell>$850.00</DataTable.Cell>
          <DataTable.Cell muted>accounts@beta.com</DataTable.Cell>
          <DataTable.Cell><DataTable.StatusBadge status="pending" /></DataTable.Cell>
          <DataTable.Cell>
            <DataTable.ActionButton icon={<MoreHorizontal size={16} />} aria-label="More options" />
          </DataTable.Cell>
        </DataTable.Row>
        {/* Selected row */}
        <DataTable.Row data-selected="">
          <DataTable.CheckCell checked />
          <DataTable.Cell>Gamma Inc</DataTable.Cell>
          <DataTable.Cell>$3,400.00</DataTable.Cell>
          <DataTable.Cell muted>finance@gamma.com</DataTable.Cell>
          <DataTable.Cell><DataTable.StatusBadge status="archived" /></DataTable.Cell>
          <DataTable.Cell>
            <DataTable.ActionButton icon={<MoreHorizontal size={16} />} aria-label="More options" />
          </DataTable.Cell>
        </DataTable.Row>
        {/* Selected + Hover */}
        <DataTable.Row data-selected="" className="force-hover">
          <DataTable.CheckCell checked />
          <DataTable.Cell>Delta LLC</DataTable.Cell>
          <DataTable.Cell>$2,100.00</DataTable.Cell>
          <DataTable.Cell muted>pay@delta.com</DataTable.Cell>
          <DataTable.Cell><DataTable.StatusBadge status="active" /></DataTable.Cell>
          <DataTable.Cell>
            <DataTable.ActionButton icon={<MoreHorizontal size={16} />} aria-label="More options" />
          </DataTable.Cell>
        </DataTable.Row>
        {/* Focus row */}
        <DataTable.Row className="force-focus" tabIndex={0}>
          <DataTable.CheckCell checked={false} />
          <DataTable.Cell>Epsilon GmbH</DataTable.Cell>
          <DataTable.Cell>$760.00</DataTable.Cell>
          <DataTable.Cell muted>billing@epsilon.de</DataTable.Cell>
          <DataTable.Cell><DataTable.StatusBadge status="pending" /></DataTable.Cell>
          <DataTable.Cell>
            <DataTable.ActionButton icon={<MoreHorizontal size={16} />} aria-label="More options" />
          </DataTable.Cell>
        </DataTable.Row>
      </DataTable.Body>
    </DataTable>
  ),
}
