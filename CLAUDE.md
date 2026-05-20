# Sparks Design System

See @.claude/aidlc-lite-workflow.md for the AI-DLC Lite workflow.

## AI-DLC Lite: Design System Workflow

This project follows AI-DLC Lite for all component work. For design system components, the Construction phase always follows a two-pass pattern. Each pass uses an orchestrator that autonomously loops through build, audit, and repair until clean before surfacing for human review.

**Pass 1 — Figma design (invoke `design-systems:figma-create-component-orchestrator`):**
- Autonomous loop: creates missing tokens, builds the component, audits, repairs, re-audits until clean (max 3 passes)
- Internally calls `figma-variables-and-styles`, `figma-components`, `figma-component-audit`, and `figma-repair`
- Before presenting for approval, run final independent audits and include all results in the approval message:
  - `design-systems:figma-component-audit` — final check on variants, states, and structure
  - `design-systems:figma-token-audit` — final check on three-tier token architecture
  - `design-systems:figma-token-audit-brad-frost` — final check on Subatomic token principles
- If any final audit finds issues: invoke `design-systems:figma-repair` with the issue report, then re-run the failed audit before presenting for approval

**Approval gate 1 — human reviews the Figma component and all audit results. Do not proceed to code until explicitly approved.**

**Pass 2 — Code implementation (invoke `design-systems:figma-to-code-orchestrator`):**
- Autonomous loop: implements the component in code, audits parity, repairs, re-audits until clean (max 3 passes)
- Internally calls `design-systems:code-build-component` and `design-systems:design-to-code-parity`
- All values must reference design tokens — never hardcode
- Follow the component rules in this file
- Before presenting for approval, run final independent audits and include all results in the approval message:
  - `design-systems:design-to-code-parity` — final check that implementation matches the Figma design
  - `token-auditor` — final check that no raw values appear in CSS token files
- If any final audit finds issues: fix via `design-systems:code-build-component` or direct edits, then re-run the failed audit before presenting for approval

**Approval gate 2 — human reviews the code implementation and all audit results. Do not run the Definition of Done checklist or update knowledge synthesis until explicitly approved.**

**Token and style work outside a component build (invoke `design-systems:figma-variables-and-styles`):**
- Use for any standalone token or style task: creating a new semantic token, renaming a collection, adding a text style, updating a variable value
- This is not part of the component build flow — invoke it directly when the task is token- or style-specific

**How to start a component intent:**

```
Using AI-DLC Lite, create a [ComponentName] component: design it on the Figma canvas
with all variants and states bound to existing tokens, then once approved implement it
as a Radix UI code component.
```

### Definition of Done

A component is not complete until every item below is checked. Do not close the Construction phase or mark the intent complete until all pass.

- [ ] Figma component: all variants present, all states covered, every token bound (no raw values)
- [ ] Code component: all CVA variants implemented, all states handled via CSS/Radix data attributes
- [ ] Storybook stories: five-story pattern complete (Default, Variants, States, Sizes, AllVariants)
- [ ] Playground preview: added to `src/playground/previews/` and registered in `src/playground/index.tsx`
- [ ] TypeScript: `npm run typecheck` passes clean
- [ ] Accessibility: Storybook a11y panel shows no violations on the Default story
- [ ] Audit trail: `aidlc-docs/audit.md` updated with completion entry
- [ ] **Knowledge synthesis: `aidlc-docs/inception/system-overview.md` updated to reflect the new component** — this is the last step and must not be skipped

A component library that converts Figma designs — with component tokens — into production-ready React components built on Radix UI primitives. Each component is built directly from a Figma source: no manual interpretation, full token parity, full variant coverage.

## Getting started

```bash
npm install
npm run dev          # dev server at localhost:5173 (also runs sync-tokens first)
npm run storybook    # Storybook at localhost:6006
npm run build        # production build
npm run typecheck    # type-check without building
npm run sync-tokens  # regenerate src/tokens/index.css after a Figma token export
npm run test-storybook  # run a11y + visual tests against a running Storybook
```

## Structure

