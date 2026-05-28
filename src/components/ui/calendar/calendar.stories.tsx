import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"
import { Calendar } from "./calendar"

const JAN_2024 = new Date(2024, 0, 1)
const JAN_15_2024 = new Date(2024, 0, 15)

const meta: Meta<typeof Calendar> = {
  title: "UI/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  parameters: {
    pseudo: {
      hover:        ".force-hover",
      focusVisible: ".force-focus",
    },
  },
  argTypes: {
    showOutsideDays: {
      control: "boolean",
      description: "Show days from adjacent months — Figma: outside days",
    },
    // Hide low-level DayPicker props from controls
    classNames:          { table: { disable: true } },
    components:          { table: { disable: true } },
    formatters:          { table: { disable: true } },
    labels:              { table: { disable: true } },
    locale:              { table: { disable: true } },
    modifiers:           { table: { disable: true } },
    modifiersClassNames: { table: { disable: true } },
    modifiersStyles:     { table: { disable: true } },
    styles:              { table: { disable: true } },
  },
}

export default meta
type Story = StoryObj<typeof Calendar>

/** Playground — click any day to select it. */
export const Default: Story = {
  render: (args) => {
    const [selected, setSelected] = React.useState<Date | undefined>()
    return (
      <Calendar
        {...args}
        defaultMonth={JAN_2024}
        selected={selected}
        onSelect={setSelected}
      />
    )
  },
}

/** A pre-selected date. Shows the selected day state. */
export const Selected: Story = {
  name: "With selection",
  parameters: { controls: { disable: true } },
  render: () => (
    <Calendar defaultMonth={JAN_2024} selected={JAN_15_2024} />
  ),
}

/**
 * All day states in one view: today (selected + today-border), disabled past dates,
 * default future days, and outside days at the month edges.
 * Hover and focus are browser-native — interact with the calendar to verify them.
 */
export const States: Story = {
  name: "States",
  parameters: { controls: { disable: true } },
  render: () => {
    const today = new Date()
    return (
      <Calendar
        selected={today}
        disabled={{ before: today }}
      />
    )
  },
}

/** Weekends are disabled. Shows the disabled day state. */
export const DisabledWeekends: Story = {
  name: "Disabled weekends",
  parameters: { controls: { disable: true } },
  render: () => (
    <Calendar
      defaultMonth={JAN_2024}
      disabled={{ dayOfWeek: [0, 6] }}
    />
  ),
}

/** Dates before Jan 15 are disabled. Shows past-date constraints. */
export const DisabledPast: Story = {
  name: "Disabled past dates",
  parameters: { controls: { disable: true } },
  render: () => (
    <Calendar
      defaultMonth={JAN_2024}
      selected={JAN_15_2024}
      disabled={{ before: JAN_15_2024 }}
    />
  ),
}

/** Two months displayed side by side. */
export const MultipleMonths: Story = {
  name: "Multiple months",
  parameters: { controls: { disable: true } },
  render: () => {
    const [selected, setSelected] = React.useState<Date | undefined>()
    return (
      <Calendar
        defaultMonth={JAN_2024}
        numberOfMonths={2}
        selected={selected}
        onSelect={setSelected}
      />
    )
  },
}
