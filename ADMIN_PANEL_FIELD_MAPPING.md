# 10LONAZ Admin Panel — Field Mapping

Exact map from admin fields to the files and components that render them today. “Editable now in data” means the string already lives in a module an editor could replace without rewriting JSX. “Hardcoded in component” means the dashboard cannot change it until that string is moved into the content bundle.

Routes are declared in `src/App.tsx`.

## 1. Global chrome

| Admin field | Source today | Rendered by | Notes |
| :--- | :--- | :--- | :--- |
| Header logo text `10lonaz` | Literal in `Navbar.tsx` | Header link to `/` | Does not read `companyData.name` |
| `nav.home` … `nav.contact` | `translations[language]` | `Navbar` `navLinks[].name` | Fallback English is also in `Navbar.tsx` |
| Nav paths `/`, `/about`, `/services`, `/portfolio`, `/careers`, `/articles`, `/faq`, `/reviews`, `/contact` | `Navbar.tsx` | Same links, desktop and mobile drawer | Not data-driven |
| Careers badge `Hiring` | `Navbar.tsx` | Small pill on Careers | |
| Header CTA `Get in Touch` → `/contact` | `Navbar.tsx` | Desktop button | No translation key |
| Language list (code, name, flag) | `languages` in `translations.ts` | Navbar dropdown | `useLanguage` saves `localStorage.language` and sets `dir=rtl` for `ar` |
| Theme cycle | `next-themes` in `Navbar.tsx` | Icon button | Visitor setting, not CMS |
| Footer brand | `companyData.name` | `Footer.tsx` | |
| Footer blurb | `companyData.shortDescription` | `Footer.tsx` | `footer.about.text` translation is unused and different |
| Address line | `companyData.contact.address.formatted` | `Footer.tsx` | Structured address fields are used in Organization schema, not in the footer line |
| Email | `companyData.contact.email` | Footer `mailto:` | |
| Phone | `phone` (href) and `phoneDisplay` (text) | Footer `tel:` | |
| WhatsApp row | `contact.whatsappLink` | Footer “WhatsApp Business Chat” | Label is hardcoded |
| Footer column links | `footerLinks` in `Footer.tsx` | Three columns | Labels and paths hardcoded. Service links all go to `/services` with no hash |
| Social URL, label, platform | `companyData.socialLinks` | Footer icon buttons | `handle` is stored and not shown. Icon map: GitHub, LinkedIn, YouTube, Instagram, X |
| Copyright | `legalName` + `new Date().getFullYear()` | Footer bottom | `footer.copyright` translation (year 2025) is unused |
| Bottom links About, Careers, FAQ, Contact | `Footer.tsx` | Bottom bar | |
| Chat welcome and 4 prompts | `AIChatModal.tsx` | Widget on every page | Keyword replies are code, not fields |
| Cursor preferences | `localStorage` `cursor-preferences` | `CustomCursor.tsx` | Not site content |

## 2. SEO and crawling

| Admin field | Source | Consumer |
| :--- | :--- | :--- |
| Default title, description, keywords, og image | `defaultMetadata` in `src/data/seo.ts` | `SEO.tsx` when a page omits the prop |
| Title suffix ` \| 10lonaz` | Literal in `SEO.tsx` | `document.title` when `title` prop is set |
| Canonical host | `companyData.siteUrl` | `SEO.tsx` |
| Home / About / Services / Portfolio / Careers / FAQ / Reviews / Articles / Contact title and description | Literal props on each page’s `<SEO>` | `SEO.tsx` |
| Job title | `` `${job.title} — Careers` `` in `JobDetails.tsx` | `SEO` |
| Article title | `article.title` | `SEO` |
| Article description | `article.metaDescription` or excerpt in `ArticleDetails.tsx` | `SEO` |
| Case study title | `` `${product.title} — Case Study` `` | `SEO` |
| Organization name, legal name, url, email, phone, founding year, address, sameAs | `companyData` via `getOrganizationSchema` | JSON-LD |
| Organization `knowsAbout` | Hardcoded array in `seo.ts` | JSON-LD only |
| Organization logo | `` `${siteUrl}/favicon.ico` `` | JSON-LD |
| WebSite search target | Hardcoded `/articles?search=` in `getWebSiteSchema` | JSON-LD |
| Service schema | First 5 `servicesData` items only, via `getServiceSchema` | `Services.tsx` |
| FAQ schema | Featured FAQs on home; filtered FAQs on `/faq` | `getFAQPageSchema` |
| Job schema | Full job record plus hardcoded TELECOMMUTE, USD, Worldwide | `getJobPostingSchema` |
| Article schema | Article + embedded author + `companyData.name` | `getArticleSchema` |
| Static tags (no-JS) | `index.html` | Browser before React |
| robots.txt | `public/robots.txt` | Crawlers |
| sitemap URLs | `public/sitemap.xml` | Crawlers. Portfolio locs are not generated from `products` |

