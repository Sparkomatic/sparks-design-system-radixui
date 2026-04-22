import { Section, Row } from "@/playground/components"
import { Button } from "@/components/ui/button"

export function ButtonPreview() {
  return (
    <Section
      title="Button"
      description="Matches RadixButton in Figma. Placeholder styles only — tokens not yet wired."
    >
      <Row label="Variants">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="tertiary">Tertiary</Button>
        <Button variant="utility">Utility</Button>
        <Button variant="destructive">Destructive</Button>
      </Row>

      <Row label="Sizes">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </Row>

      <Row label="Disabled">
        <Button variant="primary" disabled>Primary</Button>
        <Button variant="secondary" disabled>Secondary</Button>
        <Button variant="destructive" disabled>Destructive</Button>
      </Row>

      <Row label="Loading">
        <Button variant="primary" loading>Primary</Button>
        <Button variant="secondary" loading>Secondary</Button>
        <Button variant="destructive" loading>Destructive</Button>
      </Row>

      <Row label="Leading icon">
        <Button variant="primary" leadingIcon={<span className="size-4 rounded-sm bg-current opacity-70" />}>Primary</Button>
        <Button variant="secondary" leadingIcon={<span className="size-4 rounded-sm bg-current opacity-70" />}>Secondary</Button>
      </Row>

      <Row label="Trailing icon">
        <Button variant="primary" trailingIcon={<span className="size-4 rounded-sm bg-current opacity-70" />}>Primary</Button>
        <Button variant="utility" trailingIcon={<span className="size-4 rounded-sm bg-current opacity-70" />}>Utility</Button>
      </Row>

      <Row label="asChild — renders as &lt;a&gt;">
        <Button asChild variant="secondary" size="sm">
          <a href="#">Link button</a>
        </Button>
      </Row>
    </Section>
  )
}
