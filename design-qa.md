# Design QA — historical portfolio editorial redesign snapshot (`dfb7aad`) and bounded working-tree addendum

## Provenance and current validation

This file records the accepted visual and design QA performed for commit `dfb7aad5ce30a5a891ac2bf42f6f07fc891df7b5`. The capture dimensions, browser observations, 51-check result, and `passed` disposition below apply only to that commit. They are retained as historical provenance, not as exact-head evidence for `e717cfe469379e58874b0ac70a62fea8987ddf68` or any later revision.

Except inside the explicitly labeled 2026-08-19 post-snapshot addendum, all relative wording below—including “final,” “now,” “fresh,” “passed,” and “unresolved”—describes the `dfb7aad` snapshot and its then-current QA cycle. The `/tmp/...` and `/Users/...` capture paths document local inputs used for those cycles; they are not repository artifacts and are not guaranteed to remain available.

The recruiter-audit and refinement series after `dfb7aad` changed the homepage hierarchy, the Eazy Review case-study shell, and the fixed-light theme-initializer contract. For the checked-out revision, the repository-local validation surfaces are:

- Current recruiter-facing static contract: `pnpm check:portfolio -- all` (`scripts/check-portfolio-redesign.mjs`).
- Fixed-light checker regression fixtures: `node scripts/check-theme-initializer-fixtures.mjs`.
- Served-output fixed-light check: `pnpm check:theme-initializer -- <local-preview-url>` (`scripts/check-theme-initializer.mjs`).
- Source and build checks: `pnpm lint`, `pnpm exec tsc --noEmit`, and `pnpm build`.

Those commands and a fresh local rendered recruiter audit must be run and recorded against the exact revision under review. The post-snapshot addendum records bounded local working-tree evidence only; it is not a commit, deployment, production, cross-browser, physical-device, or human-acceptance claim.

## Source and capture evidence for `dfb7aad`

- Desktop source: `/Users/tysonhu/Downloads/tianzhe-portfolio-redesign-desktop.png`
- Mobile source: `/Users/tysonhu/Downloads/tianzhe-portfolio-redesign-mobile.png`
- Desktop implementation capture: `/tmp/portfolio-redesign-desktop.png`
- Mobile implementation capture: `/tmp/portfolio-redesign-mobile.png`
- Target URL and state: `http://127.0.0.1:3000/`, default homepage content, light system appearance, no hover state, top-of-page start, local development data.
- Browser: Codex In-app Browser, selected for the local URL by the Browser plugin. No standalone Playwright, Chrome fallback, Computer Use, web search, or alternate browser surface was used.

## Viewport and density normalization

| Surface | CSS viewport | Browser DPR | Source pixels | Implementation pixels | Normalization |
| --- | ---: | ---: | ---: | ---: | --- |
| Desktop | 1440 × 900 | 1 | 1440 × 5836 | 1440 × 5852 | Source treated as 1 image pixel per target CSS pixel; implementation captured at 1 device pixel per CSS pixel. Width and state are identical. |
| Mobile | 390 × 844 | 1 | 390 × 8299 | 390 × 8282 | Source treated as 1 image pixel per target CSS pixel; implementation captured at 1 device pixel per CSS pixel. Width and state are identical. |

The final mobile height differs by 17 pixels (0.2%). The final desktop height differs by 16 pixels (0.3%). Both viewports now preserve the reference's section-heading wraps and overall density while retaining the approved evidence-qualified copy.

## Capture method

The In-app Browser full-page screenshot path repeated sticky content and produced blank regions, so the final implementation captures were assembled only from Browser viewport screenshots. Scrollbars were temporarily hidden with a capture-only CSS rule, each scroll advanced by the exact visible-content height (797px mobile after the measured 47px sticky header; 827px desktop after the measured 73px sticky header), and each later viewport was cropped at the exact header/overlap boundary before vertical stitching. The capture-only CSS was removed immediately afterward. The resulting PNGs contain no repeated scrollbar thumbs or viewport-boundary seams. These earlier stitching artifacts were capture artifacts, not application findings.

## Full-view evidence recorded for `dfb7aad`

