# Requirements Analysis — Text Input Component

**Depth**: Minimal (intent is clear; token spec is the source of truth)
**Date**: 2026-05-20

---

## Intent

Create a Text Input component:
1. **Pass 1** — Design the component in Figma on the Text Input page with all sizes, states, and icon slots bound to existing component tokens.
2. **Pass 2** — Implement as a Radix UI code component (React) after Pass 1 is approved.

---

## Functional Requirements

### Component surface (derived from `src/tokens/components/text-input.css`)

| Dimension | Values |
|---|---|
| Size | SM (32px), MD (40px), LG (48px) |
| State | Default, Hover, Focused, Error, Success, Disabled |
| Leading Icon | Optional — boolean slot |
| Trailing Icon | Optional — boolean slot |

### States defined by tokens

| State | Token(s) |
|---|---|
| Default | `--text-input-color-border`, `--text-input-color-background`, `--text-input-color-foreground` |
| Hover | `--text-input-color-hover/border` |
| Focused | `--text-input-color-focus/border` |
| Error | `--text-input-color-error/border`, `--text-input-color-error/foreground` |
| Success | `--text-input-color-success/border`, `--text-input-color-success/foreground` |
| Disabled | `--text-input-color-disabled/background`, `--text-input-color-disabled/foreground`, `--text-input-color-disabled/placeholder`, `--text-input-color-disabled/border` |

### Component parts (layers)

| Layer | Token binding |
|---|---|
| Container frame | background, border, radius, border-width |
| Value text | foreground |
| Placeholder text | placeholder |
| Leading Icon | icon, icon-size, icon-gap |
| Trailing Icon | icon, icon-size, icon-gap |

### Sizes defined by tokens

| Size | Height token | Padding-X token | Padding-Y token |
|---|---|---|---|
| SM | `--text-input-space-sm-height` | `--text-input-space-sm-padding-x` | `--text-input-space-sm-padding-y` |
| MD | `--text-input-space-md-height` | `--text-input-space-md-padding-x` | `--text-input-space-md-padding-y` |
| LG | `--text-input-space-lg-height` | `--text-input-space-lg-padding-x` | `--text-input-space-lg-padding-y` |

---

## Known Token Issue

**Bug:** `text-input/color/placeholder` and `text-input/color/icon` in Figma are currently aliased to `border/focus` (`--colors-arctic-blue-500`, bright blue) instead of `foreground/muted` (`--colors-steel-grey-500`).

- The variable *descriptions* in Figma correctly state "resolves to foreground/muted"
- The variable *aliases* are incorrectly bound to `border/focus`
- This is reflected in `src/tokens/components/text-input.css`: both variables resolve to `var(--border-focus)`

**Resolution**: Fix the alias in Figma during Pass 1, then re-export to update the CSS token file.

---

## Non-Functional Requirements

- All Figma values bound to component tokens — no raw hex or px values
- Code component uses `<input>` native element — no Radix primitive exists for text input
- All component tokens consumed via CSS class rules — no Tailwind colour utilities
- TypeScript strict — `React.forwardRef`, `VariantProps<>`, named exports only
- Five-story Storybook pattern (Default, Variants, States, Sizes, AllVariants)
- Playground preview registered in `src/playground/index.tsx`
- `npm run typecheck` passes clean before Done

---

## Assumptions

- No label above the input — label is a consumer responsibility, not part of the base component
- No helper/error text below the input — inline status is shown via border colour only; message text is a consumer responsibility
- No clear (×) button — not modelled in tokens, out of scope
- Icon size is uniform across sizes — single `icon-size` token (not per-size)
- "Variant" is not a CVA dimension — Text Input has one visual form with sizes and states only
