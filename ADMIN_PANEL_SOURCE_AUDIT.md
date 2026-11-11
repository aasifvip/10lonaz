# 10LONAZ Admin Panel — Source Code Audit

Audit date: 2026-11-10. Scope is the existing Vite + React + TypeScript website in this repository. No application code was changed for this audit, and no admin dashboard was implemented.

The public site is a client-rendered SPA. Almost all marketing content is compiled into the JavaScript bundle from typed modules under `src/data` and from strings written directly inside page components. There is no CMS, no authenticated admin, and no persistence for contact or job submissions.

## 1. Stack and runtime

| Layer | What exists |
| :--- | :--- |
| App | React 18.3.1, TypeScript 5.8.3, Vite 5.4.19 (`package.json` name `10lonaz-company-website`) |
| Routing | `react-router-dom` 6.30 in `src/App.tsx` |
| Styling | Tailwind CSS 3.4, CSS variables, `next-themes` (system / light / dark) |
| UI | Radix primitives in `src/components/ui`, Lucide icons, Framer Motion page transitions |
| Forms | Local React state. `react-hook-form` and `zod` are dependencies and are not used by Contact or job applications |
| Data fetching | TanStack Query is mounted in `src/App.tsx` with a 5-minute stale time. No `useQuery` call exists in `src` |
| Backend SDK | `firebase` 12.17 is initialized in `src/lib/firebase.ts`. Firestore and Storage instances are exported and never read or written by a page |
| Email SDK | `@emailjs/browser` is in `package.json` and is not imported anywhere |
| Hosting config | `firebase.json` hosts the Vite `dist` folder as a SPA rewrite to `/index.html`. No Functions, Auth, Firestore, or Storage blocks |

Entry: `index.html` → `src/main.tsx` → `src/App.tsx`.

Global chrome mounted for every route: `ThemeProvider`, `LanguageProvider`, tooltips, toasters, `ScrollToTop`, `CustomCursor`, `AIChatButton`.

## 2. Routes that exist

Defined in `src/App.tsx`.

| Path | Component | Purpose |
| :--- | :--- | :--- |
| `/` | `src/pages/Index.tsx` | Homepage |
| `/about` | `src/pages/About.tsx` | Company story |
| `/services` | `src/pages/Services.tsx` | All 12 services on one page, hash `#slug` |
| `/portfolio` | `src/pages/Portfolio.tsx` | Product / case-study grid |
| `/portfolio/:slug` | `src/pages/CaseStudy.tsx` | One product |
| `/careers` | `src/pages/Careers.tsx` | Open roles and culture |
| `/careers/:slug` | `src/pages/JobDetails.tsx` | Role detail and application form |
| `/faq` | `src/pages/FAQPage.tsx` | Full FAQ |
| `/reviews` | `src/pages/Reviews.tsx` | Testimonials |
| `/articles` | `src/pages/Articles.tsx` | Article and news index |
| `/articles/:slug` | `src/pages/ArticleDetails.tsx` | Article body |
| `/contact` | `src/pages/Contact.tsx` | Inquiry form and contact cards |
| `/login` | `src/pages/Login.tsx` | Static “client portal coming soon” card. No form, no auth |
| `*` | `src/pages/NotFound.tsx` | 404. Logs the path with `console.error` |

There is no `/admin` route and no service-detail route. Service cards link to `/services#${slug}`.

`/login` is a marketing placeholder, not an admin entry point. The bullet list (project progress, invoices, team chat, downloads) is hardcoded and is not backed by data.

## 3. Where content lives