```
src/
├── components/ui/{name}/   one folder per component
│   ├── {name}.tsx           component implementation
│   ├── {name}.css           component CSS class rules (developer-owned — never overwritten by exports)
│   ├── {name}.stories.tsx   Storybook stories
│   └── index.ts             re-exports only
├── tokens/                  Figma-owned — safe to replace entirely on every export
│   ├── index.css            auto-generated by scripts/sync-token-imports.mjs — do not edit
│   ├── primitives.css       raw oklch values
│   ├── semantic-colours.css role-based colour aliases → primitives (includes Light + Dark modes)
│   ├── semantic-space.css   spacing/sizing aliases → primitives
│   ├── semantic-typography.css typography aliases → primitives
│   ├── semantic-effects.css shadow geometry variables (:root only, no modes)
│   ├── semantic-effect-styles.css  .es-{name} utility classes — apply drop shadows, filters
│   └── components/
│       └── {name}.css       component token variables (:root only) → semantic tokens
└── index.css                single @import "@/tokens/index.css" + Tailwind bridge
```

**Token ownership split — critical:**
- `src/tokens/` is owned by Figma. Drop in a fresh export and run `npm run sync-tokens`. Never hand-edit these files.
- `src/components/ui/{name}/{name}.css` is developer-owned. Contains the CSS class rules (`.button-primary { ... }`) that apply the tokens. Import it at the top of `{name}.tsx` with `import "./{name}.css"`. This file survives token exports unchanged.

Components are built using Radix UI primitives, styled with Tailwind v4 utility classes, and use CVA (class-variance-authority) for variant logic. Tokens flow: primitives → semantic → component variables → CSS class rules.

## Token workflow — Figma is the source of truth

All token work (variables, text styles, component tokens) must originate in Figma, not in the codebase. The correct workflow is:

1. **Make changes in Figma** — create or update variables, text styles, and component token values using the Figma MCP tools.
2. **Export tokens from Figma** — this drops fresh CSS into `src/tokens/`.
3. **Run `npm run sync-tokens`** (or just `npm run dev`) — regenerates `src/tokens/index.css` so new files are picked up.
4. **Write component CSS class rules** in `src/components/ui/{name}/{name}.css` — these consume the tokens and are the only token-related files you should edit directly.

**Never directly edit any file in `src/tokens/`** — they are auto-generated and will be overwritten on the next Figma export. If a token value looks wrong in code, fix it in Figma and re-export; do not patch the CSS by hand.

### Effect styles — applying shadows and filters

Drop shadows, inner shadows, layer blurs, and background blurs are applied via `.es-{name}` utility classes generated from Figma's local effect styles. They live in `src/tokens/semantic-effect-styles.css` and are auto-imported by `src/tokens/index.css`.

**Never write `box-shadow`, `filter`, or `backdrop-filter` inside a component's own CSS rule.** Add the `.es-{name}` class to the element's `className` instead:

```tsx
// ✅ Effect style as a utility class alongside base and layout classes
<div className={cn("card es-shadow-raised flex flex-col overflow-hidden", className)} />

// ❌ Shadow hardcoded in component CSS
.card { box-shadow: 0px 2px 8px 0px oklch(...); }
```

The class name derives from the full Figma effect style path — slashes and spaces become hyphens, all lowercase, `es-` prefix:

```
Shadow/Raised   →   .es-shadow-raised
Shadow/Overlay  →   .es-shadow-overlay
Shadow/Focus    →   .es-shadow-focus
```

**Shadow colors and dark mode:** Shadow color variables live in `semantic-colours.css` with Light and Dark modes (dark mode uses white at low opacity rather than the near-black used in light mode). Shadow geometry (x, y, blur, spread) lives in `semantic-effects.css` without modes — geometry doesn't change between themes. This means dark mode shadow switching is fully automatic via the token cascade with no component code changes.

### Font name translation

Figma uses short display names for font families ("Inter", "Playfair Display"). The `@fontsource-variable` npm packages register font faces with a "Variable" suffix ("Inter Variable"). These are different CSS `font-family` names — the browser will silently fall back to the system font if they don't match.

`scripts/sync-token-imports.mjs` maintains a `FONT_FAMILY_MAP` that auto-corrects this on every `npm run sync-tokens`. The script scans all token CSS files for font-family values matching a Figma name and appends a `:root {}` correction block to `src/tokens/index.css`.

