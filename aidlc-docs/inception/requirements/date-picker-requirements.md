# Date Picker — Requirements

Generated: 2026-05-23
Depth: Standard

---

## Intent

Build a production-ready Date Picker component for the Sparks Design System. The component must be fully accessible, entirely styled through the token system, and visually consistent with the existing component library (matching Text Input for the trigger, matching Dropdown Menu / Card for the popover surface).

---

## Functional Requirements

| # | Requirement |
|---|---|
| FR1 | Single date selection only |
| FR2 | Date + time selection — a time input section appears below the calendar grid |
| FR3 | Trigger is a full-width text input with a trailing calendar icon — inherits Text Input styling |
| FR4 | Clicking the trigger opens a calendar popover anchored below the input |
| FR5 | Calendar displays one month at a time with prev/next navigation buttons |
| FR6 | Selected date is highlighted using the accent colour token |
| FR7 | Today's date has a visual indicator (dot or underline) distinct from selected |
| FR8 | Days outside the current month are shown in a muted state |
| FR9 | Time input accepts hours and minutes with AM/PM toggle |
| FR10 | Selecting a date + time composes an ISO 8601 datetime string as the component value |
| FR11 | Popover closes on date selection when no time section is present; stays open while user sets time |
| FR12 | Keyboard-navigable: arrow keys move between days, Page Up/Down changes month, Home/End move to week start/end, Enter/Space selects |
| FR13 | Escape closes the popover and returns focus to the trigger |
| FR14 | Clicking outside the popover closes it |
| FR15 | Component accepts `value` and `onChange` for controlled usage; `defaultValue` for uncontrolled |
| FR16 | Component accepts `placeholder` prop for the trigger input |
| FR17 | Component accepts `disabled` prop — trigger renders disabled, popover cannot be opened |
| FR18 | Component accepts `size` prop (SM / MD / LG) affecting the trigger height |
| FR19 | No min/max date constraints in v1 — can be added in a future pass |

---

## Non-Functional Requirements

| # | Requirement |
|---|---|
| NFR1 | WCAG 2.1 AA compliant — calendar grid uses correct ARIA grid role, day buttons have aria-label with full date string, selected and today states are announced by screen readers |
| NFR2 | All visual values reference design tokens — no hardcoded colours, spacing, radius, or shadow values |
| NFR3 | Component tokens in src/tokens/components/date-picker.css are Figma-export-safe (`:root` only, no class rules) |
| NFR4 | Dark mode works automatically via token cascade — no component code changes required |
| NFR5 | Sustainable dependencies — libraries must be actively maintained and widely adopted |
| NFR6 | Tree-shakeable — only the parts of date-fns and react-day-picker consumed are bundled |
| NFR7 | TypeScript strict — no `any`, full prop interface exported for consumer use |

---

## Library Decisions

### react-day-picker v9
**Role**: Calendar grid rendering and keyboard navigation.
**Why**: 12M+ weekly downloads; maintained since 2014; v9 custom-components API gives 100% render control — every day cell, nav button, and caption is our own element; handles WCAG 2.1 ARIA grid pattern and keyboard nav (arrow keys, Page Up/Down, Home/End, Enter) so we don't build that from scratch.
**Note**: Used in custom-components mode only — react-day-picker provides zero CSS in this mode.

### date-fns v4
**Role**: Date formatting (display string in trigger), parsing (string → Date object for value).
**Why**: Zero dependencies, fully tree-shakeable, no global state, TypeScript-first, the de facto standard for date utilities in the React ecosystem.

### @radix-ui/react-popover (already installed)
**Role**: Popover layer — open/close state, portal mounting, focus trapping, ARIA attributes, dismiss on outside click/Escape.
**Why**: Already installed and used by Dropdown Menu; battle-tested; consistent with existing architecture.

### lucide-react (already installed)
**Role**: Calendar icon in the trigger, chevron icons in the calendar nav buttons.
**Why**: Already installed and used across the design system.

---

## Figma Component Structure

