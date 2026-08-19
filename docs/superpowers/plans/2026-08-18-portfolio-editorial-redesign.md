# Portfolio Editorial Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the existing portfolio homepage as the approved responsive editorial design while preserving evidence-qualified project content and the Eazy Review case-study route.

**Architecture:** Add a typed, homepage-specific data contract and focused server-rendered section components under `src/components/portfolio/`. The root layout supplies fonts and metadata only; the homepage owns its sticky header and scoped editorial stylesheet, while the existing case-study route receives its own width container. Reference-matched raster assets live under `public/portfolio/`, and a dependency-free structural checker plus rendered Browser QA provide test-first and visual acceptance gates.

**Tech Stack:** Next.js 16 App Router, React 19 server components, TypeScript 5.9, Tailwind CSS 4 base tokens, scoped plain CSS, Lucide React interface icons, Node.js structural checks, in-app Browser visual QA.

**Spec:** `docs/superpowers/specs/2026-08-18-portfolio-editorial-redesign-design.md`

## Global Constraints

- Match `/Users/tysonhu/Downloads/tianzhe-portfolio-redesign-desktop.png` at 1440px wide and `/Users/tysonhu/Downloads/tianzhe-portfolio-redesign-mobile.png` at 390px wide.
- Preserve factual project claims and existing URLs from `src/data/resume.tsx`; do not refresh or inflate evidence-qualified claims.
- Keep `/projects/eazy-review` and its evidence content intact; only add a route-local width/padding class if needed after removing the global container.
- Do not add dependencies, routes, backend behavior, analytics, persistence, or forms.
- Do not implement Food Scanner.
- Use real supplied images or reference-grounded raster assets; do not create CSS art, handcrafted SVG, emoji, or dummy imagery.
- The primary responsive breakpoint is exactly 768px.
- Interactive touch targets have a minimum 44px by 44px hit area and visible keyboard focus.
- No commit, push, pull request, deployment, or production verification is authorized. This directory has no `.git`, so every task ends with a local checkpoint rather than a commit.
- Keep generated QA screenshots outside the repository. Only `design-qa.md` is stored in the project because the design workflow requires it.

## File Structure

Create:

- `src/data/portfolio.ts` — typed homepage content, links, proof points, presentation variants, and asset paths.
- `src/components/portfolio/site-header.tsx` — sticky desktop/mobile navigation.
- `src/components/portfolio/section-heading.tsx` — shared numbered section heading contract.
- `src/components/portfolio/hero-section.tsx` — hero copy, CTAs, service record, and engineering-priorities panel.
- `src/components/portfolio/selected-work.tsx` — four explicit project presentation variants.
- `src/components/portfolio/approach-section.tsx` — three observable engineering-behavior records.
- `src/components/portfolio/background-section.tsx` — open experience and education records.
- `src/components/portfolio/capabilities-section.tsx` — three grouped capability records.
- `src/components/portfolio/contact-footer.tsx` — dark contact CTA, social links, and back-to-top control.
- `src/app/portfolio.css` — all styles scoped beneath `.portfolio-page` or `.portfolio-header`.
- `scripts/check-portfolio-redesign.mjs` — dependency-free grouped structural acceptance checks.
- `public/portfolio/eazy-review-phone.webp` — reference-matched mobile-product visual.
- `public/portfolio/opencore-terminal.webp` — reference-matched maintenance-terminal visual.
- `public/portfolio/bci-waveform.webp` — reference-matched embedded waveform visual.
- `public/portfolio/grid-texture.webp` — restrained warm-neutral grid texture used by the page canvas.
- `design-qa.md` — final fidelity ledger and pass/block result.

Modify:

- `src/app/page.tsx` — compose the new homepage sections in the approved order.
- `src/app/layout.tsx` — remove the narrow global frame, dock, animated grid, theme initializer, and theme providers; set exact portfolio metadata.
- `src/app/globals.css` — retain shared tokens/base rules and remove global dark/theme behavior that can override the fixed light editorial canvas.
- `src/app/opengraph-image.tsx` — use the shorter portfolio identity and updated positioning description.
- `src/app/projects/eazy-review/page.tsx` — add route-local max width and padding to its existing `<main>` only.
- `package.json` — add `check:portfolio` without changing dependencies.