Page SEO literals:

| Page | `title` prop | `canonicalPath` |
| :--- | :--- | :--- |
| `Index.tsx` | Custom Software, SaaS & AI Solutions | `/` |
| `About.tsx` | About Us — Mission, Team & Engineering Standards | `/about` |
| `Services.tsx` | Custom Software, SaaS & AI Engineering Services | `/services` |
| `Portfolio.tsx` | Products & Case Studies | `/portfolio` |
| `Careers.tsx` | Careers & Open Positions | `/careers` |
| `FAQPage.tsx` | Frequently Asked Questions (FAQ) | `/faq` |
| `Reviews.tsx` | Client Reviews & Testimonials | `/reviews` |
| `Articles.tsx` | Articles, Engineering Insights & News | `/articles` |
| `Contact.tsx` | Contact Us & Request a Quote | `/contact` |

Descriptions are the `description` strings in those same `<SEO>` calls. `NotFound.tsx` and `Login.tsx` do not render `SEO`.

## 3. Homepage

| UI | Admin field | Source | Component |
| :--- | :--- | :--- | :--- |
| Badge | `hero.badge` | translations | `Hero.tsx` `t()` |
| H1 | `hero.title` | translations | `Hero.tsx` |
| Subtitle | `hero.subtitle` | translations | `Hero.tsx` |
| Primary button | `hero.cta.quote` → `/contact` | translations + hardcoded path | `Hero.tsx` |
| Secondary button | `hero.cta.services` → `/services` | translations + hardcoded path | `Hero.tsx` |
| Stat values `500+`, `300+`, `10+`, `4.9/5` | Hardcoded | `Hero.tsx` | Not `companyData.stats` |
| Stat labels | `hero.stats.projects`, `.clients`, `.experience`, `.rating` | translations | `Hero.tsx` |
| Services heading and intro | Hardcoded | `ServicesPreview.tsx` | Keys `services.title` / `subtitle` unused |
| Service card title, short description | `servicesData[]` | `ServicesPreview` first 6 by array order | Link `/services#slug` |
| Service icon | `iconName` | Preview map of 6 icons | Unknown → `Code2` |
| “Explore Service & Tech Stack” | Hardcoded | `ServicesPreview.tsx` | |
| “View All 12 Engineering Practices” | Hardcoded | `ServicesPreview.tsx` | Count is not `servicesData.length` |
| Portfolio heading and intro | Hardcoded | `PortfolioPreview.tsx` | `portfolio.*` keys unused |
| Featured products | Slug list in `PortfolioPreview.tsx` | Looks up `products` | `healthcare-management-system` matches nothing |
| Card title, description, category | `products` fields | `PortfolioPreview.tsx` | |
| Reviews heading and intro | Hardcoded | `TestimonialsPreview.tsx` | Uses all testimonials, ignores `featured` |
| Review avatar, name, role, company, content, rating | `testimonialsData` | Marquee | |
| Why Choose Us heading and subtitle | Hardcoded | `WhyChooseUs.tsx` | `why.title` / `why.subtitle` unused and the subtitle text differs |
| Six reasons | `features` array in `WhyChooseUs.tsx` | icon component, title, description | |
| FAQ badge, heading, subtitle, CTA | Hardcoded | `FAQ.tsx` | `faq.*` keys unused |
| FAQ question and answer | `faqData` where `featured` | `getFeaturedFaqs()` | Also fed to homepage FAQ schema from `Index.tsx` |