To add a new variable font:
1. Install the package: `npm install @fontsource-variable/{name}`
2. Import it in `src/index.css`: `@import "@fontsource-variable/{name}"`
3. Add an entry to `FONT_FAMILY_MAP` in `scripts/sync-token-imports.mjs`:
   ```js
   "Figma Name": "'Figma Name Variable', fallback-stack",
   ```
4. Run `npm run sync-tokens` — the correction will appear in `src/tokens/index.css`

Never add a manual `:root` override for font names to `src/index.css` — the sync script owns this.

To add a new component: read the Figma component fully via MCP, then follow the rules below.

## Light/dark mode

Theme switching is driven entirely by a single HTML attribute: `data-theme="dark"` on `<html>`. No class toggling, no JavaScript token swaps.

### How the cascade works

```
primitives.css          — raw oklch values, never change between themes
semantic-colours.css    — :root { --background-default: var(--colors-steel-grey-50) }
src/index.css           — [data-theme="dark"] { --background-default: var(--colors-steel-grey-950) }
components/*.css        — references semantic tokens, unaware of theme
CSS class rules         — .button-primary { background-color: var(--button-color-...) }
```

Setting `data-theme="dark"` on `<html>` makes the `[data-theme="dark"]` block in `src/index.css` override the semantic tokens. Every component token and CSS class that references a semantic token updates automatically — no component code changes needed.

### Adding dark mode overrides for a new semantic token

Add the override to the `[data-theme="dark"]` block in `src/index.css`:

```css
[data-theme="dark"] {
  --your-new-semantic-token: var(--colors-something-dark);
}
```

The goal is to keep this block temporary. Once the Figma token export plugin generates `[data-theme="dark"]` blocks natively inside `semantic-colours.css`, this block in `src/index.css` can be deleted — the plugin output takes over.

### Toggling theme in code

**Playground** (`src/playground/index.tsx`): maintains a `theme` state, sets/deletes `document.documentElement.dataset.theme` in a `useEffect`.

**Storybook** (`.storybook/preview.ts`): a `globalTypes.theme` toolbar entry (sun/moon icons) drives a decorator that sets/deletes `document.documentElement.dataset.theme` before each story renders.

Both use the identical mechanism — setting the attribute — so the token cascade behaves the same in both environments.

### The `@custom-variant dark` line

```css
@custom-variant dark (&:is([data-theme="dark"] *));
```

This is in `src/index.css` to enable a `dark:` Tailwind prefix if needed for layout-level dark mode changes (e.g. `dark:hidden`). It is **not** used for colour — colour always goes through token variables, never Tailwind colour utilities.

---

## Component rules

