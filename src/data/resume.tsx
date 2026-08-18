import { Icons } from "@/components/icons";
import { Globe2, HomeIcon } from "lucide-react";
import { ReactLight } from "@/components/ui/svgs/reactLight";
import { ReactNative } from "@/components/ui/svgs/reactNative";
import { NextjsIconDark } from "@/components/ui/svgs/nextjsIconDark";
import { Typescript } from "@/components/ui/svgs/typescript";
import { JavaScript } from "@/components/ui/svgs/javascript";
import { Nodejs } from "@/components/ui/svgs/nodejs";
import { Python } from "@/components/ui/svgs/python";
import { CLanguage } from "@/components/ui/svgs/cLanguage";
import { Postgresql } from "@/components/ui/svgs/postgresql";
import { Git } from "@/components/ui/svgs/git";
import { Golang } from "@/components/ui/svgs/golang";
import { Docker } from "@/components/ui/svgs/docker";

const ASSETS = {
  avatar: "https://assets.tianzhe.me/profile/avatar.webp",
  bciCover: "https://assets.tianzhe.me/projects/bci/cover.webp",
  hackintoshCover: "https://assets.tianzhe.me/projects/hackintosh/cover.webp",
  networkingStudyCover: "/networking-study-platform.png",
  eazyReviewIcon: "https://assets.tianzhe.me/projects/eazy-review/icon.svg",
  ubLogo: "https://assets.tianzhe.me/education/university-at-buffalo/logo-blue.svg",
} as const;

