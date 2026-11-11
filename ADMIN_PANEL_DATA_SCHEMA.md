# 10LONAZ Admin Panel — Data Schema

This schema describes documents an admin dashboard can edit. It is derived from the TypeScript interfaces that already exist, plus the hardcoded page sections that are content rather than layout. It is a proposal for a later implementation. Nothing in `src/` was changed.

Design rules grounded in the current code:

- Keep the same ids and slugs the routes and sitemap already use, so URLs do not change.
- Store icons as `iconName` strings. `ServiceDetail.iconName` already works this way. `CaseStudy.icon` and the About / Careers / Why Choose Us icons are Lucide component references and must be converted to names before they can be saved as JSON.
- Store image fields as URL strings, matching every current image. File upload is a later storage concern, not a new content field.
- Salary, timelines, read time, and stat figures are display strings in the source. Do not split them into numbers the UI does not read.
- Long-form page copy that is not in `src/data` is listed as `pageCopy` documents so it can be edited without duplicating the structured records.
- Locale coverage today is a flat `Record<string, string>` for chrome strings only. Structured records stay single-language until a translation map is added. Do not invent translated services or jobs; they do not exist.

Suggested storage key: one collection (or `localStorage` namespace) per section below. Document id = existing `id` or `slug`.

## 1. `settings` / `company` (single document)

Source: `CompanyInfo` in `src/data/company.ts`.

```ts
interface SocialLink {
  platform: string; // current values: "GitHub" | "LinkedIn" | "YouTube" | "Instagram" | "X"
  url: string;
  label: string;
  handle: string;
}

interface CompanySettings {
  name: string;
  legalName: string;
  brandName: string;
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  foundingYear: number;
  headquarters: string;
  workingModel: string;
  siteUrl: string; // used to build canonical and schema URLs
  contact: {
    email: string;
    careersEmail: string;
    supportEmail: string; // stored, not rendered
    phone: string; // tel: href
    phoneDisplay: string;
    whatsapp: string;
    whatsappLink: string;
    workingHours: string;
    address: {
      line1: string;
      line2: string;
      city: string;
      region: string;
      country: string;
      postalCode: string;
      formatted: string; // the string the footer and contact card show
    };
  };
  socialLinks: SocialLink[];
  stats: {
    projectsDelivered: string;
    clientSatisfaction: string;
    countriesServed: string;
    uptimeSLA: string;
    yearsInBusiness: string;
  };
  knowsAbout: string[]; // today hardcoded inside getOrganizationSchema(), not on CompanyInfo
  logoUrl: string; // today `${siteUrl}/favicon.ico`
  defaultOgImage: string; // today defaultMetadata.ogImage
}
```

Hero stat values are **not** this object. They live in `home.hero` below. An editor can later choose to bind them to `stats`, but the live hero does not.

## 2. `seoDefaults` (single document)

Source: `PageMetadata` and `defaultMetadata` in `src/data/seo.ts`, plus the static tags in `index.html` (those tags duplicate the defaults and must be updated in a build step or left as the no-JS fallback).

```ts
interface SeoDefaults {
  title: string;
  description: string;
  keywords: string[];
  canonicalPath: string;
  ogType: "website" | "article" | "profile";
  ogImage: string;
  noindex?: boolean;
  titleSuffix: string; // SEO.tsx hardcodes " | 10lonaz" when a page passes title
}
```

Per-page overrides are `pageSeo` documents, one per route that calls `<SEO>`:

```ts
interface PageSeo {
  id: string; // "home" | "about" | "services" | "portfolio" | "careers" | "faq" | "reviews" | "articles" | "contact"
  title: string; // passed into SEO; component appends titleSuffix
  description: string;
  canonicalPath: string;
  keywords?: string[];
  ogImage?: string;
}
```

Job, article, and case-study titles are computed from the record (`${job.title} — Careers`, `article.title`, `${product.title} — Case Study`). They should stay derived. Article description prefers `metaDescription`, then excerpt.

`public/sitemap.xml` is a separate artifact. A later generator can emit it from routes + slugs. Do not treat the current XML as the content source: four portfolio `<loc>` values do not exist in `products`.

