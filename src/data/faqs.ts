import { readContentOverride } from "@/admin/contentRepository";

/**
 * 10LONAZ — Frequently Asked Questions Data
 * Categorized, searchable, and structured for AEO, GEO, and Schema.org FAQPage.
 */

export type FAQCategory =
  | "General & Company"
  | "Custom Software"
  | "SaaS & Products"
  | "AI & Cloud"
  | "Pricing & Engagement"
  | "Security & Maintenance";

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: FAQCategory;
  tags?: string[];
  featured?: boolean;
  order?: number;
}

const seedFaqData: FAQItem[] = [
  // General & Company
  {
    id: "faq-01",
    question: "What makes 10lonaz different from other software development agencies?",
    answer:
      "10lonaz blends senior-only product engineering with deep domain expertise in multi-tenant SaaS and modern AI pipelines. We do not use bloated junior teams or opaque ticketing systems. Clients work directly with senior architects and developers who take end-to-end ownership, ensuring rapid delivery, clean maintainable code, and high business ROI.",
    category: "General & Company",
    tags: ["about", "differentiation", "value"],
    featured: true,
  },
  {
    id: "faq-02",
    question: "Where is 10lonaz located and how does the remote team operate?",
    answer:
      "10lonaz operates as a modern distributed global software company with leadership and core engineering distributed across North America, Europe, and Asia-Pacific. We leverage asynchronous collaboration, transparent sprint tracking, and daily standup overlap to partner smoothly with clients across any global timezone.",
    category: "General & Company",
    tags: ["location", "remote", "team", "timezones"],
    featured: false,
  },
  {
    id: "faq-03",
    question: "What is your typical project onboarding timeline?",
    answer:
      "Most projects kick off within 3 to 7 business days following requirement alignment and contract execution. Our onboarding includes an architecture discovery session, codebase / technical audit (if existing), environment setup, and backlog sprint definition.",
    category: "General & Company",
    tags: ["timeline", "onboarding", "kickoff"],
    featured: true,
  },

  // Custom Software
  {
    id: "faq-04",
    question: "What types of custom software solutions do you develop?",
    answer:
      "We design and build bespoke web applications (React, Next.js, Vue), high-performance cross-platform mobile apps (React Native, Flutter), complex backend APIs (Node.js, Python, Go), enterprise internal tools, workflow automation engines, and custom database architectures.",
    category: "Custom Software",
    tags: ["web", "mobile", "custom", "fullstack"],
    featured: true,
  },
  {
    id: "faq-05",
    question: "Can 10lonaz modernize or rescue our existing codebase?",
    answer:
      "Yes. A significant portion of our work involves refactoring legacy applications, migrating monoliths to microservices or modern modular monoliths, upgrading frameworks, resolving performance bottlenecks, and repairing technical debt without halting ongoing business operations.",
    category: "Custom Software",
    tags: ["legacy", "modernization", "refactoring", "audit"],
    featured: false,
  },
  {
    id: "faq-06",
    question: "Do you build native mobile apps or cross-platform apps?",
    answer:
      "We build both, selecting the best fit for your budget, timeline, and feature requirements. For 90% of business applications, React Native or Flutter delivers 95%+ shared codebase efficiency with true 60fps native performance. For hardware-intensive or platform-specific apps, we engineer native Swift (iOS) and Kotlin (Android).",
    category: "Custom Software",
    tags: ["mobile", "ios", "android", "flutter", "react native"],
    featured: false,
  },

  // SaaS & Products
  {
    id: "faq-07",
    question: "How do you handle multi-tenant SaaS architecture and data isolation?",
    answer:
      "We architect SaaS systems using proven tenant isolation patterns based on your compliance needs: pooled multi-tenant schemas with row-level security (RLS) for cost efficiency, or siloed schema-per-tenant / database-per-tenant models for enterprise, HIPAA, and SOC2 compliance. All systems include role-based access control (RBAC), subscription metering, and audit logs.",
    category: "SaaS & Products",
    tags: ["saas", "multi-tenant", "security", "database"],
    featured: true,
  },
  {
    id: "faq-08",
    question: "Can we license or white-label pre-built 10lonaz products?",
    answer:
      "Yes. Our portfolio includes production-ready software solutions—such as our Universal Billing SaaS, Restaurant Management POS, Hotel Booking Engine, and AI Assistant Extensions—available for commercial licensing, customization, and dedicated deployment on your private cloud.",
    category: "SaaS & Products",
    tags: ["licensing", "white-label", "portfolio", "turnkey"],
    featured: false,
  },

  // AI & Cloud
  {
    id: "faq-09",
    question: "What AI solutions can 10lonaz build for our company?",
    answer:
      "We engineer enterprise-grade LLM copilots, Retrieval-Augmented Generation (RAG) systems over proprietary documents, automated customer support agents, document parsing pipelines, multimodal computer vision tools, and custom fine-tuned models with guardrails against hallucinations.",
    category: "AI & Cloud",
    tags: ["ai", "llm", "rag", "agents", "automation"],
    featured: true,
  },
  {
    id: "faq-10",
    question: "How do you protect client data and prevent leaks when using AI models?",
    answer:
      "We adhere to strict zero-data-retention principles. Client data is never sent to public models for training. We deploy private VPC endpoints, self-hosted open-source models (Llama 3, Mistral) on dedicated GPU instances, or enterprise zero-retention agreements with Azure OpenAI and Anthropic, backed by PII anonymization layers.",
    category: "AI & Cloud",
    tags: ["security", "ai privacy", "compliance", "gdpr"],
    featured: false,
  },
  {
    id: "faq-11",
    question: "Which cloud platforms and DevOps tools do you support?",
    answer:
      "We are cloud-agnostic with deep production expertise in AWS, Google Cloud Platform (GCP), Microsoft Azure, and modern edge platforms like Cloudflare and Vercel. Our DevOps stack features Terraform/OpenTofu, Docker, Kubernetes, GitHub Actions, and Prometheus/Grafana observability.",
    category: "AI & Cloud",
    tags: ["cloud", "devops", "aws", "gcp", "azure", "docker", "kubernetes"],
    featured: false,
  },

  // Pricing & Engagement
  {
    id: "faq-12",
    question: "What pricing models does 10lonaz offer?",
    answer:
      "We offer three flexible models: 1) Fixed-Price Projects for well-defined scopes and MVPs; 2) Dedicated Engineering Teams / Staff Augmentation for continuous product iteration; and 3) Time & Materials / Retainer models for exploratory phases, architecture audits, and ongoing support.",
    category: "Pricing & Engagement",
    tags: ["pricing", "cost", "contracts", "fixed-price"],
    featured: true,
  },
  {
    id: "faq-13",
    question: "Who owns the intellectual property (IP) and source code?",
    answer:
      "You own 100% of the custom intellectual property, source code, designs, and database assets upon payment completion. We deliver complete Git repositories, design source files, and deployment runbooks with zero vendor lock-in.",
    category: "Pricing & Engagement",
    tags: ["ip", "ownership", "rights", "copyright"],
    featured: true,
  },
  {
    id: "faq-14",
    question: "Do you sign Non-Disclosure Agreements (NDAs)?",
    answer:
      "Absolutely. We routinely sign bilateral or client-provided NDAs before discussing any proprietary business ideas, data structures, or code repositories.",
    category: "Pricing & Engagement",
    tags: ["nda", "confidentiality", "legal"],
    featured: false,
  },

  // Security & Maintenance
  {
    id: "faq-15",
    question: "Do you provide ongoing post-launch maintenance and SLA support?",
    answer:
      "Yes. We offer continuous maintenance tiers that include 24/7 uptime monitoring, security patch management, bug fixes, third-party API deprecation updates, automated backups, and monthly performance optimizations.",
    category: "Security & Maintenance",
    tags: ["maintenance", "support", "sla", "monitoring"],
    featured: true,
  },
  {
    id: "faq-16",
    question: "How do you ensure application security and compliance?",
    answer:
      "Security is baked into our development lifecycle (DevSecOps). We follow OWASP Top 10 guidelines, implement automated dependency vulnerability scanning, enforce parameterized queries and sanitization, configure TLS 1.3 encryption in transit, and use AES-256 encryption at rest.",
    category: "Security & Maintenance",
    tags: ["security", "owasp", "encryption", "compliance"],
    featured: false,
  },
  {
    id: "faq-17",
    question: "What happens if a critical bug occurs after deployment?",
    answer:
      "All fixed-price deliverables include an initial warranty period (typically 30–60 days) covering bug fixes at zero additional cost. For teams on our support retainers, our SLA guarantees response within 1 hour for critical priority issues.",
    category: "Security & Maintenance",
    tags: ["warranty", "bugs", "sla", "incident response"],
    featured: false,
  },
];

export const faqData = readContentOverride<FAQItem[]>("faqs", seedFaqData);

export const faqCategories: FAQCategory[] = [
  "General & Company",
  "Custom Software",
  "SaaS & Products",
  "AI & Cloud",
  "Pricing & Engagement",
  "Security & Maintenance",
];

export const getAllFaqs = (): FAQItem[] => faqData;

export const getFeaturedFaqs = (): FAQItem[] => faqData.filter((f) => f.featured);

export const searchFaqs = (query: string, category?: string): FAQItem[] => {
  const q = query.trim().toLowerCase();
  return faqData.filter((faq) => {
    if (category && category !== "All" && faq.category !== category) {
      return false;
    }
    if (!q) return true;
    return (
      faq.question.toLowerCase().includes(q) ||
      faq.answer.toLowerCase().includes(q) ||
      faq.tags?.some((t) => t.toLowerCase().includes(q))
    );
  });
};