- Desktop comparison: source and `/tmp/portfolio-redesign-desktop.png` were opened together in the same comparison input after the final fixes and capture normalization.
- Mobile comparison: source and `/tmp/portfolio-redesign-mobile.png` were opened together in the same comparison input after the final fixes and capture normalization.
- Desktop result: hierarchy, grid canvas, header, hero, project-card ordering, approach/background/capability grouping, and contact footer track the reference. Approach renders in three lines, Background in two, and the final height is within 0.3% of the source.
- Mobile result: 390 × 8282 closely tracks the 390 × 8299 source, including the compact header, six-line hero, exact three-line Work heading, stacked project rhythm, large flagship phone, coherent full study screenshot inside its tall frame, approach cards, neutral background cards, capability rules, and contact footer.

## Focused evidence recorded for `dfb7aad`

Focused comparisons were necessary because full-page scaling made typography and project imagery too small to judge reliably.

- Desktop top reference: `/tmp/portfolio-ref-desktop-top-focus.png`
- Desktop top implementation: `/tmp/portfolio-impl-desktop-top-focus.png`
- Mobile top reference: `/tmp/portfolio-ref-mobile-top-focus.png`
- Mobile top implementation: `/tmp/portfolio-impl-mobile-top-focus.png`
- Mobile Work reference: `/tmp/portfolio-ref-mobile-work-focus.png`
- Mobile Work implementation: `/tmp/portfolio-impl-mobile-work-focus.png`

Each reference/implementation pair was generated at the same pixel width and crop size and opened together in one comparison input. Focused inspection covered font scale/wrapping, header control shapes, hero rhythm, card surfaces, image scale/crop, and link/icon treatment.

## Severity ledger and comparison history

### Iteration 0 — functional and initial desktop comparison

- P1: `Back to top` targeted the sticky header itself, so activating `#top` from the footer did not return the document to scroll position 0. Fixed by moving `id="top"` to a dedicated focusable page-top anchor before the header. Post-fix Browser evidence: URL hash `#top`, `scrollY: 0`, active element `SPAN#top`.
- P2: Header TH lacked the dark rounded-square mark and Email was rectangular. Fixed with a 36px dark monogram surface and pill-shaped Email action.
- P2: Hero wrapping diverged from the reference. Fixed with responsive line-break controls; desktop and mobile now preserve the intended phrase grouping, and mobile renders six lines.
- P2: Eazy Review and OpenCore visuals were underscaled on desktop. Fixed with desktop crop/scale rules.
- P2: BCI used a split dark/white treatment rather than a compact light row. Fixed with a light surface, compact 70/30 desktop row, linked title, and waveform visual.
- P2: Approach lacked white card surfaces. Fixed with white-tinted cards and reference-like padding/minimum height.
- P2: Background used blue top rules instead of neutral bordered cards. Fixed at desktop and mobile with neutral borders, radius, surface, and shadow.
- P2: Capability rules were blue. Fixed with dark neutral rules.
- P2: Footer email was unfilled and lacked the directional icon. Fixed with a filled white pill and arrow-up-right icon.
- Initial post-fix desktop evidence: 1440 × 5945. Independent review later found two remaining heading-wrap P2s, resolved in Iteration 4.

### Iteration 1 — initial mobile comparison

- P2: Mobile header still showed the supporting role, contrary to the compact reference. Fixed by hiding the role below 768px while retaining it on desktop.
- P2: Mobile hero combined reference lines. Fixed with mobile-only line breaks while retaining the desktop line structure.
- P2: Mobile Background and Capabilities retained blue-rule styling. Fixed with neutral background cards and dark capability rules.
- Post-fix capture: 390 × 7118. The component styling was closer, but the page remained materially denser than the 390 × 8299 source.

### Iteration 2 — mobile density and imagery

- P2: Selected Work heading wrapped too compactly. The first density pass used a mobile-specific 12ch measure; independent review later tightened it to the exact reference grouping in Iteration 4.
- P2: Major mobile-section rhythm was compressed. Fixed with larger mobile project visuals plus explicit minimum heights for Approach, Background, and Capability groups. The study visual was increased again after focused comparison to align Work-section rhythm.
- P2: Eazy phone was underscaled inside a large black raster field. Fixed by using a taller visual region with a centered `object-fit: cover` crop; the final phone is large, complete, and centered.
- Comparison after the first density pass: 390 × 8132. Final post-fix comparison after the study-region adjustment: 390 × 8282 versus 390 × 8299 source.
- Initial post-fix evidence: `/tmp/portfolio-redesign-mobile.png` plus the focused Mobile Work pair. Independent review later identified the study-image crop and exact Work line grouping addressed in Iteration 4.