`companyData.stats` on the homepage: not used. Those four values render on About.

## 4. About

| UI | Source | File |
| :--- | :--- | :--- |
| SEO title and description | Hardcoded `<SEO>` | `About.tsx` |
| Badge, H1, accent | Hardcoded | `About.tsx` |
| Intro paragraph | `companyData.fullDescription` | `About.tsx` |
| `120+` / `99.2%` / `15+` / `99.95%` | `stats.projectsDelivered`, `clientSatisfaction`, `countriesServed`, `uptimeSLA` | `About.tsx` |
| Stat labels | Hardcoded next to those values | `About.tsx` |
| Mission and vision titles and paragraphs | Hardcoded | `About.tsx` |
| Who we are badge, heading, two paragraphs, three bullets | Hardcoded | `About.tsx` |
| Team image URL and alt | Hardcoded Unsplash URL | `About.tsx` |
| Four values | `values` in `About.tsx` | icon + title + description |
| Nine capabilities | `capabilities` in `About.tsx` | title + description |
| “Explore Full Services Details” → `/services` | Hardcoded | `About.tsx` |
| Six milestones | `milestones` in `About.tsx` | year, title, event |
| Bottom CTA copy and links `/contact`, `/careers` | Hardcoded | `About.tsx` |
| `tagline`, `headquarters`, `workingModel`, `yearsInBusiness`, `foundingYear` | `company.ts` only | Not rendered on About (founding year is in Organization schema) |

## 5. Services

| UI | Field | File |
| :--- | :--- | :--- |
| Hero badge, H1, intro, CTAs | Hardcoded | `Services.tsx` |
| Filter chips All + 4 categories | Hardcoded `categories` array | `Services.tsx` (matches the `ServiceDetail['category']` union) |
| Anchor | `slug` | `Services.tsx` |
| Icon | `iconName` via `iconMap` | `Services.tsx` |
| Title, short and full description | `ServiceDetail` | Card |
| Feature list | `features[]` | Card |
| Deliverables | `deliverables[]` | Card |
| Tech stack | `techStack[]` | Card |
| Timeline | `timeline` | Card |
| Popular badge | `popular` | Card |
| Contact CTA | `` `/contact?service=${service.title}` `` | `Services.tsx` |
| JSON-LD | `getServiceSchema` for indexes 0–4 | `Services.tsx` |

There is no separate detail page. Editing `slug` changes the hash target used by `ServicesPreview`.

## 6. Portfolio

| UI | Field | File |
| :--- | :--- | :--- |
| Listing hero copy | Hardcoded | `Portfolio.tsx` |
| Category chips | `productCategories` | `src/data/products.ts` |
| Card title, description, category, icon | `products[]` | `Portfolio.tsx` |
| Detail route | `slug` | `CaseStudy.tsx` via `getProductBySlug` |
| Overview, client, industry, timeline, team size, challenge | Same record | `CaseStudy.tsx` |
| Scope bullets | `scope[]` | `CaseStudy.tsx` |
| Features | `features[].title`, `.description` | `CaseStudy.tsx` |
| Stack | `techStack[]` | `CaseStudy.tsx` |
| Outcomes | `outcomes[].metric`, `.label` | `CaseStudy.tsx` |
| Quote | `testimonial.quote`, `.author`, `.role` | Only if present (billing product) |
| Type label | `productType` | `CaseStudy.tsx` |
| Buy button | `pricing.price`, `pricing.buyUrl` | Hidden if no `buyUrl` |
| Trial button | `pricing.trialDays`, `pricing.trialUrl` | Hidden if no `trialUrl` |
| Pricing block features | `pricing.features[]`, `pricing.period` | Hidden if no `pricing` |
| Download | `downloadUrl` | Hidden if absent |
| Live preview | `livePreviewUrl` | Hidden if absent |
| Source | `sourceCodeUrl` | Hidden if absent (unset on all current products) |
| Extension | `extensionUrl` | `ai-page-summarizer-extension` |
| Screenshots | `screenshots[]` | URLs |
| Icon | Lucide component on the record | Must become `iconName` before a form can save it |