`public/robots.txt` is a settings text field (user-agent groups and the sitemap URL). It is not structured content.

## 3. `navigation` (single document)

Source: the `navLinks` array in `src/components/Navbar.tsx` and `footerLinks` plus the bottom bar in `src/components/Footer.tsx`.

```ts
interface NavItem {
  id: string;
  labelKey: string; // existing translation key, e.g. "nav.careers"
  labelFallback: string; // English fallback already in Navbar
  path: string;
  badge?: string; // only Careers uses "Hiring"
  visible: boolean;
  order: number;
}

interface FooterLink {
  name: string;
  path: string;
  external?: boolean;
  badge?: string;
}

interface NavigationSettings {
  header: NavItem[];
  headerCta: { label: string; path: string }; // "Get in Touch" → /contact
  logoText: string; // literal "10lonaz" in the header
  footerColumns: {
    companyTitle: string;
    company: FooterLink[];
    servicesTitle: string;
    services: FooterLink[];
    supportTitle: string;
    support: FooterLink[];
    socialHeading: string; // "Follow 10lonaz"
  };
  footerLegalLinks: FooterLink[];
}
```

Social URLs stay on `CompanySettings.socialLinks`. The footer only looks up icons for platform names GitHub, LinkedIn, YouTube, Instagram, and X.

## 4. `translations` and `languages`

Source: `src/lib/translations.ts`.

```ts
type LanguageCode = "en" | "zh" | "ja" | "si" | "ta" | "ar" | "es" | "ml" | "hi";

interface LanguageOption {
  code: LanguageCode;
  name: string;
  flag: string;
  direction: "ltr" | "rtl"; // only ar is rtl in useLanguage.tsx
  enabled: boolean;
}

interface TranslationDictionary {
  locale: LanguageCode;
  entries: Record<string, string>;
}
```

Current keys (all locales): the 39 keys listed in the source audit under Language system. Admin should edit by key, with `en` as the fallback the hook already uses.

Structured content (services, jobs, FAQs, articles, about body) has no locale map. A future optional shape, only if translation work is added later:

```ts
type LocalizedString = { en: string } & Partial<Record<LanguageCode, string>>;
```

Do not require non-English values for records that are English-only today.

## 5. `services` collection

Source: `ServiceDetail`.

```ts
interface Service {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  features: string[];
  deliverables: string[];
  techStack: string[];
  timeline: string;
  category: "Development" | "Architecture & Cloud" | "Design & Strategy" | "Growth & Operations";
  popular?: boolean;
  order: number; // implicit array order today; homepage uses the first 6
}
```

Allowed `iconName` values the Services page can render: `Code2`, `Boxes`, `Globe`, `Smartphone`, `Building2`, `Brain`, `Cloud`, `Palette`, `Plug`, `Search`, `Wrench`, `Compass`. The homepage preview map is smaller (`Code2`, `Boxes`, `Smartphone`, `Cloud`, `Brain`, `Palette`). An unknown name already falls back to `Code2`.

`pageCopy.services` holds the hero badge, H1, intro, filter label “All”, card CTA, and bottom CTA. Category chips should be derived from `Service.category` plus “All” so they cannot drift from the data (today they are a second hardcoded list that happens to match).

Contact `projectTypes` is a separate string list and is not the service catalog.

## 6. `products` collection (portfolio)

Source: `CaseStudy`, `Feature`, `PricingPlan`, with `icon` replaced by `iconName`.

```ts
interface ProductFeature {
  title: string;
  description: string;
}

interface PricingPlan {
  price: string;
  period?: string;
  trialDays?: number;
  buyUrl?: string;
  trialUrl?: string;
  features?: string[];
}

interface Product {
  slug: string; // route /portfolio/:slug — there is no separate id
  iconName: string;
  title: string;
  description: string;
  overview: string;
  category: "SaaS" | "Business" | "Marketplace" | "AI" | "Education" | "E-commerce" | "Mobile Apps" | "Browser Extensions";
  client: string;
  industry: string;
  timeline: string;
  teamSize: string;
  challenge: string;
  scope: string[];
  features: ProductFeature[];
  techStack: string[];
  outcomes: { metric: string; label: string }[];
  testimonial?: { quote: string; author: string; role: string };
  productType?: "paid" | "free" | "extension" | "standard";
  livePreviewUrl?: string;
  sourceCodeUrl?: string;
  extensionUrl?: string;
  pricing?: PricingPlan;
  downloadUrl?: string;
  screenshots?: string[];
  order: number;
  featuredOnHome: boolean; // replaces the hardcoded slug list
}
```