### Iteration 3 — capture normalization

- Repeated scrollbar thumbs and 1px horizontal viewport seams were traced to the manual screenshot stitch using 46/72px trims while the measured bordered headers were 47/73px. These were not application defects.
- Final recapture temporarily hid page scrollbars and used exact 47/73px header trims with overlap-aware final clips. Same-input comparison confirmed clean captures without repeated UI or seams.

### Iteration 4 — independent review correction

- P2: Desktop Approach wrapped to four lines and Background to three. Scoped desktop measures of 19ch and 21ch now produce the reference's three-line and two-line groupings. The normalized desktop capture is 1440 × 5852 versus 1440 × 5836.
- P2: Mobile Work placed `clear` on the second line at 12ch; a measured 11ch width now renders exactly `Different project` / `types, with a` / `clear hierarchy.` without duplicating copy.
- P2: The mobile Networking raster was forced through a 500px-tall `object-fit: cover` crop, leaving fragmented content. The approved real screenshot then used `object-fit: contain`, centered inside the existing 500px browser frame, so the complete product state was coherent and undistorted while section rhythm stayed aligned. This historical asset decision was superseded by the 2026-08-19 addendum.
- P3 polish: the BCI linked title now has a resting underline and accent hover affordance.
- `dfb7aad` Browser evidence: desktop Approach/Background line counts `3/2`; mobile Work line count `3`; study frame `500px` with `object-fit: contain`; zero horizontal overflow; all four images complete with non-zero natural dimensions; the fresh snapshot console had zero warnings and zero errors.

### Iteration 5 — whole-build review correction

- P2 accessibility: the BCI title was the card's only link, but its desktop inline box measured roughly 30.72px high. The scoped anchor now uses `inline-flex`, vertical centering, and `min-height: 44px`; Browser measurement confirms an exact 44px desktop target and an 80.625px wrapped mobile target.
- P2 contract coverage: the structural checker previously verified only a generic 44px declaration and did not lock canonical destinations. It now checks the contact email, GitHub and LinkedIn profiles, live study site, four repository URLs, internal case-study route, and component propagation for contact destinations.
- Test-first evidence: the expanded checker failed on the missing scoped BCI declarations before the CSS change; a mutated fixture replacing the live study destination failed the exact canonical check. The corrected implementation passes all 51 checks.
- Same-input focused desktop comparison confirms the larger hit box preserves the intended BCI row composition and resting underline without introducing a visible P0–P2 mismatch. Clean final captures are 1440 × 5865 versus 1440 × 5836 and 390 × 8282 versus 390 × 8299.

## Approved-content and asset decisions

- The implementation intentionally preserves the approved evidence-qualified project summaries, metric source period, non-unique-visit note, technology lists, military role detail, and education wording. Their extra wrapping versus the visual reference is an approved content difference, not visual drift.
- Historical `dfb7aad` decision, superseded by the 2026-08-19 addendum: the study reference depicted a quiz-question panel while the implementation used the existing real `public/networking-study-platform.png` product screenshot. That snapshot kept the screenshot centered and fully visible with `object-fit: contain` inside the reference-sized browser frame.

## Required fidelity surfaces recorded for `dfb7aad`

- Fonts and typography: approved sans/mono families, heavy display hierarchy, compact mono rails, responsive sizes, letter spacing, and final headline/section wrapping were checked in full and focused comparisons. Desktop Approach/Background render in three/two lines and mobile Work in the exact three reference lines. Minor rasterization differences remain P3 only.
- Spacing and layout rhythm: container widths, hero balance, section gaps, card padding/radii, desktop grid tracks, mobile stacking, and page-height density were checked. Final mobile height is within 0.2% and desktop within 0.5% of the sources.
- Colors and tokens: warm grid canvas, dark ink/footer, cobalt labels/rules, pale study blue, pale OpenCore green, white approach/background surfaces, muted text, and green status dots match the intended token roles.
- Image quality and crop: all four local assets loaded sharply with non-zero natural dimensions. Eazy scale/crop and OpenCore scale were corrected; BCI uses the approved waveform; the study screenshot is complete and undistorted within its 500px frame; the subject difference is the approved real-screenshot constraint documented above.
- Copy and content: labels, headings, project ordering, metrics, source period, non-unique-visit qualification, service/education records, technology groups, and link labels were checked. Longer evidence-qualified copy is intentionally preserved under the approved spec.
- Icons, responsiveness, accessibility, and polish: Lucide directional icons match the interaction roles; desktop/mobile header changes, full mobile stacking, reduced-motion support, 44px targets, focus outlines, external-link contracts, anchor clearance, and overflow were verified.

