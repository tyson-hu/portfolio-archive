# Portfolio IA and Eazy Review Reframe Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reframe the portfolio shell, homepage hero, and Eazy Review case study into the approved recruiter-facing information architecture while preserving factual evidence and keeping the result local-only for human review.

**Architecture:** Keep the existing Next.js App Router and editorial CSS architecture. Put typed portfolio destinations and hero copy in `src/data/portfolio.ts`, isolate only the mobile dialog and case-study current-section behavior as client components, keep all case content server-rendered, and lock each slice with dependency-free source contracts before rendered-browser acceptance.

**Tech Stack:** Next.js 16.1.1, React 19.2.3, TypeScript 5.9.3, CSS, native `dialog` and `details` elements, Lucide React, pnpm.

**Spec:** `docs/superpowers/specs/2026-08-19-portfolio-ia-case-study-reframe-design.md`

## Global Constraints

- The dirty local checkout is the source of truth. Do not reset, stash, clean, or overwrite unrelated work.
- Before any implementation edit, create and verify the recoverable snapshot at `/tmp/portfolio-ia-reframe-2026-08-19/source-before/` with a sorted SHA-256 manifest.
- Do not add dependencies or replace the existing editorial visual language.
- Writing is exactly `https://blog.tianzhe.me` and Lab is exactly `https://lab.tianzhe.me`; both must pass the public HTTPS/HTML preflight before being encoded.
- Preserve the evidence commit `72149320c328532d2fb2e01da944bfa4b3cc9244`, every enumerated evidence key, the `dataModel` and `tasks` links, and the four frozen boundary statements.
- Product Flow, real product screenshots, public role/ownership, lifecycle status, and a `View product flow` action remain absent in this pass.
- Do not present `public/portfolio/eazy-review-phone.webp` as product-flow proof.
- Preserve the existing 3px focus outline and reduced-motion contract. New buttons and disclosure summaries must join those selectors.
- Acceptance is staged against the approved spec only; it is not full acceptance of the original audit.
- Do not run `git add`, `git commit`, `git push`, `gh pr`, OpenNext deployment, Wrangler deployment, or any production operation.
- The normal frequent-commit step in the planning skill is superseded by the approved local-only gate. Each task ends with focused tests and a scoped diff review instead.
- Use the in-app Browser for rendered QA. Do not install or silently substitute standalone Playwright.
- If actual 200% browser text zoom cannot be exercised, record it as not run and block staged acceptance.

## File Map

- Modify `scripts/check-portfolio-redesign.mjs` — replace obsolete source contracts and add focused navigation, hero, case-study, and responsive/accessibility groups.
- Modify `src/data/portfolio.ts` — own typed shared destinations, the short identity form, and approved hero content.
- Modify `src/components/portfolio/site-header.tsx` — render the combined home identity, route-aware desktop destinations, internal Contact, and the mobile client boundary.
- Create `src/components/portfolio/mobile-navigation.tsx` — own native mobile-dialog state, closure, focus return, and mobile destination rendering.
- Modify `src/components/portfolio/contact-footer.tsx` — propagate Writing and Lab from shared data while retaining email, GitHub, LinkedIn, and Back to top.
- Modify `src/components/portfolio/hero-section.tsx` — render the approved data-driven hero without presentation-only line breaks or duplicated identity.
- Create `src/components/portfolio/case-study-nav.tsx` — render server-visible section links and observe the current case-study section.
- Modify `src/app/projects/eazy-review/page.tsx` — add At a Glance, change the action hierarchy, expose concise decision results, group verification evidence, and provide exact section IDs.
- Modify `src/app/portfolio.css` — compose the dialog, hero fold, case-study navigation, disclosures, type floors, focus states, and responsive behavior.
- No other source file is in scope unless a focused test demonstrates that one of these interfaces cannot be integrated without it.

---

### Task 1: Protect the local source and record the baseline

**Files:**
- Read: `docs/superpowers/specs/2026-08-19-portfolio-ia-case-study-reframe-design.md`
- Read: `package.json`
- Create outside repository: `/tmp/portfolio-ia-reframe-2026-08-19/source-before/`
- Create outside repository: `/tmp/portfolio-ia-reframe-2026-08-19/evidence/`
- Test: existing repository checks

**Interfaces:**
- Consumes: the dirty working tree and the approved spec.
- Produces: an exact source snapshot, matching working/snapshot SHA-256 manifests, external-destination evidence, and baseline logs used by every later task.

- [ ] **Step 1: Reconfirm repository identity and record the untouched state**

Run:

```bash
cd /Users/tysonhu/Documents/Portfolio
git rev-parse --show-toplevel
git rev-parse HEAD
git status --short --branch
```

Expected: top level is `/Users/tysonhu/Documents/Portfolio`; HEAD is recorded without interpreting the dirty tree as a failure.

- [ ] **Step 2: Copy tracked and nonignored untracked source to the fixed snapshot path**

Run exactly once before source edits:

```zsh
set -euo pipefail
portfolio_repo=/Users/tysonhu/Documents/Portfolio
snapshot_root=/tmp/portfolio-ia-reframe-2026-08-19
if [[ -e $snapshot_root/source-before || -e $snapshot_root/source-before-files.z ]]
then
  print -u2 -- "Snapshot path already exists; inspect it before continuing."
  exit 1
fi
mkdir -p $snapshot_root/source-before $snapshot_root/evidence/baseline $snapshot_root/evidence/static $snapshot_root/evidence/build $snapshot_root/evidence/browser $snapshot_root/evidence/screenshots
cd $portfolio_repo
git rev-parse HEAD > $snapshot_root/source-before-head.txt
git status --porcelain=v2 --branch > $snapshot_root/source-before-status.txt
git ls-files -co --exclude-standard -z | LC_ALL=C sort -z > $snapshot_root/source-before-files.z
rsync -a --from0 --files-from=$snapshot_root/source-before-files.z $portfolio_repo/ $snapshot_root/source-before/
(cd $portfolio_repo && xargs -0 shasum -a 256 < $snapshot_root/source-before-files.z) > $snapshot_root/source-before-working.sha256
(cd $snapshot_root/source-before && xargs -0 shasum -a 256 < $snapshot_root/source-before-files.z) > $snapshot_root/source-before-copy.sha256
cmp $snapshot_root/source-before-working.sha256 $snapshot_root/source-before-copy.sha256
```

Expected: `cmp` exits 0. If it does not, stop before editing and repair the snapshot process without deleting the working tree.

- [ ] **Step 3: Preflight the approved Writing and Lab destinations**

Run:

```zsh
set -euo pipefail
snapshot_root=/tmp/portfolio-ia-reframe-2026-08-19
: > $snapshot_root/evidence/baseline/external-destinations.txt
for external_url in https://blog.tianzhe.me https://lab.tianzhe.me
do
  read -r http_status effective content_type <<< "$(curl --silent --show-error --location --max-redirs 5 --connect-timeout 10 --max-time 20 --proto '=https' --proto-redir '=https' --output /dev/null --write-out '%{http_code} %{url_effective} %{content_type}' $external_url)"
  print -r -- "$external_url	$http_status	$effective	$content_type" | tee -a $snapshot_root/evidence/baseline/external-destinations.txt
  [[ $http_status == 2?? || $http_status == 3?? ]]
  [[ $effective == $external_url || $effective == $external_url/ || $effective == $external_url/* ]]
  [[ $content_type == text/html* ]]
done
```

Expected: both responses remain on their approved HTTPS host and report a successful HTML response. Any mismatch pauses execution for user direction; do not substitute another URL.

- [ ] **Step 4: Record the pre-change static and type baseline**

Run:

```zsh
set -euo pipefail
snapshot_root=/tmp/portfolio-ia-reframe-2026-08-19
pnpm check:portfolio -- all | tee $snapshot_root/evidence/baseline/portfolio-contracts.txt
node scripts/check-theme-initializer-fixtures.mjs | tee $snapshot_root/evidence/baseline/theme-fixtures.txt
pnpm lint | tee $snapshot_root/evidence/baseline/lint.txt
pnpm exec tsc --noEmit | tee $snapshot_root/evidence/baseline/typescript.txt
pnpm build | tee $snapshot_root/evidence/baseline/next-build.txt
```

Expected: all five commands exit 0. If an inherited failure appears, preserve its log and stop before implementation rather than folding it into this change.

- [ ] **Step 5: Verify that the snapshot is still recoverable**

Run:

```zsh
cmp /tmp/portfolio-ia-reframe-2026-08-19/source-before-working.sha256 /tmp/portfolio-ia-reframe-2026-08-19/source-before-copy.sha256
```

Expected: exit 0.

---

### Task 2: Build the typed shared navigation and mobile dialog

**Files:**
- Modify: `scripts/check-portfolio-redesign.mjs:4-36,113-190,248-407`
- Modify: `src/data/portfolio.ts:1-100`
- Modify: `src/components/portfolio/site-header.tsx:1-35`
- Create: `src/components/portfolio/mobile-navigation.tsx`
- Modify: `src/components/portfolio/contact-footer.tsx:1-51`
- Modify: `src/app/projects/eazy-review/page.tsx:15-17,297-303`
- Modify: `src/app/portfolio.css:31-48,740-940,1070-1155`
- Test: `pnpm check:portfolio -- navigation`

**Interfaces:**
- Consumes: `PORTFOLIO.identity`, `PORTFOLIO.contact`, and the approved section/external destination contract.
- Produces:
  - `PortfolioNavigationSurface = "desktop" | "mobile"`
  - `PortfolioArea = "work"`
  - `PortfolioSectionHrefPrefix = "" | "/"`
  - `PortfolioNavigationItem` as the section/external discriminated union
  - `resolvePortfolioNavigationHref(item, sectionHrefPrefix): string`
  - `SiteHeader({ sectionHrefPrefix?: PortfolioSectionHrefPrefix, currentArea?: PortfolioArea })`
  - `MobileNavigation({ items, sectionHrefPrefix, githubHref, currentArea })`

- [ ] **Step 1: Add a navigation contract that fails against the current source**

Add these path helpers near the existing checker helpers:

```js
const occurrenceCount = (path, value) => read(path).split(value).length - 1;
const portfolioDataPath = "src/data/portfolio.ts";
const headerPath = "src/components/portfolio/site-header.tsx";
const mobileNavigationPath = "src/components/portfolio/mobile-navigation.tsx";
const footerPath = "src/components/portfolio/contact-footer.tsx";
const heroPath = "src/components/portfolio/hero-section.tsx";
const caseStudyPath = "src/app/projects/eazy-review/page.tsx";
```

