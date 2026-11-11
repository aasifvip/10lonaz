# 10LONAZ — Premium Software Development Company Website

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.19-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4.17-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Proprietary-green.svg)]()

10LONAZ is a modern, responsive, high-performance website for **10lonaz Technologies Inc.**, an engineering firm specializing in bespoke software development, multi-tenant SaaS products, cross-platform mobile apps, cloud DevOps, and enterprise generative AI solutions.

---

## 🚀 Key Website Features

### 1. Careers & Job Management System (`/careers` & `/careers/:slug`)
- **Interactive Vacancy Board:** Filter positions dynamically by Department (*Engineering, AI & Data, Product & Design, Cloud & DevOps, QA & Security*), Location, Employment Type (*Full-time, Part-time, Contract*), and Experience Level (*Junior, Mid-Level, Senior, Lead/Principal*).
- **Searchable Listings:** Instant real-time search across job titles, tech stacks, and descriptions.
- **Deep-Dive Job Details Pages:** Responsibilities, hard requirements, preferred qualifications, salary ranges, employee benefits, and role-specific custom interview questions.
- **Social Sharing:** One-click sharing to LinkedIn, Twitter/X, native email, or clipboard.
- **Graceful Empty State:** User-friendly fallback when filters yield no matches, offering a direct open application flow.

### 2. Functional Job Application System
- **Comprehensive Candidate Form:** Full name, email, phone number, location, years of experience, education, primary skills, cover letter, and privacy consent.
- **Resume Upload Validation:** Client-side file type verification (`.pdf`, `.doc`, `.docx`) and size enforcement (5MB limit) with visual removal indicator.
- **Structured Application Summary Generator:** Converts candidate data into an executive-ready application summary.
- **Secure Email Application Dispatch:** Pre-formats the applicant's default mail client with `careers@10lonaz.com`, job title, and detailed application payload. Provides transparent instructions requiring the applicant to attach their resume and press "Send", with zero false "email sent" confirmations.
- **Backend & Firebase Architecture Ready:** Structured data schema prepared for seamless future Firestore or Cloud Function API integration without frontend redesign.

### 3. Dedicated FAQ Knowledge Base (`/faq` & Homepage Section)
- **Categorized Question Navigation:** General & Company, Custom Software, SaaS & Products, AI & Cloud, Pricing & Contracts, Security & Maintenance.
- **Interactive Search:** Real-time search across questions, answers, and tags.
- **Smooth Animations:** Radix UI accessible accordion with fluid open/close transitions.
- **Schema.org FAQPage:** Search engine rich snippet optimization.

### 4. Global Navigation & Scroll Correction
- **Sticky Navigation Bar:** Seamless responsive desktop and mobile drawers with active indicators across nested routes.
- **Automatic Scroll-to-Top:** `ScrollToTop` router listener resets viewport position on all route transitions.
- **Sticky Header Offset Navigation:** Hash anchor links (`#faq`, `#slug`) smoothly scroll with a 72px clearance offset.
- **Footer Social Hover Bug Fix:** Replaced unstable inline drop-shadow filters with clean Tailwind CSS transitions and full `:focus-visible` accessibility.

### 5. Services & Solutions Catalog (`/services`)
- **12 Specialized Practices:** From custom software and multi-tenant SaaS to LLM copilots and cloud DevOps.
- **Filter by Practice:** Development, Architecture & Cloud, Design & Strategy, Growth & Operations.
- **Deliverables & Tech Stack:** Transparent breakdown of timelines, technology choices, and deliverables.

### 6. Products & Portfolio Showcase (`/portfolio` & `/portfolio/:slug`)
- **Case Studies & Products:** Production-ready applications including Universal Billing SaaS, Restaurant Management POS, Hotel Booking Engine, and AI Browser Extensions.
- **Detailed Outcomes:** Key challenge, scope of work, features, metrics, tech stack, and live preview/repo links.

