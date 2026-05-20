# Sparks Design System

A component library built on Radix UI primitives, styled with design tokens exported from Figma. Each component is built directly from a Figma source -- no manual interpretation, full token parity, full variant coverage.

## Getting started

```bash
npm install
npm run dev          # dev server at localhost:5173
npm run storybook    # Storybook at localhost:6006
npm run sync-tokens  # regenerate tokens after a Figma export
```

## How components are built

Every component goes through a two-pass workflow with a human approval gate at each pass:

1. **Figma pass** -- the component is designed on the Figma canvas with all variants, states, and token bindings
2. **Approval gate 1** -- you review the Figma component before any code is written
3. **Code pass** -- the component is implemented in code from the approved Figma design
4. **Approval gate 2** -- you review the code before the component is marked done
5. **Definition of Done** -- checklist runs, knowledge synthesis is updated, component is complete

Figma is the source of truth. The code is derived from it, not the other way around.

## Working with AI-DLC Lite

This repo follows [AI-DLC Lite](https://github.com/aws-samples/sample-aidlc-lite) -- a structured human-AI collaboration methodology. AI plans and executes; humans decide and validate at each approval gate.

### Starting a component

Kick off a new component with:

```
Using AI-DLC Lite, create a [ComponentName] component: design it on the Figma canvas
with all variants and states bound to existing tokens, then once approved implement it
as a Radix UI code component.
```

That single prompt covers the full lifecycle. The workflow will:
- Run a fast Inception (detecting existing tokens, patterns, and components)
- Execute the Figma design pass
- Pause for your approval before writing any code
- Execute the code pass from the approved design

### Approval gates

There are two mandatory approval gates per component. At each gate you receive the work plus a structured audit report -- review both before approving.

1. **After Figma, before code** -- you receive the Figma component and three audit reports (component structure, three-tier token architecture, Subatomic token principles). Review variants, states, token bindings, and any audit findings. If audits flagged issues, Claude will have already repaired and re-audited before presenting -- you should see a clean report. Only approve once you're satisfied the design is correct.
2. **After code, before done** -- you receive the implementation and two audit reports (design-to-code parity, raw value check). Review in Storybook and the playground: all variants render correctly, states behave as expected, no accessibility violations, no audit findings. Only once you approve does the Definition of Done checklist run and the knowledge synthesis update.

Neither gate can be skipped. This is the "humans validate" principle from AI-DLC Lite.

### Resuming after a break

If you close the session after approving the Figma design, start the next session with:

```
Using AI-DLC Lite, resume the [ComponentName] component -- Figma is approved, proceed to the code pass.
```

The workflow detects the existing `aidlc-state.md` and picks up from where it left off.

### Definition of Done

A component is not complete -- and should not be merged -- until every item below passes:

- [ ] Figma component: all variants present, all states covered, every token bound (no raw values)
- [ ] Code component: all CVA variants implemented, all states handled via CSS/Radix data attributes
- [ ] Storybook stories: five-story pattern complete (Default, Variants, States, Sizes, AllVariants)
- [ ] Playground preview: added and visible at localhost:5173
- [ ] TypeScript: `npm run typecheck` passes clean
- [ ] Accessibility: Storybook a11y panel shows no violations on the Default story
- [ ] Audit trail: `aidlc-docs/audit.md` updated with completion entry
- [ ] Knowledge synthesis: `aidlc-docs/inception/system-overview.md` updated to reflect the new component

The last item is mandatory. It keeps the system context current so the next component starts with an accurate picture of what already exists.

### Audit trail

Each component intent produces two files in `aidlc-docs/`:
- `audit.md` -- a complete log of every prompt, decision, and approval
- `aidlc-state.md` -- current workflow state (used for session resumption)

These are the paper trail for the methodology. Commit them alongside the component files.

## Token workflow

All token work originates in Figma. Never edit files in `src/tokens/` by hand.

1. Make changes in Figma (variables, text styles, component tokens)
2. Export tokens -- this drops fresh CSS into `src/tokens/`
3. Run `npm run sync-tokens` to regenerate the import index
4. Write component CSS class rules in `src/components/ui/{name}/{name}.css`

## Structure

```
src/
├── components/ui/{name}/   one folder per component
│   ├── {name}.tsx
│   ├── {name}.css          developer-owned, never overwritten by token exports
│   ├── {name}.stories.tsx
│   └── index.ts
├── tokens/                 Figma-owned -- safe to replace entirely on export
└── index.css
aidlc-docs/                 AI-DLC Lite audit trail and state files
.aidlc-lite-rule-details/   AI-DLC Lite workflow rule detail files
```