Leave in place:

- `src/data/resume.tsx` and legacy homepage components, because they still compile and may support existing code; the redesigned homepage simply stops importing them.
- The full content and evidence URLs inside `src/app/projects/eazy-review/page.tsx`.

---

### Task 1: Structural Checker and Typed Homepage Contract

**Files:**

- Create: `scripts/check-portfolio-redesign.mjs`
- Create: `src/data/portfolio.ts`
- Modify: `package.json`

**Interfaces:**

- Produces: `PORTFOLIO: PortfolioData` and CLI command `pnpm check:portfolio -- <group>`.
- Consumes: Existing factual URLs, summaries, dates, and contact details from `src/data/resume.tsx`.

- [ ] **Step 1: Add the grouped structural checker before creating the new data module**

Create `scripts/check-portfolio-redesign.mjs` with a file reader that treats missing files as empty strings and these group names: `data`, `assets`, `shell`, `hero`, `work`, `sections`, `styles`, and `all`.

```js
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const read = (path) => {
  const absolute = join(root, path);
  return existsSync(absolute) ? readFileSync(absolute, "utf8") : "";
};
const present = (path) => existsSync(join(root, path));
const contains = (path, value) => read(path).includes(value);
const excludes = (path, value) => !read(path).includes(value);

const checks = {
  data: [
    ["typed portfolio export", contains("src/data/portfolio.ts", "export const PORTFOLIO")],
    ["approved hero headline", contains("src/data/portfolio.ts", "Reliable software, from product interfaces to system boundaries.")],
    ["Networking traffic analytics removed", excludes("src/data/portfolio.ts", "metricSummary")],
    ["three capability groups", contains("src/data/portfolio.ts", 'title: "Systems and delivery"')],
  ],
  assets: [
    ["Eazy Review phone asset", present("public/portfolio/eazy-review-phone.webp")],
    ["OpenCore terminal asset", present("public/portfolio/opencore-terminal.webp")],
    ["BCI waveform asset", present("public/portfolio/bci-waveform.webp")],
    ["static grid texture", present("public/portfolio/grid-texture.webp")],
    ["study product screenshot", present("public/networking-study-platform.png")],
  ],
  shell: [
    ["exact metadata title", contains("src/app/layout.tsx", "Tianzhe Hu — Software Engineer")],
    ["root has no dock", excludes("src/app/layout.tsx", "<Navbar")],
    ["root has no animated grid", excludes("src/app/layout.tsx", "FlickeringGrid")],
    ["case study owns its container", contains("src/app/projects/eazy-review/page.tsx", "case-study-page")],
    ["homepage header", contains("src/app/page.tsx", "<SiteHeader")],
  ],
  hero: [
    ["hero component", present("src/components/portfolio/hero-section.tsx")],
    ["engineering priorities", contains("src/components/portfolio/hero-section.tsx", "engineering-priorities")],
    ["selected-work CTA", contains("src/components/portfolio/hero-section.tsx", 'href="#work"')],
  ],
  work: [
    ["selected work component", present("src/components/portfolio/selected-work.tsx")],
    ["flagship variant", contains("src/components/portfolio/selected-work.tsx", "project-card--flagship")],
    ["live-product variant", contains("src/components/portfolio/selected-work.tsx", "project-card--study")],
    ["open-source variant", contains("src/components/portfolio/selected-work.tsx", "project-card--opencore")],
    ["compact embedded variant", contains("src/components/portfolio/selected-work.tsx", "project-card--embedded")],
  ],
  sections: [
    ["approach section", present("src/components/portfolio/approach-section.tsx")],
    ["background section", present("src/components/portfolio/background-section.tsx")],
    ["capabilities section", present("src/components/portfolio/capabilities-section.tsx")],
    ["contact footer", present("src/components/portfolio/contact-footer.tsx")],
    ["no homepage About", excludes("src/app/page.tsx", 'id="about"')],
    ["no Additional work", excludes("src/app/page.tsx", "Additional work")],
  ],
  styles: [
    ["scoped editorial CSS", contains("src/app/portfolio.css", ".portfolio-page")],
    ["exact desktop breakpoint", contains("src/app/portfolio.css", "@media (min-width: 768px)")],
    ["reduced motion", contains("src/app/portfolio.css", "prefers-reduced-motion")],
    ["sticky anchor margin", contains("src/app/portfolio.css", "scroll-margin-top")],
    ["44px targets", contains("src/app/portfolio.css", "min-height: 44px")],
  ],
};

const group = process.argv[2] ?? "all";
const selected = group === "all" ? Object.values(checks).flat() : checks[group];
if (!selected) {
  console.error(`Unknown check group: ${group}`);
  process.exit(2);
}
const failures = selected.filter(([, passed]) => !passed);
for (const [label, passed] of selected) console.log(`${passed ? "PASS" : "FAIL"} ${label}`);
if (failures.length) process.exit(1);
```

