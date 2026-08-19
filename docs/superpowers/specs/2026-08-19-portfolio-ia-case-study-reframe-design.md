# Portfolio IA and Eazy Review Reframe Design

**Date:** 2026-08-19

**Status:** Approved design scope; implementation not started

## Purpose

Make the existing editorial portfolio more decisive for a first-time recruiter or engineering reader without replacing its visual language. The pass will expose selected work earlier, connect Portfolio, Writing, and Lab, make the full navigation available on mobile, and give the Eazy Review case study a scannable product-to-evidence reading path.

The local working copy remains the source of truth. This design does not authorize a commit, push, pull-request update, Cloudflare deployment, production change, or merge.

## Design principles

- Preserve engineering truth, explicit project boundaries, immutable evidence links, and the `Independent engineering project` context.
- Preserve the warm grid canvas, strong black typography, restrained blue and green accents, project-card families, visible focus treatment, reduced-motion behavior, and practical 44px interaction targets.
- Improve hierarchy and information scent before adding decoration.
- Do not fabricate product screenshots, usage, scale, release status, employment, ownership, or production maturity.
- Prefer small native browser primitives and narrow client boundaries over new UI dependencies.

## Current-state constraints

- The checkout is `main` at `cdd1c9469654240ebe3148fdf08893658610f2d4`, while the redesign is represented by modified tracked files and many untracked files. Implementation must begin with a recoverable source snapshot and must not reset or stash this tree.
- The current static checker encodes behavior this design intentionally replaces, including the 720px desktop hero minimum, header `mailto:` action, old headline, hidden mobile navigation, and blind nested-route prefixing. Tests must change with the contract.
- The only Eazy Review image in `public/portfolio/` is a generated overview illustration. It is not evidence of browse, edit, failed-save, retry, or recovery states and must not be presented as product-flow proof.
- Exact role/ownership wording and current release status are not confirmed for a public At a Glance record. This pass will not infer them.

## Scope

### Included in this pass

1. A typed internal/external navigation model shared by the homepage and case-study shell.
2. Writing and Lab links in desktop navigation, mobile navigation, and the shared footer.
3. A Contact action that stays in the portfolio and targets the contact section.
4. One combined home/identity link, with the persistent role subtitle removed.
5. A real mobile navigation sheet with all primary destinations.
6. Work marked as the current area on the Eazy Review route.
7. A shorter, naturally wrapping hero with one scan path, clearer actions, quieter service context, and Selected Work visible before the fold at the required desktop sizes.
8. A factual Eazy Review At a Glance section before Architecture.
9. An Eazy Review on-page navigation model for desktop and mobile.
10. Progressive disclosure for engineering decisions.
11. Verification evidence grouped into understandable bundles while preserving every existing granular source link.
12. Microtypography, focus, responsive, text-zoom, and reduced-motion corrections required by the new structure.
13. Updated static contracts and fresh rendered QA for the new behavior.

### Deferred until real evidence is supplied

- An annotated Product Flow section.
- Product-detail, rating create/edit, failed-save, retry, or recovery screenshots.
- Public role/ownership and lifecycle-status rows in At a Glance.
- A `View product flow` primary action.

When sanitized real screens and exact wording are supplied, Product Flow can be inserted between At a Glance and Architecture without restructuring the rest of the page.

These items are explicitly deferred from the original audit for this staged pass. A completion report may claim only **staged acceptance** against this document; it must not claim full acceptance of the original audit until Product Flow, role/ownership, and lifecycle-status criteria are separately approved and verified.

### Out of scope

- Redesigning the four Selected Work card families or changing their evidence-qualified project copy.
- Adding a mascot or treating the existing generated phone illustration as product proof.
- Homepage scrollspy. The project route will expose Work as the current page area; homepage section-current state remains unchanged.
- Reciprocal changes to the Writing or Lab properties themselves.
- New dependencies, a new design system, dark-mode work, analytics, forms, email-copy controls, or live-demo claims.
- Physical-phone acceptance, deployment, production authorization, PR readiness, or merge.

## Information architecture

### Shared destination model