Add a `navigation` group with these exact assertions:

```js
navigation: [
  [
    "typed section and external navigation",
    allContain(portfolioDataPath, [
      'export type PortfolioNavigationSurface = "desktop" | "mobile"',
      'export type PortfolioArea = "work"',
      'export type PortfolioSectionHrefPrefix = "" | "/"',
      "export type PortfolioNavigationItem =",
      'kind: "section"',
      'kind: "external"',
      "surfaces: readonly PortfolioNavigationSurface[]",
      "resolvePortfolioNavigationHref",
    ]),
  ],
  [
    "canonical Writing and Lab destinations",
    allContain(portfolioDataPath, [
      'label: "Writing"',
      'href: "https://blog.tianzhe.me"',
      'label: "Lab"',
      'href: "https://lab.tianzhe.me"',
    ]),
  ],
  [
    "single combined header identity",
    occurrenceCount(headerPath, 'href="/"') === 1 &&
      allContain(headerPath, ["portfolio-header__home", "identity.shortName"]) &&
      excludes(headerPath, "portfolio-header__role"),
  ],
  [
    "header Contact stays inside the portfolio",
    allContain(headerPath, [
      "sectionHrefPrefix",
      'className="portfolio-header__contact"',
      "Contact",
    ]) &&
      excludes(headerPath, "mailto:"),
  ],
  [
    "project route marks Work current",
    allContain(headerPath, [
      "currentArea?: PortfolioArea",
      'currentArea === "work"',
      'aria-current={isCurrent ? "page" : undefined}',
    ]) &&
      contains(caseStudyPath, 'currentArea="work"'),
  ],
  [
    "native mobile navigation",
    present(mobileNavigationPath) &&
      allContain(mobileNavigationPath, [
        '"use client"',
        "<dialog",
        ".showModal()",
        'aria-haspopup="dialog"',
        "onClose={handleDialogClose}",
        "triggerRef.current?.focus()",
        "event.target === event.currentTarget",
      ]),
  ],
  [
    "mobile destination set",
    allContain(mobileNavigationPath, [
      '.surfaces.includes("mobile")',
      "Contact",
      "GitHub",
      'target="_blank"',
      'rel="noopener noreferrer"',
      "opens in a new tab",
    ]),
  ],
  [
    "footer propagates ecosystem destinations",
    allContain(footerPath, [
      "navigation",
      'item.kind === "external"',
      "ecosystemLinks.map",
      "opens in a new tab",
    ]) &&
      contains(footerPath, 'href={`mailto:${contact.email}`}'),
  ],
],
```

Replace the obsolete checker expectations for header email propagation, blind nested-route prefixing, and `<SiteHeader sectionHrefPrefix="/" />`. Keep the footer email assertion.

- [ ] **Step 2: Run the focused checker and preserve the intended red state**

Run:

```zsh
set +e
pnpm check:portfolio -- navigation | tee /tmp/portfolio-ia-reframe-2026-08-19/evidence/static/01-navigation-red.txt
navigation_status=$pipestatus[1]
set -e
test $navigation_status -eq 1
rg '^FAIL ' /tmp/portfolio-ia-reframe-2026-08-19/evidence/static/01-navigation-red.txt
```

Expected: the new navigation assertions fail because the typed destinations, internal Contact, combined identity, mobile dialog, and footer ecosystem links do not yet exist.

- [ ] **Step 3: Define the shared destination types and exact data**

Add before `PortfolioData`:

```ts
export type PortfolioNavigationSurface = "desktop" | "mobile";
export type PortfolioArea = "work";
export type PortfolioSectionHrefPrefix = "" | "/";

export type PortfolioNavigationItem =
  | {
      kind: "section";
      label: "Work" | "About" | "Background";
      href: `#${string}`;
      surfaces: readonly PortfolioNavigationSurface[];
    }
  | {
      kind: "external";
      label: "Writing" | "Lab";
      href: `https://${string}`;
      surfaces: readonly PortfolioNavigationSurface[];
    };

export function resolvePortfolioNavigationHref(
  item: PortfolioNavigationItem,
  sectionHrefPrefix: PortfolioSectionHrefPrefix,
): string {
  return item.kind === "section"
    ? `${sectionHrefPrefix}${item.href}`
    : item.href;
}
```

Add `shortName: "Tyson Hu"` to the identity interface and data. Replace only the navigation interface with:

```ts
navigation: readonly PortfolioNavigationItem[];
```

Leave the existing hero interface and data unchanged until Task 3 so this task remains independently type-correct.

Replace the navigation data with:

```ts
navigation: [
  {
    kind: "section",
    label: "Work",
    href: "#work",
    surfaces: ["desktop", "mobile"],
  },
  {
    kind: "external",
    label: "Writing",
    href: "https://blog.tianzhe.me",
    surfaces: ["desktop", "mobile"],
  },
  {
    kind: "external",
    label: "Lab",
    href: "https://lab.tianzhe.me",
    surfaces: ["desktop", "mobile"],
  },
  {
    kind: "section",
    label: "About",
    href: "#about",
    surfaces: ["desktop", "mobile"],
  },
  {
    kind: "section",
    label: "Background",
    href: "#background",
    surfaces: ["mobile"],
  },
],
```

- [ ] **Step 4: Replace the header with one route-aware identity and desktop navigation**

Use this component structure:

```tsx
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { MobileNavigation } from "@/components/portfolio/mobile-navigation";
import {
  PORTFOLIO,
  resolvePortfolioNavigationHref,
  type PortfolioArea,
  type PortfolioSectionHrefPrefix,
} from "@/data/portfolio";

type SiteHeaderProps = {
  sectionHrefPrefix?: PortfolioSectionHrefPrefix;
  currentArea?: PortfolioArea;
};

export function SiteHeader({
  sectionHrefPrefix = "",
  currentArea,
}: SiteHeaderProps) {
  const { identity, navigation, contact } = PORTFOLIO;
  const desktopItems = navigation.filter((item) =>
    item.surfaces.includes("desktop"),
  );
  const contactHref = `${sectionHrefPrefix}#contact`;

  return (
    <header className="portfolio-header">
      <div className="portfolio-header__inner">
        <Link
          className="portfolio-header__home"
          href="/"
          aria-label={`${identity.name} home`}
        >
          <span className="portfolio-header__monogram-mark">
            {identity.initials}
          </span>
          <span className="portfolio-header__name">
            <span className="portfolio-header__name-short">
              {identity.shortName}
            </span>
            <span className="portfolio-header__name-full">
              {identity.name}
            </span>
          </span>
        </Link>

        <nav className="portfolio-header__nav" aria-label="Primary navigation">
          {desktopItems.map((item) => {
            const isCurrent =
              currentArea === "work" &&
              item.kind === "section" &&
              item.label === "Work";

            return (
              <a
                key={item.href}
                href={resolvePortfolioNavigationHref(item, sectionHrefPrefix)}
                target={item.kind === "external" ? "_blank" : undefined}
                rel={item.kind === "external" ? "noopener noreferrer" : undefined}
                aria-current={isCurrent ? "page" : undefined}
              >
                {item.label}
                {item.kind === "external" ? (
                  <>
                    <ArrowUpRight size={13} aria-hidden="true" />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </>
                ) : null}
              </a>
            );
          })}
        </nav>

        <a className="portfolio-header__contact" href={contactHref}>
          Contact
        </a>

        <MobileNavigation
          items={navigation}
          sectionHrefPrefix={sectionHrefPrefix}
          githubHref={contact.github}
          currentArea={currentArea}
        />
      </div>
    </header>
  );
}
```

- [ ] **Step 5: Create the native mobile-dialog client boundary**

Create `src/components/portfolio/mobile-navigation.tsx` with this complete behavior:

```tsx
"use client";

import { ArrowUpRight } from "lucide-react";
import {
  useRef,
  useState,
  type MouseEvent,
} from "react";

import {
  resolvePortfolioNavigationHref,
  type PortfolioArea,
  type PortfolioNavigationItem,
  type PortfolioSectionHrefPrefix,
} from "@/data/portfolio";

type MobileNavigationProps = {
  items: readonly PortfolioNavigationItem[];
  sectionHrefPrefix: PortfolioSectionHrefPrefix;
  githubHref: string;
  currentArea?: PortfolioArea;
};

export function MobileNavigation({
  items,
  sectionHrefPrefix,
  githubHref,
  currentArea,
}: MobileNavigationProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const mobileItems = items.filter((item) =>
    item.surfaces.includes("mobile"),
  );

  const openDialog = () => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    dialog.showModal();
    setIsOpen(true);
  };

  const closeDialog = () => {
    const dialog = dialogRef.current;
    if (dialog?.open) dialog.close();
  };

  const handleDialogClose = () => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) closeDialog();
  };

  return (
    <div className="portfolio-mobile-navigation">
      <button
        ref={triggerRef}
        className="portfolio-mobile-navigation__trigger"
        type="button"
        aria-controls="portfolio-mobile-dialog"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        onClick={openDialog}
      >
        Menu
      </button>

      <dialog
        ref={dialogRef}
        id="portfolio-mobile-dialog"
        className="portfolio-mobile-navigation__dialog"
        aria-labelledby="portfolio-mobile-navigation-title"
        onClose={handleDialogClose}
        onClick={handleBackdropClick}
      >
        <div className="portfolio-mobile-navigation__sheet">
          <div className="portfolio-mobile-navigation__heading">
            <h2 id="portfolio-mobile-navigation-title">Navigation</h2>
            <button
              className="portfolio-mobile-navigation__close"
              type="button"
              onClick={closeDialog}
            >
              Close
            </button>
          </div>

          <nav
            className="portfolio-mobile-navigation__links"
            aria-label="Mobile navigation"
          >
            {mobileItems.map((item) => {
              const isCurrent =
                currentArea === "work" &&
                item.kind === "section" &&
                item.label === "Work";

              return (
                <a
                  key={item.href}
                  href={resolvePortfolioNavigationHref(
                    item,
                    sectionHrefPrefix,
                  )}
                  target={item.kind === "external" ? "_blank" : undefined}
                  rel={
                    item.kind === "external"
                      ? "noopener noreferrer"
                      : undefined
                  }
                  aria-current={isCurrent ? "page" : undefined}
                  onClick={closeDialog}
                >
                  <span>{item.label}</span>
                  {item.kind === "external" ? (
                    <>
                      <ArrowUpRight size={16} aria-hidden="true" />
                      <span className="sr-only">
                        {" "}(opens in a new tab)
                      </span>
                    </>
                  ) : null}
                </a>
              );
            })}
            <a
              href={`${sectionHrefPrefix}#contact`}
              onClick={closeDialog}
            >
              Contact
            </a>
            <a
              href={githubHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeDialog}
            >
              <span>GitHub</span>
              <ArrowUpRight size={16} aria-hidden="true" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </nav>
        </div>
      </dialog>
    </div>
  );
}
```

- [ ] **Step 6: Propagate Writing and Lab through the footer**

Destructure `navigation` and derive:

```tsx
const ecosystemLinks = navigation.filter(
  (item) => item.kind === "external",
);
```

Keep the current email, GitHub, LinkedIn, and Back to top links. Between LinkedIn and Back to top, render:

```tsx
{ecosystemLinks.map((item) => (
  <a
    key={item.href}
    href={item.href}
    target="_blank"
    rel="noopener noreferrer"
  >
    <span>{item.label}</span>
    <ArrowUpRight aria-hidden="true" size={18} strokeWidth={2.25} />
    <span className="sr-only"> (opens in a new tab)</span>
  </a>
))}
```

- [ ] **Step 7: Mark Work current on the Eazy Review route**

Change the project-route call to:

```tsx
<SiteHeader sectionHrefPrefix="/" currentArea="work" />
```

- [ ] **Step 8: Add the focused header and dialog CSS**

Replace the old monogram/identity/email rules with selectors for `portfolio-header__home`, short/full names, Contact, and mobile navigation. The required state rules are:

```css
.portfolio-header__home,
.portfolio-header__contact,
.portfolio-mobile-navigation__trigger,
.portfolio-mobile-navigation__close,
.portfolio-mobile-navigation__links a {
  min-height: 44px;
}

