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
const allContain = (path, values) => values.every((value) => contains(path, value));
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
  styles: [
    ["scoped editorial CSS", contains("src/app/portfolio.css", ".portfolio-page")],
    ["exact desktop breakpoint", contains("src/app/portfolio.css", "@media (min-width: 768px)")],
    ["reduced motion", contains("src/app/portfolio.css", "prefers-reduced-motion")],
    ["sticky anchor margin", contains("src/app/portfolio.css", "scroll-margin-top")],
    ["44px targets", contains("src/app/portfolio.css", "min-height: 44px")],
    [
      "embedded title uses a measurable box",
      ruleContains("src/app/portfolio.css", ".project-card--embedded h3 a", "display: inline-flex"),
    ],
    [
      "embedded title has a 44px target",
      ruleContains("src/app/portfolio.css", ".project-card--embedded h3 a", "min-height: 44px"),
    ],
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
