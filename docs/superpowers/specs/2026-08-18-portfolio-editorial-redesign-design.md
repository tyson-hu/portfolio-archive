# Portfolio Editorial Redesign

- Date: 2026-08-18
- Status: Approved design contract; awaiting written-spec review
- Scope: Local homepage implementation and verification only

## Objective

Redesign the existing recruiter-facing portfolio homepage to match the selected desktop and mobile visual references while preserving the development version's stronger, evidence-qualified content.

The redesign must make Eazy Review the clear flagship, keep the Networking Study Platform prominent and evidence-grounded, retain OpenCore and BCI as evidence of systems breadth, and replace the current resume-template hierarchy with an editorial presentation of engineering judgment.

## Source of Truth

The implementation is grounded in these selected references:

- `/Users/tysonhu/Downloads/tianzhe-portfolio-redesign-desktop.png` at 1440 x 5836.
- `/Users/tysonhu/Downloads/tianzhe-portfolio-redesign-mobile.png` at 390 x 8299.
- The approved in-chat design contract from 2026-08-18.
- Existing evidence-qualified project copy and links in `src/data/resume.tsx`.

When visual and prose references differ, preserve factual content and link accuracy while matching the selected images' hierarchy, styling, and responsive composition.

## Scope Boundaries

Included:

- The homepage route at `/`.
- Homepage navigation, content hierarchy, project presentations, background, capabilities, and contact footer.
- Purpose-built local visual assets needed to match the selected references.
- Homepage metadata updates required by the shorter name and positioning statement.
- Responsive, interaction, accessibility, build, and visual-fidelity verification.

Excluded:

- Changes to the existing `/projects/eazy-review` case-study content or evidence links.
- New application routes, backend services, persistence, analytics, or forms.
- Food Scanner, because it is optional in the prose memo and absent from both selected visual references.
- Git commit, push, pull request, Cloudflare deployment, production promotion, or production acceptance.
- Study-platform traffic analytics on the homepage. The revised card uses evergreen product proof instead.

## Information Architecture

The homepage order is fixed:

1. Sticky header
2. Hero
3. Selected Work
4. Approach
5. Background
6. Capabilities
7. Contact footer

The standalone About, Engineering & Service accordion, individual skill pills, floating dock, repeated featured-card stack, and Additional Work introduction are removed from the homepage.

## Visual System

### Layout

- Use a warm-neutral page canvas with one restrained static grid texture.
- Desktop content uses an approximately 1120px maximum width inside a 1440px canvas.
- Desktop sections use a narrow left label rail and a wider main-content column where shown in the reference.
- Mobile uses approximately 12px page gutters and a single-column flow.
- The primary responsive breakpoint is 768px. Layouts must remain stable between the reference widths rather than only at those two exact sizes.

### Color

- Warm canvas: approximately `#f3f2ec`.
- Primary ink and dark panels: approximately `#101613` to `#111714`.
- Muted text: neutral gray-green with sufficient contrast.
- Primary accent: electric blue, approximately `#3d5fec`.
- Supporting status accent: green.
- Project surfaces: pale periwinkle for the study platform and pale green for OpenCore.
- Borders: restrained warm gray, approximately `#d9d8d3`.

### Typography

- Continue using locally supported Geist Sans and Geist Mono from the existing layout.
- Use heavy, tightly tracked sans-serif display headings.
- Use monospaced uppercase labels with wide tracking for section numbers, eyebrows, dates, and technical metadata.
- Desktop hero headline is approximately 92px with compact line height; mobile is approximately 40-42px.
- Desktop section headings are approximately 56-64px; mobile section headings are approximately 31-34px.
- Body copy remains readable at approximately 18-20px desktop and 14-16px mobile.

### Surfaces

- Use rounded cards selectively, with approximately 16-22px radii.
- Use subtle one-pixel borders and restrained shadows.
- Do not add pointer cursors to non-interactive card surfaces.
- Avoid repeated animated decoration and universal bordered containers.
- The page is an intentionally light editorial experience with a dark flagship card and dark footer; the removed floating theme control is not replaced.
- The browser and social title is `Tianzhe Hu — Software Engineer`.

## Components and Content

### Sticky Header

Desktop:

- TH monogram mark.
- `Tianzhe Hu` with `Software Engineer` as supporting label.
- In-page links: Work, Approach, Background.
- Outlined Email action.

Mobile:

- TH monogram, `Tianzhe Hu`, and Email action.
- Hide the three text navigation links to preserve the selected compact header.

The header remains readable over the page canvas, includes visible keyboard focus states, and does not obscure anchor targets.

### Hero

Use this content:

- Eyebrow: `Software Engineer · New York`.
- H1: `Reliable software, from product interfaces to system boundaries.`
- Introduction: `I build full-stack, mobile, and developer-facing systems with explicit data ownership, recoverable failure states, and evidence that other engineers can inspect.`
- Primary CTA: `View selected work` to `#work`.
- Secondary CTA: `GitHub` to the existing GitHub profile.
- Supporting record: `U.S. Army Reserve · Information Technology Specialist (25B)`.

The engineering-priorities panel contains:

1. `Secure boundaries` - ownership and authorization live at the data boundary, not only in the UI.
2. `Explicit failure behavior` - offline, reconnect, timeout, and backend failures are part of product design.
3. `Inspectable evidence` - architecture decisions are paired with tests, documentation, and reproducible checks.

Desktop positions this panel to the lower right of the hero. Mobile places it beneath the CTAs and service record.

### Selected Work

Section label: `01 · Selected Work`.

Heading: `Different project types, with a clear hierarchy.`

Supporting copy: lead with the systems that best demonstrate product judgment and technical depth while keeping open-source and embedded work visible without presenting every project as equally important.

#### Eazy Review

- Variant: flagship, full width, dark surface.
- Eyebrow: `Flagship case study · Mobile + backend`.
- Preserve the current architecture-focused summary and technology list.
- Primary internal link: `/projects/eazy-review` labeled `Read engineering case study`.
- Secondary external link: existing GitHub repository.
- Use a purpose-built visual asset matching the angled mobile review interface in the selected reference.

#### Networking Study Platform

- Variant: substantial live-product card.
- Eyebrow: `Live product · Learning platform`.
- Preserve the 404-question positioning and existing live-site and GitHub links.
- Omit traffic analytics and dated metric metadata; keep the product proof evergreen.
- Use a purpose-built local editorial artwork showing a simplified networking quiz panel with answer choices, timer, and progress. The artwork must match the isolated product-render language used by Eazy Review and OpenCore, remain visibly illustrative rather than product-proof evidence, and preserve the live site and repository as the inspectable sources.

#### OpenCore for Razer Blade 15

- Variant: secondary systems/open-source card.
- Eyebrow: `Open source · Systems maintenance`.
- Preserve the current maintenance, compatibility, and documentation framing.
- Keep the existing repository link.
- Use a purpose-built local visual asset matching the terminal-style maintenance panel in the selected reference.

#### Brain-Computer Interface Signal Processing Board

- Variant: compact embedded-engineering row.
- Eyebrow: `Embedded systems · Senior capstone`.
- Preserve the ADS119X, SPI, device-driver, and serial-streaming summary.
- The project title or explicit link remains keyboard-accessible and leads to the existing GitHub repository.
- Use a purpose-built local waveform visual matching the selected reference.

Desktop uses a full-width flagship, an asymmetric two-card row with equal-height Networking and OpenCore surfaces and bottom-aligned visuals, then a compact full-width BCI row. Mobile stacks all four presentations at their natural content heights and moves project visuals below their copy.

### Approach

Section label: `02 · Approach`.

Heading: `Replace a generic "About" paragraph with observable engineering behavior.`

Supporting copy emphasizes ownership, failure behavior, and verification rather than framework count.

The three records are:

1. `Design the boundary` - keep authorization, derivation, and ownership responsibilities explicit across client and database layers.
2. `Model failure states` - treat offline behavior, timeouts, stale sessions, and failed writes as product behavior.
3. `Show the proof` - link decisions to tests, acceptance evidence, documentation, and reproducible checks.

Desktop displays three equal columns with blue top rules. Mobile stacks the records vertically.

### Background

Section label: `03 · Background`.

Heading: `Experience and education, without a catch-all section.`

The two always-open records are:

- Experience / Military service: U.S. Army Reserve, Information Technology Specialist (25B), Cisco networking, secure configuration, technical troubleshooting, and procedure-driven IT work; Jan 2026-present.
- Education: University at Buffalo, Bachelor of Science in Computer Engineering; 2019-2023.

Do not retain the Independent Engineering Portfolio work entry or any accordion interaction.

### Capabilities

Section label: `04 · Capabilities`.

Heading: `Group tools by the work they enable.`

Groups:

- Product engineering: React Native, Expo, React, Next.js, TypeScript, JavaScript.
- Data and backend: PostgreSQL, Supabase, Node.js, Python, Go.
- Systems and delivery: C, C++, Git, Docker, CI/CD, Cloudflare.

Desktop uses three ruled columns. Mobile uses three vertically stacked ruled records. Do not render individual technology pills or logos.

