import * as React from "react"
import { Section, Row } from "@/playground/components"
import { Calendar } from "@/components/ui/calendar"

const JAN_2024 = new Date(2024, 0, 1)
const JAN_15_2024 = new Date(2024, 0, 15)

export function CalendarPreview() {
  const [selected, setSelected] = React.useState<Date | undefined>()

  return (
    <Section
      title="Calendar"
      description="Single-date selection calendar. Maps to the Calendar component in Figma."
    >
      <Row label="Interactive">
        <Calendar
          defaultMonth={JAN_2024}
          selected={selected}
          onSelect={setSelected}
        />
      </Row>
      <Row label="With selection">
        <Calendar defaultMonth={JAN_2024} selected={JAN_15_2024} />
      </Row>
      <Row label="Disabled weekends">
        <Calendar
          defaultMonth={JAN_2024}
          disabled={{ dayOfWeek: [0, 6] }}
        />
      </Row>
      <Row label="Disabled past dates">
        <Calendar
          defaultMonth={JAN_2024}
          selected={JAN_15_2024}
          disabled={{ before: JAN_15_2024 }}
        />
      </Row>
    </Section>
  )
}
