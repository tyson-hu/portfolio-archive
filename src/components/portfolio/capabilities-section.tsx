import { PORTFOLIO } from "@/data/portfolio";
import { SectionHeading } from "@/components/portfolio/section-heading";

export function CapabilitiesSection() {
  const { capabilities } = PORTFOLIO.sections;

  return (
    <section id="capabilities" className="capabilities-section" aria-labelledby="capabilities-title">
      <SectionHeading
        number={capabilities.number}
        label={capabilities.label}
        title={capabilities.title}
        description={capabilities.description}
        id="capabilities"
      />
      <div className="capabilities-section__groups">
        {PORTFOLIO.capabilities.map((capability) => (
          <article key={capability.title} className="capability-group">
            <h3>{capability.title}</h3>
            <p>{capability.technologies.join(", ")}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