Navigation items will use a discriminated type so section links and external links cannot be confused:

```ts
type PortfolioNavigationItem =
  | {
      kind: "section";
      label: "Work" | "About" | "Background";
      href: `#${string}`;
      surfaces: readonly ("desktop" | "mobile")[];
    }
  | {
      kind: "external";
      label: "Writing" | "Lab";
      href: `https://${string}`;
      surfaces: readonly ("desktop" | "mobile")[];
    };
```

The initial destinations are:

- Work → `#work`, desktop and mobile.
- Writing → `https://blog.tianzhe.me`, desktop and mobile.
- Lab → `https://lab.tianzhe.me`, desktop and mobile.
- About → `#about`, desktop and mobile.
- Background → `#background`, mobile only.

Section destinations receive the route prefix on nested pages; external URLs never do. Contact and GitHub remain explicit actions rather than ordinary primary-navigation items.

The supplied audit is the approval source for the Writing and Lab URLs. Before implementation, both URLs must return a public 2xx or 3xx HTTP response; otherwise implementation pauses without substituting a destination.

### Desktop header

The desktop header becomes:

```text
[TH] Tianzhe “Tyson” Hu    Work  Writing ↗  Lab ↗  About    Contact
```

- Monogram and name form one home link.
- The persistent role subtitle is removed.
- From 768px through 1099px, the visible name is `Tyson Hu`; at 1100px and wider it is `Tianzhe “Tyson” Hu`. The accessible home label always retains the full name.
- Contact points to `#contact` on the homepage and `/#contact` from project routes.
- Writing and Lab are visibly external, open in a new tab, include `rel="noopener noreferrer"`, and expose the new-tab behavior to assistive technology.
- On `/projects/eazy-review`, Work receives `aria-current="page"` and a restrained persistent active treatment.

### Mobile header and sheet

The mobile header becomes:

```text
[TH] Tyson Hu                                      Menu
```

Menu opens a native-dialog-based sheet containing:

- Work
- Writing ↗
- Lab ↗
- About
- Background
- Contact
- GitHub ↗

The sheet uses a small client component around the native `<dialog>` element. Native modal focus containment is retained; Escape closes it; activating a destination closes it; focus returns to Menu; backdrop activation closes it; reduced-motion users receive no translated entrance animation. Menu, Close, and every sheet destination compute to at least 44px high.

### Shared footer

The footer keeps the visible email address and adds Writing and Lab alongside GitHub, LinkedIn, and Back to top. Both the homepage and Eazy Review route inherit the same ecosystem links from the shared footer.

## Homepage hero

### Content hierarchy

The hero removes the duplicated name and role block. Its sequence becomes:

1. `Backend · Full-Stack · Developer Tooling` eyebrow.
2. `I build reliable product and platform software—from mobile interfaces to data boundaries.`
3. `Backend, full-stack, and developer-tooling work with explicit ownership, recoverable failure states, and evidence another engineer can inspect.`
4. Primary `Explore selected work` action.
5. Secondary `Contact` action.
6. Lower-emphasis GitHub, Writing, and Lab utility links.
7. Quieter `Current service` context reusing the exact existing strings `U.S. Army Reserve · Information Technology Specialist (25B)` and `January 2026–Present` without factual edits.

The headline renders from typed portfolio data and uses natural wrapping. Manual `<br>` elements are removed. The display measure, tracking, and line height are relaxed enough to remain readable through 200% text zoom and intermediate widths.

### Fold behavior

- Remove the unconditional desktop `min-height: 720px`.
- Use a bounded viewport-aware minimum, with `clamp(540px, 68svh, 640px)` as the starting contract at desktop widths.
- Reduce the oversized inset before Selected Work while preserving a deliberate section boundary.
- At 1366×768, the complete `01 · Selected Work` rail bounding box must sit below the sticky header and within the 768px viewport without scrolling.
- At 1536×1024, the complete Selected Work heading must be visible or at least 80px of the flagship Eazy Review card must intersect the initial viewport without scrolling.
- Tall screens must not make the hero grow indefinitely.
- No bespoke project teaser is added in this pass; the real Selected Work section supplies the continuation cue.

