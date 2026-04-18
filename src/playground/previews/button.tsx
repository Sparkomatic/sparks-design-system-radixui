import { Section, Row } from "@/playground/components"
import { Button } from "@/components/ui/button"

export function ButtonPreview() {
  return (
    <Section
      title="Button"
      description="Unstyled skeleton — no design tokens yet. Structure and variants are wired; styles will come from Figma."
    >
      <Row label="Variants">
        <Button variant="default">Default</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
      </Row>

      <Row label="Sizes">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </Row>

      <Row label="States">
        <Button disabled>Disabled</Button>
        <Button variant="outline" disabled>Outline disabled</Button>
      </Row>

      <Row label="asChild — renders as &lt;a&gt;">
        <Button asChild variant="ghost" size="sm">
          <a href="#">Link button</a>
        </Button>
      </Row>
    </Section>
  )
}