.portfolio-header__home {
  display: inline-flex;
  min-width: 0;
  flex: 1;
  align-items: center;
  gap: 9px;
  color: inherit;
  text-decoration: none;
}

.portfolio-header__name {
  min-width: 0;
  font-size: 0.75rem;
  font-weight: 650;
}

.portfolio-header__name-full {
  display: none;
}

.portfolio-header__nav,
.portfolio-header__contact {
  display: none;
}

.portfolio-header__nav a[aria-current="page"] {
  color: var(--portfolio-accent);
  box-shadow: inset 0 -2px var(--portfolio-accent);
}

.portfolio-mobile-navigation {
  margin-left: auto;
}

.portfolio-mobile-navigation__trigger,
.portfolio-mobile-navigation__close {
  border: 1px solid var(--portfolio-ink);
  border-radius: 999px;
  background: transparent;
  color: var(--portfolio-ink);
  padding-inline: 16px;
  font: inherit;
  font-size: 0.75rem;
  font-weight: 700;
}

.portfolio-mobile-navigation__dialog {
  width: 100%;
  max-width: none;
  height: 100dvh;
  max-height: none;
  margin: 0;
  border: 0;
  padding: 0;
  background: transparent;
}

.portfolio-mobile-navigation__dialog::backdrop {
  background: rgb(16 22 19 / 52%);
}

.portfolio-mobile-navigation__sheet {
  width: min(100%, 380px);
  min-height: 100%;
  margin-left: auto;
  padding: 18px 18px 28px;
  background: var(--portfolio-canvas);
  transform: translateX(18px);
  transition: transform 160ms ease;
}

.portfolio-mobile-navigation__dialog[open] .portfolio-mobile-navigation__sheet {
  transform: translateX(0);
}

.portfolio-mobile-navigation__heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.portfolio-mobile-navigation__heading h2 {
  margin: 0;
  font-size: 1rem;
}

.portfolio-mobile-navigation__links {
  display: grid;
  margin-top: 28px;
  border-top: 1px solid var(--portfolio-rule);
}

.portfolio-mobile-navigation__links a {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-bottom: 1px solid var(--portfolio-rule);
  color: inherit;
  text-decoration: none;
}

@media (prefers-reduced-motion: reduce) {
  .portfolio-mobile-navigation__sheet {
    transform: none;
    transition: none;
  }
}

@media (min-width: 768px) {
  .portfolio-header__home {
    flex: 1;
  }

  .portfolio-header__nav,
  .portfolio-header__contact {
    display: flex;
  }

  .portfolio-mobile-navigation {
    display: none;
  }
}

@media (min-width: 1100px) {
  .portfolio-header__name-short {
    display: none;
  }

  .portfolio-header__name-full {
    display: inline;
  }
}
```

Extend visible-focus selectors to include `.portfolio-header button:focus-visible`. Do not weaken the current 3px outline.

- [ ] **Step 9: Run navigation checks, lint, and types**

Run:

```zsh
set -euo pipefail
pnpm check:portfolio -- navigation | tee /tmp/portfolio-ia-reframe-2026-08-19/evidence/static/02-navigation-green.txt
pnpm lint
pnpm exec tsc --noEmit
```

Expected: all commands exit 0.

- [ ] **Step 10: Review only the navigation slice**

Run:

```bash
set +e
git diff --no-index -- /tmp/portfolio-ia-reframe-2026-08-19/source-before/scripts/check-portfolio-redesign.mjs /Users/tysonhu/Documents/Portfolio/scripts/check-portfolio-redesign.mjs
git diff --no-index -- /tmp/portfolio-ia-reframe-2026-08-19/source-before/src/data/portfolio.ts /Users/tysonhu/Documents/Portfolio/src/data/portfolio.ts
git diff --no-index -- /tmp/portfolio-ia-reframe-2026-08-19/source-before/src/components/portfolio /Users/tysonhu/Documents/Portfolio/src/components/portfolio
git diff --no-index -- /tmp/portfolio-ia-reframe-2026-08-19/source-before/src/app/projects/eazy-review/page.tsx /Users/tysonhu/Documents/Portfolio/src/app/projects/eazy-review/page.tsx
git diff --no-index -- /tmp/portfolio-ia-reframe-2026-08-19/source-before/src/app/portfolio.css /Users/tysonhu/Documents/Portfolio/src/app/portfolio.css
set -e
```

Expected: no project-card redesign, factual case-study rewrite, generated asset change, or remote-operation file appears.

---

### Task 3: Reframe the homepage hero and first fold

**Files:**
- Modify: `scripts/check-portfolio-redesign.mjs:113-190,248-328`
- Modify: `src/data/portfolio.ts:35-40,93-99`
- Modify: `src/components/portfolio/hero-section.tsx:1-54`
- Modify: `src/app/portfolio.css:535-738,844-940,1603-1635`
- Test: `pnpm check:portfolio -- heroReframe`

**Interfaces:**
- Consumes: the typed `PORTFOLIO.hero` and external navigation items from Task 2.
- Produces: the exact approved hero copy, two internal CTAs, GitHub/Writing/Lab utilities, the quiet current-service context, and the bounded desktop fold contract.

- [ ] **Step 1: Add hero assertions and remove conflicting old assertions**

Add:

```js
heroReframe: [
  [
    "approved staged hero copy",
    allContain(portfolioDataPath, [
      'eyebrow: "Backend · Full-Stack · Developer Tooling"',
      'headline: "I build reliable product and platform software—from mobile interfaces to data boundaries."',
      'introduction: "Backend, full-stack, and developer-tooling work with explicit ownership, recoverable failure states, and evidence another engineer can inspect."',
      'primaryActionLabel: "Explore selected work"',
      'secondaryActionLabel: "Contact"',
      'serviceLabel: "Current service"',
    ]),
  ],
  [
    "natural data-driven hero heading",
    contains(heroPath, "{hero.headline}") &&
      excludes(heroPath, "<br"),
  ],
  [
    "hero does not duplicate identity",
    excludes(heroPath, "hero-section__identity") &&
      excludes(heroPath, "identity.name") &&
      excludes(heroPath, "identity.role"),
  ],
  [
    "hero action hierarchy",
    allContain(heroPath, [
      'href="#work"',
      "hero.primaryActionLabel",
      'href="#contact"',
      "hero.secondaryActionLabel",
    ]),
  ],
  [
    "hero ecosystem utilities",
    allContain(heroPath, [
      'aria-label="Portfolio links"',
      "contact.github",
      'item.kind === "external"',
      "opens in a new tab",
    ]),
  ],
  [
    "bounded desktop hero",
    ruleContains(
      portfolioCssPath,
      ".hero-section",
      "min-height: clamp(540px, 68svh, 640px)",
    ) &&
      excludes(portfolioCssPath, "min-height: 720px") &&
      ruleContains(
        portfolioCssPath,
        ".selected-work .section-intro",
        "padding-top: 56px",
      ),
  ],
  [
    "readable hero typography",
    ruleContains(portfolioCssPath, ".hero-section h1", "max-width: 18ch") &&
      ruleContains(
        portfolioCssPath,
        ".hero-section h1",
        "letter-spacing: -0.055em",
      ) &&
      ruleContains(
        portfolioCssPath,
        ".hero-section h1",
        "line-height: 1.02",
      ),
  ],
],
```

Replace the old headline check, the `hero-section__support` requirement, the exact `2fr / 1fr` requirement, and the `min-height: 720px` expectation.

- [ ] **Step 2: Prove the hero contract is red**

Run:

```zsh
set +e
pnpm check:portfolio -- heroReframe | tee /tmp/portfolio-ia-reframe-2026-08-19/evidence/static/03-hero-red.txt
hero_status=$pipestatus[1]
set -e
test $hero_status -eq 1
rg '^FAIL ' /tmp/portfolio-ia-reframe-2026-08-19/evidence/static/03-hero-red.txt
```

Expected: approved copy, natural heading, action hierarchy, utilities, bounded fold, and readable typography fail.

- [ ] **Step 3: Replace the hero interface and data with the approved content**

Replace the hero interface with:

```ts
hero: {
  eyebrow: "Backend · Full-Stack · Developer Tooling";
  headline: string;
  introduction: string;
  primaryActionLabel: "Explore selected work";
  secondaryActionLabel: "Contact";
  serviceLabel: "Current service";
  service: string;
  servicePeriod: string;
};
```

Use exactly:

```ts
hero: {
  eyebrow: "Backend · Full-Stack · Developer Tooling",
  headline:
    "I build reliable product and platform software—from mobile interfaces to data boundaries.",
  introduction:
    "Backend, full-stack, and developer-tooling work with explicit ownership, recoverable failure states, and evidence another engineer can inspect.",
  primaryActionLabel: "Explore selected work",
  secondaryActionLabel: "Contact",
  serviceLabel: "Current service",
  service: "U.S. Army Reserve · Information Technology Specialist (25B)",
  servicePeriod: "January 2026–Present",
},
```

- [ ] **Step 4: Replace the hero component with one natural scan path**

Use:

```tsx
import { ArrowDown, ArrowUpRight } from "lucide-react";

