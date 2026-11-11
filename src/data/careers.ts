import { readContentOverride } from "@/admin/contentRepository";

/**
 * 10LONAZ — Careers & Job Openings Data
 * Structured, manually editable data ready for Firebase Firestore integration.
 */

export type Department =
  | "Engineering"
  | "AI & Data"
  | "Product & Design"
  | "Cloud & DevOps"
  | "QA & Security";

export type EmploymentType = "Full-time" | "Part-time" | "Contract" | "Freelance" | "Internship";
export type ExperienceLevel = "Junior" | "Mid-Level" | "Senior" | "Lead / Principal";

export interface JobQuestion {
  id: string;
  label: string;
  placeholder?: string;
  type: "text" | "textarea" | "select";
  options?: string[];
  required: boolean;
}

export interface JobVacancy {
  id: string;
  slug: string;
  title: string;
  department: Department;
  location: string;
  type: EmploymentType;
  experience: ExperienceLevel;
  salary: string;
  postedDate: string; // ISO date e.g. "2026-10-15"
  deadline: string; // ISO date e.g. "2026-12-31"
  featured?: boolean;
  isOpen: boolean;
  overview: string;
  responsibilities: string[];
  requirements: string[];
  qualifications: string[];
  benefits: string[];
  techStack: string[];
  customQuestions?: JobQuestion[];
  salaryAmount?: string;
  salaryCurrency?: string;
  salaryPeriod?: "hourly" | "daily" | "monthly" | "project-based" | "yearly";
  locationType?: "remote" | "hybrid" | "on-site";
  country?: string;
  openings?: number;
  order?: number;
}