## 7. Careers and job application

| UI | Field | File |
| :--- | :--- | :--- |
| Culture cards (6) | `cultureBenefits` in the page | `Careers.tsx` |
| Search | title, overview, department, location, techStack | `Careers.tsx` local filter (not `filterJobs`) |
| Department / type / experience selects | Distinct values from open jobs | `getDepartments`, `getEmploymentTypes`, `getExperienceLevels` |
| Hidden when closed | `isOpen` | `Careers.tsx` |
| Card title, department, location, type, experience, salary, overview, stack | `JobVacancy` | `Careers.tsx` |
| Featured marker | `featured` | `Careers.tsx` |
| General application subjects | Hardcoded mailto subjects | `Careers.tsx` |
| Recipient | `companyData.contact.careersEmail` | `Careers.tsx`, `JobDetails.tsx` |
| Detail: overview, responsibilities, requirements, qualifications, benefits, techStack, salary, dates, location, type, experience | `JobVacancy` | `JobDetails.tsx` |
| Custom questions | `customQuestions[]` | `JobDetails.tsx` form |
| Applicant fullName, email, phone, location, experienceYears, experienceSummary, education, skills, coverLetter, privacyConsent | Component state only | Not stored |
| Resume | File input, 5 MB, pdf/doc/docx | Not uploaded |
| Share text | Hardcoded templates + job title and URL | `JobDetails.tsx` |

`JobQuestion.type` of `select` and `options` are on the interface only. `JobDetails.tsx` renders `textarea` or a plain text `Input`. A select question would not show a dropdown until that page is updated.

## 8. Contact

| UI | Field | File |
| :--- | :--- | :--- |
| Hero badge, H1, intro | Hardcoded | `Contact.tsx` |
| Info cards | `email`, `careersEmail`, `phone`, `phoneDisplay`, `address.formatted`, `whatsappLink`, `workingHours` | `companyData` via `Contact.tsx` |
| `supportEmail` | `company.ts` | Not rendered |
| `name`, `email`, `phone`, `message` | Form state | `Contact.tsx` |
| `projectType` options | `projectTypes` array | `Contact.tsx` |
| Preselect | `?service=` query | `Contact.tsx` |
| `budget` options and default | `budgetRanges` | `Contact.tsx` |
| `timeline` default `1 – 3 months` | Form state | Free text input |
| Mailto recipient and subject pattern | `contact.email` + hardcoded subject template | `handleSubmit` |
| Success WhatsApp link | Hardcoded `https://wa.me/94754833270` | `Contact.tsx` (does not use `whatsappLink`) |
| Translation `contact.*` | `translations.ts` | Not used. Keys do not match the real labels |

FAQ is not a subsection of this page. It is `src/components/home/FAQ.tsx` and `src/pages/FAQPage.tsx`.

## 9. FAQ

| UI | Field | File |
| :--- | :--- | :--- |
| Page hero | Hardcoded | `FAQPage.tsx` |
| Category chips | `faqCategories` + All | `faqs.ts` |
| Search | `question`, `answer`, `tags` | `searchFaqs` |
| Accordion | `question`, `answer` | `FAQPage.tsx` |
| Homepage subset | `featured` | `FAQ.tsx` and `Index.tsx` schema |
| Mail CTA | `companyData.contact.email` | `FAQPage.tsx` |
| Category label in source | `Pricing & Engagement` | Not “Pricing & Contracts” |

Ids `faq-01` through `faq-17` are the stable keys.

## 10. Reviews