import { PORTFOLIO } from "@/data/portfolio";

export function HeroSection() {
  const { hero, contact, navigation } = PORTFOLIO;
  const ecosystemLinks = navigation.filter(
    (item) => item.kind === "external",
  );

  return (
    <section className="hero-section" aria-labelledby="hero-title">
      <div className="hero-section__content">
        <div className="hero-section__primary">
          <p className="hero-section__eyebrow">{hero.eyebrow}</p>
          <h1 id="hero-title">{hero.headline}</h1>
          <p className="hero-section__introduction">
            {hero.introduction}
          </p>

          <div className="hero-section__actions">
            <a
              className="hero-section__cta hero-section__cta--primary"
              href="#work"
            >
              {hero.primaryActionLabel}
              <ArrowDown aria-hidden="true" size={17} strokeWidth={2.25} />
            </a>
            <a
              className="hero-section__cta hero-section__cta--secondary"
              href="#contact"
            >
              {hero.secondaryActionLabel}
            </a>
          </div>

          <nav
            className="hero-section__utilities"
            aria-label="Portfolio links"
          >
            <a
              href={contact.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
              <ArrowUpRight aria-hidden="true" size={14} />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            {ecosystemLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.label}
                <ArrowUpRight aria-hidden="true" size={14} />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ))}
          </nav>
        </div>

        <aside
          className="hero-section__context"
          aria-labelledby="hero-context-title"
        >
          <p
            id="hero-context-title"
            className="hero-section__context-label"
          >
            {hero.serviceLabel}
          </p>
          <p className="hero-section__service">
            <strong>{hero.service}</strong>
            <span>{hero.servicePeriod}</span>
          </p>
        </aside>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Replace the hero layout and fold rules**

Remove the old identity, manual-break, support-column, and 720px-minimum rules. Apply these exact anchors while retaining the existing color variables and button hover treatment:

```css
.hero-section {
  display: grid;
  padding-block: 34px 40px;
}

.hero-section__content {
  display: grid;
  gap: 32px;
}

.hero-section__eyebrow,
.hero-section__context-label,
.section-intro__rail {
  font-family: var(--font-mono), monospace;
  font-weight: 700;
  letter-spacing: 0.12em;
  line-height: 1.35;
  text-transform: uppercase;
}

.hero-section__eyebrow,
.hero-section__context-label {
  margin: 0;
  font-size: 0.75rem;
}

.section-intro__rail {
  font-size: 0.6875rem;
}

.hero-section h1 {
  max-width: 18ch;
  margin: 14px 0 0;
  font-size: clamp(2.5rem, 5vw, 4.75rem);
  font-weight: 700;
  letter-spacing: -0.055em;
  line-height: 1.02;
  text-wrap: balance;
}

.hero-section__introduction {
  max-width: 62ch;
  margin: 24px 0 0;
  color: var(--portfolio-muted);
  font-size: 1rem;
  line-height: 1.55;
}

.hero-section__utilities {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 18px;
  margin-top: 18px;
}

.hero-section__utilities a {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--portfolio-muted);
  font-size: 0.75rem;
  font-weight: 700;
  text-decoration: none;
}

.hero-section__context {
  align-self: end;
  border-top: 1px solid var(--portfolio-rule);
  padding-top: 16px;
}

.hero-section__service {
  display: grid;
  gap: 4px;
  margin: 10px 0 0;
  color: var(--portfolio-muted);
  font-size: 0.75rem;
  line-height: 1.45;
}

.hero-section__service strong {
  color: var(--portfolio-ink);
}

@media (min-width: 768px) {
  .hero-section {
    min-height: clamp(540px, 68svh, 640px);
    padding-block: clamp(56px, 7svh, 72px) clamp(40px, 5svh, 56px);
  }

  .selected-work .section-intro {
    padding-top: 56px;
  }

  .hero-section__introduction {
    font-size: 1.125rem;
  }
}

@media (min-width: 1024px) {
  .hero-section__content {
    grid-template-columns: minmax(0, 7fr) minmax(260px, 5fr);
    column-gap: 64px;
    align-items: end;
  }
}
```

Keep both CTA classes at `min-height: 44px`.

- [ ] **Step 6: Run the focused hero checks**

Run:

```zsh
set -euo pipefail
pnpm check:portfolio -- heroReframe | tee /tmp/portfolio-ia-reframe-2026-08-19/evidence/static/04-hero-green.txt
pnpm lint
pnpm exec tsc --noEmit
```

Expected: all commands exit 0.

- [ ] **Step 7: Review only the hero slice**

Run:

```bash
set +e
git diff --no-index -- /tmp/portfolio-ia-reframe-2026-08-19/source-before/scripts/check-portfolio-redesign.mjs /Users/tysonhu/Documents/Portfolio/scripts/check-portfolio-redesign.mjs
git diff --no-index -- /tmp/portfolio-ia-reframe-2026-08-19/source-before/src/data/portfolio.ts /Users/tysonhu/Documents/Portfolio/src/data/portfolio.ts
git diff --no-index -- /tmp/portfolio-ia-reframe-2026-08-19/source-before/src/components/portfolio/hero-section.tsx /Users/tysonhu/Documents/Portfolio/src/components/portfolio/hero-section.tsx
git diff --no-index -- /tmp/portfolio-ia-reframe-2026-08-19/source-before/src/app/portfolio.css /Users/tysonhu/Documents/Portfolio/src/app/portfolio.css
set -e
```

Expected: the exact Army Reserve strings remain unchanged, no mascot or project teaser was added, and the generated Eazy Review illustration was not reclassified.

---

### Task 4: Reframe Eazy Review content into scan and evidence modes

**Files:**
- Modify: `scripts/check-portfolio-redesign.mjs:329-407`
- Modify: `src/app/projects/eazy-review/page.tsx:18-546`
- Modify: `src/app/portfolio.css:50-533`
- Test: `pnpm check:portfolio -- caseStudyReframe`

**Interfaces:**
- Consumes: the existing `EVIDENCE` object, `DECISIONS` records, proof strip, architecture markup, and frozen boundary copy.
- Produces:
  - `AT_A_GLANCE` with Product, Project context, Core invariant, and Platform.
  - `DECISIONS[number].result` for all three records.
  - `VERIFICATION_BUNDLES` with `title`, `summary`, `primaryEvidence`, and `relatedEvidence`.
  - Sections with IDs `overview`, `architecture`, `decisions`, `verification`, and `boundaries`.

- [ ] **Step 1: Add the factual and evidence-preservation source contracts**

Add these checker constants:

```js
const requiredEvidenceKeys = [
  "apiContracts",
  "aggregateTests",
  "authProvider",
  "authorizationTests",
  "concurrencyHarness",
  "currentRatingGrants",
  "databaseAcceptance",
  "databaseCi",
  "expoCi",
  "formPreservationTest",
  "ratingMutation",
  "ratingMutationTests",
  "ratingSave",
  "rlsMigration",
  "scoreDerivation",
  "task15Evidence",
  "task16Evidence",
  "task17Evidence",
  "task18Evidence",
];
const sourceIndex = (path, value) => read(path).indexOf(value);
const evidenceKeysBetween = (path, start, end) => {
  const source = read(path);
  const segment = source.slice(
    source.indexOf(start),
    source.indexOf(end),
  );
  return [
    ...new Set(
      [...segment.matchAll(/EVIDENCE\.([A-Za-z0-9]+)/g)].map(
        ([, key]) => key,
      ),
    ),
  ].sort();
};
```

Add:

```js
caseStudyReframe: [
  [
    "At a Glance precedes Architecture",
    sourceIndex(caseStudyPath, 'id="overview"') >= 0 &&
      sourceIndex(caseStudyPath, 'id="overview"') <
        sourceIndex(caseStudyPath, 'id="architecture"'),
  ],
  [
    "At a Glance contains only approved factual rows",
    allContain(caseStudyPath, [
      "At a Glance",
      "Mobile product-review application.",
      "Independent engineering project.",
      "Personal ratings remain owner-scoped while community scores are server-derived.",
      "React Native, Expo, Supabase, and PostgreSQL.",
      "Task 15",
      "Task 17",
      "Task 18",
      "Evidence snapshot",
      "72149320c328532d2fb2e01da944bfa4b3cc9244",
    ]) &&
      normalizedContains(
        caseStudyPath,
        "Automated frontend, database, authorization, and concurrency checks",
      ) &&
      excludes(caseStudyPath, "View product flow") &&
      excludes(caseStudyPath, "Product Flow") &&
      excludes(caseStudyPath, "<dt>Role</dt>") &&
      excludes(caseStudyPath, "<dt>Status</dt>"),
  ],
  [
    "case study section IDs",
    [
      'id="overview"',
      'id="architecture"',
      'id="decisions"',
      'id="verification"',
      'id="boundaries"',
    ].every((value) => contains(caseStudyPath, value)),
  ],
  [
    "decision scan and disclosure modes",
    allContain(caseStudyPath, [
      "decision.result",
      'className="case-study-decision__details"',
      "<summary>Why, verification, and evidence</summary>",
      "decision.why",
      "decision.verification",
      "decision.boundary",
    ]),
  ],
  [
    "verification bundles and disclosures",
    allContain(caseStudyPath, [
      "VERIFICATION_BUNDLES",
      "bundle.primaryEvidence",
      "bundle.relatedEvidence",
      "<summary>View related evidence</summary>",
    ]),
  ],
  [
    "exact decision and verification evidence key set remains rendered",
    JSON.stringify(
      evidenceKeysBetween(
        caseStudyPath,
        "const DECISIONS =",
        "const pageTitle =",
      ),
    ) === JSON.stringify([...requiredEvidenceKeys].sort()) &&
      allContain(caseStudyPath, [
        "EVIDENCE.dataModel",
        "EVIDENCE.tasks",
        "EVIDENCE.commit",
      ]),
  ],
  [
    "immutable evidence commit remains pinned",
    contains(
      caseStudyPath,
      'const EVIDENCE_COMMIT = "72149320c328532d2fb2e01da944bfa4b3cc9244"',
    ),
  ],
  [
    "frozen boundaries remain visible",
    [
      "Feed remains a placeholder, and protected account deletion is still pending as Task 19.",
      "Catalog cache is in memory only. There is no durable offline write queue.",
      "The current ten-dimension schema and recovery work were not staged or deployed. Production recovery-host configuration, TestFlight, App Store work, and release QA remain later tasks.",
      "This case study makes no claim about production users, traffic, scale, uptime, or a store launch.",
    ].every((value) => normalizedContains(caseStudyPath, value)) &&
      excludes(caseStudyPath, "case-study-boundaries-details"),
  ],
  [
    "generated overview art is not case-study product proof",
    excludes(caseStudyPath, "eazy-review-phone.webp"),
  ],
  [
    "case study action hierarchy",
    sourceIndex(caseStudyPath, "Project overview") >= 0 &&
      sourceIndex(caseStudyPath, "Project overview") <
        sourceIndex(caseStudyPath, "GitHub repository") &&
      sourceIndex(caseStudyPath, "GitHub repository") <
        sourceIndex(caseStudyPath, "Verification evidence"),
  ],
],
```