Home featured slugs today: `universal-billing-saas`, `restaurant-management-system`, `healthcare-management-system` (missing record), `ai-business-tools`. Seeding `featuredOnHome` should set true only for slugs that exist.

`productCategories` can be derived from `Product.category`. The page currently uses a fixed tuple that matches the union.

## 7. `jobs` collection and `jobApplications`

Source: `JobVacancy`, `JobQuestion`.

```ts
type Department = "Engineering" | "AI & Data" | "Product & Design" | "Cloud & DevOps" | "QA & Security";
type EmploymentType = "Full-time" | "Part-time" | "Contract";
type ExperienceLevel = "Junior" | "Mid-Level" | "Senior" | "Lead / Principal";

interface JobQuestion {
  id: string;
  label: string;
  placeholder?: string;
  type: "text" | "textarea" | "select";
  options?: string[]; // stored on the type; JobDetails.tsx does not render a dropdown
  required: boolean;
}

interface Job {
  id: string;
  slug: string; // /careers/:slug
  title: string;
  department: Department;
  location: string;
  type: EmploymentType;
  experience: ExperienceLevel;
  salary: string;
  postedDate: string; // ISO date
  deadline: string;
  featured?: boolean;
  isOpen: boolean;
  overview: string;
  responsibilities: string[];
  requirements: string[];
  qualifications: string[];
  benefits: string[];
  techStack: string[];
  customQuestions?: JobQuestion[];
  order: number;
}
```

Applications do not exist as stored records. The form payload that a future inbox would save, taken from `JobDetails` state:

```ts
interface JobApplication {
  id: string;
  jobId: string;
  jobSlug: string;
  jobTitle: string;
  submittedAt: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  experienceYears: string;
  experienceSummary: string;
  education: string;
  skills: string;
  coverLetter: string;
  privacyConsent: boolean;
  customAnswers: Record<string, string>;
  resume?: {
    fileName: string;
    contentType: string;
    sizeBytes: number;
    storagePath?: string; // empty until Storage upload exists
  };
  source: "mailto-staged"; // current behavior; later "firestore"
  summaryText: string; // the plain-text body built in handleSubmit
}
```

Validation to preserve: email must include `@`; required fixed fields are fullName, email, phone, location, experienceYears, skills, privacyConsent; custom questions honor `required`; resume extension `.pdf` | `.doc` | `.docx` and size ≤ 5 MB when a file is present. Resume is optional in current validation.

`pageCopy.careers` holds `cultureBenefits[]` (`iconName`, `title`, `description`) and the two general-application mailto subjects.

## 8. `inquiries` (contact)

Source: `formData` in `src/pages/Contact.tsx`. No stored collection exists.

```ts
interface ContactInquiry {
  id: string;
  submittedAt: string;
  name: string;
  email: string;
  phone: string;
  projectType: string;
  budget: string;
  timeline: string;
  message: string;
  source: "mailto-staged";
  summaryText: string;
}

interface ContactFormOptions {
  projectTypes: string[]; // 9 literals in Contact.tsx
  budgetRanges: string[]; // 6 literals
  defaultProjectType: string;
  defaultBudget: string;
  defaultTimeline: string;
}
```

Validation to preserve: name required, email contains `@`, message trim length ≥ 10. `?service=` overrides the project type when present.

## 9. `faqs`

Source: `FAQItem`.

```ts
type FAQCategory =
  | "General & Company"
  | "Custom Software"
  | "SaaS & Products"
  | "AI & Cloud"
  | "Pricing & Engagement"
  | "Security & Maintenance";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: FAQCategory;
  tags?: string[];
  featured?: boolean; // homepage section and homepage FAQ schema
  order: number;
}
```

17 current ids `faq-01` … `faq-17`. Homepage and the homepage FAQ schema use `featured === true` only. `/faq` search is question + answer + tags, optional category.

