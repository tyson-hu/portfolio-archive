import Link from "next/link";

import { PORTFOLIO } from "@/data/portfolio";

type SiteHeaderProps = {
  sectionHrefPrefix?: "" | "/";
};

export function SiteHeader({ sectionHrefPrefix = "" }: SiteHeaderProps) {
  const { identity, navigation, contact } = PORTFOLIO;

  return (
    <header className="portfolio-header">
      <div className="portfolio-header__inner">
        <Link className="portfolio-header__monogram" href="/" aria-label={`${identity.name} home`}>
          <span className="portfolio-header__monogram-mark">{identity.initials}</span>
        </Link>
        <Link className="portfolio-header__identity" href="/">
          <span>{identity.name}</span>
          <span className="portfolio-header__role">{identity.role}</span>
        </Link>
        <nav className="portfolio-header__nav" aria-label="Primary navigation">
          {navigation.map((item) => (
            <a key={item.href} href={`${sectionHrefPrefix}${item.href}`}>
              {item.label}
            </a>
          ))}
        </nav>
        <a className="portfolio-header__email" href={`mailto:${contact.email}`}>
          Email
        </a>
      </div>
    </header>
  );
}
