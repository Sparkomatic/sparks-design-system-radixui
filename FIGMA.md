# Sparks Design System — Figma Component Conventions

Rules for creating and maintaining components in the Figma file. This is the design-side companion to [CLAUDE.md](CLAUDE.md), which covers the code side. The two files share the same token naming contract — changes here flow directly into code.

---

## 1. Before Creating Anything — Read What Already Exists

Before adding a new component, inspect the Figma file:

1. **Check the existing pages** — each component lives on its own page. If a page already exists, work there.
2. **Read the existing components** — understand the naming conventions, variant structure, and token bindings already in use. Match them.
3. **Check the token collections** — Primitives → Semantic Colours → Semantic Space → Semantic Typography → Components. Understand which semantic tokens are available before deciding what to bind.
4. **Look at Button as the reference** — Button is the canonical well-formed component in this file. When in doubt about structure, variant naming, or layer naming, check how Button does it.

---

## 2. Component Naming

### Title Case with spaces

All component names use Title Case with spaces. No camelCase, no kebab-case, no dots.

| ✅ Correct | ❌ Wrong |
|---|---|
| `Dropdown Menu` | `DropdownMenu` |
| `Text Input` | `text-input` |
| `Checkbox Item` | `CheckboxItem` |

### Slash `/` as namespace separator

Use `/` to group related components in the assets panel. Everything before the last `/` becomes the folder name.

```
Dropdown Menu          ← published, top-level
Dropdown Menu/.Item    ← grouped under "Dropdown Menu"
Dropdown Menu/.Label   ← grouped under "Dropdown Menu"
```

### Dot `.` prefix for private sub-components

Any component that is a building block of a larger component — and should not be used directly by consumers — must have a `.` prefix on the leaf name (the part after the last `/`).

```
Dropdown Menu/.Item       ← private, won't publish
Dropdown Menu/.Label      ← private, won't publish
Dropdown Menu             ← no dot → published to library
```

The dot prefix tells Figma not to publish the component when the library is pushed. Consumers can only use the composed `Dropdown Menu`, not its internal parts.

### Radix naming in code vs. Figma

Radix uses dot notation in code (`DropdownMenu.Item`) because it maps to JS property access. Figma uses slash notation. Do not use dot notation in Figma component names.

| Radix (code) | Figma |
|---|---|
| `DropdownMenu.Item` | `Dropdown Menu/.Item` |
| `DropdownMenu.Label` | `Dropdown Menu/.Label` |
| `DropdownMenu.Separator` | `Dropdown Menu/.Separator` |

---

## 3. Page Structure

- One page per component family (e.g. "Button", "Dropdown Menu", "Text Input").
- The page name matches the published component name exactly.
- All component sets and their sub-parts live on that page.
- No demo or documentation frames on component pages — keep them clean for export.

---

## 4. Variant Naming

### Format

Figma variant names use the `Property=Value` format, comma-separated, in this order: **Variant → Size → State**.

```
Variant=Primary, Size=MD, State=Default
Variant=Secondary, Size=LG, State=Hover
Variant=Destructive, Size=SM, State=Disabled
```

- Property names: Title Case (`Variant`, `Size`, `State`)
- Values: Title Case (`Primary`, `Default`, `Hover`)
- Sizes: ALL CAPS abbreviation (`SM`, `MD`, `LG`)
- Always include all three dimensions even if only one changes

### Standard variant values

| Property | Values |
|---|---|
| `Variant` | `Default`, `Primary`, `Secondary`, `Tertiary`, `Utility`, `Destructive` — use only what the component needs |
| `Size` | `SM`, `MD`, `LG` |
| `State` | `Default`, `Hover`, `Focused`, `Pressed`, `Disabled`, `Loading` |

### Minimum state coverage

Every interactive component must cover at least these four states:

| State | When to include |
|---|---|
| `Default` | Always |
| `Hover` | Always |
| `Focused` | Always |
| `Disabled` | Always |
| `Pressed` | Buttons, clickable items |
| `Loading` | Buttons, async actions |
| `Open` | Triggers for menus/popovers |
| `Checked` | Checkboxes, radio items |

### Why State is a variant in Figma but not a prop in code

Figma cannot simulate browser pseudo-classes (`:hover`, `:focus-visible`), so it needs explicit State variants to show what each state looks like. In code, the browser handles hover/focus automatically. See [CLAUDE.md §5](CLAUDE.md) for the full rationale. Never add a `state` prop to a code component because a Figma State variant exists.

---

## 5. Layer Naming

Layer names are the contract between design and code. They must be:

- **Title Case with spaces**: `Item Text`, `Leading Icon`, `Sub Indicator`
- **Matching Radix sub-component part names** where a direct mapping exists
- **Consistent across all variants** in a component set — the same layer must have the same name in every variant

### Standard layer names