| Kind | Location | How the site uses it |
| :--- | :--- | :--- |
| Company profile, contact, social, stats, site URL | `src/data/company.ts` → `companyData` | Footer, Contact, Careers mailto, SEO schema generators |
| Services | `src/data/services.ts` → `servicesData` (12 records) | Homepage preview (first 6), Services page, Service JSON-LD |
| Portfolio | `src/data/products.ts` → `products` (8 records) | Portfolio, case study, homepage featured slugs |
| Jobs | `src/data/careers.ts` → `jobVacancies` (5 records, all `isOpen: true`) | Careers, job page, JobPosting JSON-LD |
| FAQ | `src/data/faqs.ts` → `faqData` (17 records) | Homepage featured subset, `/faq`, FAQPage JSON-LD |
| Reviews | `src/data/testimonials.ts` → `testimonialsData` (8) and `clientLogos` (8 names) | Homepage marquee, Reviews page |
| Articles and authors | `src/data/articles.ts` → `articles` (6) and `authors` (4) | Articles index and detail, BlogPosting JSON-LD |
| SEO defaults and schema builders | `src/data/seo.ts` | `SEO` component and page-level schema props |
| UI translations | `src/lib/translations.ts` | Language switcher. Consumed only by `Navbar` and `Hero` |
| Page chrome copy | Inside each page and home section component | English strings that are not in the data modules |
| Static SEO shell | `index.html` | Title, description, keywords, canonical, Open Graph, Twitter, favicon, Inter font |
| Crawling | `public/robots.txt`, `public/sitemap.xml` | Hand-written. Sitemap is not generated from the data modules |
| Orphan JSON | `src/data/articles/building-scalable-saas-architecture.json` | Not imported by `articles.ts` or any page |
| Images | Remote Unsplash URLs and one About image URL. `public/` has no image library besides what Vite serves for `favicon.ico` (referenced; the file was not present in the `public/` glob of `sitemap.xml` and `robots.txt` only) | `<img>` and meta `og:image` |
| User-only browser state | `localStorage` keys `language` and `cursor-preferences` | Visitor language and cursor widget. Not website content |

Nothing is loaded from an API at runtime. `fetchJobsFromFirestore` in `src/data/careers.ts` returns the static array. The Firestore query is commented out.

## 4. Homepage (`/`)

`src/pages/Index.tsx` composes, in order:

1. `SEO` — title `Custom Software, SaaS & AI Solutions`, description hardcoded in the page, schemas from `getOrganizationSchema()`, `getWebSiteSchema()`, and `getFAQPageSchema(getFeaturedFaqs())`.
2. `Navbar`, then `Hero`, `ServicesPreview`, `PortfolioPreview`, `TestimonialsPreview`, `WhyChooseUs`, `FAQ`, `Footer`.

### 4.1 Hero — `src/components/home/Hero.tsx`

Translated through `t()`:

- `hero.badge`, `hero.title`, `hero.subtitle`
- `hero.cta.quote` → link `/contact`
- `hero.cta.services` → link `/services`
- Labels `hero.stats.projects`, `hero.stats.clients`, `hero.stats.experience`, `hero.stats.rating`

Stat **values** are hardcoded in the component and do not read `companyData.stats`:

| Displayed value | Label key | `companyData.stats` counterpart |
| :--- | :--- | :--- |
| `500+` | projects | `projectsDelivered` is `120+` |
| `300+` | clients | no matching field |
| `10+` | experience | `yearsInBusiness` is `6+` |
| `4.9/5` | rating | no matching field (`uptimeSLA` and `clientSatisfaction` are unused here) |

Floating icons (`Code2`, `Database`, `Cloud`, `Cpu`, `Terminal`, `Globe`, `Boxes`) and their positions are layout, not content.

### 4.2 Services preview — `src/components/home/ServicesPreview.tsx`

- Heading and subtitle are hardcoded English: “Our Core Services” / “Full-stack software engineering…”. Translation keys `services.title`, `services.subtitle`, and `services.viewAll` exist and are unused.
- Cards are `servicesData.slice(0, 6)`: title, short description, `iconName` (only `Code2`, `Boxes`, `Smartphone`, `Cloud`, `Brain`, `Palette` are mapped; others fall back to `Code2`).
- Card link: `/services#${slug}`.
- Button text “View All 12 Engineering Practices” is hardcoded, so the count will not follow the array length.

### 4.3 Portfolio preview — `src/components/home/PortfolioPreview.tsx`

Hardcoded featured slugs:

1. `universal-billing-saas` — exists
2. `restaurant-management-system` — exists
3. `healthcare-management-system` — **does not exist** in `products`. The card is dropped by `.filter(Boolean)`
4. `ai-business-tools` — exists

The homepage therefore shows three cards, not four. Heading, subtitle, and “view project” copy are hardcoded. Translation keys `portfolio.*` are unused.

### 4.4 Testimonials preview — `src/components/home/TestimonialsPreview.tsx`

