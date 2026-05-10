import { Copy, Layers, Link, Pencil, Trash2 } from "lucide-react"
import { Section, Row } from "@/playground/components"
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DropdownMenuPreview() {
  return (
    <Section
      title="Dropdown Menu"
      description="Contextual menu triggered by a button. Maps to Dropdown Menu in Figma."
    >
      <Row label="Default">
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
              <DropdownMenuItem variant="destructive" icon={<Trash2 size={16} />} shortcut="⌫">
                Delete
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </Row>

      <Row label="Disabled items">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary">Open menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem icon={<Pencil size={16} />}>Edit</DropdownMenuItem>
            <DropdownMenuItem icon={<Copy size={16} />} disabled>Duplicate (disabled)</DropdownMenuItem>
            <DropdownMenuItem icon={<Trash2 size={16} />} variant="destructive" disabled>
              Delete (disabled)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Row>
    </Section>
  )
}