- [ ] **Step 2: Add the package command**

Add this script without changing dependencies:

```json
"check:portfolio": "node scripts/check-portfolio-redesign.mjs"
```

- [ ] **Step 3: Run the data group and verify the intended failure**

Run: `pnpm check:portfolio -- data`

Expected: exit 1 with `FAIL typed portfolio export` because `src/data/portfolio.ts` does not exist.

- [ ] **Step 4: Create the typed homepage data contract**

Define these exported interfaces exactly:

```ts
export type ProjectVariant = "flagship" | "study" | "opencore" | "embedded";

export interface PortfolioLink {
  label: string;
  href: string;
  external: boolean;
}

export interface PortfolioProject {
  slug: "eazy-review" | "networking-study" | "opencore" | "bci";
  variant: ProjectVariant;
  eyebrow: string;
  title: string;
  description: string;
  technologies: readonly string[];
  links: readonly PortfolioLink[];
  image: string;
  imageAlt: string;
}

export interface PortfolioData {
  identity: {
    name: "Tianzhe Hu";
    initials: "TH";
    role: "Software Engineer";
    location: "New York";
    url: string;
    avatarUrl: string;
    description: string;
  };
  navigation: readonly { label: "Work" | "Approach" | "Background"; href: string }[];
  hero: {
    eyebrow: string;
    headline: string;
    introduction: string;
    service: string;
  };
  priorities: readonly { number: "01" | "02" | "03"; title: string; description: string }[];
  projects: readonly PortfolioProject[];
  approach: readonly { number: "01" | "02" | "03"; title: string; description: string }[];
  background: readonly {
    kind: "experience" | "education";
    eyebrow: string;
    title: string;
    description: string;
    period: string;
  }[];
  capabilities: readonly { title: string; technologies: readonly string[] }[];
  contact: {
    email: string;
    github: string;
    linkedin: string;
  };
}
```

`PORTFOLIO` contains identity, hero, priorities, four projects, three approach records, two background records, three capability groups, and contact/social values. Use the exact approved copy from the spec. Use these local project paths:

```ts
image: "/portfolio/eazy-review-phone.webp"
image: "/networking-study-platform.png"
image: "/portfolio/opencore-terminal.webp"
image: "/portfolio/bci-waveform.webp"
```

- [ ] **Step 5: Run data checks and static type validation**

Run: `pnpm check:portfolio -- data`

Expected: all six data checks print `PASS`.

Run: `pnpm exec tsc --noEmit`

Expected: exit 0.

- [ ] **Step 6: Record the local checkpoint**

Run: `test ! -d .git && printf '%s\n' 'Local checkpoint: data contract complete; Git unavailable'`

Expected: the checkpoint line prints and no Git operation is attempted.

---

### Task 2: Reference-Matched Project Assets

**Files:**

- Create: `public/portfolio/eazy-review-phone.webp`
- Create: `public/portfolio/opencore-terminal.webp`
- Create: `public/portfolio/bci-waveform.webp`

**Interfaces:**

- Consumes: The two selected full-page reference images and existing Eazy Review visual language.
- Produces: Three raster assets at the exact public paths already declared by `PORTFOLIO.projects`.

- [ ] **Step 1: Run the asset gate and verify the intended failure**

Run: `pnpm check:portfolio -- assets`

Expected: the existing study screenshot passes and the three missing portfolio assets fail.

