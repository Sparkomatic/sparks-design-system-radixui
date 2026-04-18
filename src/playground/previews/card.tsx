import { Section, Row } from "@/playground/components"
import { Card, CardHeader, CardTitle, CardDescription, CardBody, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

function SampleCard({ variant }: { variant?: "default" | "ghost" | "elevated" }) {
  return (
    <Card variant={variant} className="w-72">
      <CardHeader>
        <CardTitle>Card title</CardTitle>
        <CardDescription>Supporting description text for this card.</CardDescription>
      </CardHeader>
      <CardBody>
        <p className="text-sm text-muted-foreground">
          Card body content goes here. This area holds the main information.
        </p>
      </CardBody>
      <CardFooter>
        <Button size="sm">Action</Button>
        <Button size="sm" variant="ghost">Cancel</Button>
      </CardFooter>
    </Card>
  )
}

export function CardPreview() {
  return (
    <Section
      title="Card"
      description="Unstyled skeleton — no design tokens yet. Compound parts and variants are wired; styles will come from Figma."
    >
      <Row label="Variants">
        <SampleCard variant="default" />
        <SampleCard variant="elevated" />
        <SampleCard variant="ghost" />
      </Row>

      <Row label="Parts in isolation">
        <Card className="w-72">
          <CardHeader>
            <CardTitle>Title only</CardTitle>
          </CardHeader>
          <CardBody>Body only, no footer.</CardBody>
        </Card>

        <Card className="w-72">
          <CardBody>Body + footer, no header.</CardBody>
          <CardFooter>
            <Button size="sm">Go</Button>
          </CardFooter>
        </Card>
      </Row>
    </Section>
  )
}