### Visual treatment

The grid remains at its current opacity and sizing in this pass. No mascot is introduced because no approved mascot exists in the current source or supplied assets.

## Eazy Review reading architecture

### Opening sequence

The case study becomes:

1. Breadcrumb and independent-project orientation.
2. Title and concise product/system summary.
3. Technology stack.
4. Primary `Project overview` action to At a Glance.
5. Secondary GitHub repository action.
6. Lower-emphasis Verification evidence link.
7. Existing proof strip and immutable audited-commit note.
8. At a Glance.
9. Architecture.
10. Engineering decisions.
11. Verification.
12. Boundaries.

The future Product Flow section will sit between At a Glance and Architecture. Until real screens exist, neither the section nor its CTA is rendered.

### At a Glance

At a Glance is an accessible description list with only verified fields:

- Product — Mobile product-review application.
- Project context — Independent engineering project.
- Core invariant — Personal ratings remain owner-scoped while community scores are server-derived.
- Platform — React Native, Expo, Supabase, and PostgreSQL.
- Evidence — Automated frontend, database, authorization, and concurrency checks paired with the existing commit-pinned Task 15, Task 17, and Task 18 physical-device evidence links.
- Evidence snapshot — Commit `72149320c328532d2fb2e01da944bfa4b3cc9244`.

Role/ownership and lifecycle status are intentionally absent rather than guessed.

### On-page navigation

A shared `CASE_STUDY_SECTIONS` list defines:

- Overview → `#overview`
- Architecture → `#architecture`
- Engineering decisions → `#decisions`
- Verification → `#verification`
- Boundaries → `#boundaries`

Desktop uses a sticky rail outside the approximately 780px reading column within the existing wide site grid. Mobile uses a native `<details>` disclosure above the reading content. Activating a mobile section link closes that disclosure. A narrow client component uses `IntersectionObserver` only to trigger recalculation of the active item: the active section is the last section in document order whose bounding-box top is at or above 120px; before that threshold it is Overview, and at the document bottom it is Boundaries. Content and links remain server-rendered and usable without client JavaScript. Sticky offsets account for the global header, and every target retains sufficient scroll margin.

### Engineering decisions

Each decision keeps these fields visible:

- Decision number and title.
- Problem.
- Decision.
- A one-sentence result grounded in the existing record.

A native `<details>` disclosure contains:

- Why.
- Verification.
- Boundary.
- Related source links.

All decisions start collapsed for deterministic server rendering and a consistent mobile/desktop contract. Summaries have explicit hover and visible focus styles. The full evidence remains present in the document and keyboard accessible.

The visible result copy is fixed for this pass:

- Decision 01 — `Personal ratings and private notes remain owner-scoped at the PostgreSQL boundary.`
- Decision 02 — `Connected reads return server-derived rating truth after create and edit operations settle.`
- Decision 03 — `Failed saves settle explicitly and retain the draft for a user-directed retry.`

### Verification bundles

The current verification rows are reorganized without deleting links:

1. Application behavior — catalog/reconnect, authentication/session isolation, durable rating edits, draft preservation, and recovery behavior.
2. Data and authorization — RLS, least-privilege grants, server-derived aggregates, pgTAP, and database concurrency behavior.
3. System verification — accepted device evidence plus frontend, database, security, and concurrency CI definitions.

Each bundle exposes a concise explanation and a primary evidence action. Granular links sit in a `View related evidence` disclosure to reduce the link wall while preserving inspectability.

The preserved granular evidence-key set is:

```text
apiContracts
aggregateTests
authProvider
authorizationTests
concurrencyHarness
currentRatingGrants
databaseAcceptance
databaseCi
expoCi
formPreservationTest
ratingMutation
ratingMutationTests
ratingSave
rlsMigration
scoreDerivation
task15Evidence
task16Evidence
task17Evidence
task18Evidence
```

The checker will compare the unique href set rendered by Decisions and Verification before and after the reorganization. Labels and grouping may change; no URL represented by this set may disappear.

The audited-commit link and the existing `dataModel` and `tasks` supporting links also remain unchanged.