- [ ] **Step 2: Generate the Eazy Review phone visual with ImageGen**

Use the desktop and mobile references as visual grounding. Generate a clean isolated project illustration: a slightly clockwise-tilted black smartphone on a deep ink background, showing an Eazy Review product-rating interface with a cobalt/periwinkle product block, a bold 8.4 score, `/ 10`, `Community score`, and three cobalt rating lines. Match the reference's editorial vector/raster style, perspective, soft cobalt glow, and high contrast. Do not add extra UI, logos, hands, scenery, or dummy text.

Inspect the result, then use ImageMagick with `-resize 1200x900^ -gravity center -extent 1200x900 -quality 90` to normalize the exact local file returned by ImageGen to `public/portfolio/eazy-review-phone.webp`. The phone must remain fully inside the safe area.

- [ ] **Step 3: Generate the OpenCore terminal visual with ImageGen**

Use the selected references as grounding. Generate a single slightly rotated rounded black terminal panel on a pale green background with a restrained blue-green glow. The panel shows concise maintenance status rows with green check marks for ACPI tables, kext order, device properties, and compatibility notes. Match the reference composition; do not add a laptop, desk, photograph, floating icons, or additional panels.

Use ImageMagick with `-resize 1200x800^ -gravity center -extent 1200x800 -quality 90` to normalize the exact local file returned by ImageGen to `public/portfolio/opencore-terminal.webp`.

- [ ] **Step 4: Generate the BCI waveform visual with ImageGen**

Use the selected references as grounding. Generate a minimal electric-blue biosignal waveform centered on a transparent-looking warm-neutral background. It must be one thin angular line with no axes, labels, grid, medical icon, device, or surrounding decoration. Match the reference's horizontal density and stroke character.

Use ImageMagick with `-resize 800x300^ -gravity center -extent 800x300 -quality 92` to normalize the exact local file returned by ImageGen to `public/portfolio/bci-waveform.webp`.

- [ ] **Step 5: Generate the static grid texture with ImageGen**

Generate a seamless warm-neutral editorial grid texture grounded in the selected references: background `#f3f2ec`, very thin low-contrast warm-gray square rules, no text, symbols, lighting, depth, objects, paper fibers, or color variation. Normalize the returned result to a 1024 x 1024 WebP at `public/portfolio/grid-texture.webp`. The stylesheet may tile this real raster asset; it must not recreate the grid with CSS gradients.

- [ ] **Step 6: Inspect the normalized assets**

Open all three local WebP files. Reject any crop with clipped devices, illegible accidental text, mismatched backgrounds, extra objects, or visual language inconsistent with the selected references. Regenerate once when a P0-P2 asset mismatch is visible.

- [ ] **Step 7: Run the asset gate**

Run: `pnpm check:portfolio -- assets`

Expected: all five asset checks print `PASS`.

- [ ] **Step 8: Record the local checkpoint**

Run: `test ! -d .git && printf '%s\n' 'Local checkpoint: project assets complete; Git unavailable'`

---

### Task 3: Root Shell, Metadata, and Sticky Header

**Files:**

- Create: `src/components/portfolio/site-header.tsx`
- Create: `src/app/portfolio.css`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/opengraph-image.tsx`
- Modify: `src/app/projects/eazy-review/page.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**

- Consumes: `PORTFOLIO.identity`, `PORTFOLIO.navigation`, and `PORTFOLIO.contact`.
- Produces: `SiteHeader(): JSX.Element`, route-local page containers, and exact metadata title/description.

- [ ] **Step 1: Run the shell group and verify failure**

Run: `pnpm check:portfolio -- shell`

Expected: exit 1 because the old root layout still imports the animated grid and global dock.

- [ ] **Step 2: Simplify the root layout**

Keep Geist and Geist Mono, import `./globals.css` and `./portfolio.css`, and render children directly:

```tsx
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="light">
      <body className={`${geist.variable} ${geistMono.variable} min-h-screen font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