*The sections below govern how every component in this repo is built — by humans and AI alike.*

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
│           ├── {component-name}.css       # CSS class rules — imported by the .tsx file
│           ├── {component-name}.types.ts  # types (only if they're non-trivial)
│           └── index.ts                   # re-exports only
├── tokens/
│   ├── index.css                          # auto-generated — do not edit
│   ├── primitives.css                     # raw values (Figma export)
│   ├── semantic-*.css                     # semantic aliases (Figma export)
│   └── components/
│       └── {component-name}.css           # :root variables only (Figma export)
└── index.css                              # @import "@/tokens/index.css" + Tailwind bridge
```

Rules:
- One component (or tightly-related compound component) per folder.
- `index.ts` only re-exports — no logic.
- The component `.css` file is imported directly in the `.tsx` file: `import "./{name}.css"` — not via `index.css`.
- `src/tokens/index.css` is auto-generated by `npm run sync-tokens` — never edit it or add manual `@import` lines to `src/index.css`.
- Component token files in `src/tokens/components/` contain **only** `:root {}` variable definitions — no class rules.

---

## 4. Wiring Up a Component When Tokens Already Exist

When `src/tokens/components/{name}.css` already exists from a Figma export, do the following before writing any component code:

1. **Read the token file** — scan every `--{name}-*` variable to understand what variants, states, and sizes are modelled. Do not guess variant names; derive them from the token names.
2. **Infer the variant surface** — token names like `--button-color-primary-*`, `--button-color-secondary-*` mean `variant: { primary, secondary }`. Token names like `--button-space-sm-*`, `--button-space-md-*` mean `size: { sm, md, lg }`.
3. **Write the component `.css` class rules** in `src/components/ui/{name}/{name}.css` — one class per variant, with state pseudo-classes (`:hover`, `:active`, `:disabled`, `[data-disabled]`) referencing the matching tokens.
4. **Import the CSS** at the top of `{name}.tsx`: `import "./{name}.css"`
5. **Write the CVA variants** using the class names defined in step 3.

### Inferring class rules from token names

Token naming follows a strict pattern — the class rule structure mirrors it directly:

```
--button-color-primary-background       → .button-primary { background-color: var(--button-color-primary-background) }
--button-color-primary-hover-background → .button-primary:hover { background-color: var(...) }
--button-color-primary-disabled-background → .button-primary:disabled, .button-primary[data-disabled] { background-color: var(...) }
--button-space-sm-height                → .button-size-sm { height: var(--button-space-sm-height) }
--button-radius                         → applied to all variant classes
--button-border-width                   → applied to all variant classes
```

If a token exists, a corresponding CSS rule must exist. Do not skip tokens that are present in the file.

---

## 5. Component Code Pattern

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

### Why Figma's State property does not become a `state` prop

Figma has a `State` property (Default, Hover, Pressed, Focused, Disabled, Loading) because Figma cannot simulate browser pseudo-classes natively — it needs explicit variants to show what each state looks like. This is a design tool affordance, not a behavioural API.

In code, the browser manages hover, active, and focus automatically via CSS pseudo-classes. Adding a `state` prop would produce a button that *looks* hovered but isn't — synthetic and misleading for keyboard users, touch users, and assistive tech.

| Figma State | Code mechanism | Why |
|---|---|---|
| Default | — (implicit) | CSS base styles |
| Hover | `:hover` in CSS | Browser-native |
| Pressed | `:active` in CSS | Browser-native |
| Focused | `:focus-visible` in CSS | Browser-native |
| Disabled | `disabled` prop | App-controlled — browser has no way to derive it |
| Loading | `loading` prop | App-controlled — no CSS pseudo-class exists |

`disabled` and `loading` are the only legitimate props because they represent app-controlled logical state. In Storybook, a `state` select control on the Default story is used to force visual states for design QA — it is a story-only arg, not a component prop.

---

## 6. State Mapping: Figma States → CSS

Map Figma states to the correct CSS mechanism. Do not invent custom classes for states Radix or CSS already handles.

| Figma state | Mechanism | Where it lives |
|---|---|---|
| Hover (colour change) | `.component-variant:hover {}` | `src/components/ui/{name}/{name}.css` |
| Hover (layout change) | `hover:shadow-md` etc. | Tailwind prefix, fine here |
| Pressed / Active (colour) | `.component-variant:active {}` | `src/components/ui/{name}/{name}.css` |
| Focused (ring/outline) | `focus-visible:ring-2` etc. | Tailwind prefix, fine here |
| Disabled | `.component-variant[data-disabled]` or `:disabled` | `src/components/ui/{name}/{name}.css` |
| Open | `data-[state=open]:` | Tailwind prefix or CSS |
| Checked | `data-[state=checked]:` | Tailwind prefix or CSS |
| Selected | `data-[highlighted]:` | Tailwind prefix or CSS |
| Loading | `data-loading` attribute | CSS `[data-loading]` selector |

Colour changes always live in the CSS file. Structural/layout state changes (shadow, ring, outline, transform) can use Tailwind prefixes.

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

Token names mirror the Figma variable names exactly — slashes become hyphens, prefixed with `--`. This means a Figma export drops straight in with zero renaming.

```
Figma variable                             CSS custom property
──────────────────────────────────────────────────────────────
button/color/primary/background        →   --button-color-primary-background
button/color/primary/hover/background  →   --button-color-primary-hover-background
button/color/primary/text              →   --button-color-primary-text
button/color/primary/disabled/background → --button-color-primary-disabled-background
button/radius                          →   --button-radius
input/color/border/default             →   --input-color-border-default
input/color/border/focus               →   --input-color-border-focus
```

The component CSS file defines both the custom properties AND the variant classes that apply them:

```css
/* src/tokens/components/button.css */

/* Token definitions — values reference semantic tokens, never raw */
:root {
  --button-color-primary-background:          var(--color-accent);
  --button-color-primary-hover-background:    var(--color-accent-hover);
  --button-color-primary-text:                var(--color-accent-foreground);
  --button-color-primary-disabled-background: var(--color-accent-subtle);
  --button-color-primary-disabled-text:       var(--color-text-disabled);
  --button-radius:                            var(--radius-control);
}

