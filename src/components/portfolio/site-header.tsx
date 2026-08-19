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
