import { PORTFOLIO } from "@/data/portfolio";
import { SectionHeading } from "@/components/portfolio/section-heading";

export function AboutSection() {
  const { about } = PORTFOLIO.sections;
  const { identity } = PORTFOLIO;

  return (
    <section id="about" className="about-section" aria-labelledby="about-title">
      <SectionHeading
        number={about.number}
        label={about.label}
        title={about.title}
        description={about.description}
        id="about"
      />
      <p className="about-section__record">
        {identity.portfolioLabel} · {identity.portfolioPeriod}
      </p>
    </section>
  );
}
