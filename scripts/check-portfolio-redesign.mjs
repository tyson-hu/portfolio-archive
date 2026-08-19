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
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const ruleContains = (path, selector, declaration) =>
  new RegExp(`${escapeRegExp(selector)}\\s*\\{[^}]*${escapeRegExp(declaration)}`, "s").test(read(path));
const lastRuleIndex = (path, selector, declaration) => {
  const matches = [
    ...read(path).matchAll(
      new RegExp(`${escapeRegExp(selector)}\\s*\\{[^}]*${escapeRegExp(declaration)}`, "gs"),
    ),
  ];
  return matches.at(-1)?.index ?? -1;
};
const allContain = (path, values) => values.every((value) => contains(path, value));
const occurrenceCount = (path, value) => read(path).split(value).length - 1;
const linkHasNewTabDisclosure = (path, hrefExpression) => {
  const source = read(path);
  const openingAnchor = new RegExp(
    `<a\\s+[^>]*href=\\{${escapeRegExp(hrefExpression)}\\}[^>]*>`,
    "s",
  ).exec(source);
  if (!openingAnchor || openingAnchor.index === undefined) return false;

  const anchorContents = source.slice(
    openingAnchor.index + openingAnchor[0].length,
    source.indexOf("</a>", openingAnchor.index),
  );
  return anchorContents.includes('className="sr-only"') &&
    anchorContents.includes("opens in a new tab");
};
const portfolioDataPath = "src/data/portfolio.ts";
const headerPath = "src/components/portfolio/site-header.tsx";
const mobileNavigationPath = "src/components/portfolio/mobile-navigation.tsx";
const footerPath = "src/components/portfolio/contact-footer.tsx";
const heroPath = "src/components/portfolio/hero-section.tsx";
const caseStudyPath = "src/app/projects/eazy-review/page.tsx";
const normalizedContains = (path, value) =>
  read(path).replace(/\s+/g, " ").includes(value);
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
const activeHomepageFiles = [
  "src/app/page.tsx",
  "src/components/portfolio/site-header.tsx",
  "src/components/portfolio/hero-section.tsx",
  "src/components/portfolio/about-section.tsx",
  "src/components/portfolio/selected-work.tsx",
  "src/components/portfolio/background-section.tsx",
  "src/components/portfolio/capabilities-section.tsx",
  "src/components/portfolio/contact-footer.tsx",
];
const activeHomepageContains = (value) => activeHomepageFiles.some((path) => contains(path, value));

const cssHexCustomProperty = (path, property) =>
  read(path).match(new RegExp(`${escapeRegExp(property)}\\s*:\\s*(#[0-9a-f]{6})\\s*;`, "i"))?.[1].toLowerCase();

const relativeLuminance = (hex) => {
  if (!hex) return null;
  const channels = hex
    .slice(1)
    .match(/.{2}/g)
    ?.map((channel) => Number.parseInt(channel, 16) / 255)
    .map((channel) =>
      channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
    );
  if (!channels || channels.length !== 3 || channels.some(Number.isNaN)) return null;
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
};

const contrastRatio = (foreground, background) => {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);
  if (foregroundLuminance === null || backgroundLuminance === null) return 0;
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);
  return (lighter + 0.05) / (darker + 0.05);
};

const contrastCheck = (label, foreground, background, minimum = 4.5) => {
  const ratio = contrastRatio(foreground, background);
  return [
    `${label} (${foreground ?? "missing"} on ${background} = ${ratio.toFixed(2)}:1, minimum ${minimum.toFixed(1)}:1)`,
    ratio >= minimum,
  ];
};

