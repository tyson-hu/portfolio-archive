interface SectionHeadingProps {
  number: "01" | "02" | "03" | "04";
  label: string;
  title: string;
  description: string;
  id: string;
}

export function SectionHeading({ number, label, title, description, id }: SectionHeadingProps) {
  return (
    <header className="section-intro">
      <p className="section-intro__rail">
        {number} · {label}
      </p>
      <div className="section-intro__content">
        <h2 id={`${id}-title`}>{title}</h2>
        <p>{description}</p>
      </div>
    </header>
  );
}
