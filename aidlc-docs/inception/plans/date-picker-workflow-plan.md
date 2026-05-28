# Date Picker — Workflow Plan

Generated: 2026-05-23

---

## Execution Plan

```
INCEPTION (complete)
  [x] Workspace Detection
  [x] Reverse Engineering
  [x] Requirements Analysis  ← done above

CONSTRUCTION
  [ ] Pass 1 — Figma Design
        figma-create-component-orchestrator
        - Create Date Picker page in Figma
        - Create component tokens in Figma (date-picker variable collection)
        - Build Date Picker trigger component set (Size x State)
        - Build sub-components: Calendar, Calendar Header, Calendar Week Header,
          Calendar Day, Time Picker
        - Bind all values to tokens (no raw values)
        - Audit: figma-component-audit + figma-token-audit
        - Repair until both audits clean
        - Present final screenshots + audit results for Approval Gate 1

  [ ] APPROVAL GATE 1 — human reviews Figma component

  [ ] Pass 2 — Code Implementation
        figma-to-code-orchestrator
        - Install react-day-picker v9 + date-fns v4
        - Export tokens from Figma + npm run sync-tokens
        - Build date-picker.tsx (compound component)
        - Build date-picker.css (CSS class rules)
        - Build date-picker.stories.tsx (five-story pattern)
        - Build src/playground/previews/date-picker.tsx
        - Register in src/playground/index.tsx
        - Audit: design-to-code-parity + token-auditor
        - Repair until both audits clean
        - Present audit results + typecheck result for Approval Gate 2

  [ ] APPROVAL GATE 2 — human reviews code implementation

  [ ] Definition of Done checklist
  [ ] Knowledge synthesis update
```

---

## Stages skipped and why

| Stage | Decision | Reason |
|---|---|---|
| User Stories | Skip | Single UI component — no user journey complexity |
| Application Design | Skip | No new business logic or data models |
| Units Generation | Skip | Single component, one unit of work |
| NFR Requirements | Skip | NFRs are captured directly in requirements doc |
| NFR Design | Skip | NFR patterns (token cascade, Radix a11y) are standard in this repo |
| Infrastructure Design | Skip | No infrastructure changes |

---

## Dependencies to install before Pass 2

```bash
npm install react-day-picker@^9 date-fns@^4
```

Both are zero-dependency (for our use) and tree-shakeable.
`@radix-ui/react-popover` and `lucide-react` already installed.

---

## Key decisions

| Decision | Choice | Reason |
|---|---|---|
| Calendar logic | react-day-picker v9 (custom-components mode) | Full render control + battle-tested ARIA grid accessibility |
| Date utilities | date-fns v4 | Tree-shakeable, zero deps, industry standard |
| Popover layer | @radix-ui/react-popover (existing) | Already in repo, consistent with Dropdown Menu |
| Icons | lucide-react (existing) | Already in repo, CalendarIcon + ChevronLeft/Right available |
| Trigger styling | Reuse text-input token pattern | Visual consistency, single source of truth |
| Time input | Native HTML time inputs styled with component tokens | No extra library; browser handles time UX |