Uses the full `testimonialsData` array (not only `featured`) in an auto-scrolling marquee. Fields rendered: `avatar`, `name`, `role`, `company`, `content`, `rating`. Heading copy is hardcoded. `testimonials.title` and `testimonials.subtitle` are unused. `getFeaturedTestimonials()` is unused by this component.

### 4.5 Why choose us — `src/components/home/WhyChooseUs.tsx`

Six hardcoded features: icon component, title, description. Section title “Why Choose Us” and subtitle “Your Vision, Our Code — Let's Build Something Extraordinary” are hardcoded. Keys `why.title` and `why.subtitle` exist in translations and are unused; the English translation subtitle is a different sentence (“We deliver excellence through innovation and dedication”).

### 4.6 Homepage FAQ — `src/components/home/FAQ.tsx`

Renders `getFeaturedFaqs()` (`featured: true`). Eight records: `faq-01`, `faq-03`, `faq-04`, `faq-07`, `faq-09`, `faq-12`, `faq-13`, `faq-15`. Section badge, title, subtitle, and CTA are hardcoded. Keys `faq.title`, `faq.subtitle`, `faq.cta` are unused. Anchor `id="faq"` with `scroll-mt-20`.

## 5. About (`/about`)

`src/pages/About.tsx`.

From `companyData`: `fullDescription`, and the four stats `projectsDelivered`, `clientSatisfaction`, `countriesServed`, `uptimeSLA` with hardcoded labels “Projects Delivered”, “Satisfaction Rate”, “Countries Reached”, “Uptime SLA”. `yearsInBusiness`, `tagline`, `headquarters`, and `workingModel` are not rendered on this page.

Hardcoded arrays inside the file (not exported, not shared):

- `capabilities` — 9 items of `title` + `description`
- `values` — 4 items of Lucide icon + `title` + `description`
- `milestones` — 6 items of `year`, `title`, `event` (2020 through “2025 – 2026”)

Also hardcoded: badge “About 10lonaz”, H1 “Software, SaaS & AI — Engineered for Growth”, mission paragraph, vision paragraph, “Who We Are” copy and three check-list lines, team photo URL `https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop` with alt “10lonaz engineering team collaboration”, section headings, CTA “Schedule a Free Technical Consultation” → `/contact` and “Explore Open Roles” → `/careers`.

SEO title and description are page literals. Schemas: Organization + breadcrumb Home / About.

There is no team-member list, no office photo gallery beyond that one image, and no separate CMS model for mission or vision.

## 6. Services (`/services`)

Data type `ServiceDetail` in `src/data/services.ts`.

| Field | Used for |
| :--- | :--- |
| `id` | React key |
| `slug` | In-page anchor `id` and homepage hash link. No `/services/:slug` route |
| `title`, `shortDescription`, `fullDescription` | Cards |
| `iconName` | Mapped in `src/pages/Services.tsx` to Code2, Boxes, Globe, Smartphone, Building2, Brain, Cloud, Palette, Plug, Search, Wrench, Compass |
| `features`, `deliverables`, `techStack` | String lists |
| `timeline` | Display string, not a structured duration |
| `category` | Union of four labels. Filter chips are a duplicate hardcoded array in the page, not derived from the data |
| `popular` | Optional badge. Set on custom software, SaaS, mobile, AI, maintenance |

Helpers: `getAllServices`, `getServiceBySlug`. `getServiceBySlug` is not used by a route.

Page chrome that is not in the data file: hero badge, H1, intro, category chip “All”, CTA into `/contact?service=${title}`, and SEO title/description. Service JSON-LD is generated only for `servicesData.slice(0, 5)`.

Inventory (slug → category):

1. `custom-software-development` — Development — popular
2. `saas-product-development` — Development — popular
3. `web-application-development` — Development
4. `mobile-app-development` — Development — popular
5. `business-management-systems` — Development
6. `ai-solutions-llm-copilots` — Architecture & Cloud — popular
7. `cloud-devops-infrastructure` — Architecture & Cloud
8. `ui-ux-design-systems` — Design & Strategy
9. `api-development-system-integration` — Development
10. `seo-website-optimization` — Growth & Operations
11. `software-maintenance-support` — Growth & Operations — popular
12. `it-consulting-tech-advisory` — Design & Strategy