## Browser, overlay, console, and interaction results recorded for `dfb7aad`

- Meaningful page identity: `Tianzhe Hu — Software Engineer`; expected hero, four project cards, Approach, Background, Capabilities, and Contact content present.
- Framework overlay: no visible Next.js error/badge/toast overlay at either viewport or on `/projects/eazy-review`.
- Console: fresh final Browser tab produced zero warnings and zero errors on the homepage, anchor interactions, and case-study route. An earlier Eazy image LCP warning was fixed by eager-loading the flagship image; no new warning appeared after the fix.
- Horizontal overflow: desktop `scrollWidth/clientWidth = 1440/1440`; mobile `390/390`; case study also matched its client width.
- Image health: all four local images completed with non-zero natural width and height at both responsive states.
- Sticky/responsive header: sticky at `top: 0`; desktop nav displayed; mobile nav and supporting role hidden; monogram/name/Email retained.
- Anchors: Work, Approach, and Background hashes updated correctly. Desktop section tops landed at approximately 88px and headings at approximately 198px, clear of the sticky header. Mobile Work CTA reached the Work section; hidden header navigation is the approved mobile simplification.
- Case study: same final Browser tab navigated internally to `/projects/eazy-review`, rendered heading `Eazy Review` and independent-project evidence content, then returned to the homepage.
- Link contracts inspected without activating external destinations: email `mailto:tysonhu.dev@gmail.com`; GitHub profile `https://github.com/tyson-hu`; LinkedIn `https://www.linkedin.com/in/TianzheHu`; study `https://study.tianzhe.me`; Eazy, study, OpenCore, and BCI repository URLs; case study `/projects/eazy-review`; back-to-top `#top`. External links expose `_blank` and `noopener noreferrer`; mail links remain same-context.
- Keyboard focus: header Email and `View selected work` each render a 3px blue solid outline with 3px offset at desktop and mobile.
- Back to top: reached `scrollY: 0`, hash `#top`, and focused the dedicated top anchor.

## Static verification recorded for `dfb7aad`

- `pnpm check:portfolio -- all`: passed all 51 portfolio contract checks.
- `pnpm lint`: passed.
- `pnpm exec tsc --noEmit`: passed.
- Initial sandboxed `pnpm build`: blocked only by `EPERM` writes under `~/Library/Preferences/.wrangler/`; no source compile failure was reported.
- Controller-approved `pnpm build` rerun after Iteration 4: passed. Next compiled in 1.1s, TypeScript completed, 6/6 static pages generated, and `/`, `/_not-found`, `/opengraph-image`, and `/projects/eazy-review` were prerendered. Only the pre-existing Node `module.register()` deprecation warning appeared. No deployment occurred.

## P3 follow-ups

- Historical, superseded follow-up: the `dfb7aad` study screenshot did not match the reference's quiz-question subject. The 2026-08-19 addendum records the later approved illustrative-artwork correction.
- Minor font rasterization and exact text wrapping differ from the static reference because the implementation uses the approved project fonts and longer evidence-qualified copy.

## Unresolved P0–P2 recorded for `dfb7aad`

None were recorded for that snapshot.

Historical QA result for commit `dfb7aad`: passed

## Post-snapshot scoped correction — 2026-08-19 uncommitted working tree

This addendum records only the two user-reported visual corrections in the local working tree based on `cdd1c94`: contact-headline punctuation crowding and the Networking Study Platform card artwork. The user directly approved a purpose-built illustrative study asset, superseding the historical real-screenshot constraint for this homepage card. The live site and repository remain the inspectable product proof.

### Iteration 6 — punctuation and Networking artwork

