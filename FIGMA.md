# Sparks Design System — Figma Conventions

Project-specific Figma rules for this design system. General headless component principles (variant grammar, state handling, layer naming standards, slot conventions, auto layout, focus ring, disabled states) live in the shared skill at `support/headless-component-principles.md` and apply here without repetition.

---

## Before Creating Anything

1. **Check existing pages** — each component family has its own page. If a page already exists, work there.
2. **Read existing components** — match the naming conventions, variant structure, and token bindings already in use.
3. **Check the token collections** — Primitives → Semantic Colours → Semantic Space → Semantic Typography → Components. Know what semantic tokens are available before deciding what to bind.
4. **Use Button as the reference** — Button is the canonical well-formed component in this file. When in doubt about structure, variant naming, or layer naming, check how Button does it.

---

## Component Naming

### Title Case with spaces

All component names use Title Case with spaces. No camelCase, no kebab-case, no dots.

| Correct | Wrong |
|---|---|
| `Dropdown Menu` | `DropdownMenu` |
| `Text Input` | `text-input` |
| `Checkbox Item` | `CheckboxItem` |

### Slash for namespacing, dot for private sub-components

Use `/` to group related components in the assets panel. Prefix private sub-components (building blocks not meant for direct use) with `.` after the last `/` -- Figma will not publish them to the library.

```
Dropdown Menu          ← published, top-level
Dropdown Menu/.Item    ← private, grouped under "Dropdown Menu"
Dropdown Menu/.Label   ← private, grouped under "Dropdown Menu"
```

### Radix code vs. Figma naming

Radix uses dot notation in code (`DropdownMenu.Item`). Figma uses slash notation. Never use dot notation in Figma component names.

| Radix (code) | Figma |
|---|---|
| `DropdownMenu.Item` | `Dropdown Menu/.Item` |
| `DropdownMenu.Label` | `Dropdown Menu/.Label` |
| `DropdownMenu.Separator` | `Dropdown Menu/.Separator` |

---

## Page Structure

- One page per component family (e.g. `Button`, `Dropdown Menu`, `Text Input`)
- Page name matches the published component name exactly
- All component sets and sub-parts live on that page
- No demo or documentation frames on component pages -- keep them clean

---

## Variant Format

Figma variant names use `Property=Value` format, comma-separated, in this order: **Variant → Size → State**.

```
Variant=Primary, Size=MD, State=Default
Variant=Secondary, Size=LG, State=Hover
```

- Property names: Title Case (`Variant`, `Size`, `State`)
- Values: Title Case (`Primary`, `Default`, `Hover`)
- Sizes: ALL CAPS abbreviation (`SM`, `MD`, `LG`)

### Standard values for this project

| Property | Values |
|---|---|
| `Variant` | `Primary`, `Secondary`, `Tertiary`, `Utility`, `Destructive` — use only what the component needs |
| `Size` | `SM`, `MD`, `LG` |
| `State` | `Default`, `Hover`, `Focused`, `Pressed`, `Disabled`, `Loading` |

---

## Project Layer Names

These extend the standard layer names in `headless-component-principles.md` with names specific to this system.

| Layer | What it represents |
|---|---|
| `Trailing Hint` | Keyboard shortcut or secondary label (right-aligned) |
| `Sub Indicator` | Chevron indicating a sub-menu |
| `Item Indicator` | Checkmark or radio dot inside a menu item |
| `Label Text` | Text inside a Label sub-component |
| `Separator Line` | The 1px line inside a Separator sub-component |

---

## Token Bindings

### Always bind — never use raw values

Every fill, stroke, corner radius, and spacing value must be bound to a Figma variable. Raw hex values or numbers break the token export pipeline.

### Semantic tokens for this project

| Design property | Semantic token |
|---|---|
| Default background | `background/default` |
| Raised surface (panel, popover) | `background/raised` |
| Subtle hover background | `background/secondary/subtle` |
| Destructive hover background | `background/destructive/subtle` |
| Disabled background | `background/disabled` |
| Default text | `foreground/default` |
| Muted / secondary text | `foreground/muted` |
| Destructive text | `foreground/destructive/default` |
| Disabled text | `foreground/disabled` |
| Default border | `border/default` |
| Focus ring | `border/focus` |
| Item corner radius | `radius/control/sm` (4px) or `radius/control/md` (8px) |
| Panel / popover corner radius | `radius/popover` (12px) |
| Card corner radius | `radius/card/md` (16px) or `radius/card/lg` (24px) |

### Token naming contract with code

Figma variable names map directly to CSS custom properties -- slashes become hyphens:

```
background/secondary/subtle       →  --background-secondary-subtle
foreground/destructive/default    →  --foreground-destructive-default
button/color/primary/background   →  --button-color-primary-background
```

Do not rename a Figma variable without updating the corresponding CSS custom property.

---

## Component Properties

Use Figma component properties to control layer visibility and content without creating extra variants.

### Boolean properties — show/hide layers

| Property name | Controls |
|---|---|
| `Leading Icon` | Visibility of the `Leading Icon` layer |
| `Trailing Icon` | Visibility of the `Trailing Icon` layer |
| `Trailing Hint` | Visibility of the `Trailing Hint` layer |

Default value should match the most common usage (usually `false` for optional decorators).

### Text properties — editable labels

| Property name | Layer it controls |
|---|---|
| `Label` | Main text content |
| `Hint Text` | Keyboard shortcut or secondary text |
| `Placeholder` | Input placeholder text |

### Instance Swap properties

Use an Instance Swap property when a layer accepts different icon components. Bind it to an icon placeholder frame.

### Do not use component properties for

- `State` -- handled by Figma variants, not properties
- `Variant` or `Size` -- these are variant dimensions, not properties

---

## Sizes

| | SM | MD | LG |
|---|---|---|---|
| Control height | 32px | 40px | 48px |
| Icon size | 14px | 16px | 20px |

Bind height values to control height tokens. Bind gap and padding to spacing tokens -- never raw numbers.