Footer “Services” links in `src/components/Footer.tsx` are six hardcoded labels that all point at `/services` with no hash.

## 7. Portfolio and case studies

Type `CaseStudy` in `src/data/products.ts`. Icons are imported Lucide components (`icon: LucideIcon`), which cannot be stored as JSON without converting them to an icon name string the way services already do.

Eight products:

| Slug | Category | `productType` | Notable optional fields |
| :--- | :--- | :--- | :--- |
| `universal-billing-saas` | SaaS | `paid` | `pricing`, `livePreviewUrl`, `screenshots`, `testimonial` |
| `ai-page-summarizer-extension` | Browser Extensions | `extension` | `extensionUrl`, `livePreviewUrl`, `screenshots` |
| `fitness-tracker-mobile-app` | Mobile Apps | `free` | `downloadUrl`, `livePreviewUrl`, `screenshots` |
| `ai-business-tools` | AI | `paid` | `pricing`, `livePreviewUrl`, `screenshots` |
| `e-commerce-platform` | E-commerce | `paid` | `pricing`, `livePreviewUrl`, `screenshots` |
| `school-lms-platform` | Education | `free` | `downloadUrl`, `livePreviewUrl`, `screenshots` |
| `travel-booking-platform` | Marketplace | `standard` | `livePreviewUrl`, `screenshots` |
| `restaurant-management-system` | Business | `paid` | `pricing`, `livePreviewUrl`, `screenshots` |

Shared fields on every record: `slug`, `icon`, `title`, `description`, `overview`, `category`, `client`, `industry`, `timeline`, `teamSize`, `challenge`, `scope[]`, `features[]` (`title` + `description`), `techStack[]`, `outcomes[]` (`metric` + `label`).

Optional and currently unused on every record: `sourceCodeUrl`. `PricingPlan.features` is present on paid products. `screenshots` are Unsplash URLs.

`productCategories` is a const tuple: All, SaaS, Business, Marketplace, AI, Education, E-commerce, Mobile Apps, Browser Extensions. The Portfolio page filters with this list.

`CaseStudy.tsx` reads `getProductBySlug`. Unknown slugs should be treated as missing content (the page should be checked before an admin “unpublish” hides a slug that is still linked). Buttons rendered only when URLs exist: Buy (`pricing.buyUrl`), trial (`pricing.trialUrl` + `trialDays`), download (`downloadUrl`), live preview (`livePreviewUrl`), source (`sourceCodeUrl`). Extension products show `extensionUrl`.

`public/sitemap.xml` portfolio URLs do not match these slugs except `universal-billing-saas`. The sitemap lists `ai-assistant-suite`, `restaurant-management-pos`, `hotel-booking-engine`, and `telehealth-consultation-app`, none of which resolve in `getProductBySlug`. Live products missing from the sitemap: the extension, FitPulse, AI copilot, e-commerce, LMS, travel booking, and restaurant POS.

## 8. Careers and applications

### 8.1 Listing — `src/pages/Careers.tsx`

Reads `jobVacancies` directly. Hides `isOpen === false`. Search matches title, overview, department, location, and tech stack. Filters: department, employment type, experience. Options come from `getDepartments`, `getEmploymentTypes`, `getExperienceLevels`, which only return values present on current jobs.

`filterJobs()` in `src/data/careers.ts` accepts a `location` filter. The Careers page does not call `filterJobs` and has no location dropdown. Location is searchable as text only.

`Department` union: Engineering, AI & Data, Product & Design, Cloud & DevOps, QA & Security. All five appear on a job.

`EmploymentType` union includes Part-time and Contract. Every current job is Full-time, so those options never appear in the filter until a job uses them.

`ExperienceLevel` includes Junior. No current job is Junior. Lead / Principal, Senior, and Mid-Level are used.

Culture block `cultureBenefits` (six items: icon, title, description) is hardcoded in the page, separate from each job’s `benefits[]`.

Empty state and “general application” links are `mailto:careers@10lonaz.com` via `companyData.contact.careersEmail`, with hardcoded subjects `General Application - Software Engineer` and `General Application - Senior Talent`.

### 8.2 The five vacancies