### Contact Footer

Section label: `05 · Contact`.

Heading: `Let's build something useful.`

Supporting copy: open to backend, full-stack, mobile, and developer-tooling opportunities.

Include:

- Email pill using the existing email address.
- Existing GitHub link.
- Existing LinkedIn link.
- Back-to-top control.
- Footer signature `Tianzhe Hu · Software Engineer`.
- Concept date label `Design concept · August 2026`.

Desktop uses a two-column footer composition. Mobile stacks the CTA and link rows.

## Data and Component Architecture

- Keep `src/data/resume.tsx` as the factual source of truth, but reshape it into semantic groups for identity, principles, projects, background, capabilities, and contact.
- Add explicit project presentation metadata such as variant, eyebrow, proof points, links, and visual asset path.
- Keep the homepage as a server-rendered composition wherever possible.
- Add dedicated flagship, live-product, open-source, and compact embedded project presentation components. The redesigned homepage stops using the current generic `ProjectCard`, which remains available to existing consumers.
- Prefer focused homepage section components over one monolithic page file.
- Remove homepage dependencies on the accordion, dock, flickering-grid, technology-icon, and repeated animation components when no longer used.
- Do not delete shared components solely because the redesigned homepage stops importing them; the existing case-study route and any other consumers must continue to build.

Expected implementation surfaces:

- `src/data/resume.tsx`
- `src/app/page.tsx`
- `src/app/layout.tsx`
- `src/app/globals.css`
- `src/components/navbar.tsx`
- New focused project presentation components under `src/components/portfolio/`
- `src/components/section/*` homepage section components
- `public/portfolio/*` for local project visual assets

## Asset Policy

- Use real existing screenshots and supplied brand assets where available.
- Create missing project illustrations as purpose-built raster assets grounded in the selected reference images.
- Do not substitute CSS drawings, handcrafted SVGs, emoji, placeholder boxes, generic stock art, or text-symbol approximations for visible project imagery.
- Use the existing icon library only for standard interface arrows and directional indicators.
- Store new production assets locally under `public/portfolio/` with descriptive names.
- Expected local asset names are `eazy-review-phone.webp`, `networking-study-panel.webp`, `opencore-terminal.webp`, `bci-waveform.webp`, and `grid-texture.webp`; the existing real study screenshot may remain for legacy surfaces but is not the homepage card artwork.
- Every meaningful image receives accurate alternative text; decorative imagery uses empty alternative text.

## Interaction and Accessibility

- Header and CTA anchor links scroll to the intended sections.
- External links open in a new tab with `noopener noreferrer`; email uses `mailto:`.
- Back to top returns focus and view to the page start.
- All interactive controls have visible hover and keyboard-focus states.
- Interactive touch targets have a minimum 44px by 44px hit area.
- Use semantic landmarks, one H1, ordered section headings, descriptive link labels, and meaningful alt text.
- Apply anchor scroll margins so the sticky header does not cover section titles.
- Respect `prefers-reduced-motion`; do not require animation to understand content.
- Maintain WCAG AA text contrast on warm, pastel, dark, and white surfaces.
- Broken remote images must not leave misleading empty interactive regions. Prefer local assets to eliminate this failure mode.

## Verification and Acceptance

Static verification:

- `pnpm lint`
- `pnpm exec tsc --noEmit`
- `pnpm build`

Rendered verification uses the in-app Browser against the local Next.js preview.

Required checks:

- Page title and route identity.
- Meaningful first render with no framework overlay.
- No relevant console errors or warnings.
- Sticky header visibility and correct responsive simplification.
- Work, Approach, and Background navigation targets.
- Email, GitHub, LinkedIn, live-site, repository, case-study, and back-to-top interactions.
- Keyboard focus visibility for primary controls.
- No clipping, overlap, unintended horizontal scrolling, broken assets, or unreadable text.
- Desktop capture at 1440px wide compared with the selected 1440px reference.
- Mobile capture at 390px wide compared with the selected 390px reference.

Design QA is a blocking gate:

- Compare the selected reference and latest rendered screenshot at the same viewport and page state.
- Record mismatches in project-root `design-qa.md`.
- Fix all P0, P1, and P2 fidelity or usability issues.
- Repeat capture and comparison until `design-qa.md` states `final result: passed`.
- P3 polish may remain only when documented as an optional follow-up.

## Completion Boundary

The task is complete when the local homepage implements the approved hierarchy, all required interactions work, static checks pass, desktop and mobile browser verification pass, and `design-qa.md` records a passed final result.

Completion does not authorize or imply Git publication, deployment, production promotion, or production acceptance.