### Boundaries

`What this project does not claim` remains fully expanded near the conclusion. The four current list items are frozen verbatim for this pass:

1. `Feed remains a placeholder, and protected account deletion is still pending as Task 19.`
2. `Catalog cache is in memory only. There is no durable offline write queue.`
3. `The current ten-dimension schema and recovery work were not staged or deployed. Production recovery-host configuration, TestFlight, App Store work, and release QA remain later tasks.`
4. `This case study makes no claim about production users, traffic, scale, uptime, or a store launch.`

Any future factual correction to these statements requires a separate evidence review and approval.

## Component boundaries

- `src/data/portfolio.ts` owns typed shared destinations, external ecosystem URLs, hero copy, and current project content.
- `src/components/portfolio/site-header.tsx` remains the server-rendered shell and receives explicit route-area state.
- `src/components/portfolio/mobile-navigation.tsx` is the only client boundary for the mobile dialog.
- `src/components/portfolio/contact-footer.tsx` renders shared ecosystem destinations.
- `src/components/portfolio/hero-section.tsx` renders the data-driven hero without presentation-only line breaks.
- `src/app/projects/eazy-review/page.tsx` owns factual case-study data and server-rendered section content.
- `src/components/portfolio/case-study-nav.tsx` is the narrow client boundary for current-section observation.
- `src/app/portfolio.css` owns responsive composition, dialog/rail/disclosure states, microtypography, and focus treatment.
- `scripts/check-portfolio-redesign.mjs` locks the new source contract and rejects reintroduction of the obsolete one.

No unrelated component migration or broad stylesheet rewrite is part of this pass.

## Error and fallback behavior

- Rendered-interaction acceptance assumes JavaScript is enabled. With JavaScript disabled, the mobile dialog control may not open; the footer remains the explicit fallback exposing every ecosystem destination. The case-study content and all section anchors remain available.
- If `IntersectionObserver` is unavailable, the on-page navigation remains usable without a current-section indicator.
- External destinations remain ordinary links; the site does not attempt to prefetch or validate them at runtime.
- Contact never depends on a configured local mail application. The visible footer email remains a direct `mailto:` option for visitors who choose it.
- Dialog and observer code must not throw during server rendering or hydration.

## Accessibility contract

- Preserve the existing 3px visible focus outline and reduced-motion handling.
- Raise every rail and eyebrow token currently set to 10px to at least 11px. Project-type and current-context labels use at least 12px.
- Menu, Close, header Contact, both hero CTAs, every mobile-sheet destination, both case-study button actions, and every disclosure summary have a computed height of at least 44px. Inline prose/evidence links retain sufficient line height and spacing rather than being forced into 44px boxes.
- Provide accessible names for Menu, Close, home, current Work area, and new-tab behavior.
- Use `aria-current="page"` for Work on the project route and `aria-current="location"` only for the active case-study section.
- Use semantic `<nav>`, `<dialog>`, `<dl>`, `<section>`, `<details>`, `<summary>`, and heading relationships.
- Decorative icons remain hidden from the accessibility tree.
- Natural H1 wrapping, navigation, disclosures, and sticky offsets must remain usable at 200% text zoom.

## Verification strategy

### Test-first static contracts

Before implementation, extend the dependency-free portfolio checker with assertions that fail against the current source for:

- Discriminated section/external navigation data.
- Writing and Lab canonical destinations.
- Contact replacing header Email/`mailto:` behavior.
- One combined identity link and no duplicated hero identity.
- Mobile navigation structure and full destination set.
- Work current-area support on the Eazy Review route.
- Data-driven natural hero headline and absence of manual hero breaks.
- Absence of the unconditional 720px hero minimum.
- At a Glance before Architecture.
- Required on-page section IDs and navigation data.
- Decision and verification disclosures.
- Unchanged immutable evidence commit and explicit boundaries.
- Minimum 11px rail typography and preserved focus/reduced-motion contracts.

Run the checker once to record the intended failures, implement the smallest coherent change, then rerun it to green.

### Source and build verification

