import { PORTFOLIO } from "@/data/portfolio";
import { SectionHeading } from "@/components/portfolio/section-heading";

export function ApproachSection() {
  const { approach } = PORTFOLIO.sections;

  return (
    <section id="approach" className="approach-section" aria-labelledby="approach-title">
      <SectionHeading
        number={approach.number}
        label={approach.label}
        title={approach.title}
        description={approach.description}
        id="approach"
      />
      <ol className="approach-section__cards">
        {PORTFOLIO.approach.map((approach) => (
          <li key={approach.number}>
            <article className="approach-card">
              <p className="approach-card__number">{approach.number}</p>
              <h3>{approach.title}</h3>
              <p>{approach.description}</p>
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}