const portfolioCssPath = "src/app/portfolio.css";
const portfolioAccent = cssHexCustomProperty(portfolioCssPath, "--portfolio-accent");
const projectCardColors = {
  accent: portfolioAccent,
  canvas: cssHexCustomProperty(portfolioCssPath, "--portfolio-canvas"),
  lightAccentText: cssHexCustomProperty(portfolioCssPath, "--portfolio-accent-text") ?? portfolioAccent,
  darkAccentText: cssHexCustomProperty(portfolioCssPath, "--portfolio-accent-text-on-dark") ?? portfolioAccent,
};
const projectCardContrastChecks = [
  contrastCheck("flagship card label contrast", projectCardColors.darkAccentText, "#101613"),
  contrastCheck("flagship subordinate-link hover contrast", projectCardColors.darkAccentText, "#101613"),
  contrastCheck("flagship primary-link hover contrast", projectCardColors.canvas, projectCardColors.accent),
  contrastCheck("study card label contrast", projectCardColors.lightAccentText, "#dce4ff"),
  contrastCheck("study subordinate-link hover contrast", projectCardColors.lightAccentText, "#dce4ff"),
  contrastCheck("study primary-link hover contrast", projectCardColors.canvas, projectCardColors.accent),
  contrastCheck("OpenCore card label contrast", projectCardColors.lightAccentText, "#e1f0dc"),
  contrastCheck("OpenCore project-link hover contrast", projectCardColors.lightAccentText, "#e1f0dc"),
  contrastCheck("embedded card label contrast", projectCardColors.lightAccentText, "#f3f2ec"),
  contrastCheck("embedded title-link hover contrast", projectCardColors.lightAccentText, "#f3f2ec"),
];
const contactFooterBasePaddingIndex = lastRuleIndex(portfolioCssPath, ".contact-footer", "padding:");
const compactFooterMobilePaddingIndex = lastRuleIndex(
  portfolioCssPath,
  ".contact-footer.contact-footer--compact",
  "padding-top: 52px",
);
const compactFooterDesktopPaddingIndex = lastRuleIndex(
  portfolioCssPath,
  ".contact-footer.contact-footer--compact",
  "padding-top: 68px",
);
const compactFooterHeadingIndex = lastRuleIndex(
  portfolioCssPath,
  ".contact-footer.contact-footer--compact .contact-footer__intro h2",
  "font-size: clamp(2.5rem, 4vw, 3.5rem)",
);
const compactFooterMetaIndex = lastRuleIndex(
  portfolioCssPath,
  ".contact-footer.contact-footer--compact .contact-footer__meta",
  "margin-top: 46px",
);