```

Set the default, Open Graph, and Twitter title to `Tianzhe Hu — Software Engineer`. Set the description to the approved hero introduction. Remove `Navbar`, `ThemeProvider`, `TooltipProvider`, `FlickeringGrid`, and the inline theme initializer from this file.

- [ ] **Step 3: Give the case-study route its own existing-width container**

Change only the `<main>` class in `src/app/projects/eazy-review/page.tsx`:

```tsx
<main className="case-study-page mx-auto flex min-h-dvh w-full max-w-2xl flex-col gap-20 px-6 py-12 pb-20 sm:py-24">
```

Do not alter its copy, evidence URLs, dates, claims, or metadata.

- [ ] **Step 4: Update the generated social image identity**

Import `PORTFOLIO`, use `PORTFOLIO.identity.name`, `initials`, `avatarUrl`, `url`, and `description`, and keep the existing image-response failure fallback.

- [ ] **Step 5: Create the semantic sticky header**

The component returns `<header className="portfolio-header" id="top">`. Use a monogram link to `/`, desktop anchor links to `#work`, `#approach`, and `#background`, and an email link to `mailto:${PORTFOLIO.contact.email}`. External/email controls get 44px hit areas and visible focus styling. The mobile nav hides only `.portfolio-header__nav`, not the name or Email action.

- [ ] **Step 6: Establish the homepage composition shell**

Replace the old homepage with this temporary composition before later tasks fill it:

```tsx
import { SiteHeader } from "@/components/portfolio/site-header";

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main className="portfolio-page">
        <div id="work" />
        <div id="approach" />
        <div id="background" />
      </main>
    </>
  );
}
```

- [ ] **Step 7: Add the first scoped shell styles**

Define the fixed colors as CSS custom properties on `.portfolio-page` and `.portfolio-header`; tile `/portfolio/grid-texture.webp` at 32px on desktop and 16px on mobile; set the sticky 72px desktop/46px mobile header, 1120px content width, focus outline, and 44px control height. The grid is a static page-owned raster asset, not a React animation or CSS gradient.

- [ ] **Step 8: Run shell, lint, and type checks**

Run: `pnpm check:portfolio -- shell && pnpm lint && pnpm exec tsc --noEmit`

Expected: all shell checks pass; lint and TypeScript exit 0.

- [ ] **Step 9: Record the local checkpoint**

Run: `test ! -d .git && printf '%s\n' 'Local checkpoint: shell and header complete; Git unavailable'`

---

### Task 4: Hero and Shared Section Heading

**Files:**

- Create: `src/components/portfolio/section-heading.tsx`
- Create: `src/components/portfolio/hero-section.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/portfolio.css`

**Interfaces:**

- Consumes: `PORTFOLIO.hero`, `PORTFOLIO.priorities`, and `PORTFOLIO.contact`.
- Produces: `SectionHeading({ number, label, title, description, id })` and `HeroSection()`.

- [ ] **Step 1: Run the hero group and verify failure**

Run: `pnpm check:portfolio -- hero`

Expected: exit 1 because `hero-section.tsx` does not exist.

- [ ] **Step 2: Implement the shared section-heading contract**

Use this interface:

```tsx
interface SectionHeadingProps {
  number: "01" | "02" | "03" | "04";
  label: string;
  title: string;
  description: string;
  id: string;
}
```

Render a `.section-intro` with monospaced label rail and a content wrapper containing the H2 and description. The H2 receives `id={`${id}-title`}`.

- [ ] **Step 3: Implement the hero**

Render one H1 with the approved headline, the introduction, `View selected work` and GitHub CTAs, the Army Reserve record, and an `<aside className="engineering-priorities" aria-labelledby="engineering-priorities-title">`. Map the three numbered priority records with two-digit numbers.

Use Lucide `ArrowDown` and `ArrowUpRight` only for standard CTA icons. Give decorative blue/green status dots `aria-hidden="true"`.

- [ ] **Step 4: Add the hero to the homepage**

Place `<HeroSection />` immediately after `<SiteHeader />` and before the temporary Selected Work anchor.

- [ ] **Step 5: Add responsive hero styles**

Mobile: 12px gutters, 40-42px H1, stacked priorities panel, CTA wrapping, and reference-matched vertical rhythm. Desktop: approximately 1020px hero region, 92px H1 in the left column, priorities card at lower right, and reference-matched row dividers. Use `clamp()` only between the approved mobile and desktop sizes.

