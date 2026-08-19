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

const checks = {
  data: [
    ["typed portfolio export", contains("src/data/portfolio.ts", "export const PORTFOLIO")],
    ["approved hero headline", contains("src/data/portfolio.ts", "Reliable software, from product interfaces to system boundaries.")],
    ["honest visit metric", contains("src/data/portfolio.ts", 'value: "≈1.8K"')],
    ["honest page-view metric", contains("src/data/portfolio.ts", 'value: "≈4K"')],
    ["metric qualification", contains("src/data/portfolio.ts", "Visits are not unique users.")],
    ["three capability groups", contains("src/data/portfolio.ts", 'title: "Systems and delivery"')],
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
