# 10LONAZ — Website Content Management Guide

This guide explains how to manually update, add, or remove content across the 10LONAZ website. All content is structured as typed, modular TypeScript files located in the `src/data/` directory.

> [!NOTE]
> All changes made in `src/data/` reflect automatically across the website, navigation, filters, and SEO structured schemas.

---

## 1. How to Update Job Vacancies & Careers

**File:** `src/data/careers.ts`

### Adding a New Job Opening
Add a new object to the `jobVacancies` array:

```typescript
{
  id: "job-006",
  slug: "senior-devops-engineer", // Used in the URL: /careers/senior-devops-engineer
  title: "Senior Cloud & DevOps Engineer",
  department: "Cloud & DevOps", // Must be: "Engineering" | "AI & Data" | "Product & Design" | "Cloud & DevOps" | "QA & Security"
  location: "Remote (Global)",
  type: "Full-time", // "Full-time" | "Part-time" | "Contract"
  experience: "Senior", // "Junior" | "Mid-Level" | "Senior" | "Lead / Principal"
  salary: "$120,000 – $145,000 USD / year",
  postedDate: "2026-11-01",
  deadline: "2026-12-31",
  featured: true, // Displays 'Featured' badge
  isOpen: true, // Set to false to temporarily archive without deleting
  overview: "Role description summarizing objectives and impact...",
  responsibilities: [
    "Architect and automate AWS/Kubernetes infrastructure...",
    "Build zero-downtime CI/CD deployment pipelines...",
  ],
  requirements: [
    "4+ years experience with Docker, Terraform, and Kubernetes...",
  ],
  qualifications: [
    "AWS Certified Solutions Architect is a plus...",
  ],
  benefits: [
    "100% remote work flexibility...",
    "$1,500 home office setup stipend...",
  ],
  techStack: ["AWS", "Kubernetes", "Terraform", "Docker", "Prometheus"],
  customQuestions: [
    {
      id: "iac_portfolio",
      label: "Link to your GitHub profile or Terraform module",
      placeholder: "https://github.com/...",
      type: "text",
      required: true,
    },
  ],
}
```

### Closing a Job
To close a position without deleting its record, simply toggle `isOpen`:
```typescript
isOpen: false
```
The job will automatically disappear from the `/careers` board and filters.

---

## 2. How to Update Articles & Blog Posts

**File:** `src/data/articles.ts`

### Adding an Article
Add an item to the `articles` array:

```typescript
{
  id: "art-5",
  slug: "your-article-slug-here", // Used in URL: /articles/your-article-slug-here
  title: "Your Compelling Article Title",
  subtitle: "Optional explanatory subtitle...",
  excerpt: "Short 1-2 sentence preview for search results and cards.",
  category: "Articles", // "Articles" or "News"
  subcategory: "Cloud Architecture",
  publishDate: "2026-11-10",
  author: authors.alex, // Choose from: authors.alex, authors.sarah, authors.marcus, authors.team
  readTime: "6 min read",
  featured: false,
  coverImage: "https://images.unsplash.com/photo-...",
  tags: ["Cloud", "DevOps", "Kubernetes"],
  metaDescription: "150-character summary for Google search results.",
  content: [
    {
      type: "paragraph",
      text: "Introductory paragraph explaining the context...",
    },
    {
      type: "heading",
      text: "1. The Technical Approach",
    },
    {
      type: "code",
      language: "typescript", // Supports: typescript, javascript, python, java, sql, bash, json, html, css
      text: `export function helloWorld() {\n  return "10lonaz";\n}`,
    },
    {
      type: "quote",
      text: "A highlighted quote or key takeaway.",
    },
    {
      type: "callout",
      text: "Key engineering insight callout box.",
    },
  ],
}
```

---

## 3. How to Update Portfolio Products & Case Studies

**File:** `src/data/products.ts`

### Adding a Portfolio Project
Add an object to the `products` array:

```typescript
{
  slug: "new-enterprise-crm",
  icon: Building2, // Imported from lucide-react
  title: "Global Enterprise CRM Platform",
  description: "Unified lead tracking, client communication, and analytics.",
  overview: "Comprehensive deep-dive overview of the platform...",
  category: "Business", // "SaaS" | "Business" | "Marketplace" | "AI" | "Education" | "E-commerce" | "Mobile Apps" | "Browser Extensions"
  client: "Enterprise Logistics Client",
  industry: "Supply Chain",
  timeline: "4 months",
  teamSize: "5 specialists",
  challenge: "The legacy system could not handle concurrent data sync...",
  scope: ["Architecture Design", "Frontend Development", "Database Migration"],
  features: [
    { title: "Real-time Tracking", description: "WebSockets dispatch engine..." },
  ],
  techStack: ["React", "Node.js", "PostgreSQL", "Redis"],
  outcomes: [
    { metric: "10x", label: "Query Speed Improvement" },
    { metric: "99.99%", label: "Uptime SLA" },
  ],
  livePreviewUrl: "https://demo.10lonaz.com",
}
```