- `pnpm check:portfolio -- all`
- `node scripts/check-theme-initializer-fixtures.mjs`
- `pnpm lint`
- `pnpm exec tsc --noEmit`
- `pnpm build`
- Served theme initialization check against the local preview.

Generated `.open-next` output is excluded from source-level conclusions.

### Rendered browser verification

Use the in-app Browser against a local served build. Capture fresh evidence rather than reusing historical QA.

Required viewports and states:

- Homepage at 1366×768 and 1536×1024 for fold acceptance.
- Homepage and Eazy Review at 320×844, 390×844, 768×1024, 1024×768, 1366×768, and 1536×1024 where relevant.
- Desktop and mobile header navigation, including Menu open/close, Escape, focus return, and destination activation.
- Eazy Review At a Glance, sticky/compact on-page navigation, active-section state, decision disclosures, verification bundles, and unchanged boundaries.
- 200% browser text zoom at a 1280×800 outer viewport: no horizontal document overflow, clipped text, unreachable Menu/Close control, obscured anchor target, or disclosure content outside the viewport.
- Reduced-motion preference.
- Horizontal overflow, lazy-image health, sticky-anchor clearance, page identity, framework overlays, and successful-route console health. Fresh homepage and Eazy Review loads must record zero browser-console errors and zero browser-console warnings.
- Keyboard focus through all new controls.

The generated overview illustration may remain on the homepage card, but no rendered QA statement may call it a real product-flow screen.

## Acceptance criteria

### Homepage and shared shell

- The complete Selected Work rail is below the sticky header and inside the initial 1366×768 viewport.
- At 1536×1024, the complete Selected Work heading is visible or at least 80px of the flagship card intersects the initial viewport.
- No unconditional 720px desktop hero minimum remains.
- Human screenshot review confirms that headline, support, and primary action form one uninterrupted scan path; automated geometry does not substitute for this judgment.
- Name and complete role are not repeated between header and hero.
- On desktop, Writing and Lab each require one destination activation. On mobile with JavaScript enabled, each requires one Menu activation followed by one destination activation.
- Header Contact stays inside the portfolio; the visible footer email still offers an explicit mail action.
- With JavaScript enabled, mobile users can reach Work, Writing, Lab, About, Background, Contact, and GitHub through the header sheet without scrolling to the footer.
- Project routes expose Work as the current area.

### Eazy Review

- A first-time visitor encounters factual product context before Architecture.
- At a Glance contains no inferred role or lifecycle claim.
- No generated image is presented as product-flow proof.
- The page provides accessible navigation to Overview, Architecture, Decisions, Verification, and Boundaries.
- Decision records support a concise scan mode and an inspectable evidence mode.
- Verification evidence is grouped while preserving the complete evidence-key set enumerated in this spec.
- The immutable evidence commit remains pinned.
- The four frozen boundary statements remain fully visible and verbatim.

### Responsive and accessible behavior

- No horizontal overflow at 320, 390, 768, 1024, 1366, or 1536 CSS pixels.
- Mobile navigation works at 320px and 390px.
- Menu, Close, header Contact, both hero CTAs, every mobile-sheet destination, both case-study button actions, and every disclosure summary compute to at least 44px high.
- Rail and eyebrow text is at least 11px.
- At 200% text zoom in a 1280×800 outer viewport, the document has no horizontal overflow or clipped text, Menu and Close remain reachable, anchor targets remain unobscured, and disclosure content remains inside the viewport.
- Reduced-motion preference is honored.
- New controls expose visible keyboard focus and correct programmatic state.
- Fresh successful-route loads show no framework overlay and record zero browser-console warnings or errors.

## Delivery gates

1. Preserve a recoverable snapshot at `/tmp/portfolio-ia-reframe-2026-08-19/source-before/`, excluding `.git`, `node_modules`, `.next`, and `.open-next`. Record a sorted SHA-256 manifest beside it and verify the manifest immediately after copying before any source edit.
2. Implement and verify locally against the staged acceptance criteria.
3. Present fresh desktop/mobile screenshots and an evidence-backed QA report for human review.
4. Stop. Do not commit, push, update PR #2, deploy to the dev Worker, or touch production without separate authorization.