## 10. `testimonials` and `clientLogos`

```ts
interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
  project: string;
  category?: string;
  featured?: boolean;
  verified?: boolean;
  order: number;
}

interface ClientLogo {
  id: string;
  name: string; // current data is a name, not an image
  imageUrl?: string;
  order: number;
}
```

Review filter chips are a separate list in `Reviews.tsx` and currently drop categories that exist on records (`Education`, `Logistics`). The admin list of filter chips should be the distinct `category` values, with “All” added by the page.

`featured` is stored but neither the homepage marquee nor the reviews grid filters on it. Keep the field; do not change that behavior until the site is intentionally updated.

## 11. `authors` and `articles`

```ts
interface Author {
  id: string; // current keys: alex, sarah, marcus, team
  name: string;
  role: string;
  avatar: string;
  bio: string;
}

type ContentBlock =
  | { type: "paragraph" | "heading" | "subheading" | "quote" | "callout"; text: string }
  | { type: "list"; items: string[] }
  | { type: "code"; text: string; language: string }
  | { type: "image"; url: string; caption?: string; text?: string };

interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  category: "Articles" | "News";
  subcategory?: string;
  publishDate: string;
  updatedDate?: string;
  authorId: string; // normalize the embedded author object to an id
  readTime: string;
  featured?: boolean;
  coverImage: string;
  tags: string[];
  content: ContentBlock[];
  metaDescription?: string;
  relatedSlugs?: string[];
}
```

When seeding, copy `author` onto `authorId` using the `authors` record key. The public page can still receive a denormalized author so `getArticleSchema` keeps `author.name`, `author.role`, and `author.avatar`.

Code languages the renderer supports: javascript, typescript, python, java, html, css, sql, json, bash (see `CodeBlock.tsx`). Other languages render as plain text.

The unused JSON file under `src/data/articles/` must not be seeded as a seventh article unless an editor explicitly imports it. Its slug and field names differ from `art-1`.

## 12. `pageCopy` documents

These strings are editable content trapped in components. One document per surface:

### `pageCopy.home.hero`

Badge, title, subtitle, two CTA labels, two CTA paths (`/contact`, `/services`), four stat `{ value, label }` pairs. Labels correspond to translation keys; values are the hardcoded `500+`, `300+`, `10+`, `4.9/5`.

### `pageCopy.home.servicesPreview`

Heading, subtitle, card link label, view-all label, view-all path, `previewCount` (6).

### `pageCopy.home.portfolioPreview`

Heading, subtitle, view-all label. Featured flags live on `Product.featuredOnHome`.

### `pageCopy.home.testimonialsPreview`

Heading, subtitle.

### `pageCopy.home.whyChooseUs`

Heading, subtitle, and:

```ts
interface WhyFeature {
  iconName: string; // CheckCircle2, Zap, Users, Shield, Globe2, HeartHandshake
  title: string;
  description: string;
  order: number;
}
```

### `pageCopy.home.faq`

Badge, heading, subtitle, CTA label, CTA path `/contact`. Questions themselves are `FAQ` records.

### `pageCopy.about`

SEO is in `pageSeo`. Body:

- badge, h1, h1Accent
- stat labels (four)
- missionTitle, missionBody, visionTitle, visionBody
- whoWeAreBadge, whoWeAreHeading, whoWeAreParagraphs[], whoWeAreBullets[]
- whoWeAreImageUrl, whoWeAreImageAlt
- valuesBadge, valuesHeading, valuesIntro, values[] `{ iconName, title, description }`
- capabilitiesBadge, capabilitiesHeading, capabilitiesIntro, capabilities[] `{ title, description }`, capabilitiesCtaLabel, capabilitiesCtaPath
- timelineBadge, timelineHeading, timelineIntro, milestones[] `{ year, title, event }`
- ctaHeading, ctaBody, ctaPrimaryLabel, ctaPrimaryPath, ctaSecondaryLabel, ctaSecondaryPath

### `pageCopy.services`, `pageCopy.portfolio`, `pageCopy.careers`, `pageCopy.faqPage`, `pageCopy.reviews`, `pageCopy.articles`, `pageCopy.contact`, `pageCopy.notFound`, `pageCopy.login`, `pageCopy.chat`