| Layer | What it represents |
|---|---|
| `Label` / `Item Text` | Primary text content |
| `Leading Icon` | Icon before the label |
| `Trailing Icon` | Icon after the label |
| `Trailing Hint` | Keyboard shortcut or secondary label (right-aligned) |
| `Sub Indicator` | Chevron or arrow indicating a sub-menu |
| `Item Indicator` | Checkmark or radio dot inside a menu item |
| `Label Text` | Text inside a Label sub-component |
| `Separator Line` | The 1px line inside a Separator sub-component |

Layer names drive component property bindings (see §7) and are referenced in code review when verifying Figma ↔ code parity.

---

## 6. Token Usage

### Always bind to a variable — never use raw values

Every fill, stroke, corner radius, and spacing value must be bound to a Figma variable. Hardcoded hex values or raw numbers are not permitted — they break the token export pipeline.

### Token hierarchy

Use tokens at the appropriate level of abstraction:

```
Primitives            ← raw values (colors/arctic-blue/500, spacing/8)
  ↓
Semantic              ← role-based aliases (foreground/default, radius/popover)
  ↓
Component tokens      ← component-specific (button/color/primary/background)
```

**Start with semantic tokens.** Add component-level tokens once the design is stable and the values need to be independently themeable. Until then, binding directly to semantic tokens is correct.

### Which semantic tokens to use

| Design property | Semantic token |
|---|---|
| Default background | `background/default` |
| Raised surface (panel, popover) | `background/raised` |
| Subtle hover background | `background/secondary/subtle` |
| Destructive hover background | `background/destructive/subtle` |
| Disabled background | `background/disabled` |
| Default text | `foreground/default` |
| Muted / secondary text | `foreground/disabled` |
| Destructive text | `foreground/destructive/default` |
| Disabled text | `foreground/disabled` |
| Default border | `border/default` |
| Focus ring | `border/focus` |
| Item corner radius | `radius/control/sm` (4px) or `radius/control/md` (8px) |
| Panel / popover corner radius | `radius/popover` (12px) |
| Card corner radius | `radius/card/md` (16px) or `radius/card/lg` (24px) |

### Token naming contract with code

Figma variable names map directly to CSS custom properties in the codebase — slashes become hyphens:

```
background/secondary/subtle  →  --background-secondary-subtle
foreground/destructive/default  →  --foreground-destructive-default
button/color/primary/background  →  --button-color-primary-background
```

Do not rename Figma variables without coordinating the CSS side. The variable name is the shared contract.

---

## 7. Component Properties

Use Figma component properties to control layer visibility and content without creating extra variants.

### Boolean properties — show/hide layers

Use a Boolean property to toggle optional layers. Bind the property to the layer's `visible` field.

| Property name | Controls |
|---|---|
| `Leading Icon` | Visibility of the `Leading Icon` layer |
| `Trailing Icon` | Visibility of the `Trailing Icon` layer |
| `Trailing Hint` | Visibility of the `Trailing Hint` layer |

Default value should match the most common usage (often `false` for optional decorators).

### Text properties — editable labels

Use a Text property for any text layer consumers will need to change. Bind the property to the layer's `characters` field.

| Property name | Layer it controls |
|---|---|
| `Label` | Main text content (`Label`, `Item Text`, etc.) |
| `Hint Text` | Keyboard shortcut or secondary text |
| `Placeholder` | Input placeholder text |

### Instance Swap properties — icon slots

Use an Instance Swap property when a layer accepts different icon components. Bind it to an icon placeholder frame.

### What NOT to use component properties for

- Do not create a `State` component property — states are handled by Figma variants, not properties.
- Do not create a `Variant` or `Size` component property — these are Figma variant dimensions, not properties.

---

## 8. Layout and Sizing

- All components use **auto-layout** (not manual positioning of children).
- Sizes come from semantic space tokens — bind `paddingLeft`, `paddingRight`, `cornerRadius` etc. to variables where possible.
- Icon sizes: SM = 14px, MD = 16px, LG = 20px.
- Component heights follow control height tokens: SM = 32px, MD = 40px, LG = 48px.

---

## 9. What NOT to Do

- Do not use camelCase, PascalCase, or kebab-case in component names — always Title Case with spaces.
- Do not use dot notation (`DropdownMenu.Item`) in Figma component names — use slash notation (`Dropdown Menu/.Item`).
- Do not publish sub-components without a `.` prefix — consumers should only reach for the composed component.
- Do not hardcode hex values or raw numbers in fills, strokes, or radii — always bind to a variable.
- Do not use Primitive tokens directly in components — go through Semantic tokens.
- Do not create State as a Figma component property — it is a variant dimension.
- Do not rename a Figma variable without updating the corresponding CSS custom property in the codebase.
- Do not create new pages for demo frames — component pages are for components only.
- Do not omit Hover, Focused, or Disabled states — all three are required for every interactive component.
