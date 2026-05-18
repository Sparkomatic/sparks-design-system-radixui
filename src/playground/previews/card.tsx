import { Section, Row } from "@/playground/components"
import {
  Card, CardImage, CardContent, CardHeader,
  CardTitle, CardSubtitle, CardDescription, CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

function ImagePlaceholder() {
  return (
    <div
      className="w-full h-full"
      style={{ background: "var(--border-default)" }}
      aria-hidden
    />
  )
}

function SampleCard({
  showImage = false,
  showSubtitle = true,
  showDescription = true,
  showCTA = true,
}: {
  showImage?: boolean
  showSubtitle?: boolean
  showDescription?: boolean
  showCTA?: boolean
}) {
  return (
    <Card className="w-72">
      {showImage && <CardImage><ImagePlaceholder /></CardImage>}
      <CardContent>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          {showSubtitle && <CardSubtitle>Card subtitle text</CardSubtitle>}
        </CardHeader>
        {showDescription && (
          <CardDescription>
            A short description of this card content goes here.
          </CardDescription>
        )}
        {showCTA && (
          <CardFooter>
            <Button variant="primary" size="md">Learn More</Button>
          </CardFooter>
        )}
      </CardContent>
    </Card>
  )
}

export function CardPreview() {
  return (
    <Section
      title="Card"
      description="Layout component with optional image, subtitle, description, and CTA slots. Maps to Card in Figma."
    >
      <Row label="Full card">
        <SampleCard showSubtitle showDescription showCTA />
      </Row>
      <Row label="With image">
        <SampleCard showImage showSubtitle showDescription showCTA />
      </Row>
      <Row label="Content options">
        <SampleCard showSubtitle={false} showDescription showCTA />
        <SampleCard showSubtitle showDescription={false} showCTA={false} />
      </Row>
      <Row label="Minimal">
        <SampleCard showSubtitle={false} showDescription={false} showCTA={false} />
      </Row>
    </Section>
  )
}
