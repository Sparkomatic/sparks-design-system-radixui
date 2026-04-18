# Sparks Design System — Component Rules

This repo converts Figma designs (with component tokens) into production-ready React components built on Radix UI primitives. These rules govern every component. Follow them without deviation unless explicitly overridden for a specific component.

---

## 1. Before Writing Any Code — Read the Figma Design Completely

When given a Figma component via MCP:

1. **Read all variant properties** before writing anything. List every property name and its possible values.
2. **Read all layer names** in the component. Each named layer maps to a component "part" and often to a CSS token.
3. **Read all linked tokens** on every layer (fill, stroke, radius, spacing, typography). These become CSS custom properties.
4. **Read all states** (default, hover, pressed/active, focused, disabled, loading). These map to Radix data attributes or CSS pseudo-classes.
5. **Identify the Radix primitive** that matches the component's interaction model before starting.

Do not begin implementation until you have a complete mental map of variants × parts × states × tokens.

---

## 2. Stack and Primitives

| Layer | Tool |
|---|---|
| Headless behaviour + a11y | Radix UI (`@radix-ui/react-*`) |
| Variant logic | `class-variance-authority` (CVA) |
| Class merging | `cn()` from `@/lib/utils` |
| Styling | Tailwind CSS v4 utility classes |
| Token values | CSS custom properties via `src/tokens/` |
| Icons | `lucide-react` |

**Never reach for a custom implementation when a Radix primitive exists.** If no Radix primitive covers the interaction model, use a `<div>` with the correct ARIA role — document why.

---

## 3. File Structure

Each component lives in its own folder:

```
src/
├── components/
│   └── ui/
│       └── {component-name}/
│           ├── {component-name}.tsx       # component implementation
│           ├── {component-name}.types.ts  # types (only if they're non-trivial)
│           └── index.ts                   # re-exports only
├── tokens/
│   ├── semantic.css                       # semantic token definitions
│   └── components/
│       └── {component-name}.css           # component-scoped tokens
└── index.css                              # imports all tokens
```

Rules:
- One component (or tightly-related compound component) per folder.
- `index.ts` only re-exports — no logic.
- When a component token file is created, add its `@import` to `src/index.css` immediately.
- Component token files are named to match the component folder exactly.

---

## 4. Component Code Pattern

Every component follows this exact structure:

```tsx
import * as React from "react"
import * as PrimitiveName from "@radix-ui/react-primitive-name"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// ── Variants ──────────────────────────────────────────────────────────────
const componentVariants = cva(
  // Base classes that apply to every variant
  "...",
  {
    variants: {
      // Each key maps to a Figma variant property (camelCase)
      variant: {
        default: "...",
        destructive: "...",
      },
      size: {
        sm: "...",
        md: "...",
        lg: "...",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

// ── Types ─────────────────────────────────────────────────────────────────
export interface ComponentProps
  extends React.ComponentPropsWithoutRef<typeof PrimitiveName.Root>,
    VariantProps<typeof componentVariants> {}

// ── Component ─────────────────────────────────────────────────────────────
const Component = React.forwardRef<
  React.ElementRef<typeof PrimitiveName.Root>,
  ComponentProps
>(({ className, variant, size, ...props }, ref) => (
  <PrimitiveName.Root
    ref={ref}
    className={cn(componentVariants({ variant, size }), className)}
    {...props}
  />
))
Component.displayName = "Component"

export { Component, componentVariants }
```

Non-negotiables:
- Always `React.forwardRef`. No exceptions.
- Always set `displayName` as a string literal matching the export name.
- Always spread `...props` last so consumers can override anything.
- Always export the CVA function alongside the component — it lets consumers extend variants.
- `className` is always accepted and merged via `cn()` as the final override layer.
- Extend Radix prop types with `React.ComponentPropsWithoutRef<typeof Primitive.Root>` — never define props from scratch when the primitive already has them.

---

## 5. Variant Mapping: Figma → CVA

| Figma | Code |
|---|---|
| Variant property name | CVA variant key (camelCase) |
| Variant property value | CVA variant value (lowercase, no spaces — use kebab-case for multi-word) |
| Figma "Size = Large" | `size: { lg: "..." }` |
| Figma "Intent = Destructive" | `variant: { destructive: "..." }` |
| Figma "State = Disabled" | Not a CVA variant — use Radix `disabled` prop → CSS `data-[disabled]` |
| Figma "State = Hover" | Not a CVA variant — use CSS `hover:` |
| Figma "State = Focused" | Not a CVA variant — use CSS `focus-visible:` |
| Figma "State = Loading" | Can be a CVA variant if it changes structure; otherwise a prop |

Figma boolean properties (e.g. "Has Icon = True") become optional React props (`icon?: React.ReactNode`), not CVA variants.

---

## 6. State Mapping: Figma States → CSS

Map Figma states to the correct CSS mechanism. Do not invent custom classes for states Radix or CSS already handles.