const seedJobVacancies: JobVacancy[] = [
  {
    id: "job-001",
    slug: "senior-full-stack-engineer-react-node",
    title: "Senior Full-Stack Engineer (React & Node.js)",
    department: "Engineering",
    location: "Remote (Global)",
    type: "Full-time",
    experience: "Senior",
    salary: "$120,000 – $155,000 USD / year",
    postedDate: "2026-10-10",
    deadline: "2026-12-31",
    featured: true,
    isOpen: true,
    overview:
      "We are seeking a seasoned Senior Full-Stack Engineer to architect, build, and scale high-concurrency SaaS applications and customer-facing digital platforms. You will collaborate closely with product managers, UI/UX designers, and distributed engineering pods to deliver secure, performant software.",
    responsibilities: [
      "Architect and implement end-to-end features across modern React (TypeScript) frontends and Node.js microservices.",
      "Design resilient database schemas and performant queries utilizing PostgreSQL, Redis, and Prisma/Drizzle.",
      "Establish automated CI/CD workflows, automated unit/integration testing suites (Jest, Playwright), and code reviews.",
      "Optimize web vital metrics, reducing bundle sizes and achieving sub-100ms API response latency.",
      "Mentor mid-level and junior engineers through pair programming, architectural guidelines, and technical documentation.",
    ],
    requirements: [
      "5+ years of production experience with TypeScript, React, and Node.js.",
      "Deep understanding of relational databases (PostgreSQL) and caching strategies (Redis).",
      "Proven track record building and scaling multi-tenant SaaS platforms or high-traffic web applications.",
      "Solid understanding of RESTful APIs, WebSockets, and asynchronous event queues (BullMQ, Kafka).",
      "Excellent asynchronous written and spoken English communication skills for remote teamwork.",
    ],
    qualifications: [
      "Bachelor's or Master's degree in Computer Science, Software Engineering, or equivalent practical experience.",
      "Experience with Docker, Kubernetes, and AWS (ECS, Lambda, RDS, S3).",
      "Familiarity with modern UI toolkits (Tailwind CSS, Radix UI / Shadcn UI).",
    ],
    benefits: [
      "100% Remote flexibility with home office equipment stipend ($1,500 initial setup).",
      "Competitive global compensation with annual performance bonus.",
      "Unlimited paid time off (minimum 25 days recommended) plus local public holidays.",
      "Annual $2,000 professional development and conference budget.",
      "Comprehensive private health and wellness coverage.",
    ],
    techStack: ["React", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS", "Docker", "AWS"],
    customQuestions: [
      {
        id: "github_or_portfolio",
        label: "Link to your GitHub profile, portfolio, or major open-source contribution",
        placeholder: "https://github.com/yourusername",
        type: "text",
        required: true,
      },
      {
        id: "notice_period",
        label: "Notice period / earliest start date",
        placeholder: "Immediately / 2 weeks / 1 month",
        type: "text",
        required: true,
      },
      {
        id: "concurrency_experience",
        label: "Briefly describe a complex scalability or concurrency challenge you solved",
        placeholder: "Tell us about the architecture, bottleneck, and outcome...",
        type: "textarea",
        required: false,
      },
    ],
  },
  {
    id: "job-002",
    slug: "lead-ai-solutions-architect",
    title: "Lead AI Solutions Architect (LLMs & RAG Systems)",
    department: "AI & Data",
    location: "Remote (Global)",
    type: "Full-time",
    experience: "Lead / Principal",
    salary: "$145,000 – $185,000 USD / year",
    postedDate: "2026-10-14",
    deadline: "2026-12-31",
    featured: true,
    isOpen: true,
    overview:
      "10lonaz is expanding its AI Solutions practice. We are looking for a Lead AI Solutions Architect to spearhead enterprise GenAI deployments, agentic workflows, multi-modal pipelines, and hybrid RAG systems that provide measurable business impact for our global clients.",
    responsibilities: [
      "Design and deploy production-grade RAG architectures with vector embeddings, hybrid search, and semantic re-ranking.",
      "Build intelligent agentic copilots utilizing LangChain, LlamaIndex, OpenAI, Anthropic, and open-source models.",
      "Implement rigorous evaluation frameworks (Ragas, TruLens) for hallucination mitigation and latency optimization.",
      "Consult directly with client CTOs and technical founders to define AI roadmaps, security boundaries, and data governance.",
      "Lead technical discovery sessions and author technical whitepapers on enterprise GenAI best practices.",
    ],
    requirements: [
      "6+ years of software engineering experience with at least 2.5+ years building and deploying production GenAI systems.",
      "Expertise in Python, FastAPI, vector databases (Pinecone, Qdrant, Milvus, pgvector), and embedding models.",
      "Deep understanding of prompt engineering, fine-tuning techniques (LoRA, QLoRA), and model serving (vLLM, Ollama).",
      "Hands-on experience with LLM guardrails, PII redaction, and enterprise data compliance (SOC2/GDPR).",
    ],
    qualifications: [
      "Advanced degree (M.S. or Ph.D.) in AI, Computer Science, or equivalent industry leadership experience.",
      "Proven contributions to AI open-source libraries or published research.",
    ],
    benefits: [
      "Generous hardware allowance (M3 Max / GPU workstation of your choice).",
      "Unlimited access to state-of-the-art model APIs and cloud compute clusters.",
      "Full remote freedom across any timezone.",
      "Comprehensive medical, dental, and vision insurance.",
      "Company profit-sharing pool for leadership positions.",
    ],
    techStack: ["Python", "FastAPI", "OpenAI / Claude", "LangChain", "Qdrant", "PostgreSQL", "Docker"],
    customQuestions: [
      {
        id: "ai_portfolio",
        label: "Links to GenAI / LLM projects or repositories you have built or led",
        placeholder: "https://...",
        type: "text",
        required: true,
      },
      {
        id: "eval_experience",
        label: "How do you evaluate and prevent hallucinations in enterprise RAG systems?",
        placeholder: "Summarize your evaluation methodologies...",
        type: "textarea",
        required: true,
      },
    ],
  },
  {
    id: "job-003",
    slug: "senior-ui-ux-product-designer",
    title: "Senior UI/UX Product Designer",
    department: "Product & Design",
    location: "Remote (Global)",
    type: "Full-time",
    experience: "Senior",
    salary: "$95,000 – $130,000 USD / year",
    postedDate: "2026-10-18",
    deadline: "2026-12-31",
    featured: false,
    isOpen: true,
    overview:
      "We believe that powerful software must be intuitive, accessible, and delight to use. As a Senior UI/UX Product Designer at 10lonaz, you will craft world-class interfaces, comprehensive design systems, and micro-interactions for SaaS platforms, dashboards, and mobile applications.",
    responsibilities: [
      "Own end-to-end design from customer discovery and user journeys to high-fidelity Figma components and interactive prototypes.",
      "Maintain and evolve our unified design tokens, typography, and responsive component libraries.",
      "Conduct usability tests, interviews, and heuristic audits to refine user onboarding and conversion funnels.",
      "Partner seamlessly with frontend engineers to ensure pixel-perfect fidelity and WCAG 2.1 AA accessibility compliance.",
      "Create clean iconography, micro-animations, and visual design assets for client products.",
    ],
    requirements: [
      "4+ years of professional experience designing B2B SaaS, mobile apps, or complex digital tools.",
      "Mastery of Figma (auto-layout, components, variables, interactive prototyping) and design systems.",
      "Strong portfolio demonstrating user-centric problem solving, clear typography, and refined aesthetics.",
      "Solid knowledge of web accessibility standards (contrast, focus states, keyboard navigation).",
    ],
    qualifications: [
      "Degree in Interaction Design, Human-Computer Interaction, or equivalent portfolio evidence.",
      "Basic understanding of HTML/CSS/Tailwind primitives to facilitate effortless engineering handoff.",
    ],
    benefits: [
      "Full Figma Professional license + software allowance for creative tools.",
      "Flexible schedule and asynchronous work culture.",
      "Annual wellness stipend and home ergonomics budget.",
      "Paid attendance to international design conferences.",
    ],
    techStack: ["Figma", "Design Systems", "Prototyping", "Tailwind CSS", "User Research"],
    customQuestions: [
      {
        id: "portfolio_url",
        label: "Portfolio URL (with case studies and password if applicable)",
        placeholder: "https://yourportfolio.com",
        type: "text",
        required: true,
      },
      {
        id: "favorite_design_system",
        label: "What design system or product interface inspires you most and why?",
        placeholder: "Share your thoughts...",
        type: "textarea",
        required: false,
      },
    ],
  },
  {
    id: "job-004",
    slug: "cloud-devops-platform-engineer",
    title: "Cloud & DevOps Platform Engineer",
    department: "Cloud & DevOps",
    location: "Remote (Global)",
    type: "Full-time",
    experience: "Mid-Level",
    salary: "$105,000 – $135,000 USD / year",
    postedDate: "2026-10-22",
    deadline: "2026-12-31",
    featured: false,
    isOpen: true,
    overview:
      "Join our Cloud & Infrastructure team to design resilient multi-cloud architectures, automate zero-downtime deployment pipelines, and maintain 99.95% uptime for mission-critical client services.",
    responsibilities: [
      "Write modular Infrastructure-as-Code using Terraform and OpenTofu across AWS, GCP, and Azure.",
      "Manage Kubernetes clusters (EKS/GKE), container registries, and automated Helm release deployments.",
      "Build bulletproof CI/CD pipelines using GitHub Actions, including automated linting, security scans, and preview environments.",
      "Configure Prometheus, Grafana, Datadog, and OpenTelemetry instrumentation for real-time alerting and APM.",
      "Implement cloud security best practices (IAM least privilege, VPC peering, secrets management with Vault).",
    ],
    requirements: [
      "3+ years in DevOps, SRE, or Cloud Infrastructure roles.",
      "Proficiency with Terraform, Docker, Kubernetes, and Linux systems administration.",
      "Deep understanding of networking, DNS, SSL/TLS, and load balancing (Cloudflare, AWS ALB).",
      "Experience setting up robust backup, disaster recovery, and failover architectures.",
    ],
    qualifications: [
      "AWS Certified Solutions Architect or CKA (Certified Kubernetes Administrator) is a plus.",
      "Experience with database management (RDS PostgreSQL high-availability, Redis clusters).",
    ],
    benefits: [
      "100% remote working environment.",
      "Certification reimbursement for cloud and security credentials.",
      "Competitive annual compensation package with equity options.",
      "25 days paid vacation + local public holidays.",
    ],
    techStack: ["AWS", "Kubernetes", "Terraform", "GitHub Actions", "Docker", "Prometheus", "PostgreSQL"],
    customQuestions: [
      {
        id: "cloud_certifications",
        label: "Relevant cloud or Kubernetes certifications (optional)",
        placeholder: "e.g. AWS Solutions Architect, CKA",
        type: "text",
        required: false,
      },
      {
        id: "iac_experience",
        label: "Describe your favorite CI/CD or IaC pipeline you built from scratch",
        placeholder: "Describe the tooling, trigger mechanism, and security gates...",
        type: "textarea",
        required: false,
      },
    ],
  },
  {
    id: "job-005",
    slug: "qa-automation-security-engineer",
    title: "QA Automation & Security Engineer",
    department: "QA & Security",
    location: "Remote (Global)",
    type: "Full-time",
    experience: "Mid-Level",
    salary: "$85,000 – $115,000 USD / year",
    postedDate: "2026-10-25",
    deadline: "2026-12-31",
    featured: false,
    isOpen: true,
    overview:
      "We are looking for a QA Automation & Security Engineer dedicated to ensuring every product 10lonaz ships is robust, bug-free, and protected against common vulnerabilities. You will write comprehensive E2E tests, automate regression suites, and conduct vulnerability scans.",
    responsibilities: [
      "Develop and maintain automated end-to-end testing frameworks using Playwright and Cypress.",
      "Create API test suites verifying request contracts, status codes, and edge-case payload validation.",
      "Perform automated and manual security audits (OWASP Top 10, penetration testing, dependency scanning with Snyk).",
      "Collaborate with developers to reproduce, isolate, and verify bug fixes before production deployments.",
      "Establish cross-browser, cross-device, and responsive mobile testing matrices.",
    ],
    requirements: [
      "3+ years of automated testing and software quality assurance experience.",
      "Strong coding abilities in JavaScript/TypeScript or Python for test automation.",
      "Hands-on experience with Playwright or Cypress integrated into CI/CD pipelines.",
      "Solid knowledge of web security fundamentals (XSS, CSRF, SQL Injection, Auth validation).",
    ],
    qualifications: [
      "Experience with performance testing tools (k6, Lighthouse CI).",
      "ISTQB certification or equivalent practical testing background.",
    ],
    benefits: [
      "Remote work freedom worldwide.",
      "Flexible working schedule.",
      "Comprehensive medical insurance.",
      "Annual conference and learning stipend.",
    ],
    techStack: ["Playwright", "TypeScript", "Jest", "k6", "GitHub Actions", "Postman", "OWASP"],
    customQuestions: [
      {
        id: "testing_frameworks",
        label: "What testing framework do you feel most productive with?",
        placeholder: "Playwright, Cypress, Selenium, etc.",
        type: "text",
        required: true,
      },
    ],
  },
];

export const jobVacancies = readContentOverride<JobVacancy[]>("jobs", seedJobVacancies).map((job) => ({
  ...job,
  salary: job.salaryAmount
    ? `${job.salaryCurrency || "USD"} ${job.salaryAmount} / ${job.salaryPeriod || "yearly"}`
    : job.salary,
}));

/**
 * Filter and query helper functions for Careers module.
 */
export const getOpenJobs = (): JobVacancy[] => {
  return jobVacancies.filter((job) => job.isOpen);
};

export const getJobBySlug = (slug?: string): JobVacancy | undefined => {
  if (!slug) return undefined;
  return jobVacancies.find((job) => job.slug.toLowerCase() === slug.toLowerCase());
};

export const getDepartments = (): Department[] => {
  const deps = new Set(jobVacancies.map((job) => job.department));
  return Array.from(deps) as Department[];
};

export const getEmploymentTypes = (): EmploymentType[] => {
  const types = new Set(jobVacancies.map((job) => job.type));
  return Array.from(types) as EmploymentType[];
};

export const getExperienceLevels = (): ExperienceLevel[] => {
  const levels = new Set(jobVacancies.map((job) => job.experience));
  return Array.from(levels) as ExperienceLevel[];
};

export interface JobFilterParams {
  search?: string;
  department?: string;
  location?: string;
  type?: string;
  experience?: string;
}

export const filterJobs = (params: JobFilterParams): JobVacancy[] => {
  return jobVacancies.filter((job) => {
    if (!job.isOpen) return false;

    if (params.search) {
      const q = params.search.toLowerCase();
      const matchesSearch =
        job.title.toLowerCase().includes(q) ||
        job.overview.toLowerCase().includes(q) ||
        job.department.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q) ||
        job.techStack.some((tech) => tech.toLowerCase().includes(q));
      if (!matchesSearch) return false;
    }

    if (params.department && params.department !== "All") {
      if (job.department !== params.department) return false;
    }

    if (params.type && params.type !== "All") {
      if (job.type !== params.type) return false;
    }

    if (params.experience && params.experience !== "All") {
      if (job.experience !== params.experience) return false;
    }

    return true;
  });
};

/**
 * Firebase Firestore Adapter Stub
 * When ready, switch static lookup to Firestore collection queries.
 */
export const fetchJobsFromFirestore = async (): Promise<JobVacancy[]> => {
  // Stored for seamless backend connection:
  // const snapshot = await getDocs(collection(db, "job_vacancies"));
  // return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as JobVacancy));
  return jobVacancies;
};
