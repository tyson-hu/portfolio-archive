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
const normalizedContains = (path, value) =>
  read(path).replace(/\s+/g, " ").includes(value);
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
    ["approved hero headline", contains("src/data/portfolio.ts", "Reliable software, from product interfaces to system boundaries.")],
    ["honest visit metric", contains("src/data/portfolio.ts", "≈1.8K visits")],
    ["honest page-view metric", contains("src/data/portfolio.ts", "4K page views")],
    ["metric qualification", contains("src/data/portfolio.ts", "visits are not unique users.")],
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
    ["study product screenshot", present("public/networking-study-platform.png")],
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
    ["header email propagation", contains("src/components/portfolio/site-header.tsx", 'href={`mailto:${contact.email}`}')],
    ["footer email propagation", contains("src/components/portfolio/contact-footer.tsx", 'href={`mailto:${contact.email}`}')],
    ["hero GitHub propagation", contains("src/components/portfolio/hero-section.tsx", "href={contact.github}")],
    ["footer GitHub propagation", contains("src/components/portfolio/contact-footer.tsx", "href={contact.github}")],
    ["footer LinkedIn propagation", contains("src/components/portfolio/contact-footer.tsx", "href={contact.linkedin}")],
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
  work: [
    ["selected work component", present("src/components/portfolio/selected-work.tsx")],
    ["flagship variant", contains("src/components/portfolio/selected-work.tsx", "project-card--flagship")],
    ["live-product variant", contains("src/components/portfolio/selected-work.tsx", "project-card--study")],
    ["open-source variant", contains("src/components/portfolio/selected-work.tsx", "project-card--opencore")],
    ["compact embedded variant", contains("src/components/portfolio/selected-work.tsx", "project-card--embedded")],
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
    [
      "qualified Networking metric",
      contains(
        "src/data/portfolio.ts",
        "30 days ending Aug. 17, 2026: ≈1.8K visits / 4K page views",
      ),
    ],
    ["Networking visits-not-users wording", contains("src/data/portfolio.ts", "visits are not unique users")],
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
    [
      "desktop hero density reduced",
      excludes("src/app/portfolio.css", "min-height: 1020px") &&
        ruleContains("src/app/portfolio.css", ".hero-section", "min-height: 720px"),
    ],
  ],
  caseStudy: [
    [
      "case study shared shell",
      allContain("src/app/projects/eazy-review/page.tsx", [
        'import { SiteHeader } from "@/components/portfolio/site-header"',
        'import { ContactFooter } from "@/components/portfolio/contact-footer"',
        '<SiteHeader sectionHrefPrefix="/" />',
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
      "case study primary and verification CTAs",
      allContain("src/app/projects/eazy-review/page.tsx", [
        "GitHub repository",
        'href="#verification"',
        "How I verified it",
      ]),
    ],
    [
      "nested header homepage anchors",
      allContain("src/components/portfolio/site-header.tsx", [
        "sectionHrefPrefix",
        "${sectionHrefPrefix}${item.href}",
      ]) &&
        contains("src/app/projects/eazy-review/page.tsx", '<SiteHeader sectionHrefPrefix="/" />'),
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
  styles: [
    ["scoped editorial CSS", contains("src/app/portfolio.css", ".portfolio-page")],
    ["exact desktop breakpoint", contains("src/app/portfolio.css", "@media (min-width: 768px)")],
    ["reduced motion", contains("src/app/portfolio.css", "prefers-reduced-motion")],
    ["sticky anchor margin", contains("src/app/portfolio.css", "scroll-margin-top")],
    ["44px targets", contains("src/app/portfolio.css", "min-height: 44px")],
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