- Contact headline: `.contact-footer__intro h2` tracking changed from `-0.065em` to `-0.055em`. The 1440 × 1000 production-build capture shows the final period as a separate glyph to the right of the final `l`; an independent focused review found no remaining overlap.
- Networking artwork: `public/portfolio/networking-study-panel.webp` replaces the literal full-page screenshot on the homepage card. It uses one isolated floating quiz panel, restrained periwinkle/cobalt light, soft shadow, and negative space to align with the Eazy Review and OpenCore product-render family. Alternative text describes the illustration rather than presenting it as product-proof evidence.
- Responsive framing: desktop retains the shallow centered crop used by the paired project row. Below 768px, the study visual now uses its natural `3 / 2` ratio instead of the historical 500px screenshot frame. Browser measurements were 328 × 218.66 at 390px and 258 × 172 at 320px; both images completed with non-zero natural dimensions and centered `object-fit: contain` rendering.
- Browser evidence: Codex In-app Browser against `http://127.0.0.1:3001/` served from a fresh Next.js production build; CSS viewport coverage was 1440 × 1000, 390 × 844, and 320 × 844. Each viewport had `scrollWidth === clientWidth`, no framework overlay, and the final tab reported zero console warnings or errors.
- Interaction regression: activating `Back to top` returned the URL to `#top`, set `scrollY` to `0`, and focused `SPAN#top`.
- Local captures: `/tmp/portfolio-after-work-desktop.png`, `/tmp/portfolio-after-work-390.png`, `/tmp/portfolio-after-work-320.png`, and `/tmp/portfolio-after-contact-desktop.png`.
- Static regression coverage now requires the new artwork path and alternative text contract, rejects the legacy homepage screenshot path, locks centered study-image positioning, locks the mobile `3 / 2` frame, and locks the corrected footer tracking.
- Remaining P3: the quiz subject necessarily contains more interface detail than the terminal and phone illustrations. Independent review found the treatment materially closer and acceptable across all three widths; further abstraction is optional, not a blocking defect.

Working-tree QA result for the two bounded findings: passed. At the time of this local QA pass, no commit, push, review-state change, deployment, production verification, cross-browser pass, physical-device pass, or human acceptance was claimed. The later authorized dev-only deployment is recorded below.

## Dev-only review deployment — 2026-08-19

- Target boundary: Wrangler `env.dev` only, resolving to Worker `tianzhe-portfolio-dev` and its environment-suffixed `WORKER_SELF_REFERENCE`. Production Worker `tianzhe-portfolio` and its custom domain were not targeted.
- Preflight: `pnpm check:portfolio -- all`, `pnpm lint`, `pnpm exec tsc --noEmit`, `pnpm exec opennextjs-cloudflare build --env dev`, and `pnpm exec wrangler deploy --dry-run --env dev` passed. The dry run named only `tianzhe-portfolio-dev`.
- Deployment command: `pnpm exec opennextjs-cloudflare deploy --env dev`.
- Deployed URL: `https://tianzhe-portfolio-dev.tyson-ec2.workers.dev`.
- Deployed Worker version: `bda5f55d-fff7-450c-b744-04630a2e9cec`; `wrangler deployments list --env dev` confirmed it receives 100% of dev traffic.
- HTTP verification: `/`, `/projects/eazy-review`, and `/portfolio/networking-study-panel.webp` each returned 200 without a redirect; the served fixed-light initializer check passed.
- Browser verification: 1440 × 1000, 390 × 844, and 320 × 844 all matched `scrollWidth === clientWidth`, showed no framework overlay, and loaded the new Networking artwork with non-zero natural dimensions. Mobile retained the `3 / 2` artwork frame at both widths; the final dev tab produced no console warnings or errors.
- Contact and navigation: the deployed 1440px capture shows the final `l.` as separate glyphs; `Back to top` returned to `#top`, `scrollY: 0`, and focus on `SPAN#top`.
- Dev captures: `/tmp/portfolio-dev-deploy-desktop.png`, `/tmp/portfolio-dev-deploy-390.png`, and `/tmp/portfolio-dev-deploy-contact.png`.

Dev-only deployment result: passed for review. No commit, push, production deployment, custom-domain verification, cross-browser pass, physical-device pass, or human acceptance is claimed.