/* Variant classes — applied by CVA, reference only the tokens above */
.button-primary {
  background-color: var(--button-color-primary-background);
  color:            var(--button-color-primary-text);
  border-radius:    var(--button-radius);
}
.button-primary:hover {
  background-color: var(--button-color-primary-hover-background);
}
.button-primary[data-disabled],
.button-primary:disabled {
  background-color: var(--button-color-primary-disabled-background);
  color:            var(--button-color-primary-disabled-text);
}
```

Rules:
- Component tokens always reference semantic tokens (`var(--color-*)`) — never raw values.
- Semantic tokens always use `oklch()` values — never hex, hsl, or rgb.
- If a Figma-linked token doesn't match an existing semantic token, add the semantic token first, then reference it.
- Token names must match the Figma variable name exactly (slashes → hyphens). This is the contract that makes Figma exports drop-in replaceable.
- When Figma tokens are exported and updated, only the `:root {}` block changes — the variant classes never need to change.

---

## 8. Tailwind vs Plain CSS — The Hard Split

This is a strict rule, not a guideline. Mixing Tailwind colour utilities with CSS custom properties causes specificity fights (the same problem that makes shadcn hard to override). Avoid it from the start by keeping Tailwind and CSS in completely separate lanes.

### Tailwind handles: layout only

```
flex, grid, inline-flex     — display and flow
items-center, justify-*     — alignment
gap-*, p-*, px-*, py-*      — spacing (only when NOT token-driven)
w-*, h-*, min-w-*, max-w-*  — sizing
font-medium, text-sm        — typography scale
transition-colors           — transition utility
truncate, overflow-hidden   — text/overflow helpers
sr-only                     — screen reader visibility
```

### Plain CSS (in component token files) handles: everything visual

```
background-color    — always via var(--token)
color               — always via var(--token)
border-color        — always via var(--token)
border-radius       — always via var(--token)
box-shadow          — always via var(--token)
opacity             — always via var(--token) if token-driven
```

**Never use Tailwind colour utilities** (`bg-*`, `text-*`, `border-*`, `ring-*`) inside component variant definitions. They are not wrong in principle — they are wrong here because they create a two-source-of-truth problem: the Figma token export updates the CSS var but the Tailwind class still wins in the cascade.

### How CVA variant classes work under this rule

CVA variant values are CSS class names defined in the component token file, not Tailwind utilities:

```tsx
// ✅ Correct — CVA variant points to a CSS class from the token file
const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium transition-colors",
  {
    variants: {
      variant: {
        primary:     "button-primary",     // ← defined in button.css
        secondary:   "button-secondary",   // ← defined in button.css
        destructive: "button-destructive", // ← defined in button.css
      },
      size: {
        sm: "h-8 px-3 text-sm gap-1.5",   // ← layout only, Tailwind fine here
        md: "h-10 px-4 text-sm gap-2",
        lg: "h-12 px-5 text-base gap-2",
      },
    },
  }
)

// ❌ Wrong — Tailwind colour utility in a variant
primary: "bg-blue-500 text-white hover:bg-blue-600"
```

### State changes (hover, active, disabled) belong in CSS

Hover and active colour changes are token-driven, so they live in the CSS class alongside the base state — not as Tailwind `hover:` prefixes:

```css
/* ✅ Correct — state colours live in the CSS class */
.button-primary:hover        { background-color: var(--button-color-primary-hover-background); }
.button-primary:active       { background-color: var(--button-color-primary-active-background); }
.button-primary[data-disabled] { background-color: var(--button-color-primary-disabled-background); }