export const DATA = {
  name: 'Tianzhe "Tyson" Hu',
  initials: "TH",
  url: "https://tianzhe.me",
  location: "New York, NY",
  locationLink: "https://www.google.com/maps/place/New+York,+NY",
  service: "U.S. Army Reserve IT Specialist (25B)",
  description: "Software Engineer — Backend, Full-Stack & Developer Tooling",
  summary: `I'm a New York–based Computer Engineering graduate and U.S. Army Reserve Information Technology Specialist building independent software systems across full-stack applications, secure data architecture, developer tooling, and AI-assisted engineering workflows. I focus on shipped systems, reproducible testing, clear technical decisions, and evidence engineers can inspect.`,
  avatarUrl: ASSETS.avatar,
  skills: [
    { name: "TypeScript", icon: Typescript },
    { name: "JavaScript", icon: JavaScript },
    { name: "Python", icon: Python },
    { name: "Go", icon: Golang },
    { name: "C", icon: CLanguage },
    { name: "C++" },
    { name: "React", icon: ReactLight },
    { name: "React Native", icon: ReactNative },
    { name: "Expo" },
    { name: "Next.js", icon: NextjsIconDark },
    { name: "Node.js", icon: Nodejs },
    { name: "PostgreSQL", icon: Postgresql },
    { name: "Supabase" },
    { name: "Git", icon: Git },
    { name: "Docker", icon: Docker },
    { name: "CI/CD" },
    { name: "Cloudflare Pages" },
  ],
  navbar: [{ href: "/", icon: HomeIcon, label: "Home" }],
  contact: {
    email: "tysonhu.dev@gmail.com",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/tyson-hu",
        icon: Icons.github,
        navbar: true,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/TianzheHu",
        icon: Icons.linkedin,
        navbar: true,
      },
      email: {
        name: "Send Email",
        url: "mailto:tysonhu.dev@gmail.com",
        icon: Icons.email,
        navbar: false,
      },
    },
  },

  work: [
    {
      company: "Independent Engineering Portfolio",
      badges: ["Independent"],
      location: "New York, NY",
      title: "Independent Software Engineering",
      logoUrl: "",
      start: "2023",
      end: "Present",
      description:
        "Independent software systems spanning mobile and full-stack applications, secure data architecture, developer tooling, testing and reliability, documented engineering delivery, and open-source maintenance.",
    },
    {
      company: "U.S. Army Reserve",
      badges: ["Service"],
      location: "United States",
      title: "Information Technology Specialist (25B)",
      logoUrl: "",
      start: "Jan 2026",
      end: "Present",
      description:
        "Cisco networking, secure configuration, technical troubleshooting, and procedure-driven IT work.",
    },
  ] as readonly {
    company: string;
    badges: readonly string[];
    location: string;
    title: string;
    logoUrl: string;
    start: string;
    end: string;
    description: string;
  }[],
  education: [
    {
      school: "University at Buffalo, The State University of New York",
      href: "https://www.buffalo.edu",
      degree: "Bachelor of Science in Computer Engineering",
      logoUrl: ASSETS.ubLogo,
      start: "2019",
      end: "2023",
    },
  ],
  projects: [
    {
      title: "Eazy Review",
      href: "https://github.com/Tyson-Hu/Eazy-Review",
      dates: "Independent mobile/full-stack system",
      featured: true,
      caseStudyHref: "/projects/eazy-review",
      description:
        "A React Native product-review system with a connected catalog, account state, and persisted personal ratings on Supabase and PostgreSQL.\n\n- Owner-scoped row-level security and explicit least-privilege grants\n- Automated frontend, database, authorization, and concurrency checks\n- Explicit failure handling plus offline, reconnect, and physical-device evidence",
      technologies: [
        "React Native",
        "Expo",
        "TypeScript",
        "TanStack Query",
        "Supabase",
        "PostgreSQL",
      ],
      links: [
        {
          type: "GitHub",
          href: "https://github.com/Tyson-Hu/Eazy-Review",
          icon: <Icons.github aria-hidden="true" className="size-3" />,
        },
      ],
      image: ASSETS.eazyReviewIcon,
      imageClassName: "object-contain h-28 p-4 bg-muted",
      video: "",
    },
    {
      title: "Networking Study Platform",
      href: "https://study.tianzhe.me",
      dates: "Independent educational project",
      featured: true,
      description:
        "A 404-question networking study platform built during U.S. Army AIT and later shared informally with peers preparing for course tests.\n\n- Two question banks and four answer formats across Practice and randomized 50-question Test modes\n- Persisted two-hour timer and progress stored locally in the browser\n- 30 days ending Aug. 17, 2026: ≈1.8K visits / 4K page views; visits are not unique users",
      technologies: [
        "Next.js",
        "React",
        "TypeScript",
        "Tailwind CSS",
        "Cloudflare Pages",
      ],
      links: [
        {
          type: "GitHub",
          href: "https://github.com/tyson-hu/study-website",
          icon: <Icons.github aria-hidden="true" className="size-3" />,
        },
        {
          type: "Live site",
          href: "https://study.tianzhe.me",
          icon: <Globe2 aria-hidden="true" className="size-3" />,
        },
      ],
      image: ASSETS.networkingStudyCover,
      video: "",
    },
    {
      title: "OpenCore for Razer Blade 15",
      href: "https://github.com/Tyson-Hu/RazerBlade15-Base-Model-Hackintosh_macOS_Sonoma",
      dates: "Open-source maintenance",
      featured: true,
      description:
        "OpenCore configuration and community-facing documentation for the Razer Blade 15, maintained across multiple macOS releases. The work centers on system compatibility, ACPI and kext configuration, hardware troubleshooting, installation guidance, and third-party adoption.",
      technologies: ["OpenCore", "ACPI", "Kexts", "macOS", "Hardware Debugging"],
      links: [
        {
          type: "GitHub",
          href: "https://github.com/Tyson-Hu/RazerBlade15-Base-Model-Hackintosh_macOS_Sonoma",
          icon: <Icons.github aria-hidden="true" className="size-3" />,
        },
      ],
      image: ASSETS.hackintoshCover,
      video: "",
    },
    {
      title: "Brain-Computer Interface Signal Processing Board",
      href: "https://github.com/tyson-hu/Brain-Computer-Interface_Project",
      dates: "Senior capstone",
      description:
        "Embedded software for a University at Buffalo senior capstone signal-processing board, including ADS119X communication, SPI data transfer, device drivers, and serial streaming used to inspect and validate biosignal data.",
      technologies: ["C++", "Arduino", "SPI", "ADS119X", "PCB", "EEG/EOG"],
      links: [
        {
          type: "GitHub",
          href: "https://github.com/tyson-hu/Brain-Computer-Interface_Project",
          icon: <Icons.github aria-hidden="true" className="size-3" />,
        },
      ],
      image: ASSETS.bciCover,
      video: "",
    },
  ],
} as const;
