import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"
import {
  Combobox,
  ComboboxTrigger,
  ComboboxContent,
  ComboboxItem,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxSeparator,
} from "./combobox"

const meta: Meta = {
  title: "UI/Combobox",
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="p-8 max-w-sm">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj

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

export const Default: Story = {
  name: "Basic",
  render: () => {
    const [value, setValue] = React.useState("")
    return (
      <Combobox value={value} onValueChange={setValue}>
        <ComboboxTrigger placeholder="Select framework..." />
        <ComboboxContent>
          {FRAMEWORKS.map(f => (
            <ComboboxItem key={f.value} value={f.value}>{f.label}</ComboboxItem>
          ))}
          <ComboboxEmpty />
        </ComboboxContent>
      </Combobox>
    )
  },
}

export const Grouped: Story = {
  name: "Grouped with separators",
  render: () => {
    const [value, setValue] = React.useState("")
    const groups = Array.from(new Set(COUNTRIES.map(c => c.group)))
    return (
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
    )
  },
}

export const EmptyState: Story = {
  name: "Empty state",
  render: () => (
    <Combobox>
      <ComboboxTrigger placeholder="Type 'zzz' to trigger empty state..." />
      <ComboboxContent>
        {FRAMEWORKS.map(f => (
          <ComboboxItem key={f.value} value={f.value}>{f.label}</ComboboxItem>
        ))}
        <ComboboxEmpty>No framework matches your search.</ComboboxEmpty>
      </ComboboxContent>
    </Combobox>
  ),
}
