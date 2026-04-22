import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "./button"

type StoryState = "default" | "hover" | "pressed" | "focused" | "disabled" | "loading"

const stateClassMap: Partial<Record<StoryState, string>> = {
  hover:   "force-hover",
  pressed: "force-active",
  focused: "force-focus",
}

const ALL_VARIANTS = ["primary", "secondary", "tertiary", "utility", "destructive"] as const
const ALL_SIZES    = ["sm", "md", "lg"] as const
const ALL_STATES: StoryState[] = ["default", "hover", "pressed", "focused", "disabled", "loading"]

type Variant = typeof ALL_VARIANTS[number]

function stateProps(state: StoryState) {
  return {
    disabled: state === "disabled",
    loading:  state === "loading",
    className: stateClassMap[state],
  }
}

// ── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    pseudo: {
      hover:        ".force-hover",
      active:       ".force-active",
      focusVisible: ".force-focus",
    },
  },
  argTypes: {
    children: {
      control: "text",
      description: "Button text content — Figma: Label",
    },
    variant: {
      control: "select",
      options: ALL_VARIANTS,
      description: "Visual style — Figma: Variant",
    },
    size: {
      control: "select",
      options: ALL_SIZES,
      description: "Height (32/40/48px) — Figma: Size",
    },
    disabled:    { table: { disable: true } },
    loading:     { table: { disable: true } },
    asChild:     { table: { disable: true } },
    leadingIcon:  { table: { disable: true } },
    trailingIcon: { table: { disable: true } },
  },
  args: {
    children: "Button",
    variant: "primary",
    size: "md",
  },
}

export default meta
type Story = StoryObj<typeof meta>

// ── Default (Playground) ─────────────────────────────────────────────────────
// Variant × Size × State — mirrors the Figma property panel exactly.

export const Default: Story = {
  argTypes: {
    state: {
      control: "select",
      options: ALL_STATES,
      description: "Interactive state — Figma: State",
    },
  },
  args: { state: "default" } as Record<string, unknown>,
  render: ({ className, ...args }: React.ComponentProps<typeof Button> & { state?: StoryState }) => {
    const state = (args as unknown as { state: StoryState }).state ?? "default"
    return (
      <Button
        {...args}
        {...stateProps(state)}
        className={[stateClassMap[state], className].filter(Boolean).join(" ")}
      />
    )
  },
}

// ── Variants ─────────────────────────────────────────────────────────────────
// All 5 variants at MD size, default state.

export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex items-end gap-4 flex-wrap">
      {ALL_VARIANTS.map(variant => (
        <div key={variant} className="flex flex-col items-center gap-2">
          <Button variant={variant} size="md">Button</Button>
          <span className="text-xs opacity-40 capitalize">{variant}</span>
        </div>
      ))}
    </div>
  ),
}

// ── States ───────────────────────────────────────────────────────────────────
// Primary MD — one button per Figma state. Visual reference for all 6 states.

export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex items-end gap-4 flex-wrap">
      {ALL_STATES.map(state => (
        <div key={state} className="flex flex-col items-center gap-2">
          <Button variant="primary" size="md" {...stateProps(state)}>Button</Button>
          <span className="text-xs opacity-40 capitalize">{state}</span>
        </div>
      ))}
    </div>
  ),
}

// ── Sizes ────────────────────────────────────────────────────────────────────
// Primary variant, default state — SM / MD / LG side by side.

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex items-end gap-4">
      {ALL_SIZES.map(size => (
        <div key={size} className="flex flex-col items-center gap-2">
          <Button variant="primary" size={size}>Button</Button>
          <span className="text-xs opacity-40 uppercase">{size}</span>
        </div>
      ))}
    </div>
  ),
}

// ── All Variants ─────────────────────────────────────────────────────────────
// Full matrix: variant × size × state. Complete visual reference for design QA.

function VariantRow({ variant }: { variant: Variant }) {
  return (
    <>
      {ALL_SIZES.map(size =>
        ALL_STATES.map(state => (
          <Button key={`${size}-${state}`} variant={variant} size={size} {...stateProps(state)}>
            Button
          </Button>
        ))
      )}
    </>
  )
}

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-6">
      {/* Header row */}
      <div className="flex items-center gap-2">
        <span className="w-28 shrink-0" />
        {ALL_SIZES.map(size =>
          ALL_STATES.map(state => (
            <span key={`${size}-${state}`} className="w-20 text-center text-xs opacity-40 leading-tight">
              {size.toUpperCase()}<br />{state}
            </span>
          ))
        )}
      </div>
      {ALL_VARIANTS.map(variant => (
        <div key={variant} className="flex items-center gap-2">
          <span className="w-28 text-sm text-right shrink-0 opacity-40">{variant}</span>
          <VariantRow variant={variant} />
        </div>
      ))}
    </div>
  ),
}