Remove the obsolete action assertion that expects the repository to be primary. Keep the current generic-component exclusions.

- [ ] **Step 2: Prove the case-study contract is red**

Run:

```zsh
set +e
pnpm check:portfolio -- caseStudyReframe | tee /tmp/portfolio-ia-reframe-2026-08-19/evidence/static/05-case-study-red.txt
case_status=$pipestatus[1]
set -e
test $case_status -eq 1
rg '^FAIL ' /tmp/portfolio-ia-reframe-2026-08-19/evidence/static/05-case-study-red.txt
```

Expected: At a Glance, section IDs, result fields, and both disclosure modes fail. Immutable commit and frozen-boundary checks may already pass.

- [ ] **Step 3: Add the approved At a Glance facts and decision results**

Add after `STACK`:

```ts
const AT_A_GLANCE = {
  product: "Mobile product-review application.",
  projectContext: "Independent engineering project.",
  coreInvariant:
    "Personal ratings remain owner-scoped while community scores are server-derived.",
  platform: "React Native, Expo, Supabase, and PostgreSQL.",
} as const;
```

Add these exact `result` values to the matching decision objects:

```ts
result:
  "Personal ratings and private notes remain owner-scoped at the PostgreSQL boundary.",
```

```ts
result:
  "Connected reads return server-derived rating truth after create and edit operations settle.",
```

```ts
result:
  "Failed saves settle explicitly and retain the draft for a user-directed retry.",
```

Do not change the existing Problem, Decision, Why, Verification, Boundary, or link facts.

- [ ] **Step 4: Replace verification rows with three complete bundles**

Use exactly this key allocation so every required evidence key remains represented:

```ts
const VERIFICATION_BUNDLES = [
  {
    title: "Application behavior",
    summary:
      "Catalog and session behavior, durable rating edits, explicit failure settlement, draft preservation, and password recovery.",
    primaryEvidence: {
      label: "Rating persistence evidence",
      href: EVIDENCE.task17Evidence,
    },
    relatedEvidence: [
      {
        label: "Catalog and reconnect evidence",
        href: EVIDENCE.task15Evidence,
      },
      { label: "API contract", href: EVIDENCE.apiContracts },
      {
        label: "Auth and session evidence",
        href: EVIDENCE.task16Evidence,
      },
      { label: "AuthProvider", href: EVIDENCE.authProvider },
      {
        label: "Draft-preservation test",
        href: EVIDENCE.formPreservationTest,
      },
      { label: "Mutation behavior", href: EVIDENCE.ratingMutation },
      {
        label: "Failure-state tests",
        href: EVIDENCE.ratingMutationTests,
      },
      { label: "Rating write path", href: EVIDENCE.ratingSave },
      {
        label: "Password recovery evidence",
        href: EVIDENCE.task18Evidence,
      },
    ],
  },
  {
    title: "Data and authorization",
    summary:
      "Owner-only rows, least-privilege grants, server-derived aggregates, pgTAP coverage, and concurrent database behavior.",
    primaryEvidence: {
      label: "Database acceptance",
      href: EVIDENCE.databaseAcceptance,
    },
    relatedEvidence: [
      {
        label: "RLS and grant migration",
        href: EVIDENCE.rlsMigration,
      },
      {
        label: "Current column allowlist",
        href: EVIDENCE.currentRatingGrants,
      },
      {
        label: "Authorization tests",
        href: EVIDENCE.authorizationTests,
      },
      {
        label: "Score derivation migration",
        href: EVIDENCE.scoreDerivation,
      },
      { label: "Aggregate pgTAP", href: EVIDENCE.aggregateTests },
      {
        label: "Concurrency harness",
        href: EVIDENCE.concurrencyHarness,
      },
    ],
  },
  {
    title: "System verification",
    summary:
      "Frontend, database, security, and concurrency definitions that guard the evidence-backed path.",
    primaryEvidence: {
      label: "Expo CI",
      href: EVIDENCE.expoCi,
    },
    relatedEvidence: [
      { label: "Database CI", href: EVIDENCE.databaseCi },
    ],
  },
] as const;
```

- [ ] **Step 5: Change the opening action hierarchy**

Render these actions in order:

```tsx
<div className="case-study-actions">
  <a
    href="#overview"
    className="case-study-action case-study-action--primary"
  >
    Project overview
    <ArrowDown size={16} strokeWidth={2.25} aria-hidden />
  </a>
  <a
    href={REPOSITORY_URL}
    target="_blank"
    rel="noopener noreferrer"
    className="case-study-action case-study-action--secondary"
  >
    <Github size={16} strokeWidth={2.25} aria-hidden />
    GitHub repository
    <span className="sr-only"> (opens in a new tab)</span>
  </a>
</div>
<p className="case-study-hero__verification-link">
  <a href="#verification">Verification evidence</a>
</p>
```

Keep the proof strip and audited-commit note immediately after this hierarchy.

- [ ] **Step 6: Insert At a Glance before the existing Architecture section**

Render:

```tsx
<section
  id="overview"
  aria-labelledby="overview-title"
  className="case-study-section case-study-reading-column"
>
  <SectionHeading
    id="overview-title"
    eyebrow="At a Glance"
    title="Product context before implementation detail"
    description="A factual orientation to the product, its core invariant, and the evidence snapshot used by this case study."
  />

  <dl className="case-study-at-a-glance">
    <div>
      <dt>Product</dt>
      <dd>{AT_A_GLANCE.product}</dd>
    </div>
    <div>
      <dt>Project context</dt>
      <dd>{AT_A_GLANCE.projectContext}</dd>
    </div>
    <div>
      <dt>Core invariant</dt>
      <dd>{AT_A_GLANCE.coreInvariant}</dd>
    </div>
    <div>
      <dt>Platform</dt>
      <dd>{AT_A_GLANCE.platform}</dd>
    </div>
    <div>
      <dt>Evidence</dt>
      <dd>
        <p>
          Automated frontend, database, authorization, and concurrency
          checks paired with accepted physical-device evidence.
        </p>
        <div className="case-study-at-a-glance__links">
          <EvidenceLink href={EVIDENCE.task15Evidence}>
            Task 15
          </EvidenceLink>
          <EvidenceLink href={EVIDENCE.task17Evidence}>
            Task 17
          </EvidenceLink>
          <EvidenceLink href={EVIDENCE.task18Evidence}>
            Task 18
          </EvidenceLink>
        </div>
      </dd>
    </div>
    <div>
      <dt>Evidence snapshot</dt>
      <dd>
        <EvidenceLink href={EVIDENCE.commit}>
          {EVIDENCE_COMMIT}
        </EvidenceLink>
      </dd>
    </div>
  </dl>
</section>
```

Set `id="architecture"` on the existing Architecture section without changing its factual contents. Set `id="decisions"` on Decisions and `id="boundaries"` on Boundaries; retain `id="verification"`.

- [ ] **Step 7: Render each decision in concise and inspectable modes**

Inside each decision article, keep title, Problem, and Decision visible, add Result, and move the deeper record into a closed native disclosure:

```tsx
<div className="case-study-decision__body">
  <h3>{decision.title}</h3>
  <div className="case-study-decision__record">
    <p>
      <strong>Problem — </strong>
      {decision.problem}
    </p>
    <p>
      <strong>Decision — </strong>
      {decision.decision}
    </p>
    <p>
      <strong>Result — </strong>
      {decision.result}
    </p>
  </div>
  <details className="case-study-decision__details">
    <summary>Why, verification, and evidence</summary>
    <div className="case-study-decision__details-content">
      <p>
        <strong>Why — </strong>
        {decision.why}
      </p>
      <p>
        <strong>Verification — </strong>
        {decision.verification}
      </p>
      <p>
        <strong>Boundary — </strong>
        {decision.boundary}
      </p>
      <div className="case-study-decision__links">
        {decision.links.map((link) => (
          <EvidenceLink key={link.href} href={link.href}>
            {link.label}
          </EvidenceLink>
        ))}
      </div>
    </div>
  </details>
</div>
```

Do not add `open` to the disclosure.

- [ ] **Step 8: Render each verification bundle with one primary action**

Replace the verification row list with:

```tsx
<ul className="case-study-verification">
  {VERIFICATION_BUNDLES.map((bundle) => (
    <li key={bundle.title}>
      <div className="case-study-verification__summary">
        <h3>{bundle.title}</h3>
        <p>{bundle.summary}</p>
        <EvidenceLink href={bundle.primaryEvidence.href}>
          {bundle.primaryEvidence.label}
        </EvidenceLink>
      </div>
      <details className="case-study-verification__details">
        <summary>View related evidence</summary>
        <div className="case-study-verification__links">
          {bundle.relatedEvidence.map((item) => (
            <EvidenceLink key={item.href} href={item.href}>
              {item.label}
            </EvidenceLink>
          ))}
        </div>
      </details>
    </li>
  ))}
</ul>
```

Do not wrap the Boundaries list in a disclosure and do not edit its four statements.

- [ ] **Step 9: Replace the old row assumptions with At a Glance and disclosure styles**

Remove the old `.case-study-verification li > p`, `.case-study-verification li > div`, and 560px verification-row grid rules because the new bundle markup no longer has those child shapes. Keep the list container, then use this complete replacement:

```css
.case-study-at-a-glance {
  display: grid;
  margin: 28px 0 0;
  border-top: 1px solid var(--portfolio-rule);
}

.case-study-at-a-glance > div {
  display: grid;
  gap: 7px;
  padding: 16px 0;
  border-bottom: 1px solid var(--portfolio-rule);
}

.case-study-at-a-glance dt {
  color: var(--portfolio-muted);
  font-family: var(--font-mono), monospace;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.case-study-at-a-glance dd {
  min-width: 0;
  margin: 0;
  line-height: 1.55;
  overflow-wrap: anywhere;
}

.case-study-at-a-glance dd > p {
  margin: 0;
}

.case-study-at-a-glance__links,
.case-study-decision__links,
.case-study-verification__links {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 14px;
}

.case-study-decision__details,
.case-study-verification__details {
  margin-top: 18px;
  border-top: 1px solid var(--portfolio-rule);
}

.case-study-decision__details summary,
.case-study-verification__details summary {
  display: flex;
  min-height: 44px;
  align-items: center;
  cursor: pointer;
  color: var(--portfolio-accent);
  font-size: 0.75rem;
  font-weight: 700;
}

.case-study-decision__details-content,
.case-study-verification__links {
  padding-bottom: 16px;
}

.case-study-decision__details-content p {
  margin: 12px 0 0;
  overflow-wrap: anywhere;
  color: var(--portfolio-muted);
  font-size: 0.8125rem;
  line-height: 1.65;
}

.case-study-decision__details-content strong {
  color: var(--portfolio-ink);
  font-weight: 750;
}

.case-study-verification {
  overflow: hidden;
  padding: 0;
  list-style: none;
}

.case-study-verification li {
  min-width: 0;
  padding: 18px 16px;
}

.case-study-verification li + li {
  border-top: 1px solid var(--portfolio-rule);
}

.case-study-verification__summary {
  display: block;
  min-width: 0;
}

.case-study-verification__summary h3,
.case-study-verification__summary p {
  margin: 0;
}

.case-study-verification__summary p {
  margin-top: 8px;
  color: var(--portfolio-muted);
  line-height: 1.55;
}

@media (min-width: 560px) {
  .case-study-at-a-glance > div {
    grid-template-columns: minmax(130px, 0.35fr) minmax(0, 1fr);
    gap: 24px;
  }
}
```

Extend the focus selector to include both disclosure summary selectors.

- [ ] **Step 10: Run case-study checks, lint, and types**

Run:

```zsh
set -euo pipefail
pnpm check:portfolio -- caseStudyReframe | tee /tmp/portfolio-ia-reframe-2026-08-19/evidence/static/06-case-study-green.txt
pnpm lint
pnpm exec tsc --noEmit
```

Expected: all commands exit 0.

- [ ] **Step 11: Review evidence preservation**

Run:

```bash
set +e
git diff --no-index -- /tmp/portfolio-ia-reframe-2026-08-19/source-before/src/app/projects/eazy-review/page.tsx /Users/tysonhu/Documents/Portfolio/src/app/projects/eazy-review/page.tsx
git diff --no-index -- /tmp/portfolio-ia-reframe-2026-08-19/source-before/scripts/check-portfolio-redesign.mjs /Users/tysonhu/Documents/Portfolio/scripts/check-portfolio-redesign.mjs
set -e
rg -n '72149320c328532d2fb2e01da944bfa4b3cc9244|Feed remains a placeholder|Catalog cache is in memory only|This case study makes no claim' src/app/projects/eazy-review/page.tsx
```

Expected: the immutable commit, granular links, `dataModel`, `tasks`, and all four visible boundaries remain; no role, status, Product Flow, or product-screen claim was introduced.

---

### Task 5: Add case-study orientation and finish responsive/accessibility styles

**Files:**
- Create: `src/components/portfolio/case-study-nav.tsx`
- Modify: `src/app/projects/eazy-review/page.tsx:15-17,297-546`
- Modify: `src/app/portfolio.css:27-533,535-1200,1603-1635`
- Modify: `scripts/check-portfolio-redesign.mjs:408-478`
- Test: `pnpm check:portfolio -- reframeStyles`

**Interfaces:**
- Consumes: DOM section IDs `overview`, `architecture`, `decisions`, `verification`, and `boundaries`.
- Produces:
  - `CASE_STUDY_SECTIONS` as the single ordered section model.
  - `CaseStudySectionId` derived from that model.
  - `CaseStudyNav(): JSX.Element` with a desktop sticky rail and mobile native disclosure.
  - Active selection rule: the last section with top at or above 120px; Overview before that threshold; Boundaries at the document bottom.

- [ ] **Step 1: Add source contracts for navigation, type floors, focus, and target sizes**

Add:

```js
reframeStyles: [
  [
    "case study ordered section model",
    present("src/components/portfolio/case-study-nav.tsx") &&
      allContain("src/components/portfolio/case-study-nav.tsx", [
        "CASE_STUDY_SECTIONS",
        "data-case-study-marker",
        'href: "#overview"',
        'href: "#architecture"',
        'href: "#decisions"',
        'href: "#verification"',
        'href: "#boundaries"',
      ]),
  ],
  [
    "case study current location behavior",
    allContain("src/components/portfolio/case-study-nav.tsx", [
      '"use client"',
      "IntersectionObserver",
      "getBoundingClientRect().top <= 120",
      'aria-current={isCurrent ? "location" : undefined}',
      "document.documentElement.scrollHeight",
      'setActiveId("boundaries")',
    ]),
  ],
  [
    "mobile case navigation closes after activation",
    allContain("src/components/portfolio/case-study-nav.tsx", [
      "<details",
      "<summary>On this page</summary>",
      "mobileDetailsRef.current.open = false",
    ]),
  ],
  [
    "case navigation is integrated outside the reading column",
    allContain(caseStudyPath, [
      "<CaseStudyNav />",
      'className="case-study-body"',
      'className="case-study-body__content"',
      'data-case-study-marker="overview"',
      'data-case-study-marker="architecture"',
      'data-case-study-marker="decisions"',
      'data-case-study-marker="verification"',
      'data-case-study-marker="boundaries"',
    ]),
  ],
  [
    "all former 10px tokens are raised",
    excludes(portfolioCssPath, "font-size: 0.625rem"),
  ],
  [
    "new controls have selector-specific 44px targets",
    [
      ".portfolio-mobile-navigation__trigger",
      ".portfolio-mobile-navigation__close",
      ".portfolio-mobile-navigation__links a",
      ".portfolio-header__contact",
      ".hero-section__cta",
      ".case-study-action",
      ".case-study-decision__details summary",
      ".case-study-verification__details summary",
      ".case-study-navigation__mobile summary",
    ].every((selector) =>
      ruleContains(portfolioCssPath, selector, "min-height: 44px"),
    ),
  ],
  [
    "new buttons and summaries retain visible focus",
    allContain(portfolioCssPath, [
      ".portfolio-header button:focus-visible",
      ".case-study-decision__details summary:focus-visible",
      ".case-study-verification__details summary:focus-visible",
      "outline: 3px solid #3d5fec",
    ]),
  ],
  [
    "reduced motion removes dialog translation",
    allContain(portfolioCssPath, [
      "@media (prefers-reduced-motion: reduce)",
      ".portfolio-mobile-navigation__sheet",
      "transform: none",
      "transition: none",
    ]),
  ],
],
```

- [ ] **Step 2: Prove the navigation/style contract is red**

Run:

```zsh
set +e
pnpm check:portfolio -- reframeStyles | tee /tmp/portfolio-ia-reframe-2026-08-19/evidence/static/07-styles-red.txt
styles_status=$pipestatus[1]
set -e
test $styles_status -eq 1
rg '^FAIL ' /tmp/portfolio-ia-reframe-2026-08-19/evidence/static/07-styles-red.txt
```

Expected: case navigation, current-location behavior, integration, and former 10px token assertions fail.

- [ ] **Step 3: Create the ordered case-study navigation client**

Create `src/components/portfolio/case-study-nav.tsx`:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";

export const CASE_STUDY_SECTIONS = [
  { id: "overview", label: "Overview", href: "#overview" },
  { id: "architecture", label: "Architecture", href: "#architecture" },
  {
    id: "decisions",
    label: "Engineering decisions",
    href: "#decisions",
  },
  { id: "verification", label: "Verification", href: "#verification" },
  { id: "boundaries", label: "Boundaries", href: "#boundaries" },
] as const;

export type CaseStudySectionId =
  (typeof CASE_STUDY_SECTIONS)[number]["id"];

export function CaseStudyNav() {
  const [activeId, setActiveId] =
    useState<CaseStudySectionId>("overview");
  const mobileDetailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const targets = CASE_STUDY_SECTIONS.map(({ id }) =>
      document.querySelector<HTMLElement>(
        `[data-case-study-marker="${id}"]`,
      ),
    ).filter((target): target is HTMLElement => target !== null);

    const calculateActiveSection = () => {
      const atDocumentBottom =
        Math.ceil(window.scrollY + window.innerHeight) >=
        document.documentElement.scrollHeight;

      if (atDocumentBottom) {
        setActiveId("boundaries");
        return;
      }

      let nextActive: CaseStudySectionId = "overview";
      for (const section of CASE_STUDY_SECTIONS) {
        const target = document.getElementById(section.id);
        if (target && target.getBoundingClientRect().top <= 120) {
          nextActive = section.id;
        } else {
          break;
        }
      }
      setActiveId(nextActive);
    };

    const observer = new IntersectionObserver(calculateActiveSection, {
      rootMargin: "-121px 0px 0px 0px",
      threshold: [0, 1],
    });

    targets.forEach((target) => observer.observe(target));
    window.addEventListener("resize", calculateActiveSection);
    calculateActiveSection();

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", calculateActiveSection);
    };
  }, []);

  const closeMobileNavigation = () => {
    if (
      window.matchMedia("(max-width: 1023px)").matches &&
      mobileDetailsRef.current
    ) {
      mobileDetailsRef.current.open = false;
    }
  };

  const renderLinks = () =>
    CASE_STUDY_SECTIONS.map((section) => {
      const isCurrent = activeId === section.id;
      return (
        <a
          key={section.id}
          href={section.href}
          aria-current={isCurrent ? "location" : undefined}
          onClick={closeMobileNavigation}
        >
          {section.label}
        </a>
      );
    });

  return (
    <aside className="case-study-navigation">
      <nav
        className="case-study-navigation__desktop"
        aria-label="Case study sections"
      >
        {renderLinks()}
      </nav>
      <details
        ref={mobileDetailsRef}
        className="case-study-navigation__mobile"
      >
        <summary>On this page</summary>
        <nav aria-label="Case study sections">{renderLinks()}</nav>
      </details>
    </aside>
  );
}
```

The duplicate link presentation is intentional for no-JavaScript usability. Rendered QA must count the visible `aria-current="location"` link at the active breakpoint.

- [ ] **Step 4: Place the case navigation beside the reading content**

Add the import beside the existing shared-shell imports:

```tsx
import { CaseStudyNav } from "@/components/portfolio/case-study-nav";
```

Keep the hero header as its existing centered reading column. Immediately after its closing `</header>` and before the opening `#overview` section, insert:

