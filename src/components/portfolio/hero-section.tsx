import { ArrowDown, ArrowUpRight, Circle } from "lucide-react";

import { PORTFOLIO } from "@/data/portfolio";

export function HeroSection() {
  const { hero, identity, contact } = PORTFOLIO;

  return (
    <section className="hero-section" aria-labelledby="hero-title">
      <div className="hero-section__content">
        <p className="hero-section__eyebrow">
          <Circle className="hero-section__eyebrow-dot" aria-hidden="true" fill="currentColor" strokeWidth={0} />
          {identity.portfolioLabel} · {identity.location}
        </p>
        <div className="hero-section__identity">
          <p className="hero-section__name">{identity.name}</p>
          <p className="hero-section__role">{identity.role}</p>
        </div>
        <h1 id="hero-title">
          Reliable<span className="hero-section__mobile-break"><br /></span> software,
          <span className="hero-section__mobile-break"><br /></span> from product
          <span className="hero-section__mobile-break"><br /></span> interfaces
          <br className="hero-section__desktop-break" /> to system
          <span className="hero-section__mobile-break"><br /></span> boundaries.
        </h1>
        <p className="hero-section__introduction">{hero.introduction}</p>
        <div className="hero-section__actions">
          <a className="hero-section__cta hero-section__cta--primary" href="#work">
            View selected work
            <ArrowDown aria-hidden="true" size={17} strokeWidth={2.25} />
          </a>
          <a
            className="hero-section__cta hero-section__cta--secondary"
            href={contact.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
            <ArrowUpRight aria-hidden="true" size={17} strokeWidth={2.25} />
          </a>
        </div>
        <p className="hero-section__service">
          <Circle className="hero-section__service-dot" aria-hidden="true" fill="currentColor" strokeWidth={0} />
          <strong>{hero.service}</strong>
          <span> · {hero.servicePeriod}</span>
        </p>
      </div>
    </section>
  );
}