const checks = {
  data: [
    ["typed portfolio export", contains("src/data/portfolio.ts", "export const PORTFOLIO")],
    ["Networking traffic analytics removed", excludes("src/data/portfolio.ts", "metricSummary")],
    [
      "three recruiter capability groups",
      allContain("src/data/portfolio.ts", ['title: "Languages"', 'title: "Application"', 'title: "Data / Infrastructure"']),
    ],
  ],
  assets: [
    ["Eazy Review phone asset", present("public/portfolio/eazy-review-phone.webp")],
    ["OpenCore terminal asset", present("public/portfolio/opencore-terminal.webp")],
    ["BCI waveform asset", present("public/portfolio/bci-waveform.webp")],
    ["static grid texture", present("public/portfolio/grid-texture.webp")],
    ["Networking Study editorial artwork", present("public/portfolio/networking-study-panel.webp")],
  ],
  contracts: [
    ["canonical contact email", contains("src/data/portfolio.ts", 'email: "tysonhu.dev@gmail.com"')],
    ["canonical GitHub profile", contains("src/data/portfolio.ts", 'github: "https://github.com/tyson-hu"')],
    ["canonical LinkedIn profile", contains("src/data/portfolio.ts", 'linkedin: "https://www.linkedin.com/in/TianzheHu"')],
    ["Eazy Review case-study route", contains("src/data/portfolio.ts", 'href: "/projects/eazy-review"')],
    ["Eazy Review repository", contains("src/data/portfolio.ts", 'href: "https://github.com/Tyson-Hu/Eazy-Review"')],
    ["Networking Study live site", contains("src/data/portfolio.ts", 'href: "https://study.tianzhe.me"')],
    ["Networking Study repository", contains("src/data/portfolio.ts", 'href: "https://github.com/tyson-hu/study-website"')],
    [
      "OpenCore repository",
      contains(
        "src/data/portfolio.ts",
        'href: "https://github.com/Tyson-Hu/RazerBlade15-Base-Model-Hackintosh_macOS_Sonoma"',
      ),
    ],
    [
      "BCI repository",
      contains("src/data/portfolio.ts", 'href: "https://github.com/tyson-hu/Brain-Computer-Interface_Project"'),
    ],
    ["footer email propagation", contains("src/components/portfolio/contact-footer.tsx", 'href={`mailto:${contact.email}`}')],
    ["hero GitHub propagation", contains("src/components/portfolio/hero-section.tsx", "href={contact.github}")],
    ["footer GitHub propagation", contains("src/components/portfolio/contact-footer.tsx", "href={contact.github}")],
    ["footer LinkedIn propagation", contains("src/components/portfolio/contact-footer.tsx", "href={contact.linkedin}")],
  ],
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
    [
      "GitHub footer link announces its new tab",
      linkHasNewTabDisclosure(footerPath, "contact.github"),
    ],
    [
      "LinkedIn footer link announces its new tab",
      linkHasNewTabDisclosure(footerPath, "contact.linkedin"),
    ],
  ],
  shell: [
    ["exact metadata title", contains("src/app/layout.tsx", "Tianzhe Hu — Software Engineer")],
    [
      "fixed-light served checker contract",
      allContain("scripts/check-theme-initializer.mjs", [
        "Expected <html> root",
        "Expected zero active inline theme initializers",
        "Fixed-light shell PASS",
        "__name",
      ]) && excludes("scripts/check-theme-initializer.mjs", "Expected exactly one inline theme initializer"),
    ],
    ["root has no dock", excludes("src/app/layout.tsx", "<Navbar")],
    ["root has no animated grid", excludes("src/app/layout.tsx", "FlickeringGrid")],
    ["case study owns its container", contains("src/app/projects/eazy-review/page.tsx", "case-study-page")],
    ["homepage header", contains("src/app/page.tsx", "<SiteHeader")],
  ],
  hero: [
    ["hero component", present("src/components/portfolio/hero-section.tsx")],
    ["concise hero without priority cards", excludes("src/components/portfolio/hero-section.tsx", "engineering-priorities")],
    ["selected-work CTA", contains("src/components/portfolio/hero-section.tsx", 'href="#work"')],
  ],
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
  work: [
    ["selected work component", present("src/components/portfolio/selected-work.tsx")],
    ["flagship variant", contains("src/components/portfolio/selected-work.tsx", "project-card--flagship")],
    ["live-product variant", contains("src/components/portfolio/selected-work.tsx", "project-card--study")],
    ["open-source variant", contains("src/components/portfolio/selected-work.tsx", "project-card--opencore")],
    ["compact embedded variant", contains("src/components/portfolio/selected-work.tsx", "project-card--embedded")],
    [
      "Networking traffic summary is not rendered",
      excludes("src/components/portfolio/selected-work.tsx", "project.metricSummary") &&
        excludes("src/components/portfolio/selected-work.tsx", "project-card__metric-summary") &&
        excludes("src/app/portfolio.css", ".project-card__metric-summary"),
    ],
    [
      "Networking Study uses centered editorial artwork",
      contains(
        "src/data/portfolio.ts",
        'image: "/portfolio/networking-study-panel.webp"',
      ) &&
        contains(
          "src/data/portfolio.ts",
          'imageAlt: "Stylized networking quiz panel with answer choices, timer, and progress"',
        ) &&
        excludes("src/data/portfolio.ts", 'image: "/networking-study-platform.png"') &&
        ruleContains(
          "src/app/portfolio.css",
          ".project-card--study .project-card__visual--study img",
          "object-position: center",
        ),
    ],
    [
      "mobile Networking artwork keeps its natural landscape frame",
      ruleContains(
        "src/app/portfolio.css",
        ".project-card--study .project-card__visual--study",
        "min-height: 0",
      ) &&
        ruleContains(
          "src/app/portfolio.css",
          ".project-card--study .project-card__visual--study",
          "aspect-ratio: 3 / 2",
        ),
    ],
    [
      "desktop secondary cards share one row height",
      ruleContains("src/app/portfolio.css", ".selected-work__secondary-row", "align-items: stretch"),
    ],
    [
      "desktop secondary cards use a balanced three-to-two split",
      ruleContains(
        "src/app/portfolio.css",
        ".selected-work__secondary-row",
        "grid-template-columns: minmax(0, 3fr) minmax(0, 2fr)",
      ),
    ],
    [
      "desktop secondary card visuals stay bottom-aligned",
      ruleContains("src/app/portfolio.css", ".project-card--study .project-card__visual--study", "align-self: end") &&
        ruleContains(
          "src/app/portfolio.css",
          ".project-card--compact-opencore .project-card__visual--terminal",
          "align-self: end",
        ),
    ],
    [
      "OpenCore card uses the full secondary-card visual height",
      ruleContains(
        "src/app/portfolio.css",
        ".project-card--compact-opencore .project-card__visual--terminal",
        "height: 214px",
      ) && excludes("src/app/portfolio.css", "height: 132px"),
    ],
    [
      "OpenCore description explains the maintained compatibility scope",
      allContain("src/data/portfolio.ts", [
        "compatibility work spanning ACPI, kexts, and hardware troubleshooting",
        "release-specific documentation",
      ]),
    ],
  ],
  sections: [
    ["about section", present("src/components/portfolio/about-section.tsx")],
    ["background section", present("src/components/portfolio/background-section.tsx")],
    ["capabilities section", present("src/components/portfolio/capabilities-section.tsx")],
    ["contact footer", present("src/components/portfolio/contact-footer.tsx")],
    ["homepage About bridge", contains("src/app/page.tsx", "<AboutSection")],
    ["no Additional work", excludes("src/app/page.tsx", "Additional work")],
  ],
  homepage: [
    [
      "active homepage Tyson identity",
      contains("src/data/portfolio.ts", 'name: "Tianzhe “Tyson” Hu"') && activeHomepageContains("identity.name"),
    ],
    [
      "active homepage New York location",
      contains("src/data/portfolio.ts", 'location: "New York, NY"') && activeHomepageContains("identity.location"),
    ],
    [
      "active homepage target role lane",
      contains("src/data/portfolio.ts", 'role: "Software Engineer — Backend, Full-Stack & Developer Tooling"') &&
        activeHomepageContains("identity.role"),
    ],
    [
      "active independent engineering portfolio label",
      contains("src/data/portfolio.ts", 'portfolioLabel: "Independent Engineering Portfolio"') &&
        activeHomepageContains("identity.portfolioLabel"),
    ],
    [
      "active About navigation target",
      allContain("src/data/portfolio.ts", ['label: "About"', 'href: "#about"']) &&
        contains("src/components/portfolio/about-section.tsx", 'id="about"'),
    ],
    [
      "concise two-sentence About bridge",
      contains("src/components/portfolio/about-section.tsx", "about.description") &&
        contains("src/components/portfolio/about-section.tsx", "identity.portfolioLabel") &&
        contains("src/components/portfolio/about-section.tsx", "identity.portfolioPeriod") &&
        contains("src/data/portfolio.ts", 'portfolioPeriod: "2023–Present"'),
    ],
    [
      "recruiter-facing section headings",
      [
        "Different project types, with a clear hierarchy",
        "Replace a generic",
        "without a catch-all section",
        "Group tools by the work they enable",
      ].every((heading) => excludes("src/data/portfolio.ts", heading)),
    ],
    [
      "Eazy Review proof items",
      contains("src/data/portfolio.ts", 'slug: "eazy-review"') &&
        contains("src/data/portfolio.ts", "Owner-scoped PostgreSQL row-level security") &&
        contains("src/data/portfolio.ts", "offline, reconnect, and physical-device evidence"),
    ],
    [
      "Networking proof items",
      contains("src/data/portfolio.ts", 'slug: "networking-study"') &&
        contains("src/data/portfolio.ts", "randomized 50-question Test mode") &&
        contains("src/data/portfolio.ts", "study progress persist locally"),
    ],
    [
      "explicit project proof-item rendering",
      contains("src/components/portfolio/selected-work.tsx", "project.proofPoints") &&
        contains("src/components/portfolio/selected-work.tsx", "project-card__proof-list"),
    ],
    ["Networking card uses evergreen proof only", excludes("src/data/portfolio.ts", "metricSummary")],
    [
      "compact OpenCore hierarchy hook",
      contains("src/components/portfolio/selected-work.tsx", "project-card--compact-opencore"),
    ],
    [
      "secondary BCI hierarchy hook",
      contains("src/components/portfolio/selected-work.tsx", "project-card--secondary-bci"),
    ],
    [
      "dated design concept removed from active footer",
      excludes("src/data/portfolio.ts", "Design concept · August 2026") &&
        excludes("src/components/portfolio/contact-footer.tsx", "conceptDate"),
    ],
    [
      "Army service period retained",
      contains("src/data/portfolio.ts", "January 2026–Present") && activeHomepageContains("hero.servicePeriod"),
    ],
  ],
  caseStudy: [
    [
      "case study shared shell",
      allContain("src/app/projects/eazy-review/page.tsx", [
        'import { SiteHeader } from "@/components/portfolio/site-header"',
        'import { ContactFooter } from "@/components/portfolio/contact-footer"',
        '<SiteHeader sectionHrefPrefix="/" currentArea="work" />',
        "<ContactFooter compact />",
      ]),
    ],
    [
      "case study shell and reading column hooks",
      allContain("src/app/projects/eazy-review/page.tsx", [
        "portfolio-page case-study-page",
        "case-study-shell",
        "case-study-reading-column",
      ]) &&
        allContain("src/app/portfolio.css", [".case-study-shell", ".case-study-reading-column"]),
    ],
    [
      "case study orientation label",
      contains("src/app/projects/eazy-review/page.tsx", "Independent Engineering Case Study"),
    ],
    [
      "case study proof labels",
      allContain("src/app/projects/eazy-review/page.tsx", [
        'label: "Security"',
        'label: "Verification"',
        'label: "Reliability"',
      ]),
    ],
    [
      "plain-English case study evidence labels",
      allContain("src/app/projects/eazy-review/page.tsx", [
        "Catalog and reconnect evidence",
        "Auth and session evidence",
        "Rating persistence evidence",
        "Password recovery evidence",
      ]) &&
        ["Task 15 result", "Task 16 result", "Task 17 result", "Task 18 result"].every((label) =>
          excludes("src/app/projects/eazy-review/page.tsx", label),
        ),
    ],
    [
      "case study decision titles and limitation",
      allContain("src/app/projects/eazy-review/page.tsx", [
        "Keep ownership at the data boundary",
        "Keep aggregate score truth server-owned",
        "Model failure as product behavior",
      ]) &&
        normalizedContains(
          "src/app/projects/eazy-review/page.tsx",
          "This case study makes no claim about production users, traffic, scale, uptime, or a store launch.",
        ),
    ],
    [
      "case study avoids generic Badge and Button",
      excludes("src/app/projects/eazy-review/page.tsx", "@/components/ui/badge") &&
        excludes("src/app/projects/eazy-review/page.tsx", "@/components/ui/button") &&
        excludes("src/app/projects/eazy-review/page.tsx", "<Badge") &&
        excludes("src/app/projects/eazy-review/page.tsx", "<Button"),
    ],
  ],
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
      "case study observer has a capability-safe fallback",
      allContain("src/components/portfolio/case-study-nav.tsx", [
        'typeof window.IntersectionObserver !== "undefined"',
        "new window.IntersectionObserver",
        "observer?.observe(target)",
        "observer?.disconnect()",
        'window.addEventListener("scroll", calculateActiveSection, { passive: true })',
        'window.addEventListener("resize", calculateActiveSection)',
        "calculateActiveSection();",
      ]),
    ],
    [
      "case study active location recalculates at scroll bottom",
      allContain("src/components/portfolio/case-study-nav.tsx", [
        'window.addEventListener("scroll", calculateActiveSection, { passive: true })',
        'window.removeEventListener("scroll", calculateActiveSection)',
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
    [
      "desktop case navigation itself is sticky",
      ruleContains(portfolioCssPath, ".case-study-navigation", "position: sticky") &&
        ruleContains(portfolioCssPath, ".case-study-navigation", "top: 92px"),
    ],
  ],
  styles: [
    ["scoped editorial CSS", contains("src/app/portfolio.css", ".portfolio-page")],
    ["exact desktop breakpoint", contains("src/app/portfolio.css", "@media (min-width: 768px)")],
    ["reduced motion", contains("src/app/portfolio.css", "prefers-reduced-motion")],
    ["sticky anchor margin", contains("src/app/portfolio.css", "scroll-margin-top")],
    ["44px targets", contains("src/app/portfolio.css", "min-height: 44px")],
    [
      "contact display tracking separates terminal punctuation",
      ruleContains(
        "src/app/portfolio.css",
        ".contact-footer__intro h2",
        "letter-spacing: -0.055em",
      ),
    ],
    [
      "primary project link has contrasting hover treatment",
      ruleContains(
        "src/app/portfolio.css",
        ".project-card__links--hierarchical .project-card__link--primary:hover",
        "background: var(--portfolio-accent)",
      ) &&
        ruleContains(
          "src/app/portfolio.css",
          ".project-card__links--hierarchical .project-card__link--primary:hover",
          "color: var(--portfolio-canvas)",
        ),
    ],
    [
      "embedded title uses a measurable box",
      ruleContains("src/app/portfolio.css", ".project-card--embedded h3 a", "display: inline-flex"),
    ],
    [
      "embedded title has a 44px target",
      ruleContains("src/app/portfolio.css", ".project-card--embedded h3 a", "min-height: 44px"),
    ],
    [
      "compact footer overrides follow all base padding shorthands",
      contactFooterBasePaddingIndex >= 0 &&
        compactFooterMobilePaddingIndex > contactFooterBasePaddingIndex &&
        compactFooterDesktopPaddingIndex > compactFooterMobilePaddingIndex &&
        compactFooterHeadingIndex > contactFooterBasePaddingIndex &&
        compactFooterMetaIndex > contactFooterBasePaddingIndex,
    ],
    [
      "project card text accents use surface-aware tokens",
      ruleContains(
        "src/app/portfolio.css",
        ".project-card",
        "--project-card-accent-text: var(--portfolio-accent-text)",
      ) &&
        ruleContains(
          "src/app/portfolio.css",
          ".project-card--flagship",
          "--project-card-accent-text: var(--portfolio-accent-text-on-dark)",
        ) &&
        ruleContains(
          "src/app/portfolio.css",
          ".project-card__eyebrow",
          "color: var(--project-card-accent-text)",
        ) &&
        ruleContains(
          "src/app/portfolio.css",
          ".project-card__links a:hover",
          "color: var(--project-card-accent-text)",
        ) &&
        ruleContains(
          "src/app/portfolio.css",
          ".project-card--flagship .project-card__links--hierarchical .project-card__link--subordinate:hover",
          "color: var(--project-card-accent-text)",
        ) &&
        ruleContains(
          "src/app/portfolio.css",
          ".project-card--embedded h3 a:hover",
          "color: var(--project-card-accent-text)",
        ),
    ],
    ...projectCardContrastChecks,
  ],
};

const group = process.argv[2] === "--" ? process.argv[3] ?? "all" : process.argv[2] ?? "all";
const selected = group === "all" ? Object.values(checks).flat() : checks[group];
if (!selected) {
  console.error(`Unknown check group: ${group}`);
  process.exit(2);
}
const failures = selected.filter(([, passed]) => !passed);
for (const [label, passed] of selected) console.log(`${passed ? "PASS" : "FAIL"} ${label}`);
if (failures.length) process.exit(1);