/* ❌ Wrong — Tailwind hover prefix on a colour */
/* hover:bg-blue-600 */
```

Tailwind `hover:` and `focus-visible:` prefixes are still fine for layout-level state changes (e.g. `hover:shadow-md`, `focus-visible:ring-2`) — just not for colour.

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

## 10. Extending Radix Components

**Radix owns behaviour. You own structure.**

Radix primitives handle keyboard navigation, focus management, ARIA state, and open/close logic. Never modify or replace that layer. Everything visual and structural around it is plain HTML and React — extend it freely.

When a Figma component has more layers than a Radix primitive provides out of the box, there are three scenarios:

### Scenario A — Extra presentational layer (subtitle, description, eyebrow, badge slot)

Add it as a new compound component part. It's just a styled element — it doesn't need Radix behind it.

```tsx
// Radix has no Card primitive — it's pure layout, build all parts yourself
<Card>
  <CardHeader>
    <CardTitle>Plan name</CardTitle>
    <CardSubtitle>Billed monthly</CardSubtitle>  {/* ← new part, just a <p> */}
  </CardHeader>
  <CardBody>...</CardBody>
</Card>
```

`CardSubtitle` is a `forwardRef` wrapping a `<p>` with its own token-driven styles. It has no Radix involvement.

### Scenario B — Extra content inside a Radix interactive part

Pass it as children. Radix primitives are open — you can put whatever you need inside a `Select.Item`, `DropdownMenu.Item`, `Dialog.Content`, etc.

```tsx
<Select.Item value="gb">
  <Flag country="gb" />                          {/* ← your addition */}
  <Select.ItemText>United Kingdom</Select.ItemText>
  <span className="text-muted-foreground">+44</span>  {/* ← your addition */}
</Select.Item>
```

No wrapping needed — just add children alongside the Radix parts.

### Scenario C — Genuinely different interaction model

If the Figma component does something no Radix primitive handles — build it from scratch using a `<div>` with the correct ARIA role. Document which ARIA pattern you followed and why no Radix primitive was suitable. This should be rare.

---

### Decision guide

| Figma has... | Approach |
|---|---|
| Extra label / text / icon slot | New compound part (`forwardRef` + styled element) |
| Richer content inside an item | Add as children of the Radix part |
| A layout-only component (Card, Page Header) | All parts are your own — no Radix needed |
| A different interaction model entirely | New component with explicit ARIA role |
| The same structure as Radix | Wrap the Radix primitive directly |

**Never fork Radix source code.** You lose upstream accessibility fixes and behaviour updates.

### Radix Popover with a custom trigger (not Popover.Trigger)

When building a component that uses `Popover.Root` with `Popover.Anchor` instead of `Popover.Trigger` — e.g. a Combobox where the input controls open state — two things will cause the dropdown to close immediately after opening:

1. **`onPointerDownOutside`** — Radix's DismissableLayer sees clicks on the anchor as "outside" the content and dismisses it.
2. **`onFocusOutside`** — focus on the input (which lives in the anchor, not the content) is treated as focus leaving the popover.

Fix both on `Popover.Content` by checking whether the interaction originated inside the trigger area. **Always use `e.detail.originalEvent.target`** — not `e.target`. Radix wraps these events in a `CustomEvent`; `e.target` is the document, not the clicked element.

```tsx
// Ref to the trigger/anchor element — set via context or prop
const triggerRef = React.useRef<HTMLDivElement | null>(null)

<Popover.Content
  onPointerDownOutside={e => {
    if (triggerRef.current?.contains(e.detail.originalEvent.target as Node)) {
      e.preventDefault()
    }
  }}
  onFocusOutside={e => {
    if (triggerRef.current?.contains(e.detail.originalEvent.target as Node)) {
      e.preventDefault()
    }
  }}