### Pages
All work happens on a new page: `Date Picker`

### Published component
| Component | Description |
|---|---|
| `Date Picker` | The trigger — a full-width text input with calendar icon |

### Private sub-components (prefixed with `.`)
| Component | Description |
|---|---|
| `Date Picker/.Calendar` | The popover panel — background, border, shadow, radius |
| `Date Picker/.Calendar Header` | Month/year label + prev/next nav buttons |
| `Date Picker/.Calendar Week Header` | Row of short day names (Mo, Tu, We...) |
| `Date Picker/.Calendar Day` | Individual day cell — all visual states |
| `Date Picker/.Time Picker` | Hour/minute inputs + AM/PM toggle below the calendar |

### Trigger variants
| Property | Values |
|---|---|
| Size | SM, MD, LG |
| State | Default, Hover, Focused, Filled, Open, Error, Disabled |

### Calendar Day variants
| Property | Values |
|---|---|
| State | Default, Hover, Selected, Today, Outside Month, Disabled |

---

## Token Strategy

### New component token file: `src/tokens/components/date-picker.css`

The trigger reuses Text Input semantic tokens for input-related values and adds its own tokens for calendar-specific styles.

| Token group | Maps to |
|---|---|
| `date-picker/trigger/color/*` | Text Input semantic tokens (background, border, text, placeholder, icon) |
| `date-picker/calendar/background` | `var(--background-raised)` |
| `date-picker/calendar/border` | `var(--border-default)` |
| `date-picker/calendar/radius` | `var(--radius-popover)` |
| `date-picker/calendar/shadow` | effect style (es-shadow-overlay) |
| `date-picker/day/color/selected/background` | `var(--color-accent)` |
| `date-picker/day/color/selected/text` | `var(--color-accent-foreground)` |
| `date-picker/day/color/hover/background` | `var(--background-secondary-subtle)` |
| `date-picker/day/color/today/indicator` | `var(--color-accent)` |
| `date-picker/day/color/outside/text` | `var(--foreground-muted)` |
| `date-picker/day/color/disabled/text` | `var(--foreground-disabled)` |
| `date-picker/day/radius` | `var(--radius-control-sm)` |
| `date-picker/nav/color/hover/background` | `var(--background-secondary-subtle)` |
| `date-picker/nav/color/disabled/text` | `var(--foreground-disabled)` |
| `date-picker/time/color/border` | `var(--border-default)` |

---

## Code Structure

```
src/components/ui/date-picker/
├── date-picker.tsx           compound component
├── date-picker.css           CSS class rules
├── date-picker.stories.tsx   five-story pattern
└── index.ts                  re-exports

src/tokens/components/
└── date-picker.css           :root variables only (Figma-export-safe)

src/playground/previews/
└── date-picker.tsx           playground preview
```

### Exported components
- `DatePicker` — root compound component (Popover.Root wrapper)
- `DatePickerTrigger` — the input + icon trigger
- `DatePickerContent` — popover content wrapper
- `DatePickerCalendar` — react-day-picker with custom components
- `DatePickerTimePicker` — time input section

### CVA variants
- `datepickerTriggerVariants` — `size: { sm, md, lg }` — controls trigger height and typography
- `calendarDayVariants` — `state: { default, selected, today, outside, disabled }` — applied by react-day-picker custom day component
- `calendarNavVariants` — nav button styles

---

## Definition of Done

Taken from CLAUDE.md and applied to Date Picker:

- [ ] Figma: all trigger sizes + states, all day states, calendar header, time picker — all token-bound
- [ ] Code: all CVA variants, all states via CSS/Radix data attrs, react-day-picker custom-components wired
- [ ] Stories: Default, Variants (sizes), States (trigger states), Sizes, AllVariants
- [ ] Playground preview registered in src/playground/index.tsx
- [ ] TypeScript clean
- [ ] a11y panel: no violations on Default story
- [ ] audit.md updated
- [ ] system-overview.md and api-and-dependencies.md updated