```tsx
<div className="case-study-body">
  <CaseStudyNav />
  <div className="case-study-body__content">
```

Leave the complete `#overview`, `#architecture`, `#decisions`, `#verification`, and `#boundaries` sections from Task 4 in their current order. Leave the complete `case-study-return` block after Boundaries. Immediately after that return block and before `</article>`, insert:

```tsx
  </div>
</div>
```

As the first child of each corresponding section, insert the observer marker with its exact ID:

```tsx
<span
  className="case-study-section-marker"
  data-case-study-marker="overview"
  aria-hidden="true"
/>
<span
  className="case-study-section-marker"
  data-case-study-marker="architecture"
  aria-hidden="true"
/>
<span
  className="case-study-section-marker"
  data-case-study-marker="decisions"
  aria-hidden="true"
/>
<span
  className="case-study-section-marker"
  data-case-study-marker="verification"
  aria-hidden="true"
/>
<span
  className="case-study-section-marker"
  data-case-study-marker="boundaries"
  aria-hidden="true"
/>
```

These five snippets are separate insertions, one per section; do not place all five in one section.

- [ ] **Step 5: Add responsive case-navigation composition**

Add:

```css
.case-study-body {
  margin-top: 72px;
}

.case-study-body__content {
  min-width: 0;
}

.case-study-body__content .case-study-section:first-child {
  margin-top: 0;
}

.case-study-section {
  position: relative;
}

.case-study-section-marker {
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  height: 1px;
  pointer-events: none;
}

.case-study-navigation {
  width: min(calc(100% - 24px), 780px);
  margin-inline: auto;
}

.case-study-navigation__desktop {
  display: none;
}

.case-study-navigation__mobile {
  border-block: 1px solid var(--portfolio-rule);
}

.case-study-navigation__mobile summary {
  display: flex;
  min-height: 44px;
  align-items: center;
  cursor: pointer;
  color: var(--portfolio-accent);
  font-size: 0.75rem;
  font-weight: 700;
}

.case-study-navigation__mobile nav,
.case-study-navigation__desktop {
  gap: 2px;
}

.case-study-navigation__mobile nav {
  display: grid;
  padding-bottom: 12px;
}

.case-study-navigation a {
  display: flex;
  min-height: 44px;
  align-items: center;
  border-left: 2px solid transparent;
  padding-inline: 12px;
  color: var(--portfolio-muted);
  font-size: 0.75rem;
  font-weight: 700;
  text-decoration: none;
}

.case-study-navigation a[aria-current="location"] {
  border-left-color: var(--portfolio-accent);
  color: var(--portfolio-accent);
}

@media (min-width: 768px) {
  .case-study-navigation {
    width: min(calc(100% - 48px), 780px);
  }
}

@media (min-width: 1024px) {
  .case-study-body {
    display: grid;
    grid-template-columns: minmax(160px, 220px) minmax(0, 780px);
    gap: clamp(32px, 5vw, 72px);
    width: min(calc(100% - 48px), 1120px);
    margin-inline: auto;
    align-items: start;
  }

  .case-study-navigation {
    width: auto;
    margin: 0;
  }

  .case-study-navigation__desktop {
    position: sticky;
    top: 92px;
    display: grid;
  }

  .case-study-navigation__mobile {
    display: none;
  }

  .case-study-body__content .case-study-reading-column {
    width: 100%;
  }
}
```

Keep `scroll-margin-top` at 72px on small screens and 98px at 768px and wider.

- [ ] **Step 6: Raise the remaining microtype floors without changing copy**

Replace every remaining `font-size: 0.625rem` declaration with these later, explicit overrides:

```css
.case-study-hero__orientation,
.case-study-section-heading__eyebrow,
.hero-section__eyebrow,
.hero-section__context-label,
.project-card__eyebrow,
.background-card__eyebrow,
.contact-footer__rail {
  font-size: 0.75rem;
}

.case-study-stack,
.case-study-architecture__index,
.case-study-decision__number,
.section-intro__rail,
.background-card__period,
.capability-group h3,
.contact-footer__meta,
.project-card__technologies {
  font-size: 0.6875rem;
}
```

Delete the obsolete `.portfolio-header__role` rule.

- [ ] **Step 7: Finish selector-specific focus and 44px contracts**

The combined focus list must include:

```css
.portfolio-page a:focus-visible,
.portfolio-page summary:focus-visible,
.portfolio-header a:focus-visible,
.portfolio-header button:focus-visible,
.contact-footer a:focus-visible,
.case-study-decision__details summary:focus-visible,
.case-study-verification__details summary:focus-visible {
  outline: 3px solid #3d5fec;
  outline-offset: 3px;
}
```

Add individual rules so the source checker and computed styles both establish each target directly:

```css
.portfolio-mobile-navigation__trigger {
  min-height: 44px;
}

.portfolio-mobile-navigation__close {
  min-height: 44px;
}

.portfolio-mobile-navigation__links a {
  min-height: 44px;
}

.portfolio-header__contact {
  min-height: 44px;
}

.hero-section__cta {
  min-height: 44px;
}

.case-study-action {
  min-height: 44px;
}

.case-study-decision__details summary {
  min-height: 44px;
}

.case-study-verification__details summary {
  min-height: 44px;
}

.case-study-navigation__mobile summary {
  min-height: 44px;
}
```

- [ ] **Step 8: Run focused and complete source validation**

Run:

```zsh
set -euo pipefail
pnpm check:portfolio -- reframeStyles | tee /tmp/portfolio-ia-reframe-2026-08-19/evidence/static/08-styles-green.txt
pnpm check:portfolio -- all | tee /tmp/portfolio-ia-reframe-2026-08-19/evidence/static/09-all-green.txt
node scripts/check-theme-initializer-fixtures.mjs
pnpm lint
pnpm exec tsc --noEmit
```

Expected: every command exits 0.

- [ ] **Step 9: Review the complete source diff against scope**

Run:

```bash
git status --short --branch
set +e
git diff --no-index -- /tmp/portfolio-ia-reframe-2026-08-19/source-before/scripts/check-portfolio-redesign.mjs /Users/tysonhu/Documents/Portfolio/scripts/check-portfolio-redesign.mjs
git diff --no-index -- /tmp/portfolio-ia-reframe-2026-08-19/source-before/src/data/portfolio.ts /Users/tysonhu/Documents/Portfolio/src/data/portfolio.ts
git diff --no-index -- /tmp/portfolio-ia-reframe-2026-08-19/source-before/src/components/portfolio /Users/tysonhu/Documents/Portfolio/src/components/portfolio
git diff --no-index -- /tmp/portfolio-ia-reframe-2026-08-19/source-before/src/app/projects/eazy-review/page.tsx /Users/tysonhu/Documents/Portfolio/src/app/projects/eazy-review/page.tsx
git diff --no-index -- /tmp/portfolio-ia-reframe-2026-08-19/source-before/src/app/portfolio.css /Users/tysonhu/Documents/Portfolio/src/app/portfolio.css
set -e
```

Expected: only the approved shell, hero, case-study, checker, and CSS surfaces appear. No asset, dependency, unrelated section, deployment, or GitHub metadata change is introduced.

---

### Task 6: Build, serve, and perform staged rendered acceptance

**Files:**
- Read: all files modified in Tasks 2–5
- Create outside repository: `/tmp/portfolio-ia-reframe-2026-08-19/evidence/build/`
- Create outside repository: `/tmp/portfolio-ia-reframe-2026-08-19/evidence/browser/`
- Create outside repository: `/tmp/portfolio-ia-reframe-2026-08-19/evidence/screenshots/`
- Test: production build and in-app Browser

**Interfaces:**
- Consumes: the green source contracts and production Next.js build.
- Produces: route, geometry, interaction, accessibility, console, screenshot, and final-worktree evidence sufficient for staged local review; no publication artifact.

- [ ] **Step 1: Run the final source and production-build gate with preserved logs**

Run:

```zsh
set -euo pipefail
snapshot_root=/tmp/portfolio-ia-reframe-2026-08-19
pnpm check:portfolio -- all | tee $snapshot_root/evidence/build/01-portfolio-contracts.txt
node scripts/check-theme-initializer-fixtures.mjs | tee $snapshot_root/evidence/build/02-theme-fixtures.txt
pnpm lint | tee $snapshot_root/evidence/build/03-lint.txt
pnpm exec tsc --noEmit | tee $snapshot_root/evidence/build/04-typescript.txt
pnpm build | tee $snapshot_root/evidence/build/05-next-build.txt
```

Expected: all five commands exit 0. Do not run OpenNext or Wrangler.

- [ ] **Step 2: Start the production server locally**

In a dedicated terminal:

```zsh
cd /Users/tysonhu/Documents/Portfolio
pnpm start -- --hostname 127.0.0.1 --port 3000
```

Expected: the server remains available at `http://127.0.0.1:3000` until browser QA finishes.

- [ ] **Step 3: Verify both success routes and fixed-light initialization**

From another terminal:

```zsh
set -euo pipefail
snapshot_root=/tmp/portfolio-ia-reframe-2026-08-19
curl --fail --silent --show-error --max-time 5 http://127.0.0.1:3000/ > /dev/null
curl --fail --silent --show-error --max-time 5 http://127.0.0.1:3000/projects/eazy-review > /dev/null
pnpm check:theme-initializer -- http://127.0.0.1:3000/ | tee $snapshot_root/evidence/build/06-served-theme-home.txt
pnpm check:theme-initializer -- http://127.0.0.1:3000/projects/eazy-review | tee $snapshot_root/evidence/build/07-served-theme-case-study.txt
```

Expected: both routes return success and both fixed-light checks pass.

- [ ] **Step 4: Exercise the required Browser viewport matrix**

Use the in-app Browser on both routes at:

