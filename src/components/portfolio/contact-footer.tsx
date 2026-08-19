import { ArrowUp, ArrowUpRight } from "lucide-react";

import { PORTFOLIO } from "@/data/portfolio";

type ContactFooterProps = {
  compact?: boolean;
};

export function ContactFooter({ compact = false }: ContactFooterProps) {
  const { contact, identity, navigation } = PORTFOLIO;
  const ecosystemLinks = navigation.filter(
    (item) => item.kind === "external",
  );

  return (
    <footer
      id="contact"
      className={`contact-footer${compact ? " contact-footer--compact" : ""}`}
      aria-labelledby="contact-title"
    >
      <div className="contact-footer__inner">
        <div className="contact-footer__intro">
          <p className="contact-footer__rail">{contact.label}</p>
          <h2 id="contact-title">{contact.title}</h2>
          <p>{contact.description}</p>
          <a className="contact-footer__email" href={`mailto:${contact.email}`}>
            {contact.email}
            <ArrowUpRight aria-hidden="true" size={15} strokeWidth={2.25} />
          </a>
        </div>
        <div className="contact-footer__links" aria-label="Contact links">
          <a href={contact.github} target="_blank" rel="noopener noreferrer">
            <span>GitHub</span>
            <ArrowUpRight aria-hidden="true" size={18} strokeWidth={2.25} />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">
            <span>LinkedIn</span>
            <ArrowUpRight aria-hidden="true" size={18} strokeWidth={2.25} />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          {ecosystemLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>{item.label}</span>
              <ArrowUpRight aria-hidden="true" size={18} strokeWidth={2.25} />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ))}
          <a href="#top">
            <span>Back to top</span>
            <ArrowUp aria-hidden="true" size={18} strokeWidth={2.25} />
          </a>
        </div>
      </div>
      <div className="contact-footer__meta">
        <p>
          {identity.name} · {identity.role}
        </p>
        <p>{identity.location}</p>
      </div>
    </footer>
  );
}