- [ ] **Step 6: Run hero, lint, and type checks**

Run: `pnpm check:portfolio -- hero && pnpm lint && pnpm exec tsc --noEmit`

Expected: all checks exit 0.

- [ ] **Step 7: Record the local checkpoint**

Run: `test ! -d .git && printf '%s\n' 'Local checkpoint: hero complete; Git unavailable'`

---

### Task 5: Tiered Selected Work

**Files:**

- Create: `src/components/portfolio/selected-work.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/portfolio.css`

**Interfaces:**

- Consumes: `PORTFOLIO.projects: readonly PortfolioProject[]` and all four asset paths.
- Produces: `SelectedWork()` with explicit `FlagshipProject`, `StudyProject`, `OpenCoreProject`, and `EmbeddedProject` internal components.

- [ ] **Step 1: Run the work group and verify failure**

Run: `pnpm check:portfolio -- work`

Expected: exit 1 because the selected-work component and variant class markers do not exist.

- [ ] **Step 2: Implement the shared project primitives**

Inside `selected-work.tsx`, add local `ProjectEyebrow`, `ProjectLinks`, and `ProjectImage` helpers. `ProjectLinks` uses Next `Link` for internal URLs and `<a target="_blank" rel="noopener noreferrer">` for external URLs. Each link label remains explicit; the entire card is never clickable.

- [ ] **Step 3: Implement the flagship variant**

Render `.project-card--flagship` with the Eazy Review eyebrow, title, technical summary, technology line, case-study link, GitHub link, and `eazy-review-phone.webp`. Desktop copy sits left and the phone visual right; mobile stacks the phone beneath copy. The phone image uses descriptive alt text and `sizes="(min-width: 768px) 42vw, 90vw"`.

- [ ] **Step 4: Implement the study variant**

Render `.project-card--study` with the 404-question summary, evergreen product proof, live-site and GitHub links, and the real networking screenshot. Do not render traffic analytics or dated metric metadata. Position the screenshot as a browser-like product crop using `object-fit`/`object-position`, not CSS-generated UI.

- [ ] **Step 5: Implement the OpenCore and embedded variants**

OpenCore uses `.project-card--opencore`, its maintenance summary/technology line/repository link, and the local terminal visual. BCI uses `.project-card--embedded`, the exact embedded summary, repository/title link, and local waveform visual.

- [ ] **Step 6: Compose the work section**

Render `<section id="work" aria-labelledby="work-title">` with `SectionHeading`, then the flagship, asymmetric study/OpenCore row, and compact BCI row. Select project records by `slug` and throw a descriptive build-time error if any required record is missing:

```ts
const requireProject = (slug: PortfolioProject["slug"]) => {
  const project = PORTFOLIO.projects.find((item) => item.slug === slug);
  if (!project) throw new Error(`Missing portfolio project: ${slug}`);
  return project;
};
```

- [ ] **Step 7: Add work-section responsive styles**

Desktop: 1120px flagship, 500px approximate height; 646/456 asymmetric secondary row with a 20px gap, equal-height card surfaces, and bottom-aligned visuals; compact full-width BCI row. Mobile: all cards stack at natural content heights, visuals move beneath copy, reference radii/colors/padding are retained, and no horizontal overflow appears at 390px.

- [ ] **Step 8: Run work, asset, lint, and type checks**

Run: `pnpm check:portfolio -- work && pnpm check:portfolio -- assets && pnpm lint && pnpm exec tsc --noEmit`

Expected: all checks exit 0.

- [ ] **Step 9: Record the local checkpoint**

Run: `test ! -d .git && printf '%s\n' 'Local checkpoint: Selected Work complete; Git unavailable'`

---

### Task 6: Approach, Background, Capabilities, and Contact

**Files:**

- Create: `src/components/portfolio/approach-section.tsx`
- Create: `src/components/portfolio/background-section.tsx`
- Create: `src/components/portfolio/capabilities-section.tsx`
- Create: `src/components/portfolio/contact-footer.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/portfolio.css`

**Interfaces:**

- Consumes: `PORTFOLIO.approach`, `background`, `capabilities`, and `contact`.
- Produces: Four server components in the approved page order.

