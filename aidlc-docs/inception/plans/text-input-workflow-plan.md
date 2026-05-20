# Workflow Plan — Text Input Component

**Date**: 2026-05-20
**Depth**: Standard
**Project type**: Brownfield design system component

---

## Execution Plan

### INCEPTION PHASE

| Stage | Status | Notes |
|---|---|---|
| Workspace Detection | COMPLETED | Brownfield, 4 existing components, token-only text-input.css already exported |
| Reverse Engineering | COMPLETED | system-overview.md + api-and-dependencies.md in place |
| Requirements Analysis | COMPLETED | Minimal depth — intent clear, token file is the spec |
| User Stories | SKIPPED | No new user-facing flow; pure component library work |
| Workflow Planning | IN PROGRESS | This document |
| Application Design | SKIPPED | Component structure is defined by tokens + CLAUDE.md patterns |
| Units Generation | SKIPPED | Single component, no decomposition needed |

---

### CONSTRUCTION PHASE — Two-Pass Design System Pattern

#### Pass 1 — Figma Design (skill: `design-systems:figma-create-component-orchestrator`)

**Goal**: Build the component set on the Text Input page with all sizes, states, and icon slots. Every visual value bound to a component token.

**Steps (orchestrator runs autonomously, loops until clean):**
- [x] Fix token bug: rebind `text-input/color/placeholder` and `text-input/color/icon` aliases from `border/focus` to `foreground/muted` in Figma
- [x] Re-export tokens to update `src/tokens/components/text-input.css`
- [x] Screenshot Text Input page to confirm empty canvas and find clear space
- [x] Build component set: Size (SM/MD/LG) × State (Default/Hover/Focused/Error/Success/Disabled) × Leading Icon (True/False) × Trailing Icon (True/False)
- [x] Bind all values to tokens — no raw values
- [x] Run `design-systems:figma-component-audit` (structure, variants, states)
- [x] Run `design-systems:figma-token-audit` (token architecture, no hardcoded values)
- [x] Repair any issues found (added Focus Ring layer to Focused state variants)
- [x] Re-run failed audits until clean
- [x] Present for human review with all audit results

**Approval Gate 1**: Human reviews Figma component and audit results. Do not proceed to code until explicitly approved.

---

#### Pass 2 — Code Implementation (skill: `design-systems:figma-to-code-orchestrator`)

**Goal**: Implement a production-ready React component that matches the approved Figma design with full token parity.

**Steps (orchestrator runs autonomously, loops until clean):**
- [ ] Read the approved Figma component fully
- [ ] Write `src/components/ui/text-input/text-input.css` — CSS class rules consuming component tokens
- [ ] Write `src/components/ui/text-input/text-input.tsx` — CVA + native `<input>` + `React.forwardRef`
- [ ] Write `src/components/ui/text-input/text-input.stories.tsx` — Five-story pattern
- [ ] Write `src/playground/previews/text-input.tsx` — playground preview
- [ ] Write `src/components/ui/text-input/index.ts` — re-exports
- [ ] Register preview in `src/playground/index.tsx`
- [ ] Run `design-systems:design-to-code-parity` audit
- [ ] Run `token-auditor` audit
- [ ] Repair any issues found
- [ ] Re-run failed audits until clean
- [ ] Present for human review with all audit results

**Approval Gate 2**: Human reviews code implementation and audit results. Do not run Definition of Done checklist or update knowledge synthesis until explicitly approved.

---

#### Definition of Done (after Pass 2 approval)

- [ ] Figma component: all variants present, all states covered, every token bound (no raw values)
- [ ] Code component: all CVA variants implemented, all states handled via CSS/Radix data attributes
- [ ] Storybook stories: five-story pattern complete
- [ ] Playground preview: added to `src/playground/previews/` and registered in `src/playground/index.tsx`
- [ ] TypeScript: `npm run typecheck` passes clean
- [ ] Accessibility: Storybook a11y panel shows no violations on Default story
- [ ] Audit trail: `aidlc-docs/audit.md` updated with completion entry
- [ ] Knowledge synthesis: `system-overview.md` and `api-and-dependencies.md` updated

---

## Skipped Stages and Rationale

| Stage | Reason |
|---|---|
| User Stories | No user-facing workflow change — adding a library component |
| Application Design | Component structure is fully defined by tokens and CLAUDE.md component rules |
| Units Generation | Single atomic component — no decomposition value |
| NFR Requirements/Design | Stack is fixed (React, CVA, Radix, Tailwind v4, strict TS) — no decisions to make |
| Infrastructure Design | No infrastructure changes |

---

## Risk Register

| Risk | Mitigation |
|---|---|
| Token alias bug (placeholder/icon → border/focus) | Fix in Figma before building component; re-export CSS |
| No Radix primitive for text input | Use native `<input>` with correct ARIA — document in origin comment |
| Error/Success states affect only border colour | Inline message text is consumer responsibility — document in stories |