| UI | Field | File |
| :--- | :--- | :--- |
| Hero copy | Hardcoded | `Reviews.tsx` |
| Average | Computed from `rating` | `Reviews.tsx` |
| Filter chips | Hardcoded `filterCategories` | Omits `Education` and `Logistics`, which exist on `rev-06` and `rev-07` |
| Card | `avatar`, `name`, `role`, `company`, `content`, `rating`, `project`, `category`, `verified` | `Reviews.tsx` |
| `featured` | `testimonials.ts` | Not applied on this page or the homepage marquee |
| Logo strip names | `clientLogos` string array | `Reviews.tsx` if the page renders them; they are name strings, not files |

## 11. Articles

| UI | Field | File |
| :--- | :--- | :--- |
| Index hero | Hardcoded | `Articles.tsx` |
| Category filter | `Article.category` `Articles` \| `News` | Query `category` |
| Tag filter | `tags[]` via `getAllTags` | Query `tag` |
| Search | title, excerpt, tags (page filter) | Query `search` |
| Card | `title`, `excerpt`, `coverImage`, `category`, `publishDate`, `readTime`, `author.name`, `tags` | `Articles.tsx` |
| Body blocks | `content[]` by `type` | `ArticleDetails.tsx` + `CodeBlock.tsx` for `code` |
| Author box | `author.name`, `role`, `avatar`, `bio` | Embedded object |
| Related | `relatedSlugs` | `getRelatedArticles` |
| Share links | Hardcoded networks + title and URL | `ArticleDetails.tsx` |
| JSON file under `src/data/articles/` | Unused | No component |

Author records in `authors`: `alex` (Alex Rivera), `sarah` (Sarah Chen), `marcus` (Marcus Vance), `team` (10lonaz Newsroom).

## 12. Login, 404, and unused packages

| UI | Source | Admin? |
| :--- | :--- | :--- |
| “Client Portal” heading, description, four bullets, contact link | `Login.tsx` | Copy only. No account system behind it |
| 404 heading and body | `NotFound.tsx` | Copy only |
| EmailJS | Dependency only | No templates or keys in source |
| Firestore `db`, Storage `storage` | `src/lib/firebase.ts` | No collection reads |
| React Query | Provider only | No queries to point at an admin API |

## 13. Seed identity checklist

Use these ids so admin edits stay attached to existing URLs.

**Services:** `svc-custom-software`, `svc-saas-products`, `svc-web-apps`, `svc-mobile-apps`, `svc-business-management`, `svc-ai-solutions`, `svc-cloud-devops`, `svc-ui-ux-design`, `svc-api-integration`, `svc-seo-optimization`, `svc-maintenance-support`, `svc-it-consulting`.

**Jobs:** `job-001` … `job-005` with slugs in `careers.ts`.

**FAQs:** `faq-01` … `faq-17`.

**Reviews:** `rev-01` … `rev-08`.

**Articles:** `art-1`, `art-2`, `art-3`, `art-4`, `news-1`, `news-2`.

**Products:** slugs in `products.ts` (eight). Do not seed sitemap-only slugs `ai-assistant-suite`, `restaurant-management-pos`, `hotel-booking-engine`, `telehealth-consultation-app`, or the homepage slug `healthcare-management-system`.

## 14. Duplication to avoid

| If the dashboard edits… | Do not also maintain a second copy in… |
| :--- | :--- |
| `companyData` contact emails | Mailto strings (except the one hardcoded `wa.me` number, which should be switched to the company field when the site is next allowed to change) |
| Service records | Footer service labels (they are a short list, not the catalog) or contact `projectTypes` (separate list) |
| `faqData` | Homepage FAQ (it already filters `featured`) |
| `products` | A parallel “case study” collection |
| `articles` in `articles.ts` | `building-scalable-saas-architecture.json` |
| `translations` `hero.*` | A second hero heading inside `Hero.tsx` (the component already uses `t()`) |
| Hero stat **values** | `companyData.stats` until a deliberate binding is made; they disagree today |