- [ ] **Step 1: Run the sections group and verify failure**

Run: `pnpm check:portfolio -- sections`

Expected: exit 1 because the four section files do not exist.

- [ ] **Step 2: Implement Approach**

Render `<section id="approach" aria-labelledby="approach-title">` with `SectionHeading` and three ordered `.approach-card` articles. Each card includes a two-digit number, exact title, and exact description. Blue top rules are borders, not decorative SVG/CSS illustrations.

- [ ] **Step 3: Implement Background**

Render `<section id="background" aria-labelledby="background-title">` with two always-open articles. Use semantic `<time>` elements, visible labels for Experience/Military service and Education, and no accordion or disclosure state.

- [ ] **Step 4: Implement Capabilities**

Render `<section id="capabilities" aria-labelledby="capabilities-title">` with three ruled groups. Technologies remain plain comma-separated text and never become badges or icon pills.

- [ ] **Step 5: Implement the Contact footer**

Render `<footer id="contact" className="contact-footer">` with the approved heading/copy, email pill, GitHub and LinkedIn rows, and `<a href="#top">Back to top</a>`. Include `Tianzhe Hu · Software Engineer` and `Design concept · August 2026`. Use Lucide `ArrowUpRight` and `ArrowUp` only for interface direction.

- [ ] **Step 6: Compose the final homepage order**

`src/app/page.tsx` must be exactly this section order:

```tsx
<SiteHeader />
<main className="portfolio-page">
  <HeroSection />
  <SelectedWork />
  <ApproachSection />
  <BackgroundSection />
  <CapabilitiesSection />
</main>
<ContactFooter />
```

- [ ] **Step 7: Add responsive section/footer styles**

Desktop: left label rail, three Approach columns, two Background cards, three Capabilities columns, and two-column footer. Mobile: every group stacks with the selected padding and spacing; Contact links become full-width rows. Preserve the dark footer contrast and lime section label.

- [ ] **Step 8: Run sections, lint, and type checks**

Run: `pnpm check:portfolio -- sections && pnpm lint && pnpm exec tsc --noEmit`

Expected: all checks exit 0.

- [ ] **Step 9: Record the local checkpoint**

Run: `test ! -d .git && printf '%s\n' 'Local checkpoint: remaining sections complete; Git unavailable'`

---

### Task 7: Responsive Fidelity and Accessibility Pass

**Files:**

- Modify: `src/app/portfolio.css`
- Modify: `src/app/globals.css`
- Modify: homepage components only when the stylesheet exposes a semantic/accessibility defect

**Interfaces:**

- Consumes: Completed component class names and the selected 1440px/390px references.
- Produces: Stable 390px-to-1440px responsive behavior, reduced-motion handling, and WCAG-aware interaction states.

- [ ] **Step 1: Run the styles group and verify any missing acceptance markers fail**

Run: `pnpm check:portfolio -- styles`

Expected before the pass: any missing `@media (min-width: 768px)`, `prefers-reduced-motion`, `scroll-margin-top`, or `min-height: 44px` marker reports `FAIL`.

- [ ] **Step 2: Complete global scoped styles**

Add:

```css
.portfolio-page section[id] {
  scroll-margin-top: 88px;
}

.portfolio-page a:focus-visible,
.portfolio-header a:focus-visible,
.contact-footer a:focus-visible {
  outline: 3px solid #3d5fec;
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .portfolio-page *, .portfolio-header *, .contact-footer * {
    transition-duration: 0.01ms !important;
  }
}
```

Ensure all CTA/link hit areas use `min-height: 44px`, body overflow is clipped only on the x-axis, images use `max-width: 100%`, and no content relies on hover to become visible.

- [ ] **Step 3: Check intermediate widths without changing the approved breakpoint**

Inspect at 768px, 1024px, and 1280px. Fix only fluid spacing, wrapping, and size interpolation; do not add new visual breakpoints that change the information hierarchy.

- [ ] **Step 4: Verify semantic and keyboard behavior in source**

Confirm one H1, ordered H2 structure, unique IDs, descriptive alt text, `aria-labelledby` on complex sections, `aria-hidden` on decorative icons, `rel="noopener noreferrer"` on external targets, and no positive `tabIndex`.

