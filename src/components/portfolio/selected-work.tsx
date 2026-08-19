import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { PORTFOLIO, type PortfolioLink, type PortfolioProject } from "@/data/portfolio";
import { SectionHeading } from "@/components/portfolio/section-heading";

interface ProjectCardProps {
  project: PortfolioProject;
}

function ProjectEyebrow({ children }: { children: string }) {
  return <p className="project-card__eyebrow">{children}</p>;
}

function ProjectLinks({ links, emphasizeFirst = false }: { links: readonly PortfolioLink[]; emphasizeFirst?: boolean }) {
  return (
    <div className={`project-card__links${emphasizeFirst ? " project-card__links--hierarchical" : ""}`}>
      {links.map((link, index) => {
        const className = emphasizeFirst
          ? index === 0
            ? "project-card__link project-card__link--primary"
            : "project-card__link project-card__link--subordinate"
          : "project-card__link";

        return link.external ? (
          <a className={className} key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">
            {link.label}
            <ArrowUpRight aria-hidden="true" size={15} strokeWidth={2.25} />
          </a>
        ) : (
          <Link className={className} key={link.href} href={link.href}>
            {link.label}
            <ArrowUpRight aria-hidden="true" size={15} strokeWidth={2.25} />
          </Link>
        );
      })}
    </div>
  );
}

function ProjectProof({ project }: ProjectCardProps) {
  if (!project.proofPoints) return null;

  return (
    <ul className="project-card__proof-list">
      {project.proofPoints.map((proofPoint) => (
        <li key={proofPoint}>{proofPoint}</li>
      ))}
    </ul>
  );
}

function ProjectImage({
  project,
  className,
  sizes,
}: ProjectCardProps & { className?: string; sizes: string }) {
  return (
    <Image
      className={className}
      src={project.image}
      alt={project.imageAlt}
      width={1200}
      height={900}
      sizes={sizes}
      loading={project.slug === "eazy-review" ? "eager" : "lazy"}
    />
  );
}

function FlagshipProject({ project }: ProjectCardProps) {
  return (
    <article className="project-card project-card--flagship">
      <div className="project-card__copy">
        <ProjectEyebrow>{project.eyebrow}</ProjectEyebrow>
        <h3>{project.title}</h3>
        <p className="project-card__description">{project.description}</p>
        <ProjectProof project={project} />
        <p className="project-card__technologies">{project.technologies.join(" · ")}</p>
        <ProjectLinks links={project.links} emphasizeFirst />
      </div>
      <div className="project-card__visual project-card__visual--phone">
        <ProjectImage project={project} sizes="(min-width: 768px) 42vw, 90vw" />
      </div>
    </article>
  );
}

function StudyProject({ project }: ProjectCardProps) {
  return (
    <article className="project-card project-card--study">
      <div className="project-card__copy">
        <ProjectEyebrow>{project.eyebrow}</ProjectEyebrow>
        <h3>{project.title}</h3>
        <p className="project-card__description">{project.description}</p>
        <ProjectProof project={project} />
        <p className="project-card__metric-summary">{project.metricSummary}</p>
        <p className="project-card__technologies">{project.technologies.join(" · ")}</p>
        <ProjectLinks links={project.links} emphasizeFirst />
      </div>
      <div className="project-card__visual project-card__visual--study">
        <ProjectImage project={project} sizes="(min-width: 768px) 46vw, 90vw" />
      </div>
    </article>
  );
}

function OpenCoreProject({ project }: ProjectCardProps) {
  return (
    <article className="project-card project-card--opencore project-card--compact-opencore">
      <div className="project-card__copy">
        <ProjectEyebrow>{project.eyebrow}</ProjectEyebrow>
        <h3>{project.title}</h3>
        <p className="project-card__description">{project.description}</p>
        <p className="project-card__technologies">{project.technologies.join(" · ")}</p>
        <ProjectLinks links={project.links} />
      </div>
      <div className="project-card__visual project-card__visual--terminal">
        <ProjectImage project={project} sizes="(min-width: 768px) 32vw, 90vw" />
      </div>
    </article>
  );
}

function EmbeddedProject({ project }: ProjectCardProps) {
  const projectLink = project.links[0];

  return (
    <article className="project-card project-card--embedded project-card--secondary-bci">
      <div className="project-card__copy">
        <ProjectEyebrow>{project.eyebrow}</ProjectEyebrow>
        <h3>
          <a href={projectLink.href} target="_blank" rel="noopener noreferrer">
            {project.title}
          </a>
        </h3>
        <p className="project-card__description">{project.description}</p>
        <p className="project-card__technologies">{project.technologies.join(" · ")}</p>
      </div>
      <div className="project-card__visual project-card__visual--waveform">
        <ProjectImage project={project} sizes="(min-width: 768px) 40vw, 90vw" />
      </div>
    </article>
  );
}

const requireProject = (slug: PortfolioProject["slug"]) => {
  const project = PORTFOLIO.projects.find((item) => item.slug === slug);
  if (!project) throw new Error(`Missing portfolio project: ${slug}`);
  return project;
};

export function SelectedWork() {
  const { selectedWork } = PORTFOLIO;
  const flagship = requireProject("eazy-review");
  const study = requireProject("networking-study");
  const opencore = requireProject("opencore");
  const embedded = requireProject("bci");

  return (
    <section id="work" className="selected-work" aria-labelledby="work-title">
      <SectionHeading
        number={selectedWork.number}
        label={selectedWork.label}
        title={selectedWork.title}
        description={selectedWork.description}
        id="work"
      />
      <div className="selected-work__projects">
        <FlagshipProject project={flagship} />
        <div className="selected-work__secondary-row">
          <StudyProject project={study} />
          <OpenCoreProject project={opencore} />
        </div>
        <EmbeddedProject project={embedded} />
      </div>
    </section>
  );
}
