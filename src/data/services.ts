import { readContentOverride } from "@/admin/contentRepository";

/**
 * 10LONAZ — Services Data
 * Centralized, typed service definitions for landing previews, services page,
 * and Schema.org Service structured data.
 */

export interface ServiceDetail {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string; // Identifier for Lucide icon
  features: string[];
  deliverables: string[];
  techStack: string[];
  timeline: string;
  category: "Development" | "Architecture & Cloud" | "Design & Strategy" | "Growth & Operations";
  popular?: boolean;
  published?: boolean;
  order?: number;
  imageUrl?: string;
  pricing?: string;
}

const seedServicesData: ServiceDetail[] = [
  {
    id: "svc-custom-software",
    slug: "custom-software-development",
    title: "Custom Software Development",
    shortDescription:
      "Tailored software engineered to your exact business logic, workflows, and growth roadmap.",
    fullDescription:
      "We design, build, and deploy high-performance custom software tailored to the exact requirements of your business. From enterprise automation portals to complex computational tools, our software eliminates operational friction and creates long-term competitive advantages.",
    iconName: "Code2",
    features: [
      "Enterprise workflow automation",
      "Legacy system modernization & refactoring",
      "High-throughput microservices architecture",
      "Multi-platform database synchronization",
    ],
    deliverables: [
      "Full source code & Git repository ownership",
      "Automated CI/CD pipelines & test suites",
      "Architecture design diagrams & technical documentation",
      "30-day post-launch warranty & SLA coverage",
    ],
    techStack: ["React", "Node.js", "TypeScript", "Python", "Go", "PostgreSQL", "Docker"],
    timeline: "6 – 16 weeks",
    category: "Development",
    popular: true,
  },
  {
    id: "svc-saas-products",
    slug: "saas-product-development",
    title: "SaaS Product Development",
    shortDescription:
      "Multi-tenant SaaS platforms with subscription billing, analytics, and role-based access.",
    fullDescription:
      "Turn your software vision into a profitable, scalable cloud SaaS product. We implement battle-tested multi-tenant isolation, Stripe / LemonSqueezy subscription management, automated customer onboarding, role-based access control, and usage metering.",
    iconName: "Boxes",
    features: [
      "Multi-tenant database architectures (RLS or isolated schemas)",
      "Automated subscription billing, tax compliance & dunning",
      "Granular role-based access control (RBAC & ABAC)",
      "Telemetry, user analytics & audit logging",
    ],
    deliverables: [
      "Production-ready SaaS application",
      "Admin & tenant management dashboards",
      "Payment gateway integration with webhook handlers",
      "Cloud infrastructure provisioning scripts (IaC)",
    ],
    techStack: ["Next.js", "React", "PostgreSQL", "Prisma", "Stripe", "Redis", "AWS"],
    timeline: "8 – 20 weeks",
    category: "Development",
    popular: true,
  },
  {
    id: "svc-web-apps",
    slug: "web-application-development",
    title: "Web Application Development",
    shortDescription:
      "Fast, responsive, SEO-ready web applications built with modern frameworks and best practices.",
    fullDescription:
      "We build responsive, accessible, lightning-fast Single Page Applications (SPAs) and Progressive Web Apps (PWAs). Our web apps score 95+ on Google Core Web Vitals, delighting users on smartphones, tablets, and desktop displays alike.",
    iconName: "Globe",
    features: [
      "Progressive Web App (PWA) with offline capabilities",
      "Sub-second page transitions & client-side caching",
      "Full WCAG 2.1 AA accessibility compliance",
      "Search Engine Optimization (SEO) structured data built-in",
    ],
    deliverables: [
      "Production build bundle with minification and code splitting",
      "Responsive layout across 5 screen breakpoints",
      "Headless CMS integration or dynamic API backend",
      "Cross-browser testing matrix verification",
    ],
    techStack: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Vite", "Framer Motion"],
    timeline: "4 – 10 weeks",
    category: "Development",
  },
  {
    id: "svc-mobile-apps",
    slug: "mobile-app-development",
    title: "Mobile App Development",
    shortDescription:
      "Native and cross-platform iOS & Android apps with polished UX and offline capabilities.",
    fullDescription:
      "Reach your audience anywhere with seamless mobile apps. We leverage React Native and Flutter to deliver near 100% code sharing without sacrificing smooth 60fps native performance, intuitive touch gestures, biometric authentication, or push notification capabilities.",
    iconName: "Smartphone",
    features: [
      "Cross-platform iOS and Android unified codebase",
      "Native device integration (Camera, GPS, Biometrics, Bluetooth)",
      "Offline-first synchronization with SQLite / WatermelonDB",
      "App Store & Google Play Store submission management",
    ],
    deliverables: [
      "Signed production iOS (.ipa) and Android (.aab) binaries",
      "Automated over-the-air (OTA) update configuration",
      "App store listing screenshots, metadata & review approvals",
      "Push notification service setup (Firebase Cloud Messaging)",
    ],
    techStack: ["React Native", "Flutter", "Swift", "Kotlin", "Firebase", "Expo"],
    timeline: "8 – 16 weeks",
    category: "Development",
    popular: true,
  },
  {
    id: "svc-business-management",
    slug: "business-management-systems",
    title: "Business Management Systems",
    shortDescription:
      "ERP, CRM, HR, and inventory systems that unify your operations end-to-end.",
    fullDescription:
      "Replace disjointed spreadsheets and cumbersome legacy tools with an integrated operational command center. We create unified ERP, CRM, inventory, and point-of-sale systems customized to your company's exact operational workflows.",
    iconName: "Building2",
    features: [
      "Custom ERP, CRM, and supply chain management",
      "Role-based employee portals & payroll tracking",
      "Barcode/QR inventory scanning and automated reorder alerts",
      "Real-time operational business intelligence dashboards",
    ],
    deliverables: [
      "Centralized operations hub with multi-department modules",
      "Automated email & SMS notifications",
      "Data migration scripts from old databases/spreadsheets",
      "Admin user training manuals & video walkthroughs",
    ],
    techStack: ["React", "Node.js", "PostgreSQL", "Redis", "Tailwind CSS"],
    timeline: "8 – 18 weeks",
    category: "Development",
  },
  {
    id: "svc-ai-solutions",
    slug: "ai-solutions-llm-copilots",
    title: "AI Solutions & Copilots",
    shortDescription:
      "AI copilots, chatbots, RAG systems, and workflow automation built on modern LLMs.",
    fullDescription:
      "Transform business efficiency with custom AI agents and enterprise copilots. We build advanced Retrieval-Augmented Generation (RAG) pipelines over your private documents, automated customer support agents, and predictive workflows backed by robust hallucination guards and data privacy guarantees.",
    iconName: "Brain",
    features: [
      "Custom enterprise RAG over PDF, Notion, Confluence, and databases",
      "Autonomous AI agents with tool-calling capabilities",
      "Zero-data-retention private cloud deployments",
      "Semantic cache layers reducing LLM inference costs by up to 70%",
    ],
    deliverables: [
      "AI copilot embedded in web/mobile app or Slack/Teams",
      "Vector database pipeline & continuous document indexing",
      "Evaluation benchmarks for retrieval precision & factual accuracy",
      "Comprehensive telemetry dashboard for token consumption & latency",
    ],
    techStack: ["Python", "FastAPI", "LangChain", "OpenAI", "Anthropic", "Qdrant", "pgvector"],
    timeline: "4 – 12 weeks",
    category: "Architecture & Cloud",
    popular: true,
  },
  {
    id: "svc-cloud-devops",
    slug: "cloud-devops-infrastructure",
    title: "Cloud & DevOps Infrastructure",
    shortDescription:
      "Cloud architecture, CI/CD, containers, and observability to ship faster and safer.",
    fullDescription:
      "Build a resilient, cost-effective infrastructure that scales effortlessly. We implement Infrastructure as Code (Terraform), automate continuous integration and delivery pipelines, configure Kubernetes orchestration, and set up comprehensive observability so you can release with complete confidence.",
    iconName: "Cloud",
    features: [
      "Automated Infrastructure as Code (Terraform / OpenTofu)",
      "Zero-downtime blue/green & canary deployments",
      "Container orchestration with Kubernetes (EKS / GKE)",
      "24/7 APM alerting (Prometheus, Grafana, Datadog)",
    ],
    deliverables: [
      "Version-controlled infrastructure codebase",
      "Configured CI/CD pipelines in GitHub Actions or GitLab",
      "Cloud cost optimization report & right-sizing audit",
      "Disaster recovery runbook with RPO & RTO metrics",
    ],
    techStack: ["AWS", "GCP", "Docker", "Kubernetes", "Terraform", "GitHub Actions", "Prometheus"],
    timeline: "3 – 8 weeks",
    category: "Architecture & Cloud",
  },
  {
    id: "svc-ui-ux-design",
    slug: "ui-ux-design-systems",
    title: "UI/UX Design & Design Systems",
    shortDescription:
      "Research-driven interfaces and design systems that convert visitors into loyal users.",
    fullDescription:
      "We combine rigorous user research with refined visual craft to design digital experiences that captivate users and drive conversions. Our scalable design systems bridge the gap between design and development, accelerating feature velocity.",
    iconName: "Palette",
    features: [
      "User journey mapping & high-fidelity interactive prototyping",
      "Complete design system with Figma variables and design tokens",
      "Responsive UI specifications across mobile, tablet, and desktop",
      "Usability testing & conversion rate optimization audits",
    ],
    deliverables: [
      "Organized Figma master workspace with component library",
      "Clickable prototypes for investor and stakeholder pitches",
      "Design tokens exported as CSS/Tailwind variables",
      "Design handoff specifications for developers",
    ],
    techStack: ["Figma", "Framer", "Design Tokens", "Tailwind CSS", "UserTesting"],
    timeline: "3 – 8 weeks",
    category: "Design & Strategy",
  },
  {
    id: "svc-api-integration",
    slug: "api-development-system-integration",
    title: "API Development & System Integration",
    shortDescription:
      "Secure REST and GraphQL APIs plus deep integrations across your existing tools.",
    fullDescription:
      "Connect your disparate systems into a unified data flow. We build high-throughput REST and GraphQL APIs, integrate third-party payment gateways, CRM systems, ERPs, and marketing tools, backed by rate limiting, HMAC authentication, and webhook reliability.",
    iconName: "Plug",
    features: [
      "RESTful and GraphQL API design with OpenAPI/Swagger specs",
      "Robust webhook event dispatcher with automatic exponential retries",
      "Third-party integrations (Stripe, Salesforce, HubSpot, QuickBooks)",
      "API gateway setup with rate limiting and DDoS mitigation",
    ],
    deliverables: [
      "Interactive OpenAPI documentation (Swagger / Redoc)",
      "SDK generation for client languages (TypeScript, Python)",
      "Integration unit & load test suites",
      "API monitoring & error logging integration",
    ],
    techStack: ["Node.js", "FastAPI", "GraphQL", "PostgreSQL", "Redis", "Swagger"],
    timeline: "3 – 8 weeks",
    category: "Development",
  },
  {
    id: "svc-seo-optimization",
    slug: "seo-website-optimization",
    title: "SEO & Website Performance Optimization",
    shortDescription:
      "Technical SEO, Core Web Vitals, and content optimization to grow organic traffic.",
    fullDescription:
      "Improve search engine visibility, boost organic lead flow, and outrank competitors. We perform comprehensive technical audits, configure rich Schema.org structured data, optimize Core Web Vitals to green scores, and prepare sites for Answer Engine Optimization (AEO).",
    iconName: "Search",
    features: [
      "Core Web Vitals acceleration (LCP, INP, CLS optimization)",
      "Comprehensive Schema.org JSON-LD structured data",
      "Semantic HTML & accessible heading hierarchy",
      "XML sitemaps, canonical tags, and search engine console configuration",
    ],
    deliverables: [
      "Technical SEO audit report with step-by-step remediation",
      "Configured robots.txt, XML sitemap, and Open Graph cards",
      "Lighthouse 95+ score optimization proof",
      "AEO / GEO content structure recommendations",
    ],
    techStack: ["Lighthouse", "Google Search Console", "Schema.org", "Ahrefs", "Tailwind CSS"],
    timeline: "2 – 6 weeks",
    category: "Growth & Operations",
  },
  {
    id: "svc-maintenance-support",
    slug: "software-maintenance-support",
    title: "Software Maintenance & 24/7 Support",
    shortDescription:
      "Proactive monitoring, updates, and SLA support so your product stays healthy.",
    fullDescription:
      "Software is a living asset that requires ongoing care. We provide proactive monitoring, dependency updates, security patches, performance tuning, and guaranteed response SLAs to ensure your applications run smoothly around the clock.",
    iconName: "Wrench",
    features: [
      "Continuous uptime and performance monitoring",
      "Monthly dependency vulnerability patches and upgrades",
      "Guaranteed priority SLA for critical incidents",
      "Regular automated off-site backups & disaster recovery drills",
    ],
    deliverables: [
      "Monthly health check & performance reporting",
      "Dedicated Slack/Teams communication channel",
      "Incident post-mortem reports",
      "Dedicated developer hours for ongoing minor enhancements",
    ],
    techStack: ["AWS CloudWatch", "Sentry", "BetterUptime", "Dependabot", "All Stacks"],
    timeline: "Ongoing Retainer",
    category: "Growth & Operations",
    popular: true,
  },
  {
    id: "svc-it-consulting",
    slug: "it-consulting-tech-advisory",
    title: "IT Consulting & Technical Advisory",
    shortDescription:
      "Strategic technology consulting on architecture, hiring, and digital transformation.",
    fullDescription:
      "Get fractional CTO advisory and strategic technology guidance without the full-time executive cost. We help leadership teams choose optimal tech stacks, review architecture blueprints, evaluate technical hires, and execute seamless digital transformations.",
    iconName: "Compass",
    features: [
      "Fractional CTO advisory and roadmap validation",
      "Codebase and architecture security & scalability audits",
      "Vendor evaluation & software procurement analysis",
      "Engineering team mentoring and hiring interview panels",
    ],
    deliverables: [
      "Executive technical strategy roadmap document",
      "Architecture evaluation and recommendation report",
      "Tech stack trade-off and cost-projection matrix",
      "Bi-weekly advisory sync sessions",
    ],
    techStack: ["Advisory", "System Design", "Enterprise Architecture"],
    timeline: "Flexible / Monthly Advisory",
    category: "Design & Strategy",
  },
];

export const servicesData = readContentOverride<ServiceDetail[]>("services", seedServicesData);

export const getAllServices = (): ServiceDetail[] => servicesData;

export const getServiceBySlug = (slug?: string): ServiceDetail | undefined => {
  if (!slug) return undefined;
  return servicesData.find((s) => s.slug.toLowerCase() === slug.toLowerCase());
};
