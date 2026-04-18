import type { Meta, StoryObj } from "@storybook/react-vite"
import { Card, CardHeader, CardTitle, CardDescription, CardBody, CardFooter } from "./card"
import { Button } from "@/components/ui/button"

const meta: Meta<typeof Card> = {
  title: "UI/Card",
  component: Card,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "elevated", "ghost"],
      description: "Visual style of the card",
    },
  },
  args: {
    variant: "default",
  },
  decorators: [
    (Story) => (
      <div className="p-8 max-w-sm">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Card title</CardTitle>
        <CardDescription>Supporting description text.</CardDescription>
      </CardHeader>
      <CardBody>
        <p className="text-sm text-muted-foreground">
          Card body content goes here.
        </p>
      </CardBody>
      <CardFooter>
        <Button size="sm">Action</Button>
        <Button size="sm" variant="ghost">Cancel</Button>
      </CardFooter>
    </Card>
  ),
}

export const Elevated: Story = {
  args: { variant: "elevated" },
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Elevated card</CardTitle>
        <CardDescription>Shadow instead of border.</CardDescription>
      </CardHeader>
      <CardBody>
        <p className="text-sm text-muted-foreground">Card body content.</p>
      </CardBody>
    </Card>
  ),
}

export const Ghost: Story = {
  args: { variant: "ghost" },
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Ghost card</CardTitle>
        <CardDescription>No border or shadow.</CardDescription>
      </CardHeader>
      <CardBody>
        <p className="text-sm text-muted-foreground">Card body content.</p>
      </CardBody>
    </Card>
  ),
}

export const AllVariants: Story = {
  name: "All variants",
  decorators: [
    (Story) => (
      <div className="flex flex-wrap gap-6 p-8">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <>
      {(["default", "elevated", "ghost"] as const).map((variant) => (
        <Card key={variant} variant={variant} className="w-64">
          <CardHeader>
            <CardTitle className="capitalize">{variant}</CardTitle>
            <CardDescription>Card variant example.</CardDescription>
          </CardHeader>
          <CardBody>
            <p className="text-sm text-muted-foreground">Body content.</p>
          </CardBody>
          <CardFooter>
            <Button size="sm">Action</Button>
          </CardFooter>
        </Card>
      ))}
    </>
  ),
}
