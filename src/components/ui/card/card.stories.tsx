import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Card, CardImage, CardContent, CardHeader,
  CardTitle, CardSubtitle, CardDescription, CardFooter,
} from "./card"
import { Button } from "@/components/ui/button"

// ── Meta ──────────────────────────────────────────────────────────────────

const meta: Meta<typeof Card> = {
  title: "UI/Card",
  component: Card,
  tags: ["autodocs"],
  argTypes: {
    className: { table: { disable: true } },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// ── Helpers ───────────────────────────────────────────────────────────────

function ImageSlot() {
  return (
    <img
      src="https://placehold.co/320x160"
      alt=""
      className="w-full h-full object-cover"
    />
  )
}

interface ComposedCardProps {
  showImage?: boolean
  showSubtitle?: boolean
  showDescription?: boolean
  showCTA?: boolean
}

function ComposedCard({
  showImage = false,
  showSubtitle = true,
  showDescription = true,
  showCTA = true,
}: ComposedCardProps) {
  return (
    <Card>
      {showImage && <CardImage><ImageSlot /></CardImage>}
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

// ── Default (Playground) ─────────────────────────────────────────────────
// All Figma boolean properties as controls — mirrors the Figma property panel.

type StoryArgs = React.ComponentProps<typeof Card> & ComposedCardProps

export const Default: Story = {
  argTypes: {
    showImage:       { control: "boolean", description: "Show image slot — Figma: [Slot: Image]" },
    showSubtitle:    { control: "boolean", description: "Show subtitle — Figma: Show Subtitle" },
    showDescription: { control: "boolean", description: "Show description — Figma: Show Description" },
    showCTA:         { control: "boolean", description: "Show CTA button — Figma: Show CTA" },
  },
  args: {
    showImage:       false,
    showSubtitle:    true,
    showDescription: true,
    showCTA:         true,
  } as StoryArgs,
  decorators: [(Story) => <div className="w-80 p-8"><Story /></div>],
  render: (args) => {
    const { showImage, showSubtitle, showDescription, showCTA } = args as StoryArgs
    return (
      <ComposedCard
        showImage={showImage}
        showSubtitle={showSubtitle}
        showDescription={showDescription}
        showCTA={showCTA}
      />
    )
  },
}

// ── WithImage ─────────────────────────────────────────────────────────────
// Card with image slot — Figma: [Slot: Image] visible.

export const WithImage: Story = {
  parameters: { controls: { disable: true } },
  decorators: [(Story) => <div className="w-80 p-8"><Story /></div>],
  render: () => (
    <ComposedCard showImage showSubtitle showDescription showCTA />
  ),
}

// ── ContentOptions ────────────────────────────────────────────────────────
// All Figma boolean combinations — subtitle, description, CTA on/off.

const CONTENT_COMBOS: (ComposedCardProps & { label: string })[] = [
  { label: "All parts",       showSubtitle: true,  showDescription: true,  showCTA: true  },
  { label: "No subtitle",     showSubtitle: false, showDescription: true,  showCTA: true  },
  { label: "No description",  showSubtitle: true,  showDescription: false, showCTA: true  },
  { label: "No CTA",          showSubtitle: true,  showDescription: true,  showCTA: false },
]

export const ContentOptions: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap gap-6 p-8">
      {CONTENT_COMBOS.map(({ label, ...props }) => (
        <div key={label} className="flex flex-col gap-2 w-72">
          <ComposedCard {...props} />
          <span className="text-xs opacity-40">{label}</span>
        </div>
      ))}
    </div>
  ),
}

// ── Minimal ───────────────────────────────────────────────────────────────
// Title only — all optional parts hidden.

export const Minimal: Story = {
  parameters: { controls: { disable: true } },
  decorators: [(Story) => <div className="w-80 p-8"><Story /></div>],
  render: () => (
    <Card>
      <CardContent>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
        </CardHeader>
      </CardContent>
    </Card>
  ),
}

// ── AllCombinations ───────────────────────────────────────────────────────
// Complete visual reference — with/without image × content options.

export const AllCombinations: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap gap-6 p-8">
      <ComposedCard showImage={false} showSubtitle showDescription showCTA />
      <ComposedCard showImage showSubtitle showDescription showCTA />
      <ComposedCard showImage={false} showSubtitle={false} showDescription showCTA />
      <ComposedCard showImage={false} showSubtitle showDescription={false} showCTA={false} />
    </div>
  ),
}