| id | slug | department | experience | featured |
| :--- | :--- | :--- | :--- | :--- |
| `job-001` | `senior-full-stack-engineer-react-node` | Engineering | Senior | yes |
| `job-002` | `lead-ai-solutions-architect` | AI & Data | Lead / Principal | yes |
| `job-003` | `senior-ui-ux-product-designer` | Product & Design | Senior | no |
| `job-004` | `cloud-devops-platform-engineer` | Cloud & DevOps | Mid-Level | no |
| `job-005` | `qa-automation-security-engineer` | QA & Security | Mid-Level | no |

Each record also has `location` (`Remote (Global)` on all), `type`, `salary` (display string, not min/max numbers), `postedDate`, `deadline` (all deadlines `2026-12-31`), `overview`, `responsibilities[]`, `requirements[]`, `qualifications[]`, `benefits[]`, `techStack[]`, `customQuestions[]`.

`JobQuestion` fields: `id`, `label`, `placeholder?`, `type` (`text` | `textarea` | `select`), `options?`, `required`. No current question uses `select` or `options`. `JobDetails.tsx` only branches on `textarea` versus a text input, so a `select` question would render as a text field and `options` would be ignored.

### 8.3 Application form — `src/pages/JobDetails.tsx`

Unknown slug redirects to `/careers`.

Fixed fields (all required except where noted):

| State field | Required | Notes |
| :--- | :--- | :--- |
| `fullName` | yes | |
| `email` | yes | Checks that the string contains `@` only |
| `phone` | yes | |
| `location` | yes | City/country |
| `experienceYears` | yes | Free text |
| `experienceSummary` | no | Present in state |
| `education` | no | |
| `skills` | yes | |
| `coverLetter` | no | |
| `privacyConsent` | yes | Checkbox. Privacy policy URL does not exist; consent copy is in the component |
| `customAnswers[questionId]` | per question | |
| Resume file | validated if chosen, not required by `validateForm` | `.pdf`, `.doc`, `.docx`, max 5 MB. Held in component state only |

Submit builds a plain-text summary, opens a dialog, and sets `window.location.href` to `mailto:${careersEmail}` with the summary in the body. The resume is **not** attached. The UI tells the applicant to attach it in their mail client. Nothing is written to Firestore, EmailJS, or `localStorage`. Sharing uses Twitter intent, LinkedIn, mailto, and clipboard. JobPosting JSON-LD uses the salary string as `baseSalary.value` and hardcodes `jobLocationType: TELECOMMUTE`, currency USD, and applicant country “Worldwide”.

## 9. Contact (`/contact`) and FAQ

### 9.1 Contact page

`src/pages/Contact.tsx`.

Query `?service=` pre-fills `projectType` (Services page passes the service title).

Form state:

| Field | Control | Required |
| :--- | :--- | :--- |
| `name` | text | yes |
| `email` | text | yes, must contain `@` |
| `phone` | text | no |
| `projectType` | select | defaults to first option or query value |
| `budget` | select | default `$25,000 – $50,000` |
| `timeline` | text | default `1 – 3 months` |
| `message` | textarea | yes, minimum 10 characters |

`projectTypes` and `budgetRanges` are hardcoded arrays in the page, not derived from `servicesData`.

Submit builds a text summary and opens `mailto:hello@10lonaz.com` (`companyData.contact.email`). No server record is stored. A success path also links WhatsApp with a **hardcoded** `https://wa.me/94754833270?...` instead of `companyData.contact.whatsappLink`.

Contact cards use `companyData.contact`: email, careers email, phone / `phoneDisplay`, address `formatted`, WhatsApp link, and `workingHours`. `supportEmail` is defined and not shown on this page.

Hero badge, H1, and intro paragraph are hardcoded. Translation keys `contact.name`, `contact.email`, `contact.subject`, `contact.message`, `contact.send` do not match this form (there is no subject field; labels are “Full name”, “Estimated Budget Range”, and so on) and the page does not call `useLanguage`.

There is no FAQ block inside `Contact.tsx`. The FAQ lives on `/` (`#faq`) and `/faq`. The footer and navbar link to `/faq`, not to a contact-page subsection.

### 9.2 FAQ — `src/data/faqs.ts` and `src/pages/FAQPage.tsx`

