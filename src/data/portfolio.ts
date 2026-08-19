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
  proofPoints?: readonly [string, string];
  metricSummary?: string;
}

export interface PortfolioData {
  identity: {
    name: "Tianzhe “Tyson” Hu";
    initials: "TH";
    role: "Software Engineer — Backend, Full-Stack & Developer Tooling";
    location: "New York, NY";
    portfolioLabel: "Independent Engineering Portfolio";
    portfolioPeriod: "2023–Present";
    url: string;
    avatarUrl: string;
    description: string;
  };
  navigation: readonly { label: "Work" | "About" | "Background"; href: string }[];
  hero: {
    headline: string;
    introduction: string;
    service: string;
    servicePeriod: string;
  };
  selectedWork: {
    number: "01";
    label: "Selected Work";
    title: string;
    description: string;
  };
  sections: {
    about: { number: "02"; label: "About"; title: string; description: string };
    background: { number: "03"; label: "Background"; title: string; description: string };
    capabilities: { number: "04"; label: "Capabilities"; title: string; description: string };
  };
  projects: readonly PortfolioProject[];
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
  };
}

export const PORTFOLIO: PortfolioData = {
  identity: {
    name: "Tianzhe “Tyson” Hu",
    initials: "TH",
    role: "Software Engineer — Backend, Full-Stack & Developer Tooling",
    location: "New York, NY",
    portfolioLabel: "Independent Engineering Portfolio",
    portfolioPeriod: "2023–Present",
    url: "https://tianzhe.me",
    avatarUrl: "https://assets.tianzhe.me/profile/avatar.webp",
    description: "Software Engineer — Backend, Full-Stack & Developer Tooling",
  },
  navigation: [
    { label: "Work", href: "#work" },
    { label: "About", href: "#about" },
    { label: "Background", href: "#background" },
  ],
  hero: {
    headline: "Reliable software, from product interfaces to system boundaries.",
    introduction:
      "I build reliable product and platform software with clear ownership, recoverable failure behavior, and evidence another engineer can inspect.",
    service: "U.S. Army Reserve · Information Technology Specialist (25B)",
    servicePeriod: "January 2026–Present",
  },
  selectedWork: {
    number: "01",
    label: "Selected Work",
    title: "Selected engineering work.",
    description:
      "Product, platform, and systems work with inspectable decisions and evidence.",
  },
  sections: {
    about: {
      number: "02",
      label: "About",
      title: "Engineering grounded in product judgment and systems thinking.",
      description:
        "My independent engineering work builds on a B.S. in Computer Engineering and the operational context of current Army Reserve IT service. I treat software as an inspectable system whose boundaries, failure states, and evidence should be clear enough for another engineer to verify.",
    },
    background: {
      number: "03",
      label: "Background",
      title: "Service and engineering education.",
      description: "The technical foundation behind my independent software work.",
    },
    capabilities: {
      number: "04",
      label: "Capabilities",
      title: "Tools I use to build and deliver software.",
      description: "A focused toolkit spanning application code, data boundaries, and infrastructure.",
    },
  },
  projects: [
    {
      slug: "eazy-review",
      variant: "flagship",
      eyebrow: "Flagship case study · Mobile + backend",
      title: "Eazy Review",
      description:
        "A mobile product-review system backed by owner-scoped data access and explicit failure handling.",
      proofPoints: [
        "Owner-scoped PostgreSQL row-level security and explicit least-privilege grants.",
        "Automated frontend, database, authorization, and concurrency checks, with offline, reconnect, and physical-device evidence.",
      ],
      technologies: ["React Native", "TypeScript", "Supabase", "PostgreSQL"],
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
        "A browser-based networking study platform with 404 questions, flexible practice formats, and timed testing.",
      proofPoints: [
        "Practice and randomized 50-question Test modes across two question banks and four answer formats.",
        "A two-hour timer and study progress persist locally in the browser.",
      ],
      technologies: ["Next.js", "TypeScript", "Cloudflare Pages"],
      links: [
        { label: "Live site", href: "https://study.tianzhe.me", external: true },
        { label: "GitHub", href: "https://github.com/tyson-hu/study-website", external: true },
      ],
      image: "/networking-study-platform.png",
      imageAlt: "Networking Study Platform interface showing study content and progress",
      metricSummary:
        "30 days ending Aug. 17, 2026: ≈1.8K visits / 4K page views; visits are not unique users.",
    },
    {
      slug: "opencore",
      variant: "opencore",
      eyebrow: "Open source · Systems maintenance",
      title: "OpenCore for Razer Blade 15",
      description:
        "Maintained OpenCore configuration and installation documentation for a Razer Blade 15 across multiple macOS releases.",
      technologies: ["OpenCore", "ACPI", "Hardware debugging"],
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
      title: "Languages",
      technologies: ["TypeScript", "JavaScript", "Python", "Go", "C", "C++"],
    },
    {
      title: "Application",
      technologies: ["React Native", "Expo", "React", "Next.js", "Node.js"],
    },
    {
      title: "Data / Infrastructure",
      technologies: ["PostgreSQL", "Supabase", "Git", "Docker", "CI/CD", "Cloudflare"],
    },
  ],
  contact: {
    email: "tysonhu.dev@gmail.com",
    github: "https://github.com/tyson-hu",
    linkedin: "https://www.linkedin.com/in/TianzheHu",
    label: "05 · Contact",
    title: "Let's build something useful.",
    description: "Open to backend, full-stack, mobile, and developer-tooling opportunities.",
  },
};