Each stores the hero badge, headings, and intro paragraphs that are currently literals in that page, plus chat welcome text and `suggestedPrompts[]` for the assistant. Login bullets are four strings and are not a real product feature; editing them does not create a portal.

Chat reply rules are code (`handleSendMessage` keyword branches), not content documents. Leave them out of the schema until a real assistant configuration is built.

## 13. Relationships

```text
CompanySettings.siteUrl
  └─ used by SEO canonical, Organization, WebSite, JobPosting, Article schema

CompanySettings.contact.email        → Contact mailto, Footer, FAQ mailto
CompanySettings.contact.careersEmail → JobDetails mailto, Careers general application
CompanySettings.contact.whatsappLink → Footer, Contact cards
CompanySettings.socialLinks[].url    → Footer icons, Organization.sameAs

Service.slug → /services#{slug} only
Service.title → optional ?service= on /contact (string match, not id)

Product.slug → /portfolio/:slug
Product.testimonial is embedded, not a Testimonial id
Product.featuredOnHome → Homepage PortfolioPreview

Job.slug → /careers/:slug
Job.customQuestions → JobApplication.customAnswers keys
Job.isOpen → hidden from Careers list and from filterJobs
JobApplication.jobId → Job.id

FAQ.featured → homepage FAQ and homepage FAQPage schema
FAQ.category → FAQ page chips

Testimonial.category → Reviews chips (chips should be derived)
clientLogos[].name has no foreign key to Testimonial.company (names currently match)

Author.id → Article.authorId
Article.slug → /articles/:slug
Article.relatedSlugs[] → other Article.slug
Article.tags → Articles page tag filter
Article.category → Articles page category filter (Articles | News) and /articles?category=News footer link

TranslationDictionary entries
  nav.*  → Navbar labels
  hero.* → Hero (labels and sentences)
  other keys → stored but unread by current components

pageSeo.id → the matching page component's <SEO> props
```

There is no foreign key from footer service links to `Service.slug`. They are plain labels pointing at `/services`.

## 14. What not to put in the content schema

- Tailwind classes, motion timings, breakpoints
- Radix `src/components/ui/*`
- Theme (`next-themes`) and `cursor-preferences`
- Prism language grammars
- Firebase mock fallbacks in `src/lib/firebase.ts`
- The commented Firestore snippet inside `fetchJobsFromFirestore`

## 15. Local-first document shape for a later migration

Use the same JSON shape in `localStorage` and in Firestore so a switch is a repository change.

```ts
interface ContentBundle {
  version: 1;
  updatedAt: string;
  company: CompanySettings;
  seoDefaults: SeoDefaults;
  pageSeo: PageSeo[];
  navigation: NavigationSettings;
  languages: LanguageOption[];
  translations: TranslationDictionary[];
  services: Service[];
  products: Product[];
  jobs: Job[];
  faqs: FAQ[];
  testimonials: Testimonial[];
  clientLogos: ClientLogo[];
  authors: Author[];
  articles: Article[];
  contactFormOptions: ContactFormOptions;
  pageCopy: Record<string, unknown>;
}
```

Submissions (`ContactInquiry`, `JobApplication`) are a different bundle. They are append-only operational data, not seeded from the marketing modules, because the site does not store them today.

Firestore collection names that match the existing stub comment and the domain:

| Collection | Document id |
| :--- | :--- |
| `settings` | `company`, `seo`, `navigation`, `contactForm` |
| `translations` | locale code |
| `services` | `Service.id` |
| `products` | `Product.slug` |
| `job_vacancies` | `Job.id` (the name already used in the comment in `careers.ts`) |
| `job_applications` | generated id |
| `inquiries` | generated id |
| `faqs` | `FAQ.id` |
| `testimonials` | `Testimonial.id` |
| `authors` | `Author.id` |
| `articles` | `Article.id` |
| `page_copy` | surface id (`about`, `home.hero`, …) |

Storage paths, when uploads are added: `images/{collection}/{id}/{filename}` and `resumes/{applicationId}/{filename}`. Until then, image fields remain the Unsplash (or other) URLs already in the data files.