`FAQItem`: `id`, `question`, `answer`, `category`, optional `tags[]`, optional `featured`.

Categories, in `faqCategories` and on the type:

1. General & Company — faq-01, faq-02, faq-03
2. Custom Software — faq-04, faq-05, faq-06
3. SaaS & Products — faq-07, faq-08
4. AI & Cloud — faq-09, faq-10, faq-11
5. Pricing & Engagement — faq-12, faq-13, faq-14 (the prompt text “Pricing & Contracts” does not match the source label)
6. Security & Maintenance — faq-15, faq-16, faq-17

`searchFaqs(query, category)` matches question, answer, and tags. The page calls this. SEO uses `getFAQPageSchema` for the filtered list passed by the page. Hero copy and the mailto CTA are hardcoded. Category “All” is a page concern, not a stored category.

## 10. Reviews (`/reviews`)

`Testimonial`: `id`, `name`, `role`, `company`, `avatar` (URL), `content`, `rating` (number, all current values are 5), `project`, optional `category`, `featured`, `verified`.

Categories on records: Cloud & SaaS, Fintech, Mobile, E-Commerce, APIs & Integration, Education, Logistics, Enterprise.

`filterCategories` in `src/pages/Reviews.tsx` is hardcoded and **omits Education and Logistics**, so `rev-06` (EduLearn) and `rev-07` (FoodHub) never appear when a chip other than “All” is selected, and there is no chip that isolates them.

`clientLogos` is an array of company name strings, not image URLs. Average rating is computed from the data. Hero copy is hardcoded. `featured` drives `getFeaturedTestimonials`, which the Reviews page does not filter by; the homepage marquee also ignores `featured`.

## 11. Articles

`Article` in `src/data/articles.ts`: `id`, `slug`, `title`, optional `subtitle`, `excerpt`, `category` (`Articles` | `News`), optional `subcategory`, `publishDate`, optional `updatedDate`, `author` (embedded `Author`), `readTime` (display string), optional `featured`, `coverImage`, `tags[]`, `content[]`, optional `metaDescription`, optional `relatedSlugs[]`.

`Author`: `name`, `role`, `avatar`, `bio`. Keys in `authors`: `alex`, `sarah`, `marcus`, `team`. Articles embed a copy of the author object rather than storing only the key.

`ContentBlock.type`: `paragraph` | `heading` | `subheading` | `quote` | `code` | `list` | `callout` | `image`.

Fields actually used in current articles: `text`, `items` (lists), `language` (code). `caption` and `url` exist on the type. `image` blocks and `subheading` blocks are not used in the current six articles. `CodeBlock.tsx` highlights JavaScript, TypeScript, Python, Java, HTML, CSS, SQL, JSON, and Bash via Prism.

Published records:

| id | slug | category | author key used |
| :--- | :--- | :--- | :--- |
| `art-1` | `building-scalable-saas-architecture-2026` | Articles | alex |
| `art-2` | `llm-copilots-in-enterprise-workflow` | Articles | sarah |
| `news-1` | `10lonaz-launches-next-gen-ai-suite` | News | team |
| `art-3` | `optimizing-web-vitals-performance` | Articles | alex |
| `news-2` | `10lonaz-expands-global-engineering-hubs` | News | marcus |
| `art-4` | `modern-full-stack-engineering-cheat-sheet` | Articles | alex |

`Articles.tsx` filters with query params `category`, `tag`, and `search`. Helpers: `getArticles`, `getArticleBySlug`, `getFeaturedArticles`, `getRelatedArticles`, `getCategories`, `getAllTags`.

`ArticleDetails.tsx` renders blocks, related articles, and share links (Twitter, LinkedIn, Facebook, email, copy). SEO uses `article.metaDescription` or excerpt, `coverImage`, and `getArticleSchema`.

The JSON file `src/data/articles/building-scalable-saas-architecture.json` uses different field names (`featuredImage`, `summary`, `lastUpdated`, `author` as a string, `category: "Article"`, a different slug). It is dead content. Editing it does not change the site.

## 12. Navigation, footer, settings

### 12.1 Navbar — `src/components/Navbar.tsx`

Links are a hardcoded array. Labels come from translations with English fallbacks. Paths are fixed. The Careers item has a hardcoded badge string `Hiring`.

