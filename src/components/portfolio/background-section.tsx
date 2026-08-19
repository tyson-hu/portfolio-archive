import { PORTFOLIO } from "@/data/portfolio";
import { SectionHeading } from "@/components/portfolio/section-heading";

export function BackgroundSection() {
  const { background: backgroundSection } = PORTFOLIO.sections;

  return (
    <section id="background" className="background-section" aria-labelledby="background-title">
      <SectionHeading
        number={backgroundSection.number}
        label={backgroundSection.label}
        title={backgroundSection.title}
        description={backgroundSection.description}
        id="background"
      />
      <div className="background-section__records">
        {PORTFOLIO.background.map((background) => (
          <article key={background.kind} className="background-card">
            <p className="background-card__eyebrow">{background.eyebrow}</p>
            <h3>{background.title}</h3>
            <p className="background-card__description">{background.description}</p>
            <p className="background-card__period">
              <time dateTime={background.period.startDate}>{background.period.startLabel}</time>
              <span aria-hidden="true">–</span>
              {background.period.endDate ? (
                <time dateTime={background.period.endDate}>{background.period.endLabel}</time>
              ) : (
                <span>{background.period.endLabel}</span>
              )}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
