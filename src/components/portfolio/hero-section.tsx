import { ArrowDown, ArrowUpRight, Circle } from "lucide-react";

import { PORTFOLIO } from "@/data/portfolio";

export function HeroSection() {
  const { hero, priorities, contact } = PORTFOLIO;
  const [serviceName, serviceDetail] = hero.service.split(" · ");

  return (
    <section className="hero-section" aria-labelledby="hero-title">
      <div className="hero-section__content">
        <p className="hero-section__eyebrow">
          <Circle className="hero-section__eyebrow-dot" aria-hidden="true" fill="currentColor" strokeWidth={0} />
          {hero.eyebrow}
        </p>
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
          <strong>{serviceName}</strong>
          {serviceDetail ? <span> · {serviceDetail}</span> : null}
        </p>
      </div>

      <aside className="engineering-priorities" aria-labelledby="engineering-priorities-title">
        <div className="engineering-priorities__heading">
          <h2 id="engineering-priorities-title">Engineering priorities</h2>
          <Circle className="engineering-priorities__status" aria-hidden="true" fill="currentColor" strokeWidth={0} />
        </div>
        <ol className="engineering-priorities__list">
          {priorities.map((priority) => (
            <li key={priority.number} className="engineering-priorities__item">
              <span className="engineering-priorities__number">{priority.number}</span>
              <div>
                <h3>{priority.title}</h3>
                <p>{priority.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </aside>
    </section>
  );
}
