import type { Meta, StoryObj } from "@storybook/react-vite"
import { Copy, Layers, Link, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./dropdown-menu"

type StoryState = "default" | "hover" | "focused" | "disabled"

const stateClassMap: Partial<Record<StoryState, string>> = {
  hover:   "force-hover",
  focused: "force-focus",
}

const ALL_VARIANTS = ["default", "destructive"] as const
const ALL_ITEM_STATES: StoryState[] = ["default", "hover", "focused", "disabled"]

// ── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof DropdownMenuItem> = {
  title: "UI/DropdownMenu",
  component: DropdownMenuItem,
  tags: ["autodocs"],
  parameters: {
    pseudo: {
      hover:        ".force-hover",
      focusVisible: ".force-focus",
    },
  },
  argTypes: {
    children: {
      control: "text",
      description: "Item label — Figma: Label",
    },
    variant: {
      control: "select",
      options: ALL_VARIANTS,
      description: "Visual style — Figma: Variant",
    },
    shortcut: {
      control: "text",
      description: "Keyboard shortcut hint — Figma: Trailing Hint",
    },
    disabled: { table: { disable: true } },
    icon:     { table: { disable: true } },
  },
  args: {
    children: "Menu item",
    variant: "default",
    shortcut: "⌘K",
  },
}

export default meta
type Story = StoryObj<typeof meta>

// ── Default (Playground) ─────────────────────────────────────────────────────
// Full interactive dropdown — mirrors the Figma composite component.

export const Default: Story = {
  argTypes: {
    state: {
      control: "select",
      options: ALL_ITEM_STATES,
      description: "Interactive state — Figma: State",
    },
  },
  args: { state: "default" } as Record<string, unknown>,
  render: () => (
    <div className="flex justify-center p-8">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">Open menu</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem icon={<Pencil size={16} />} shortcut="⌘E">Edit</DropdownMenuItem>
            <DropdownMenuItem icon={<Copy size={16} />} shortcut="⌘D">Duplicate</DropdownMenuItem>
            <DropdownMenuItem icon={<Link size={16} />} shortcut="⌘L">Copy link</DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger icon={<Layers size={16} />}>Sub menu</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Sub item 1</DropdownMenuItem>
                <DropdownMenuItem>Sub item 2</DropdownMenuItem>
                <DropdownMenuItem>Sub item 3</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Danger zone</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem variant="destructive" icon={<Trash2 size={16} />} shortcut="⌫">Delete</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
}

// ── Variants ─────────────────────────────────────────────────────────────────
// Default vs Destructive items — static panel for visual QA.

export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex gap-8 p-4">
      {ALL_VARIANTS.map(variant => (
        <div key={variant} className="flex flex-col gap-1">
          <span className="text-xs opacity-40 uppercase mb-2">{variant}</span>
          <div className="dropdown-menu-content">
            <DropdownMenuItem variant={variant} icon={<Pencil size={16} />} shortcut="⌘E">
              Menu item
            </DropdownMenuItem>
            <DropdownMenuItem variant={variant} icon={<Copy size={16} />}>
              No shortcut
            </DropdownMenuItem>
            <DropdownMenuItem variant={variant} shortcut="⌘K">
              No icon
            </DropdownMenuItem>
            <DropdownMenuItem variant={variant}>
              Plain item
            </DropdownMenuItem>
          </div>
        </div>
      ))}
    </div>
  ),
}

// ── States ───────────────────────────────────────────────────────────────────
// Default variant — one item per Figma state. Static panel for visual QA.

export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex gap-8 p-4">
      {ALL_ITEM_STATES.map(state => (
        <div key={state} className="flex flex-col gap-1">
          <span className="text-xs opacity-40 capitalize mb-2">{state}</span>
          <div className="dropdown-menu-content">
            <DropdownMenuItem
              icon={<Pencil size={16} />}
              shortcut="⌘E"
              disabled={state === "disabled"}
              className={stateClassMap[state]}
            >
              Menu item
            </DropdownMenuItem>
          </div>
        </div>
      ))}
    </div>
  ),
}

// ── Composition ───────────────────────────────────────────────────────────────
// Full composite — matches the Figma "Dropdown Menu" component exactly.

export const Composition: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="p-4">
      <div className="dropdown-menu-content w-52">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem icon={<Pencil size={16} />} shortcut="⌘E">Edit</DropdownMenuItem>
        <DropdownMenuItem icon={<Copy size={16} />} shortcut="⌘D">Duplicate</DropdownMenuItem>
        <DropdownMenuItem icon={<Link size={16} />} shortcut="⌘L">Copy link</DropdownMenuItem>
        <DropdownMenuSubTrigger icon={<Layers size={16} />}>Sub menu</DropdownMenuSubTrigger>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Danger zone</DropdownMenuLabel>
        <DropdownMenuItem variant="destructive" icon={<Trash2 size={16} />} shortcut="⌫">Delete</DropdownMenuItem>
      </div>
    </div>
  ),
}

// ── AllVariants ───────────────────────────────────────────────────────────────
// Full matrix: variant × state. Complete visual reference for design QA.

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="p-4 flex flex-col gap-6">
      <div className="flex gap-2 ml-28">
        {ALL_ITEM_STATES.map(state => (
          <span key={state} className="w-40 text-center text-xs opacity-40 capitalize">{state}</span>
        ))}
      </div>
      {ALL_VARIANTS.map(variant => (
        <div key={variant} className="flex items-start gap-2">
          <span className="w-28 text-sm text-right shrink-0 opacity-40 pt-2">{variant}</span>
          {ALL_ITEM_STATES.map(state => (
            <div key={state} className="dropdown-menu-content w-40">
              <DropdownMenuItem
                variant={variant}
                icon={<Pencil size={16} />}
                shortcut="⌘E"
                disabled={state === "disabled"}
                className={stateClassMap[state]}
              >
                Menu item
              </DropdownMenuItem>
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
}
