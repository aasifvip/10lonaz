import { readContentOverride } from "@/admin/contentRepository";

export interface AboutPageCopy {
  badge: string;
  heading: string;
  headingAccent: string;
  missionTitle: string;
  missionBody: string;
  visionTitle: string;
  visionBody: string;
  statLabels: string[];
  teamImageUrl: string;
  teamImageAlt: string;
  whoWeAreBadge: string;
  whoWeAreHeading: string;
  whoWeAreParagraphs: string[];
  whoWeAreBullets: string[];
  valuesBadge: string;
  valuesHeading: string;
  valuesIntro: string;
  values: { iconName: string; title: string; description: string }[];
  capabilitiesBadge: string;
  capabilitiesHeading: string;
  capabilitiesIntro: string;
  capabilitiesCtaLabel: string;
  capabilities: { title: string; description: string }[];
  milestonesBadge: string;
  milestonesHeading: string;
  milestonesIntro: string;
  milestones: { year: string; title: string; event: string }[];
  ctaHeading: string;
  ctaBody: string;
  ctaPrimaryLabel: string;
  ctaSecondaryLabel: string;
}

export const defaultAboutPageCopy: AboutPageCopy = {
  badge: "About 10lonaz",
  heading: "Software, SaaS & AI —",
  headingAccent: "Engineered for Growth",
  missionTitle: "Our Mission",
  missionBody: "To empower visionary founders and forward-thinking enterprises with resilient, beautifully designed software that solves real human problems and unlocks exponential operational scale.",
  visionTitle: "Our Vision",
  visionBody: "To become the world's most trusted boutique software engineering partner, recognized for technical integrity, zero-bloat delivery, and pioneering work in multi-tenant cloud and autonomous AI systems.",
  statLabels: ["Projects Delivered", "Satisfaction Rate", "Countries Reached", "Uptime SLA"],
  teamImageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop",
  teamImageAlt: "10lonaz engineering team collaboration",
  whoWeAreBadge: "Who We Are",
  whoWeAreHeading: "Senior Engineering Without the Agency Bureaucracy",
  whoWeAreParagraphs: [
    "10lonaz was established by engineers frustrated by traditional software agency practices: high partner markups, bait-and-switch staffing with inexperienced juniors, and missed deadlines.",
    "We built 10lonaz as a flat, senior-only collective. When you partner with us, you collaborate directly with seasoned full-stack architects, cloud specialists, and product designers who have battle-tested experience building products handling millions of daily queries.",
  ],
  whoWeAreBullets: [
    "Direct direct Slack/Teams collaboration with your developers",
    "Weekly demo sprints and working software every Friday",
    "Complete IP ownership and clean Git repositories",
  ],
  valuesBadge: "Our Principles",
  valuesHeading: "How We Build",
  valuesIntro: "The core convictions that guide every architectural decision, line of code, and client interaction.",
  values: [
    { iconName: "Target", title: "Mission-Driven", description: "We build software that delivers measurable commercial results, not vanity metrics or bloated codebases." },
    { iconName: "Lightbulb", title: "Innovation First", description: "We thoughtfully integrate bleeding-edge technology — GenAI copilots, edge compute, and vector databases." },
    { iconName: "Users", title: "True Client Partnership", description: "We operate as an integrated technical extension of your team with daily asynchronous transparency." },
    { iconName: "Award", title: "Engineering Excellence", description: "Strict code reviews, automated CI/CD security scanning, and sub-100ms API response standards in every release." },
  ],
  capabilitiesBadge: "Technical Breadth",
  capabilitiesHeading: "What We Deliver",
  capabilitiesIntro: "End-to-end technical capabilities from discovery and prototyping to deployment and 24/7 maintenance.",
  capabilitiesCtaLabel: "Explore Full Services Details",
  capabilities: [
    { title: "Custom Web Applications", description: "Modern SPAs, PWAs, and high-performance marketing portals." },
    { title: "Mobile Applications", description: "Native and cross-platform apps for iOS and Android." },
    { title: "Multi-Tenant SaaS Platforms", description: "Multi-tenant products engineered for scale with automated billing." },
    { title: "AI Copilots & RAG Systems", description: "Domain-specific LLM agents, private document RAG, and automation." },
    { title: "Enterprise Software & ERP", description: "Mission-critical internal business systems and workflows." },
    { title: "Cloud Architecture & DevOps", description: "Terraform IaC, Kubernetes, and 24/7 observability on AWS, GCP, Azure." },
    { title: "REST & GraphQL API Services", description: "High-throughput APIs, webhooks, and third-party integrations." },
    { title: "Database Systems & Optimization", description: "PostgreSQL with RLS, Redis caching, vector databases, and zero-downtime migrations." },
    { title: "UI/UX & Design Systems", description: "Conversion-focused user research, Figma prototypes, and WCAG AA accessibility." },
  ],
  milestonesBadge: "Our Timeline",
  milestonesHeading: "The Journey of 10lonaz",
  milestonesIntro: "Key milestones that defined our growth into a global software powerhouse.",
  milestones: [
    { year: "2020", title: "Founding", event: "10lonaz was founded with a mission to deliver senior-level engineering to modern startups and enterprises." },
    { year: "2021", title: "SaaS Practice Launch", event: "Engineered and shipped our first batch of multi-tenant SaaS platforms, expanding our distributed engineering hub." },
    { year: "2022", title: "Cloud & DevOps Scale", event: "Launched our 24/7 Cloud & DevOps practice, formalizing Kubernetes and infrastructure-as-code deployments." },
    { year: "2023", title: "100+ Projects Milestone", event: "Crossed 100+ successfully delivered software products across fintech, healthcare, logistics, and retail." },
    { year: "2024", title: "AI Copilot Center of Excellence", event: "Launched custom enterprise GenAI, hybrid RAG pipelines, and automated LLM agent solutions." },
    { year: "2025 – 2026", title: "Global Expansion", event: "Serving enterprises across 15+ countries with round-the-clock follow-the-sun software engineering." },
  ],
  ctaHeading: "Let's Build Your Next Digital Advantage",
  ctaBody: "Partner with senior engineers who care about your product's speed, scalability, and commercial outcome.",
  ctaPrimaryLabel: "Schedule a Free Technical Consultation",
  ctaSecondaryLabel: "Explore Open Roles",
};

export const aboutPageCopy = readContentOverride<AboutPageCopy>("aboutCopy", defaultAboutPageCopy);
