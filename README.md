# Sparks Design System

A component library built on Radix UI primitives, styled with design tokens exported from Figma. Each component is built directly from a Figma source -- no manual interpretation, full token parity, full variant coverage.

This project follows [AI-DLC Lite](https://github.com/aws-samples/sample-aidlc-lite): AI plans and executes, humans decide and validate at each gate.

---

## Dev commands

```bash
npm install
npm run dev          # dev server at localhost:5173
npm run storybook    # Storybook at localhost:6006
npm run sync-tokens  # regenerate tokens after a Figma export
npm run typecheck    # type-check without building
npm run test-storybook  # run a11y + visual tests (requires Storybook running)
```

---

## Step 1 — Do this once before building any components

AI-DLC Lite was added to this project mid-build. Before starting the first component under this workflow, you need to run Inception once. This analyses the existing codebase, tokens, and components to create a baseline context file that every subsequent component build will load.

**You only ever do this once.** After that, Inception is skipped automatically.

Open a new Claude Code session and type:

```
Using AI-DLC Lite, run project inception for the Sparks Design System.
This is a brownfield project -- components and tokens already exist.
Analyse the current state and produce the system overview.
```

**What happens:**
- Claude scans the existing components, tokens, and patterns
- Produces `aidlc-docs/inception/reverse-engineering/system-overview.md`
- Establishes the baseline that all future component builds load at the start

**When it's done:** Claude presents an approval message summarising what it found. Review it, confirm it looks accurate, and approve. Commit the `aidlc-docs/` folder.

---

## Step 2 — Building a component (repeat for every component)

### Start the component

Open a new Claude Code session and use the appropriate starter phrase from `CLAUDE.md` — there are two: one for when the Figma design doesn't exist yet, one for when it already exists on the canvas (e.g. imported from a UI library). Replace `[ComponentName]` with the component name exactly as it should appear in Figma and code (e.g. `Button`, `Badge`, `Select`).

**What happens automatically (you wait):**

1. Fast Inception runs -- detects existing system-overview, skips re-analysis, loads current context
2. Figma design pass begins -- the orchestrator searches the connected library, creates any missing tokens, builds the component with all variants and states, audits and repairs until clean
3. Two final audits run independently (component structure + token architecture)

### Gate 1 -- Review the Figma design

Claude pauses and presents:
- The completed Figma component (link or screenshot)
- Audit report from `figma-component-audit` -- structure, variants, states
- Audit report from `figma-token-audit` -- token naming, tier compliance, completeness

**What to check in Figma:**
- All variants are present and correctly named
- All states exist (Default, Hover, Focus, Active, Disabled at minimum)
- Every fill, stroke, spacing, and radius value is bound to a variable -- no raw values
- The component looks correct against the design intent

**If the audit reports flag anything**, Claude will have already attempted to repair and re-audit. If unresolved issues remain, decide whether they are blockers before approving.

**To approve**, reply:

```
Approved. Proceed to the code pass.
```

**To request changes**, reply with what needs fixing:

```
The hover state background is using the wrong token -- it should use the secondary variant. Fix and re-present.
```

Do not proceed to code until you are satisfied. The code is generated directly from this Figma design.

### After Gate 1 (you wait again)

**What happens automatically:**

4. Code pass begins -- the orchestrator reads the Figma component in full, implements the Radix UI component with CVA variants, CSS token rules, Storybook stories, and playground preview, then audits parity and repairs until clean
5. Two final audits run independently (design-to-code parity + raw value check)

### Gate 2 -- Review the code

Claude pauses and presents:
- Summary of files created or changed
- Audit report from `design-to-code-parity` -- does the code match the Figma design
- Audit report from `token-auditor` -- no raw values in CSS token files

**What to check:**

```bash
npm run storybook
```

Open localhost:6006 and check:
- All variants render correctly in the Variants story
- All states render correctly in the States story (hover, focus, active, disabled)
- No accessibility violations in the Accessibility panel on the Default story
- Dark mode works via the sun/moon toggle in the Storybook toolbar

Also check:
```bash
npm run typecheck   # must pass clean
```

**To approve**, reply:

```
Approved.
```

**To request changes**, describe what needs fixing:

```
The disabled state text colour is too dark -- check the token, it should be color/text/disabled.
```

### After Gate 2 (you wait one more time)

**What happens automatically:**

6. Definition of Done checklist runs -- Claude works through every item
7. `aidlc-docs/inception/reverse-engineering/system-overview.md` and `aidlc-docs/inception/reverse-engineering/api-and-dependencies.md` are updated to reflect the new component
8. `aidlc-docs/audit.md` is updated with the completion entry

Claude presents a completion message listing all DoD items checked. **Commit everything** -- component files and `aidlc-docs/` together.

---

## Resuming after a break

If you close the session mid-component (e.g. after Gate 1 but before Gate 2), resume with:

```
Using AI-DLC Lite, resume the [ComponentName] component -- Figma is approved, proceed to the code pass.
```

Claude detects the existing `aidlc-state.md` and picks up where it left off.

---

## Token work (no component build)

For standalone token tasks -- creating a new semantic token, renaming a collection, adding a text style -- do **not** use `Using AI-DLC Lite`. Use the skill directly:

```
Using the figma-variables-and-styles skill, add a new semantic colour token
for error border states.
```

```
Using the figma-variables-and-styles skill, rename the spacing collection
from "Spacing & Sizing" to "Semantic Spacing & Sizing".
```

Token changes in Figma still need to be exported and synced to code:

```bash
# after exporting tokens from Figma
npm run sync-tokens
```

---

## Fixes and non-component work

For anything that isn't building a new component from scratch -- fixing a bug, updating a story, adjusting a token value -- do **not** use `Using AI-DLC Lite`. Just describe the task:

```
The Button component hover state is using --button-color-primary-background
instead of --button-color-primary-hover-background. Fix it.
```

```
Add a missing AllVariants story to the Badge component.
```

AI-DLC Lite is for structured new-component work only. Using it for quick fixes adds unnecessary overhead.

---

## Definition of Done

A component is not complete -- and should not be merged -- until every item passes:

- [ ] Figma component: all variants present, all states covered, every token bound (no raw values)
- [ ] Code component: all CVA variants implemented, all states handled via CSS/Radix data attributes
- [ ] Storybook stories: five-story pattern complete (Default, Variants, States, Sizes, AllVariants)
- [ ] Playground preview: added and visible at localhost:5173
- [ ] TypeScript: `npm run typecheck` passes clean
- [ ] Accessibility: Storybook a11y panel shows no violations on the Default story
- [ ] Audit trail: `aidlc-docs/audit.md` updated with completion entry
- [ ] Knowledge synthesis: `aidlc-docs/inception/reverse-engineering/system-overview.md` and `aidlc-docs/inception/reverse-engineering/api-and-dependencies.md` updated to reflect the new component

The last item is mandatory. It keeps the system context current so the next component starts with an accurate picture of what already exists.

---

## Audit trail

Every component intent writes to `aidlc-docs/`:
- `audit.md` -- complete log of every prompt, decision, and approval
- `aidlc-state.md` -- current workflow state, used for session resumption

Commit these alongside the component files. They are the paper trail for the methodology.

---

## Token workflow

All token values originate in Figma. Never edit files in `src/tokens/` by hand -- they are overwritten on every export.

1. Make changes in Figma (variables, text styles, component tokens)
2. Export tokens -- drops fresh CSS into `src/tokens/`
3. Run `npm run sync-tokens` -- regenerates `src/tokens/index.css`
4. Write component CSS class rules in `src/components/ui/{name}/{name}.css` -- this file is yours, never overwritten

---

## Structure

```
src/
├── components/ui/{name}/
│   ├── {name}.tsx           component implementation
│   ├── {name}.css           CSS class rules -- developer-owned, never overwritten
│   ├── {name}.stories.tsx   Storybook stories
│   └── index.ts             re-exports only
├── tokens/                  Figma-owned -- safe to replace entirely on export
└── index.css
aidlc-docs/                  AI-DLC Lite audit trail and state files
.aidlc-lite-rule-details/    AI-DLC Lite workflow rule detail files
.claude/aidlc-lite-workflow.md  AI-DLC Lite core workflow (loaded automatically)
```
