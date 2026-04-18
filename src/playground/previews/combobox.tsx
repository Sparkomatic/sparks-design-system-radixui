import * as React from "react"
import { Section, Row } from "@/playground/components"
import {
  Combobox,
  ComboboxTrigger,
  ComboboxContent,
  ComboboxItem,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxSeparator,
} from "@/components/ui/combobox"

const FRAMEWORKS = [
  { value: "react",   label: "React" },
  { value: "vue",     label: "Vue" },
  { value: "svelte",  label: "Svelte" },
  { value: "angular", label: "Angular" },
  { value: "solid",   label: "Solid" },
  { value: "qwik",    label: "Qwik" },
]

const COUNTRIES = [
  { value: "gb", label: "United Kingdom", group: "Europe" },
  { value: "de", label: "Germany",        group: "Europe" },
  { value: "fr", label: "France",         group: "Europe" },
  { value: "us", label: "United States",  group: "Americas" },
  { value: "ca", label: "Canada",         group: "Americas" },
  { value: "jp", label: "Japan",          group: "Asia" },
]

function BasicCombobox() {
  const [value, setValue] = React.useState("")
  return (
    <div className="w-64">
      <Combobox value={value} onValueChange={setValue}>
        <ComboboxTrigger placeholder="Select framework..." />
        <ComboboxContent>
          {FRAMEWORKS.map(f => (
            <ComboboxItem key={f.value} value={f.value}>{f.label}</ComboboxItem>
          ))}
          <ComboboxEmpty />
        </ComboboxContent>
      </Combobox>
      {value && (
        <p className="mt-2 text-xs text-muted-foreground">Selected: {value}</p>
      )}
    </div>
  )
}

function GroupedCombobox() {
  const [value, setValue] = React.useState("")
  const groups = Array.from(new Set(COUNTRIES.map(c => c.group)))

  return (
    <div className="w-64">
      <Combobox value={value} onValueChange={setValue}>
        <ComboboxTrigger placeholder="Select country..." />
        <ComboboxContent>
          {groups.map((group, i) => (
            <React.Fragment key={group}>
              {i > 0 && <ComboboxSeparator />}
              <ComboboxGroup>
                <ComboboxGroupLabel>{group}</ComboboxGroupLabel>
                {COUNTRIES.filter(c => c.group === group).map(c => (
                  <ComboboxItem key={c.value} value={c.value}>{c.label}</ComboboxItem>
                ))}
              </ComboboxGroup>
            </React.Fragment>
          ))}
          <ComboboxEmpty />
        </ComboboxContent>
      </Combobox>
    </div>
  )
}

export function ComboboxPreview() {
  return (
    <Section
      title="Combobox"
      description="Searchable dropdown built on Radix Popover with full ARIA combobox pattern and keyboard navigation."
    >
      <Row label="Basic — type to filter, arrow keys to navigate, Enter to select">
        <BasicCombobox />
      </Row>

      <Row label="Grouped with separators">
        <GroupedCombobox />
      </Row>

      <Row label="Empty state — type something with no match">
        <div className="w-64">
          <Combobox>
            <ComboboxTrigger placeholder="Type 'zzz' to see empty state..." />
            <ComboboxContent>
              {FRAMEWORKS.map(f => (
                <ComboboxItem key={f.value} value={f.value}>{f.label}</ComboboxItem>
              ))}
              <ComboboxEmpty>No framework matches your search.</ComboboxEmpty>
            </ComboboxContent>
          </Combobox>
        </div>
      </Row>
    </Section>
  )
}
