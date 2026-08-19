"use client";

import { useEffect, useRef, useState } from "react";

export const CASE_STUDY_SECTIONS = [
  { id: "overview", label: "Overview", href: "#overview" },
  { id: "architecture", label: "Architecture", href: "#architecture" },
  {
    id: "decisions",
    label: "Engineering decisions",
    href: "#decisions",
  },
  { id: "verification", label: "Verification", href: "#verification" },
  { id: "boundaries", label: "Boundaries", href: "#boundaries" },
] as const;

export type CaseStudySectionId =
  (typeof CASE_STUDY_SECTIONS)[number]["id"];

export function CaseStudyNav() {
  const [activeId, setActiveId] =
    useState<CaseStudySectionId>("overview");
  const mobileDetailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const targets = CASE_STUDY_SECTIONS.map(({ id }) =>
      document.querySelector<HTMLElement>(
        `[data-case-study-marker="${id}"]`,
      ),
    ).filter((target): target is HTMLElement => target !== null);

    const calculateActiveSection = () => {
      const atDocumentBottom =
        Math.ceil(window.scrollY + window.innerHeight) >=
        document.documentElement.scrollHeight;

      if (atDocumentBottom) {
        setActiveId("boundaries");
        return;
      }

      let nextActive: CaseStudySectionId = "overview";
      for (const section of CASE_STUDY_SECTIONS) {
        const target = document.getElementById(section.id);
        if (target && target.getBoundingClientRect().top <= 120) {
          nextActive = section.id;
        } else {
          break;
        }
      }
      setActiveId(nextActive);
    };

    const observer =
      typeof window.IntersectionObserver !== "undefined"
        ? new window.IntersectionObserver(calculateActiveSection, {
            rootMargin: "-121px 0px 0px 0px",
            threshold: [0, 1],
          })
        : null;

    targets.forEach((target) => observer?.observe(target));
    window.addEventListener("scroll", calculateActiveSection, { passive: true });
    window.addEventListener("resize", calculateActiveSection);
    calculateActiveSection();

    return () => {
      observer?.disconnect();
      window.removeEventListener("scroll", calculateActiveSection);
      window.removeEventListener("resize", calculateActiveSection);
    };
  }, []);

  const closeMobileNavigation = () => {
    if (
      window.matchMedia("(max-width: 1023px)").matches &&
      mobileDetailsRef.current
    ) {
      mobileDetailsRef.current.open = false;
    }
  };

  const renderLinks = () =>
    CASE_STUDY_SECTIONS.map((section) => {
      const isCurrent = activeId === section.id;
      return (
        <a
          key={section.id}
          href={section.href}
          aria-current={isCurrent ? "location" : undefined}
          onClick={closeMobileNavigation}
        >
          {section.label}
        </a>
      );
    });

  return (
    <aside className="case-study-navigation">
      <nav
        className="case-study-navigation__desktop"
        aria-label="Case study sections"
      >
        {renderLinks()}
      </nav>
      <details
        ref={mobileDetailsRef}
        className="case-study-navigation__mobile"
      >
        <summary>On this page</summary>
        <nav aria-label="Case study sections">{renderLinks()}</nav>
      </details>
    </aside>
  );
}
