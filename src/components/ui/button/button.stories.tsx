import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "./button"

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary", "utility", "destructive"],
      description: "Visual style of the button",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Height and padding of the button",
    },
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
    asChild: { table: { disable: true } },
    leadingIcon: { table: { disable: true } },
    trailingIcon: { table: { disable: true } },
  },
  args: {
    children: "Button",
    variant: "primary",
    size: "md",
    disabled: false,
    loading: false,
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {}

export const Secondary: Story = {
  args: { variant: "secondary" },
}

export const Tertiary: Story = {
  args: { variant: "tertiary" },
}

export const Utility: Story = {
  args: { variant: "utility" },
}

export const Destructive: Story = {
  args: { variant: "destructive" },
}

export const Small: Story = {
  args: { size: "sm" },
}

export const Large: Story = {
  args: { size: "lg" },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const Loading: Story = {
  args: { loading: true },
}

export const AllVariants: Story = {
  name: "All variants",
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="tertiary">Tertiary</Button>
      <Button variant="utility">Utility</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  ),
}

export const AllSizes: Story = {
  name: "All sizes",
  render: () => (
    <div className="flex flex-wrap items-end gap-3">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
}
