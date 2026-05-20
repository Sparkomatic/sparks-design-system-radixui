import type { Meta, StoryObj } from "@storybook/react-vite"
import { Search, Mail, Eye } from "lucide-react"
import { TextInput } from "./text-input"

type StoryState = "default" | "hover" | "focused" | "disabled"

const stateClassMap: Partial<Record<StoryState, string>> = {
  hover:   "force-hover",
  focused: "force-focus",
}

const ALL_SIZES   = ["sm", "md", "lg"] as const
const ALL_STATUSES = ["default", "error", "success"] as const
const ALL_STATES: StoryState[] = ["default", "hover", "focused", "disabled"]

type Size   = typeof ALL_SIZES[number]
type Status = typeof ALL_STATUSES[number]

function stateProps(state: StoryState) {
  return {
    disabled:  state === "disabled",
    className: stateClassMap[state],
  }
}

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta<typeof TextInput> = {
  title: "UI/TextInput",
  component: TextInput,
  tags: ["autodocs"],
  parameters: {
    pseudo: {
      hover:        ".force-hover",
      focusVisible: ".force-focus",
    },
  },
  argTypes: {
    placeholder: {
      control: "text",
      description: "Placeholder text — Figma: Placeholder",
    },
    size: {
      control: "select",
      options: ALL_SIZES,
      description: "Height (32/40/48px) — Figma: Size",
    },
    status: {
      control: "select",
      options: ALL_STATUSES,
      description: "Validation status — Figma: State (Error/Success)",
    },
    disabled:     { table: { disable: true } },
    leadingIcon:  { table: { disable: true } },
    trailingIcon: { table: { disable: true } },
  },
  args: {
    placeholder: "Placeholder text",
    size: "md",
    status: "default",
  },
}

export default meta
type Story = StoryObj<typeof meta>

// ── Default (Playground) ──────────────────────────────────────────────────────

export const Default: Story = {
  argTypes: {
    defaultValue: {
      control: "text",
      description: "Pre-filled value — simulates typed text",
    },
    state: {
      control: "select",
      options: ALL_STATES,
      description: "Interactive state — Figma: State",
    },
  },
  args: { state: "default" } as Record<string, unknown>,
  render: ({ className, ...args }: React.ComponentProps<typeof TextInput> & { state?: StoryState }) => {
    const state = (args as unknown as { state: StoryState }).state ?? "default"
    return (
      <div className="w-80">
        <TextInput
          {...args}
          {...stateProps(state)}
          className={[stateClassMap[state], className].filter(Boolean).join(" ")}
        />
      </div>
    )
  },
}

// ── Status ────────────────────────────────────────────────────────────────────
// All statuses at MD size, default state.

export const Status: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      {ALL_STATUSES.map(status => (
        <div key={status} className="flex flex-col gap-1">
          <TextInput size="md" status={status} placeholder="Placeholder text" />
          <span className="text-xs opacity-40 capitalize">{status}</span>
        </div>
      ))}
    </div>
  ),
}

// ── States ────────────────────────────────────────────────────────────────────
// Default status, MD size — all interactive states.

export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      {ALL_STATES.map(state => (
        <div key={state} className="flex flex-col gap-1">
          <TextInput size="md" status="default" placeholder="Placeholder text" {...stateProps(state)} />
          <span className="text-xs opacity-40 capitalize">{state}</span>
        </div>
      ))}
    </div>
  ),
}

// ── Sizes ─────────────────────────────────────────────────────────────────────
// Default status, default state — SM / MD / LG.

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      {ALL_SIZES.map(size => (
        <div key={size} className="flex flex-col gap-1">
          <TextInput size={size} status="default" placeholder="Placeholder text" />
          <span className="text-xs opacity-40 uppercase">{size}</span>
        </div>
      ))}
    </div>
  ),
}

// ── All Variants ──────────────────────────────────────────────────────────────
// Full matrix: size × status × state. Includes icon slot examples.

function StatusRow({ status }: { status: Status }) {
  return (
    <>
      {ALL_SIZES.map(size =>
        ALL_STATES.map(state => (
          <TextInput
            key={`${size}-${state}`}
            size={size}
            status={status}
            placeholder="Placeholder"
            {...stateProps(state)}
          />
        ))
      )}
    </>
  )
}

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="w-20 shrink-0" />
        {ALL_SIZES.map(size =>
          ALL_STATES.map(state => (
            <span key={`${size}-${state}`} className="w-44 text-center text-xs opacity-40 leading-tight">
              {size.toUpperCase()}<br />{state}
            </span>
          ))
        )}
      </div>
      {ALL_STATUSES.map(status => (
        <div key={status} className="flex items-center gap-2">
          <span className="w-20 text-sm text-right shrink-0 opacity-40">{status}</span>
          <StatusRow status={status} />
        </div>
      ))}
      {/* Icon slots */}
      <div className="flex flex-col gap-3">
        <span className="text-xs opacity-40 font-medium">Icon slots (MD, default)</span>
        <div className="flex items-center gap-4 flex-wrap">
          <TextInput size="md" leadingIcon={<Search size={16} />} placeholder="Leading icon" className="w-52" />
          <TextInput size="md" trailingIcon={<Eye size={16} />} placeholder="Trailing icon" className="w-52" />
          <TextInput size="md" leadingIcon={<Mail size={16} />} trailingIcon={<Eye size={16} />} placeholder="Both icons" className="w-52" />
        </div>
      </div>
    </div>
  ),
}