### 7. Technical Articles & Blog Engine (`/articles` & `/articles/:slug`)
- **Search & Tag Filtering:** Browse by category (*Articles, News*) and topics (*TypeScript, Python, SaaS, AI, Web Vitals*).
- **Prism.js Syntax Highlighting:** Theme-consistent code blocks supporting **JavaScript, TypeScript, Python, Java, HTML, CSS, SQL, JSON, and Bash** with copy-to-clipboard buttons and language labels.

### 8. Reviews & Testimonials (`/reviews`)
- **Verified Partner Feedback:** Client testimonials with ratings, company information, project scope, and domain filtering.

### 9. Contact & Consultation (`/contact`)
- **Dual Contact Flow:** Structured project proposal staging with `mailto:hello@10lonaz.com`, direct WhatsApp business chat link (`https://wa.me/94754833270`), phone, and address details.

### 10. Modern SEO, AEO & GEO Architecture
- **Schema.org Structured Data:** Organization, WebSite, Service, BlogPosting, JobPosting, FAQPage, BreadcrumbList JSON-LD.
- **Search Engine Assets:** Complete XML sitemap at `public/sitemap.xml` and optimized `public/robots.txt` supporting standard web crawlers and AI search agents (GPTBot, PerplexityBot, ClaudeBot).

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework & Language** | React 18.3.1, TypeScript 5.8.3 |
| **Build & Bundler** | Vite 5.4.19 with `@vitejs/plugin-react-swc` & code splitting |
| **Styling & Design Tokens** | Tailwind CSS 3.4.17, Tailwind Animate, CSS Variables |
| **UI Components** | Radix UI primitives (`@radix-ui/react-*`), Lucide Icons |
| **Animation** | Framer Motion 12.23 |
| **Syntax Highlighting** | PrismJS 1.30 (JS, TS, Python, Java, HTML, CSS, SQL, JSON, Bash) |
| **State & Data Fetching** | TanStack React Query 5.83 |
| **Notifications** | Sonner & Radix Toast |
| **Routing** | React Router DOM 6.30 |
| **Cloud & Backend Ready** | Firebase SDK 12.17 |

---

## 📂 Project Structure

```text
├── public/
│   ├── favicon.ico             # Company favicon
│   ├── robots.txt              # Search engine & AI crawler rules
│   └── sitemap.xml             # Complete XML sitemap
├── src/
│   ├── components/
│   │   ├── chat/               # AI chatbot widget
│   │   ├── common/             # Reusable core components
│   │   │   ├── CodeBlock.tsx   # Syntax highlighted code block (Prism.js)
│   │   │   ├── ScrollToTop.tsx # Global route & anchor scroll reset
│   │   │   └── SEO.tsx         # Dynamic meta tags & JSON-LD schemas
│   │   ├── home/               # Homepage modular preview sections
│   │   │   ├── FAQ.tsx         # Homepage featured FAQ accordion
│   │   │   ├── Hero.tsx        # Homepage hero section
│   │   │   ├── PortfolioPreview.tsx
│   │   │   ├── ServicesPreview.tsx
│   │   │   ├── TestimonialsPreview.tsx
│   │   │   └── WhyChooseUs.tsx
│   │   ├── ui/                 # Radix UI + Tailwind design system components
│   │   ├── Footer.tsx          # Upgraded global footer (fixed hover bug)
│   │   └── Navbar.tsx          # Responsive sticky navigation bar
│   ├── data/                   # Centralized, modular, typed static data
│   │   ├── articles.ts         # Blog articles, authors, and technical code
│   │   ├── careers.ts          # Job vacancies, requirements, salary & questions
│   │   ├── company.ts          # Master contact details, branding & social links
│   │   ├── faqs.ts             # Categorized FAQ questions & search logic
│   │   ├── products.ts         # Portfolio products & case studies
│   │   ├── seo.ts              # SEO metadata & Schema.org generators
│   │   ├── services.ts         # 12 specialized services & deliverables
│   │   └── testimonials.ts     # Client reviews, ratings & logos
│   ├── hooks/                  # Custom React hooks (language, toast, mobile)
│   ├── lib/                    # Firebase helpers, translations & utilities
│   ├── pages/                  # Top-level view pages
│   │   ├── About.tsx           # About 10lonaz, mission, values, milestones
│   │   ├── ArticleDetails.tsx  # Article reading view with CodeBlock
│   │   ├── Articles.tsx        # Articles list with search & category filters
│   │   ├── Careers.tsx         # Careers landing & job filtering
│   │   ├── CaseStudy.tsx       # Portfolio product case study view
│   │   ├── Contact.tsx         # Contact & technical proposal request
│   │   ├── FAQPage.tsx         # Dedicated FAQ knowledge base
│   │   ├── Index.tsx           # Homepage
│   │   ├── JobDetails.tsx      # Job details & interactive application form
│   │   ├── Portfolio.tsx       # Products & portfolio showcase
│   │   ├── Reviews.tsx         # Client testimonials & domain filters
│   │   └── Services.tsx        # Services list & detailed breakdowns
│   ├── App.tsx                 # Router configuration & providers
│   ├── index.css               # Global styles & Prism syntax theme
│   └── main.tsx                # React root mount
├── README.md                   # Project overview & documentation
├── WEBSITE_CONTENT_GUIDE.md    # Guide for editing all website content
└── WEBSITE_QA_REPORT.md        # Comprehensive functional QA test report
```