- [ ] **Step 5: Run all structural and static checks**

Run: `pnpm check:portfolio -- all`

Expected: every structural line prints `PASS`.

Run: `pnpm lint && pnpm exec tsc --noEmit && pnpm build`

Expected: all three commands exit 0.

- [ ] **Step 6: Record the local checkpoint**

Run: `test ! -d .git && printf '%s\n' 'Local checkpoint: static and responsive implementation complete; Git unavailable'`

---

### Task 8: In-App Browser Verification and Design QA Gate

**Files:**

- Create: `design-qa.md`
- Modify: implementation files only for verified P0-P2 findings
- Save screenshots outside repository: `/tmp/portfolio-redesign-desktop.png` and `/tmp/portfolio-redesign-mobile.png`

**Interfaces:**

- Consumes: Local Next.js preview, selected reference PNGs, and completed homepage.
- Produces: Rendered interaction evidence and `design-qa.md` with `final result: passed` or an honest blocked result.

- [ ] **Step 1: Start the local app on an exact stable host/port**

Run: `pnpm dev -- --hostname 127.0.0.1 --port 3000`

Keep the server running for the remaining steps.

- [ ] **Step 2: Open the preview through the in-app Browser**

Name the Browser session, acquire the in-app tab, navigate to `http://127.0.0.1:3000/`, and verify URL/title identity.

Target flow: homepage loads -> hero renders -> header/CTA anchors navigate to their sections -> external and mail links expose the correct destinations -> back to top returns to the header.

- [ ] **Step 3: Run required browser-health checks**

At desktop and mobile widths verify:

- Meaningful DOM, not a blank shell.
- No Next.js/framework overlay.
- No relevant console errors or warnings.
- No horizontal overflow.
- All local image requests return successfully.
- Sticky header and mobile simplification match the references.
- Work, Approach, and Background anchors move to visible section headings.
- Case-study link reaches `/projects/eazy-review` and its existing evidence page renders.
- Email, GitHub, LinkedIn, study live-site, repository, and back-to-top links expose the correct targets.
- Keyboard focus is visibly rendered on the primary CTA and header Email action.

- [ ] **Step 4: Capture same-width rendered evidence**

Capture a 1440px-wide full-page screenshot to `/tmp/portfolio-redesign-desktop.png` and a 390px-wide full-page screenshot to `/tmp/portfolio-redesign-mobile.png` using the in-app Browser screenshot API.

- [ ] **Step 5: Compare reference and implementation together**

Open each reference beside its same-width rendered capture. Create a mismatch ledger with severity:

- P0: missing/broken content or interaction.
- P1: hierarchy, layout, or asset mismatch that changes the design.
- P2: clear spacing, type, color, crop, border, or responsive mismatch.
- P3: small polish difference with no material fidelity or usability effect.

Fix every P0-P2, reload the same Browser tab, repeat console/interaction checks, and recapture the affected viewport. Do not loop solely on P3 polish.

- [ ] **Step 6: Write the blocking QA report**

`design-qa.md` must contain:

```md
# Portfolio Editorial Redesign Design QA

- references: desktop 1440px; mobile 390px
- rendered captures: /tmp/portfolio-redesign-desktop.png; /tmp/portfolio-redesign-mobile.png
- page identity: passed
- framework overlay: passed
- console health: passed
- primary interactions: passed
- desktop fidelity: passed
- mobile fidelity: passed
- unresolved P0-P2: none
- P3 follow-ups: none

final result: passed
```

If Browser capture or comparison is unavailable, replace the final line with `final result: blocked` and state the exact blocker. Never claim visual acceptance from build output alone.

- [ ] **Step 7: Run the final static checks after visual fixes**

Run: `pnpm check:portfolio -- all && pnpm lint && pnpm exec tsc --noEmit && pnpm build`

Expected: all commands exit 0 and `design-qa.md` says `final result: passed`.

- [ ] **Step 8: Leave the verified preview running and report the local-only completion boundary**

Provide the clickable Codex Desktop preview URL. Report desktop/mobile viewport evidence, interaction coverage, console status, static command results, any P3 notes, and the lack of Git/deployment actions.