Desktop CTA “Get in Touch” → `/contact` is not in the translation file. Logo text is the literal `10lonaz`, not `companyData.brandName` or `companyData.name`.

Language menu maps `languages` from `src/lib/translations.ts`. Theme cycles system → dark → light → system through `next-themes`. Theme is a visitor preference, not site content.

### 12.2 Footer — `src/components/Footer.tsx`

Uses `companyData.name`, `shortDescription`, `contact.address.formatted`, `contact.email`, `contact.phone`, `contact.phoneDisplay`, `contact.whatsappLink`, `socialLinks`, `legalName`.

Social icons are a local map: GitHub, LinkedIn, YouTube, Instagram, X. An unknown `platform` string falls back to `ExternalLink`. Handles (`social.handle`) are stored and not rendered.

`footerLinks` (company, services, support) are hardcoded. Column titles “Company”, “Services”, “Support & Connect”, and “Follow 10lonaz” are hardcoded. Translation keys `footer.*` are unused. Copyright line uses `new Date().getFullYear()` plus `legalName`. The translation string `footer.copyright` still says 2025 and is unused.

Bottom links: About, Careers, FAQ, Contact. There are no privacy, terms, or cookie pages in the router.

### 12.3 Company settings that exist but are easy to miss

`src/data/company.ts` `CompanyInfo`:

- Identity: `name` `10lonaz`, `legalName` `10lonaz Technologies Inc.`, `brandName` `10LONAZ`, `tagline`, `shortDescription`, `fullDescription`, `foundingYear` 2020, `headquarters`, `workingModel`, `siteUrl` `https://10lonaz.com`
- Contact: `email` `hello@10lonaz.com`, `careersEmail` `careers@10lonaz.com`, `supportEmail` `support@10lonaz.com` (unused in UI), `phone` `+194754833270`, `phoneDisplay` `+1 (94) 754-833-270`, `whatsapp` `+94754833270`, `whatsappLink` (pre-filled wa.me text), address lines, `workingHours`
- `stats`: five display strings
- `socialLinks`: five platforms

`knowsAbout` inside `getOrganizationSchema()` is a hardcoded list, not a field on `CompanyInfo`. Organization logo URL is `${siteUrl}/favicon.ico`.

## 13. SEO

Two layers:

1. `index.html` static tags for the first paint and crawlers that do not run JavaScript. Title, description, keywords, canonical `https://10lonaz.com`, Open Graph, Twitter card, image URL (Unsplash). These are not updated by the React `SEO` component until JS runs.
2. `src/components/common/SEO.tsx` sets `document.title` to `${title} | 10lonaz` when a title prop is passed, otherwise `defaultMetadata.title` (which already contains the brand and is not double-suffixed). It writes description, keywords, canonical from `companyData.siteUrl` + path, `og:*`, `twitter:*`, and JSON-LD into `#dynamic-json-ld-scripts`.

`defaultMetadata` in `src/data/seo.ts`: title, description, keywords array, `canonicalPath` `/`, `ogType` website, `ogImage` Unsplash URL. Per-page titles and descriptions are literals in each page file (see `ADMIN_PANEL_FIELD_MAPPING.md`). Article, job, and case-study titles are derived from the record.

Schema builders in `src/data/seo.ts`: Organization, WebSite (search action targets `/articles?search={search_term_string}`), BreadcrumbList, JobPosting, FAQPage, BlogPosting, Service. There is no Product or Review schema.

`public/robots.txt` allows Googlebot, Bingbot, Twitterbot, facebookexternalhit, GPTBot, ChatGPT-User, PerplexityBot, ClaudeBot, and `*`. Sitemap URL is `https://10lonaz.com/sitemap.xml`.

`public/sitemap.xml` lastmod values are `2026-11-10`. It lists the static pages, all five real job slugs, all six real article slugs, and five portfolio URLs of which four do not match `products`.

No Google Analytics, GTM, Plausible, Meta Pixel, or other tracker script exists in `index.html` or `src`.

## 14. Language system

`src/hooks/useLanguage.tsx` + `src/lib/translations.ts`.