>
```

Also always set both of these to prevent Radix moving focus away from your custom input:
```tsx
onOpenAutoFocus={e => e.preventDefault()}
onCloseAutoFocus={e => e.preventDefault()}
```

### Where custom and extended components live

All design system components — whether Radix-backed, extended, or pure layout — live in `src/components/ui/`. There is no separate "custom" folder. The distinction is captured in a comment at the top of each component file, not in the folder structure.

```
src/components/ui/
├── button/           ← wraps Radix Slot + native <button>
├── card/             ← pure layout, no Radix primitive
├── card-promo/       ← extends Card with an image slot and eyebrow
└── dialog/           ← wraps Radix Dialog primitive
```

At the top of every component file, add one of these origin comments:

```tsx
// Origin: Radix primitive — @radix-ui/react-dialog
// Origin: Layout component — no Radix primitive
// Origin: Extends Card — adds image slot and eyebrow label
```

This makes it immediately clear during review and when migrating to Storybook what each component is built from, without needing to open the imports.

---

## 11. Accessibility

- **Let Radix handle all ARIA attributes** it is designed to manage. Do not add `aria-expanded`, `aria-selected`, `aria-controls` etc. manually if the Radix primitive already manages them.
- **Do** pass `aria-label` or `aria-labelledby` props through when a visible label is absent (e.g. icon-only buttons).
- **Always** use `focus-visible:` not `focus:` for focus ring styles — this respects keyboard-only focus.
- **Never** remove the focus ring without replacing it (`outline-none` without an alternative is a violation).
- **Do** support `asChild` via Radix `Slot` when the component should render as a different element (e.g. a Button that renders as a link).

---

## 12. TypeScript

- Strict mode is on. No `any`. No `@ts-ignore` without a code comment explaining why.
- Use `React.ComponentPropsWithoutRef<>` for prop types that extend native/Radix elements — not `HTMLAttributes` directly.
- Use `React.ElementRef<>` for the ref type in `forwardRef`.
- Export prop interfaces so consumers can type their own wrappers.
- `VariantProps<typeof variantFn>` should always be intersected into the component's prop interface.

---

## 13. Playground

Every component must have a preview file in `src/playground/previews/`. This is for quick visual review during development — run `npm run dev` and open localhost:5173.

### Adding a preview

1. Create `src/playground/previews/{component-name}.tsx`
2. Import it in `src/playground/index.tsx` and add it to the `previews` array

### Preview file pattern

```tsx
import { Section, Row } from "@/playground/components"
import { Button } from "@/components/ui/button"

