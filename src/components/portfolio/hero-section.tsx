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
          <p className="hero-section__introduction">{hero.introduction}</p>

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