| Width × height | Homepage | Eazy Review |
|---|---|---|
| 320×844 | header, Menu closed/open, overflow, focus | overview, mobile section disclosure, decision/evidence disclosures, boundaries |
| 390×844 | header, Menu closed/open, overflow, focus | overview, mobile section disclosure, decision/evidence disclosures, boundaries |
| 768×1024 | shared shell transition, overflow | mobile case navigation, content width, anchors |
| 1024×768 | hero and shared shell | sticky case rail, anchors, disclosures |
| 1366×768 | exact initial-fold gate | sticky case rail and reading column |
| 1536×1024 | exact initial-fold gate | wide composition and boundaries |

At every tested state require:

```js
document.documentElement.scrollWidth ===
  document.documentElement.clientWidth
```

Expected: true, with no clipped text or control.

- [ ] **Step 5: Measure both homepage fold gates at scroll position zero**

At 1366×768 run:

```js
const header = document
  .querySelector(".portfolio-header")
  .getBoundingClientRect();
const rail = document
  .querySelector(".selected-work .section-intro__rail")
  .getBoundingClientRect();

({
  headerBottom: header.bottom,
  railTop: rail.top,
  railBottom: rail.bottom,
  viewportHeight: innerHeight,
  accepted:
    scrollY === 0 &&
    rail.top >= header.bottom &&
    rail.bottom <= innerHeight,
});
```

At 1536×1024 run:

```js
const heading = document
  .querySelector("#work-title")
  .getBoundingClientRect();
const card = document
  .querySelector(".project-card--flagship")
  .getBoundingClientRect();
const cardIntersection = Math.max(
  0,
  Math.min(card.bottom, innerHeight) - Math.max(card.top, 0),
);

({
  headingBottom: heading.bottom,
  cardIntersection,
  accepted:
    scrollY === 0 &&
    (heading.bottom <= innerHeight || cardIntersection >= 80),
});
```

Expected: both `accepted` values are true.

- [ ] **Step 6: Perform the human hero scan-path judgment**

Inspect fresh 1366×768 and 1536×1024 screenshots. Record pass only if the eyebrow, headline, supporting copy, and primary action read as one uninterrupted path; current-service context and utility links remain visually secondary; Selected Work is clearly the next destination.

Expected: this is a human visual judgment, not inferred from the geometry scripts.

- [ ] **Step 7: Verify mobile dialog behavior at 320px and 390px**

For each mobile width:

1. Focus Menu and activate it.
2. Confirm `dialog#portfolio-mobile-dialog` is open and focus is inside it.
3. Confirm Work, Writing, Lab, About, Background, Contact, and GitHub are all visible and keyboard reachable.
4. Press Escape; confirm the dialog closes and focus returns to Menu.
5. Reopen, activate Close, and confirm focus returns.
6. Reopen, activate the backdrop, and confirm focus returns.
7. Reopen, activate an internal destination, and confirm the dialog closes and the expected portfolio hash is reached.
8. Inspect Writing, Lab, and GitHub for exact href, `target="_blank"`, `rel="noopener noreferrer"`, and announced new-tab text.

Expected: every path works without requiring footer navigation.

- [ ] **Step 8: Verify route-aware shared navigation**

On `/`:

- Work and About use unprefixed hashes.
- Contact is `#contact`.
- Writing and Lab remain absolute URLs.
- Desktop primary navigation contains Work, Writing, Lab, and About but not Background.

On `/projects/eazy-review`:

- Work has `aria-current="page"`.
- Work, About, Background, and Contact resolve through `/`.
- Writing and Lab remain absolute URLs and are never prefixed.

At 1024px the visible identity is `Tyson Hu`; at 1366px it is `Tianzhe “Tyson” Hu`. At both widths the monogram and visible name form one home link whose accessible name retains the full name.

At both routes, confirm the footer contains the visible email action, GitHub, LinkedIn, Writing, Lab, and Back to top.

Expected: internal/external branching, identity behavior, and shared ecosystem propagation are correct at both routes.

- [ ] **Step 9: Verify Eazy Review orientation and disclosure behavior**

At desktop and mobile breakpoints:

1. Confirm At a Glance precedes Architecture in DOM and rendered order.
2. Activate Overview, Architecture, Engineering decisions, Verification, and Boundaries.
3. Confirm the target heading clears the sticky global header.
4. Scroll through sections; confirm one visible navigation link has `aria-current="location"` and Boundaries becomes current at document bottom.
5. On mobile, activate a section link and confirm the `On this page` disclosure closes.
6. Confirm every decision starts closed, opens by keyboard, and exposes Why, Verification, Boundary, and source links.
7. Confirm every verification bundle has one visible primary evidence link and one closed `View related evidence` disclosure.
8. Confirm all four boundary statements are visible without opening anything.
9. Confirm no image or label represents the generated overview art as a product screen.

Expected: scan mode and evidence mode are both complete and keyboard usable.

- [ ] **Step 10: Measure the exact interaction and type floors**

For Menu, Close, header Contact, both hero CTAs, every mobile-sheet link, both case-study actions, and every disclosure summary, record:

```js
element.getBoundingClientRect().height >= 44
```

For every hero/section rail, case-study eyebrow, project-type label, and current-context label, record:

```js
Number.parseFloat(getComputedStyle(element).fontSize) >= 11
```

Additionally require project-type and current-context labels to compute to at least 12px.

Expected: every targeted assertion is true.

- [ ] **Step 11: Test reduced motion**

With `prefers-reduced-motion: reduce` enabled, open the mobile dialog and disclosures. Inspect the sheet:

```js
const sheet = document.querySelector(
  ".portfolio-mobile-navigation__sheet",
);
const style = getComputedStyle(sheet);

({
  transform: style.transform,
  transitionDuration: style.transitionDuration,
});
```

Expected: no translated entrance state and no meaningful transition or animation duration. Keyboard and disclosure behavior remain intact.

- [ ] **Step 12: Test actual 200% browser text zoom**

Set the Browser outer viewport to 1280×800 and use actual browser text/page zoom at 200% on both routes. Do not substitute a root-font-size mutation.

Verify:

- no horizontal document overflow;
- no clipped or overlapping header/dialog text;
- Menu and Close remain reachable;
- H1 and supporting copy remain readable;
- every anchor target remains clear of the sticky header;
- decision and verification content remains within the viewport;
- every control remains reachable by keyboard.

Expected: all pass. If the Browser cannot provide actual 200% zoom, record `not run` and do not claim staged acceptance.

- [ ] **Step 13: Check fresh-route console and image health**

Reload `/` and `/projects/eazy-review` with the console cleared. Require:

- correct URL and page identity;
- meaningful DOM content;
- no Next.js error overlay;
- all intended images complete with nonzero natural dimensions;
- zero browser-console errors;
- zero browser-console warnings.

A deliberate missing-route 404 is outside this success-route assertion.

- [ ] **Step 14: Capture the required local screenshots**

Save outside the repository:

```text
/tmp/portfolio-ia-reframe-2026-08-19/evidence/screenshots/home-1366x768-fold.png
/tmp/portfolio-ia-reframe-2026-08-19/evidence/screenshots/home-1536x1024-fold.png
/tmp/portfolio-ia-reframe-2026-08-19/evidence/screenshots/home-390x844-menu-closed.png
/tmp/portfolio-ia-reframe-2026-08-19/evidence/screenshots/home-390x844-menu-open.png
/tmp/portfolio-ia-reframe-2026-08-19/evidence/screenshots/home-320x844-menu-open.png
/tmp/portfolio-ia-reframe-2026-08-19/evidence/screenshots/eazy-review-1366x768-overview.png
/tmp/portfolio-ia-reframe-2026-08-19/evidence/screenshots/eazy-review-1366x768-decisions.png
/tmp/portfolio-ia-reframe-2026-08-19/evidence/screenshots/eazy-review-390x844-overview.png
/tmp/portfolio-ia-reframe-2026-08-19/evidence/screenshots/eazy-review-390x844-decision-open.png
/tmp/portfolio-ia-reframe-2026-08-19/evidence/screenshots/eazy-review-320x844-navigation.png
/tmp/portfolio-ia-reframe-2026-08-19/evidence/screenshots/home-1280x800-zoom-200.png
/tmp/portfolio-ia-reframe-2026-08-19/evidence/screenshots/eazy-review-1280x800-zoom-200.png
```

Recapture any image where sticky navigation obscures the intended heading.

- [ ] **Step 15: Create and verify the final local source manifest**

Run:

```zsh
set -euo pipefail
portfolio_repo=/Users/tysonhu/Documents/Portfolio
snapshot_root=/tmp/portfolio-ia-reframe-2026-08-19
if [[ -e $snapshot_root/source-after || -e $snapshot_root/source-after-files.z ]]
then
  print -u2 -- "Final snapshot path already exists; inspect it before continuing."
  exit 1
fi
mkdir -p $snapshot_root/source-after
cd $portfolio_repo
git status --porcelain=v2 --branch > $snapshot_root/source-after-status.txt
git ls-files -co --exclude-standard -z | LC_ALL=C sort -z > $snapshot_root/source-after-files.z
rsync -a --from0 --files-from=$snapshot_root/source-after-files.z $portfolio_repo/ $snapshot_root/source-after/
(cd $portfolio_repo && xargs -0 shasum -a 256 < $snapshot_root/source-after-files.z) > $snapshot_root/source-after-working.sha256
(cd $snapshot_root/source-after && xargs -0 shasum -a 256 < $snapshot_root/source-after-files.z) > $snapshot_root/source-after-copy.sha256
cmp $snapshot_root/source-after-working.sha256 $snapshot_root/source-after-copy.sha256
```

Expected: `cmp` exits 0.

- [ ] **Step 16: Rerun the final gate after browser-driven corrections**

Run:

```zsh
set -euo pipefail
pnpm check:portfolio -- all
node scripts/check-theme-initializer-fixtures.mjs
pnpm lint
pnpm exec tsc --noEmit
pnpm build
git status --short --branch
```

Expected: all validation commands pass; the worktree remains honestly dirty/local.

- [ ] **Step 17: Stop and hand off for human review**

Stop the local server with Ctrl-C. Report:

- exact commands and outcomes;
- screenshot paths;
- the two fold measurements;
- navigation, disclosure, focus, target-size, reduced-motion, text-zoom, console, and overflow results;
- any not-run or blocked item;
- the retained snapshot/evidence path;
- Product Flow, public role/lifecycle rows, physical-phone acceptance, commit, push, PR update, deployment, production, and full-audit acceptance as unclaimed.

Do not proceed to commit, push, PR #2, dev deployment, or production without separate authorization.