---

## 💻 Local Installation & Development

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm (v9.0.0 or higher) or Bun

### Steps

```bash
# 1. Clone the GitHub repository (replace the URL with your repository URL)
git clone <repository-url> 10lonaz-company-website
cd 10lonaz-company-website

# 2. Install dependencies
npm ci

# 3. Start local development server
npm run dev
```

Visit `http://localhost:8080` in your browser.

Firebase is optional for the current browser-only admin and website workflows. To develop Firebase-backed features, set the following values in a local `.env.local` file using the Web app configuration from the Firebase project selected in `.firebaserc`:

```dotenv
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

The Firebase Web app configuration is included in client-side code; do not put service-account credentials or other server secrets in `VITE_` variables. Without a complete configuration, the Firebase client remains uninitialized.

### Available Scripts

- `npm run dev`: Starts the Vite development server with Hot Module Replacement (HMR).
- `npm run build`: Type-checks the TypeScript project and creates an optimized production bundle in `dist/`.
- `npm run lint`: Executes ESLint across all TypeScript and TSX files.
- `npm run preview`: Locally previews the production build from `dist/`.

---

## 📝 Content Management & Data Organization

All website content is organized into typed data files in `src/data/`. To update or add content, simply edit the corresponding file:
- **Job Vacancies:** `src/data/careers.ts`
- **Technical Articles:** `src/data/articles.ts`
- **Company Information & Socials:** `src/data/company.ts`
- **Frequently Asked Questions:** `src/data/faqs.ts`
- **Services & Practices:** `src/data/services.ts`
- **Portfolio & Case Studies:** `src/data/products.ts`
- **Client Reviews:** `src/data/testimonials.ts`

For comprehensive instructions on modifying items without breaking code, refer to [WEBSITE_CONTENT_GUIDE.md](./WEBSITE_CONTENT_GUIDE.md).

---

## 🌐 Deployment Instructions

### Firebase Hosting (Current Setup)
The project includes `.firebaserc` and `firebase.json` pre-configured for Firebase Hosting:

```bash
# Sign in to Firebase once on this machine
npx firebase-tools login

# Build the production application
npm run build

# Deploy to the project selected in .firebaserc
npx firebase-tools deploy --only hosting
```

### Static Web Hosting (Vercel, Netlify, Cloudflare Pages, AWS S3)
The production output is entirely static within `dist/`. Ensure your host redirects all routes (`/*`) to `/index.html` for single-page client-side routing.
#   1 0 l o n a z  
 