| Figma state | CSS / Radix mechanism |
|---|---|
| Hover | `hover:` Tailwind prefix |
| Pressed / Active | `active:` Tailwind prefix |
| Focused | `focus-visible:` Tailwind prefix (never `focus:` alone) |
| Disabled | `data-[disabled]:` (Radix sets this) or `disabled:` for native elements |
| Open | `data-[state=open]:` |
| Checked | `data-[state=checked]:` |
| Selected | `data-[state=active]:` or `data-[highlighted]:` depending on primitive |
| Loading | `aria-[busy=true]:` or a `data-loading` attribute |

---

## 7. Token Naming and CSS Custom Properties

### Semantic tokens (`src/tokens/semantic.css`)
```
--color-{role}-{modifier?}       e.g. --color-text-secondary
--space-{scale}                  e.g. --space-4
--size-control-{scale}           e.g. --size-control-md
--radius-{scale}                 e.g. --radius-control
--font-size-{scale}              e.g. --font-size-sm
--font-weight-{name}             e.g. --font-weight-medium
--shadow-{scale}                 e.g. --shadow-sm
--duration-{speed}               e.g. --duration-fast
```

### Component tokens (`src/tokens/components/{component}.css`)
```
--{component}-{part}-{css-property}              (default state)
--{component}-{part}-hover-{css-property}        (hover state)
--{component}-{part}-active-{css-property}       (pressed state)
--{component}-{part}-disabled-{css-property}     (disabled state)
--{component}-{part}-focus-{css-property}        (focus state)
```

Examples:
```css
--button-root-background:         var(--color-accent);
--button-root-hover-background:   var(--color-accent-hover);
--button-label-color:             var(--color-accent-foreground);
--button-root-disabled-opacity:   0.5;
--input-root-border-color:        var(--color-border-default);
--input-root-focus-border-color:  var(--color-border-focus);
```

Rules:
- Component tokens always reference semantic tokens (`var(--color-*)`) — never raw values.
- Semantic tokens always use `oklch()` values — never hex, hsl, or rgb.
- If a Figma-linked token doesn't match an existing semantic token, add the semantic token first, then reference it.
- Scope component tokens inside the component's selector or a `[data-component="name"]` attribute to avoid bleed.

---

## 8. Tailwind Classes vs CSS Custom Properties

Use **Tailwind utility classes** for:
- Layout (flexbox, grid, padding, margin, gap)
- Typography (font-size, font-weight, line-height, tracking)
- Responsive breakpoints
- Hover/focus/active states that are uniform across all variants

Use **CSS custom properties** for:
- Any value that changes between Figma variants or themes
- Any value that comes directly from a Figma-linked token
- Colors, border-colors, background-colors that differ per variant/state

Use **inline CVA variant classes** (via `cn(componentVariants({...}))`) for combining the above — never string-interpolate variant values into class names.

---

## 9. Compound Components

When a Figma component has named sub-parts (e.g. Card.Header, Card.Body, Card.Footer), model them as compound components:

```tsx
const Card = React.forwardRef<...>(...)
Card.displayName = "Card"

const CardHeader = React.forwardRef<...>(...)
CardHeader.displayName = "CardHeader"

// Export as namespace
export { Card, CardHeader, CardBody, CardFooter }
```

Each sub-part has its own CVA function if it has variants. The parent passes context via Radix context or React context only if child behaviour depends on parent state (e.g. a selected tab controlling panel visibility).

---

## 10. Accessibility

- **Let Radix handle all ARIA attributes** it is designed to manage. Do not add `aria-expanded`, `aria-selected`, `aria-controls` etc. manually if the Radix primitive already manages them.
- **Do** pass `aria-label` or `aria-labelledby` props through when a visible label is absent (e.g. icon-only buttons).
- **Always** use `focus-visible:` not `focus:` for focus ring styles — this respects keyboard-only focus.
- **Never** remove the focus ring without replacing it (`outline-none` without an alternative is a violation).
- **Do** support `asChild` via Radix `Slot` when the component should render as a different element (e.g. a Button that renders as a link).

---

## 11. TypeScript

- Strict mode is on. No `any`. No `@ts-ignore` without a code comment explaining why.
- Use `React.ComponentPropsWithoutRef<>` for prop types that extend native/Radix elements — not `HTMLAttributes` directly.
- Use `React.ElementRef<>` for the ref type in `forwardRef`.
- Export prop interfaces so consumers can type their own wrappers.
- `VariantProps<typeof variantFn>` should always be intersected into the component's prop interface.

---

## 12. What NOT to Do

- Do not build a component without reading the full Figma spec first.
- Do not hardcode color values — always trace back to a token.
- Do not add props that aren't in the Figma design (no speculative API surface).
- Do not write custom focus/hover/active logic when Radix or CSS handles it.
- Do not create abstractions shared by only one component.
- Do not use `shadcn` CLI to add components — this repo builds from primitives directly.
- Do not use `@apply` in component token files — raw CSS custom properties only.
- Do not skip `displayName` — it breaks React DevTools and error messages.
- Do not use default exports for components — named exports only.
