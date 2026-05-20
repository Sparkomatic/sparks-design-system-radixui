import { Search, Mail, Eye } from "lucide-react"
import { Section, Row } from "@/playground/components"
import { TextInput } from "@/components/ui/text-input"

export function TextInputPreview() {
  return (
    <Section
      title="Text Input"
      description="Single-line text input. Origin: layout component — no Radix primitive."
    >
      <Row label="Sizes">
        <div className="w-48"><TextInput size="sm" placeholder="Small" /></div>
        <div className="w-48"><TextInput size="md" placeholder="Medium" /></div>
        <div className="w-48"><TextInput size="lg" placeholder="Large" /></div>
      </Row>

      <Row label="Status">
        <div className="w-48"><TextInput status="default" placeholder="Default" /></div>
        <div className="w-48"><TextInput status="error"   placeholder="Error" /></div>
        <div className="w-48"><TextInput status="success" placeholder="Success" /></div>
      </Row>

      <Row label="Leading icon">
        <div className="w-56"><TextInput leadingIcon={<Search size={16} />} placeholder="Search…" /></div>
        <div className="w-56"><TextInput leadingIcon={<Mail size={16} />}   placeholder="Email" /></div>
      </Row>

      <Row label="Trailing icon">
        <div className="w-56"><TextInput trailingIcon={<Eye size={16} />} placeholder="Password" /></div>
      </Row>

      <Row label="Both icons">
        <div className="w-64">
          <TextInput
            leadingIcon={<Mail size={16} />}
            trailingIcon={<Eye size={16} />}
            placeholder="Email address"
          />
        </div>
      </Row>

      <Row label="Disabled">
        <div className="w-56"><TextInput disabled placeholder="Disabled placeholder" /></div>
        <div className="w-56"><TextInput disabled defaultValue="Disabled value" /></div>
      </Row>
    </Section>
  )
}
