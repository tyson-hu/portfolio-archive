export type ProjectVariant = "flagship" | "study" | "opencore" | "embedded";

export interface PortfolioLink {
  label: string;
  href: string;
  external: boolean;
}

export interface PortfolioProject {
  slug: "eazy-review" | "networking-study" | "opencore" | "bci";
  variant: ProjectVariant;
  eyebrow: string;
  title: string;
  description: string;
  technologies: readonly string[];
  links: readonly PortfolioLink[];
  image: string;
  imageAlt: string;
  metrics?: readonly { value: string; label: string }[];
  metricPeriod?: string;
  metricNote?: string;
}

export interface PortfolioData {
  identity: {
    name: "Tianzhe Hu";
    initials: "TH";
    role: "Software Engineer";
    location: "New York";
    url: string;
    avatarUrl: string;
    description: string;
  };
  navigation: readonly { label: "Work" | "Approach" | "Background"; href: string }[];
  hero: {
    eyebrow: string;
    headline: string;
    introduction: string;
    service: string;
  };
  priorities: readonly { number: "01" | "02" | "03"; title: string; description: string }[];
  selectedWork: {
    number: "01";
    label: "Selected Work";
    title: string;
    description: string;
  };
  sections: {
    approach: { number: "02"; label: "Approach"; title: string; description: string };
    background: { number: "03"; label: "Background"; title: string; description: string };
    capabilities: { number: "04"; label: "Capabilities"; title: string; description: string };
  };
  projects: readonly PortfolioProject[];
  approach: readonly { number: "01" | "02" | "03"; title: string; description: string }[];
  background: readonly {
    kind: "experience" | "education";
    eyebrow: string;
    title: string;
    description: string;
    period: {
      startDate: string;
      startLabel: string;
      endDate: string | null;
      endLabel: string;
    };
  }[];
  capabilities: readonly { title: string; technologies: readonly string[] }[];
  contact: {
    email: string;
    github: string;
    linkedin: string;
    label: "05 · Contact";
    title: string;
    description: string;
    conceptDate: "Design concept · August 2026";
  };
}