---

## 4. How to Update Services & Capabilities

**File:** `src/data/services.ts`

Each service card and service detail view is driven by the `servicesData` array:

```typescript
{
  id: "svc-custom-software",
  slug: "custom-software-development",
  title: "Custom Software Development",
  shortDescription: "Tailored software engineered to your exact workflows...",
  fullDescription: "Long form in-depth explanation of the service...",
  iconName: "Code2", // Key in iconMap (Code2, Boxes, Globe, Smartphone, Brain, Cloud, etc.)
  features: [
    "Enterprise workflow automation",
    "Legacy system modernization",
  ],
  deliverables: [
    "Full source code ownership",
    "Automated CI/CD pipelines",
  ],
  techStack: ["React", "Node.js", "Python", "PostgreSQL"],
  timeline: "6 – 16 weeks",
  category: "Development", // "Development" | "Architecture & Cloud" | "Design & Strategy" | "Growth & Operations"
  popular: true,
}
```

---

## 5. How to Update FAQs

**File:** `src/data/faqs.ts`

Add or modify items in the `faqData` array:

```typescript
{
  id: "faq-18",
  question: "How does 10lonaz ensure clean code and software maintainability?",
  answer: "We follow strict trunk-based development with required peer code reviews, 80%+ test coverage thresholds, and automated ESLint/Prettier checks in CI.",
  category: "Custom Software", // "General & Company" | "Custom Software" | "SaaS & Products" | "AI & Cloud" | "Pricing & Engagement" | "Security & Maintenance"
  tags: ["code quality", "maintainability", "testing"],
  featured: true, // If true, also displays on the Homepage FAQ section
}
```

---

## 6. How to Update Company Contact Details & Social Media

**File:** `src/data/company.ts`

All email addresses, phone numbers, WhatsApp numbers, office addresses, and social links are centralized in `companyData`:

```typescript
export const companyData: CompanyInfo = {
  name: "10lonaz",
  legalName: "10lonaz Technologies Inc.",
  brandName: "10LONAZ",
  contact: {
    email: "hello@10lonaz.com",
    careersEmail: "careers@10lonaz.com",
    supportEmail: "support@10lonaz.com",
    phone: "+194754833270",
    phoneDisplay: "+1 (94) 754-833-270",
    whatsapp: "+94754833270",
    whatsappLink: "https://wa.me/94754833270?text=Hello...",
    address: {
      line1: "100 Innovation Boulevard",
      line2: "Suite 400",
      city: "San Francisco",
      region: "CA",
      country: "United States",
      postalCode: "94105",
      formatted: "100 Innovation Blvd, Suite 400, San Francisco, CA 94105 & Worldwide Remote",
    },
    workingHours: "Monday – Friday: 9:00 AM – 6:00 PM EST",
  },
  socialLinks: [
    { platform: "GitHub", url: "https://github.com/10lonaz", label: "GitHub", handle: "@10lonaz" },
    { platform: "LinkedIn", url: "https://linkedin.com/company/10lonaz", label: "LinkedIn", handle: "10lonaz" },
    { platform: "YouTube", url: "https://youtube.com/@10lonaz", label: "YouTube", handle: "@10lonaz" },
    { platform: "Instagram", url: "https://instagram.com/10lonaz", label: "Instagram", handle: "@10lonaz" },
    { platform: "X", url: "https://x.com/10lonaz", label: "X (Twitter)", handle: "@10lonaz" },
  ],
  stats: {
    projectsDelivered: "120+",
    clientSatisfaction: "99.2%",
    countriesServed: "15+",
    uptimeSLA: "99.95%",
    yearsInBusiness: "6+",
  },
  siteUrl: "https://10lonaz.com",
};
```

---

## 7. How to Update SEO Metadata & Schema

**Files:** `src/data/seo.ts` and `public/sitemap.xml`

### Updating Global Default Meta Tags
Edit `defaultMetadata` in `src/data/seo.ts`:
```typescript
export const defaultMetadata: PageMetadata = {
  title: "10lonaz — Custom Software, SaaS & AI Solutions",
  description: "Your updated default website description here...",
  keywords: ["software development", "custom SaaS", "AI copilots"],
  canonicalPath: "/",
};
```

### Adding New Pages to XML Sitemap
Whenever you create a new public route or post, add an entry to `public/sitemap.xml`:
```xml
<url>
  <loc>https://10lonaz.com/your-new-page</loc>
  <lastmod>2026-11-10</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