`Language` = `en | zh | ja | si | ta | ar | es | ml | hi`. All nine dictionaries exist. `ar` sets `document.documentElement.dir` to `rtl`. Choice is stored in `localStorage` key `language`. Missing keys fall back to English, then to the key string.

English keys (other languages mirror this set; they do not add page-body translations):

`nav.home`, `nav.about`, `nav.services`, `nav.portfolio`, `nav.careers`, `nav.articles`, `nav.faq`, `nav.reviews`, `nav.contact`, `hero.badge`, `hero.title`, `hero.subtitle`, `hero.cta.quote`, `hero.cta.services`, `hero.stats.projects`, `hero.stats.clients`, `hero.stats.experience`, `hero.stats.rating`, `services.title`, `services.subtitle`, `services.viewAll`, `portfolio.title`, `portfolio.subtitle`, `portfolio.viewAll`, `portfolio.viewProject`, `testimonials.title`, `testimonials.subtitle`, `why.title`, `why.subtitle`, `faq.title`, `faq.subtitle`, `faq.cta`, `footer.about.title`, `footer.about.text`, `footer.quick.title`, `footer.social.title`, `footer.copyright`, `contact.name`, `contact.email`, `contact.subject`, `contact.message`, `contact.send`.

Only `nav.*` (Navbar) and `hero.*` (Hero) are read. Services, portfolio, reviews, about, FAQ bodies, jobs, articles, and contact form labels stay English in every language. There is no per-locale version of `servicesData`, jobs, or articles.

## 15. Email, chat, analytics, assets

**Email.** Contact and job flows are `mailto:` only. The installed EmailJS package is unused. No Cloud Function sends mail. Resume bytes never leave the browser.

**Chat.** `src/components/chat/AIChatModal.tsx` is a local keyword responder. Welcome text and four suggested prompts are hardcoded. Replies branch on the words quote/cost/price, service, and portfolio. There is no LLM API call despite the comment that the component is “ready” for one. Messages are not saved.

**Analytics.** None.

**Firebase.** `src/lib/firebase.ts` reads `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`. If env vars are missing it substitutes a mock api key and the project id `lonaz-portfolio`. `isFirebaseConfigured()` is true only when API key and project id env vars are set. Auth is not initialized. No `.env` file is part of the audited source. `firebase.json` is Hosting-only.

**Cursor.** `src/components/CustomCursor.tsx` stores `{ aiMode, cursorTheme, reducedMotion }` under `cursor-preferences`. This is a visitor setting.

**Reusable content components worth binding later:** `SEO`, `Navbar`, `Footer`, `Hero`, `ServicesPreview`, `PortfolioPreview`, `TestimonialsPreview`, `WhyChooseUs`, `FAQ`, `CodeBlock`. The `src/components/ui/*` set is a design system and should stay out of the CMS.

## 16. Functionality that is missing (do not invent it as if it exists)

- Admin UI, roles, and audit log
- Authentication of any kind (`/login` has no inputs)
- Persistence of inquiries, applications, or resumes
- Transactional email
- Analytics configuration
- Editable sitemap generation
- Locale versions of long-form content
- Per-service URLs
- Privacy policy / terms routes referenced by job consent
- A real client portal (invoices, milestones, files)
- Use of the orphan article JSON
- Image upload pipeline (Firebase Storage is initialized only)
- Binding of hero stats to `companyData.stats`
- A portfolio record for `healthcare-management-system`
- Sitemap URLs that match portfolio slugs
- Location filter UI even though `JobFilterParams.location` exists
- Reviews chips for Education and Logistics

## 17. Implication for a future admin panel

The website can be managed from one dashboard only after pages read a single content repository. Today they import static modules. A dashboard that only writes `localStorage` or Firestore will not change the live site until those imports go through a loader that prefers stored documents and falls back to the current modules.

Seed that store from the modules listed above so the dashboard edits the same records the site already shows, instead of a second copy of the marketing site. Page-level English that is still inside TSX has to be extracted into that store before an editor can change it. Until that extraction, those strings remain deploy-time code.

Detailed shapes are in `ADMIN_PANEL_DATA_SCHEMA.md`. Module and step plan is in `ADMIN_PANEL_IMPLEMENTATION_PLAN.md`. Field-to-component mapping is in `ADMIN_PANEL_FIELD_MAPPING.md`.