export function ButtonPreview() {
  return (
    <Section
      title="Button"
      description="Trigger an action. Maps to the Button component in Figma."
    >
      <Row label="Variants">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="destructive">Destructive</Button>
      </Row>
      <Row label="Sizes">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </Row>
      <Row label="States">
        <Button disabled>Disabled</Button>
        <Button loading>Loading</Button>
      </Row>
    </Section>
  )
}
```

Rules:
- One `Section` per preview file — title matches the Figma component name exactly.
- One `Row` per Figma variant group (variants, sizes, states, boolean combos).
- Render every CVA variant value. If a variant isn't shown, it isn't reviewed.
- No logic in preview files — static renders only.

---

## 14. Storybook

Storybook runs at localhost:6006 (`npm run storybook`). Every component has a stories file at `src/components/ui/{name}/{name}.stories.tsx`.

### Setup

`.storybook/main.ts` requires these addons:

```ts
addons: ["@storybook/addon-docs", "@storybook/addon-a11y", "storybook-addon-pseudo-states"],
docs: { autodocs: "tag" },
```

`.storybook/preview.ts` sets global defaults:

```ts
parameters: {
  controls: { expanded: true },  // show description column in controls panel
}
```

### Image slots in stories

Components with image slots (e.g. `CardImage`) should use a `placehold.co` URL in stories so the slot looks realistic without adding binary assets to the repo:

```tsx
function ImageSlot() {
  return (
    <img
      src="https://placehold.co/320x160"
      alt=""
      className="w-full h-full object-cover"
    />
  )
}
```

Use a size that matches the component's image token (e.g. `--card-image-height`). The playground preview can keep a grey `<div>` placeholder — it's honest about the slot being empty and doesn't need to look realistic.

### Five-story pattern

Every component gets exactly these five stories, in this order:

| Story | Purpose |
|---|---|
| **Default** | Playground — all controls live, mirrors Figma property panel |
| **Variants** | All variants at MD size, default state |
| **States** | One variant (primary) at MD, all 6 Figma states |
| **Sizes** | One variant (primary), all sizes, default state |
| **AllVariants** | Full matrix — every variant × size × state |

Each story isolates one dimension so design QA can verify each axis against Figma independently.

### Meta pattern

Use `Meta<typeof Component>` — not an intersection type — so autodocs can extract the prop table correctly. Add `tags: ["autodocs"]` to generate the Docs page.

```ts
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
      options: [...],
      description: "Visual style — Figma: Variant",
    },
    // Hide internal/structural props from the controls panel
    asChild: { table: { disable: true } },
  },
}
```

### argTypes description convention

Every argType description must include the Figma property name it maps to:

```ts
description: "Button text content — Figma: Label"
description: "Visual style — Figma: Variant"
description: "Height (32/40/48px) — Figma: Size"
description: "Interactive state — Figma: State"
```

This is the Figma ↔ code bridge visible in the controls panel and autodocs table.

### state as a story-only arg

The Default story exposes a `state` select control (default / hover / pressed / focused / disabled / loading) that mirrors Figma's State property. This is NOT a component prop — it is a story-only arg that maps to pseudo-state classes and `disabled`/`loading` props at render time.

Keep `state` out of the meta `args` and `argTypes`. Define it only on the Default story to avoid polluting the autodocs prop table.

```ts
export const Default: Story = {
  argTypes: {
    state: {
      control: "select",
      options: ["default", "hover", "pressed", "focused", "disabled", "loading"],
      description: "Interactive state — Figma: State",
    },
  },
  args: { state: "default" } as Record<string, unknown>,
  render: ({ className, ...args }: React.ComponentProps<typeof Button> & { state?: StoryState }) => {
    const state = (args as unknown as { state: StoryState }).state ?? "default"
    return (
      <Button
        {...args}
        disabled={state === "disabled"}
        loading={state === "loading"}
        className={[stateClassMap[state], className].filter(Boolean).join(" ")}
      />
    )
  },
}
```

### Forcing pseudo-states with storybook-addon-pseudo-states

The addon forces real CSS pseudo-classes via class selectors — no synthetic state prop needed. Declare the mapping in `parameters.pseudo` on the meta so it applies to all stories:

```ts
parameters: {
  pseudo: {
    hover:        ".force-hover",
    active:       ".force-active",
    focusVisible: ".force-focus",
  },
}
```

Then apply the class to individual buttons in static stories:

```tsx
<Button variant="primary" className="force-hover">Button</Button>
<Button variant="primary" className="force-active">Button</Button>
<Button variant="primary" className="force-focus">Button</Button>
```

The addon injects CSS that makes `.button-primary.force-hover` pick up the same styles as `.button-primary:hover` — so you get real visual states without touching the component.

### Static stories

All stories except Default use `parameters: { controls: { disable: true } }` and a custom `render` function. They are purely visual — no controls, no interaction. Variant/state labels use small muted text beneath each button.

### Theme toggle

The Storybook toolbar has a sun/moon toggle (defined in `.storybook/preview.ts` via `globalTypes.theme`). It sets `data-theme="dark"` on `<html>` via a global decorator — the same mechanism as the playground. Stories do not need any per-story dark mode wiring; the decorator handles it globally.

### Accessibility panel

`@storybook/addon-a11y` runs axe-core automatically on every story (`manual: false` in `preview.ts`). Check the **Accessibility** tab in the addons panel at the bottom — it only appears when viewing a Story, not the Docs page.

### Automated testing with test-runner

`@storybook/test-runner` + `axe-playwright` runs all stories headlessly and fails the suite on any axe violation. Configuration lives in `.storybook/test-runner.ts`.

Requires Storybook to be running first:

```bash
# Terminal 1
npm run storybook

# Terminal 2
npm run test-storybook
```

Each story is visited by Playwright, axe is injected, and violations produce a detailed HTML report. This is the CI gate for accessibility — the in-browser panel is for development feedback, the test-runner is for pass/fail enforcement.

---

## 15. What NOT to Do

- Do not build a component without reading the full Figma spec first.
- Do not hardcode color values — always trace back to a token.
- Do not add props that aren't in the Figma design (no speculative API surface).
- Do not write custom focus/hover/active logic when Radix or CSS handles it.
- Do not create abstractions shared by only one component.
- Do not use `shadcn` CLI to add components — this repo builds from primitives directly.
- Do not use `@apply` in component token files — raw CSS custom properties only.
- Do not skip `displayName` — it breaks React DevTools and error messages.
- Do not use default exports for components — named exports only.
- Do not add a `state` prop to components — hover/active/focus are browser-native; only `disabled` and `loading` are legitimate props.
- Do not use `Meta<typeof Component & { extraArg: T }>` intersections — it breaks autodocs prop extraction. Story-only args belong on the individual story, not the meta.
- Do not use Tailwind `hover:bg-*` or similar colour utilities in Storybook stories to fake states — use `storybook-addon-pseudo-states` class selectors instead.

.