export const PORTFOLIO: PortfolioData = {
  identity: {
    name: "Tianzhe Hu",
    initials: "TH",
    role: "Software Engineer",
    location: "New York",
    url: "https://tianzhe.me",
    avatarUrl: "https://assets.tianzhe.me/profile/avatar.webp",
    description: "Software Engineer — Backend, Full-Stack & Developer Tooling",
  },
  navigation: [
    { label: "Work", href: "#work" },
    { label: "Approach", href: "#approach" },
    { label: "Background", href: "#background" },
  ],
  hero: {
    eyebrow: "Software Engineer · New York",
    headline: "Reliable software, from product interfaces to system boundaries.",
    introduction:
      "I build full-stack, mobile, and developer-facing systems with explicit data ownership, recoverable failure states, and evidence that other engineers can inspect.",
    service: "U.S. Army Reserve · Information Technology Specialist (25B)",
  },
  priorities: [
    {
      number: "01",
      title: "Secure boundaries",
      description: "ownership and authorization live at the data boundary, not only in the UI.",
    },
    {
      number: "02",
      title: "Explicit failure behavior",
      description: "offline, reconnect, timeout, and backend failures are part of product design.",
    },
    {
      number: "03",
      title: "Inspectable evidence",
      description: "architecture decisions are paired with tests, documentation, and reproducible checks.",
    },
  ],
  selectedWork: {
    number: "01",
    label: "Selected Work",
    title: "Different project types, with a clear hierarchy.",
    description:
      "Lead with the systems that best demonstrate product judgment and technical depth while keeping open-source and embedded work visible without presenting every project as equally important.",
  },
  sections: {
    approach: {
      number: "02",
      label: "Approach",
      title: 'Replace a generic "About" paragraph with observable engineering behavior.',
      description: "Ownership, failure behavior, and verification rather than framework count.",
    },
    background: {
      number: "03",
      label: "Background",
      title: "Experience and education, without a catch-all section.",
      description: "A concise record of service, technical work, and engineering education.",
    },
    capabilities: {
      number: "04",
      label: "Capabilities",
      title: "Group tools by the work they enable.",
      description: "A practical toolkit for product delivery, data boundaries, and systems work.",
    },
  },
  projects: [
    {
      slug: "eazy-review",
      variant: "flagship",
      eyebrow: "Flagship case study · Mobile + backend",
      title: "Eazy Review",
      description:
        "A React Native product-review system with a connected catalog, account state, and persisted personal ratings on Supabase and PostgreSQL. Owner-scoped row-level security and explicit least-privilege grants, automated frontend, database, authorization, and concurrency checks, and explicit failure handling plus offline, reconnect, and physical-device evidence.",
      technologies: ["React Native", "Expo", "TypeScript", "TanStack Query", "Supabase", "PostgreSQL"],
      links: [
        { label: "Read engineering case study", href: "/projects/eazy-review", external: false },
        { label: "GitHub", href: "https://github.com/Tyson-Hu/Eazy-Review", external: true },
      ],
      image: "/portfolio/eazy-review-phone.webp",
      imageAlt: "Angled Eazy Review product-rating interface on a smartphone",
    },
    {
      slug: "networking-study",
      variant: "study",
      eyebrow: "Live product · Learning platform",
      title: "Networking Study Platform",
      description:
        "A 404-question networking study platform built during U.S. Army AIT and later shared informally with peers preparing for course tests. Two question banks and four answer formats across Practice and randomized 50-question Test modes, with a persisted two-hour timer and progress stored locally in the browser.",
      technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Cloudflare Pages"],
      links: [
        { label: "Live site", href: "https://study.tianzhe.me", external: true },
        { label: "GitHub", href: "https://github.com/tyson-hu/study-website", external: true },
      ],
      image: "/networking-study-platform.png",
      imageAlt: "Networking Study Platform interface showing study content and progress",
      metrics: [
        { value: "≈1.8K", label: "30-day visits" },
        { value: "≈4K", label: "Page views" },
      ],
      metricPeriod: "30 days ending Aug. 17, 2026",
      metricNote: "Visits are not unique users.",
    },
    {
      slug: "opencore",
      variant: "opencore",
      eyebrow: "Open source · Systems maintenance",
      title: "OpenCore for Razer Blade 15",
      description:
        "OpenCore configuration and community-facing documentation for the Razer Blade 15, maintained across multiple macOS releases. The work centers on system compatibility, ACPI and kext configuration, hardware troubleshooting, installation guidance, and third-party adoption.",
      technologies: ["OpenCore", "ACPI", "Kexts", "macOS", "Hardware Debugging"],
      links: [
        {
          label: "GitHub",
          href: "https://github.com/Tyson-Hu/RazerBlade15-Base-Model-Hackintosh_macOS_Sonoma",
          external: true,
        },
      ],
      image: "/portfolio/opencore-terminal.webp",
      imageAlt: "Terminal-style OpenCore maintenance panel",
    },
    {
      slug: "bci",
      variant: "embedded",
      eyebrow: "Embedded systems · Senior capstone",
      title: "Brain-Computer Interface Signal Processing Board",
      description:
        "Embedded software for a University at Buffalo senior capstone signal-processing board, including ADS119X communication, SPI data transfer, device drivers, and serial streaming used to inspect and validate biosignal data.",
      technologies: ["C++", "Arduino", "SPI", "ADS119X", "PCB", "EEG/EOG"],
      links: [
        {
          label: "GitHub",
          href: "https://github.com/tyson-hu/Brain-Computer-Interface_Project",
          external: true,
        },
      ],
      image: "/portfolio/bci-waveform.webp",
      imageAlt: "Electric-blue biosignal waveform",
    },
  ],
  approach: [
    {
      number: "01",
      title: "Design the boundary",
      description: "keep authorization, derivation, and ownership responsibilities explicit across client and database layers.",
    },
    {
      number: "02",
      title: "Model failure states",
      description: "treat offline behavior, timeouts, stale sessions, and failed writes as product behavior.",
    },
    {
      number: "03",
      title: "Show the proof",
      description: "link decisions to tests, acceptance evidence, documentation, and reproducible checks.",
    },
  ],
  background: [
    {
      kind: "experience",
      eyebrow: "Experience · Military service",
      title: "U.S. Army Reserve · Information Technology Specialist (25B)",
      description: "Cisco networking, secure configuration, technical troubleshooting, and procedure-driven IT work.",
      period: {
        startDate: "2026-01",
        startLabel: "Jan 2026",
        endDate: null,
        endLabel: "Present",
      },
    },
    {
      kind: "education",
      eyebrow: "Education",
      title: "University at Buffalo · Bachelor of Science in Computer Engineering",
      description: "Bachelor of Science in Computer Engineering.",
      period: {
        startDate: "2019",
        startLabel: "2019",
        endDate: "2023",
        endLabel: "2023",
      },
    },
  ],
  capabilities: [
    {
      title: "Product engineering",
      technologies: ["React Native", "Expo", "React", "Next.js", "TypeScript", "JavaScript"],
    },
    {
      title: "Data and backend",
      technologies: ["PostgreSQL", "Supabase", "Node.js", "Python", "Go"],
    },
    {
      title: "Systems and delivery",
      technologies: ["C", "C++", "Git", "Docker", "CI/CD", "Cloudflare"],
    },
  ],
  contact: {
    email: "tysonhu.dev@gmail.com",
    github: "https://github.com/tyson-hu",
    linkedin: "https://www.linkedin.com/in/TianzheHu",
    label: "05 · Contact",
    title: "Let's build something useful.",
    description: "Open to backend, full-stack, mobile, and developer-tooling opportunities.",
    conceptDate: "Design concept · August 2026",
  },
};
