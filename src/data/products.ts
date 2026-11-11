import { readContentOverride } from "@/admin/contentRepository";
import {
  Receipt, UtensilsCrossed, Hotel, Plane, HeartPulse, GraduationCap, Users,
  Briefcase, Boxes, CalendarCheck, ShoppingBag, BrainCircuit, Chrome,
  Smartphone, Code2, Sparkles, ShieldCheck, Download, ExternalLink,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Feature {
  title: string;
  description: string;
}

export interface PricingPlan {
  price: string;
  period?: string;
  trialDays?: number;
  buyUrl?: string;
  trialUrl?: string;
  features?: string[];
}

export interface CaseStudy {
  slug: string;
  icon: LucideIcon;
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
  features: Feature[];
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
  published?: boolean;
  featuredOnHome?: boolean;
  order?: number;
}

const seedProducts: CaseStudy[] = [
  {
    slug: "universal-billing-saas",
    icon: Receipt,
    title: "Universal Billing SaaS",
    description: "Multi-tenant billing, invoicing, and subscription management for any business.",
    overview: "Universal Billing SaaS is an enterprise-grade subscription and invoicing platform built for B2B SaaS companies. It handles usage-based billing, multi-currency proration, dunning automation, and automated tax compliance out of the box.",
    category: "SaaS",
    client: "Fintech scale-up (NDA)",
    industry: "Financial Services",
    timeline: "5 months — Discovery, MVP, GA launch",
    teamSize: "6 specialists",
    challenge: "Manual invoicing across three regions caused revenue leakage and month-end close taking over a week.",
    scope: [
      "Multi-tenant architecture with per-tenant isolation",
      "Recurring subscriptions, proration, and dunning flows",
      "Tax and multi-currency invoicing engine",
      "Customer billing portal and admin dashboard",
      "Stripe + bank transfer payment reconciliation",
    ],
    features: [
      { title: "Smart Metered Billing", description: "Track high-volume API usage and convert telemetry into accurate monthly invoices automatically." },
      { title: "Self-Serve Portal", description: "Allow customers to manage seats, upgrade plans, download VAT receipts, and update payment methods." },
      { title: "Dunning & Recovery", description: "Automated retry schedules and personalized email notifications that recover up to 20% of failed payments." },
      { title: "Global Tax Compliance", description: "Built-in integration for automatic sales tax, VAT, and GST calculation per country." },
    ],
    techStack: ["React", "TypeScript", "Node.js", "PostgreSQL", "Stripe", "Redis", "AWS"],
    outcomes: [
      { metric: "92%", label: "Less manual invoicing work" },
      { metric: "1 day", label: "Month-end close, down from 8" },
      { metric: "+18%", label: "Recovered failed payments" },
    ],
    productType: "paid",
    livePreviewUrl: "https://billing-demo.10lonaz.dev",
    pricing: {
      price: "$49",
      period: "per month",
      trialDays: 14,
      buyUrl: "https://billing-demo.10lonaz.dev/subscribe",
      trialUrl: "https://billing-demo.10lonaz.dev/trial",
      features: [
        "Up to 5,000 active subscriptions",
        "Multi-currency support (30+ currencies)",
        "Automated PDF invoice generation",
        "Priority 24/7 support",
      ],
    },
    screenshots: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    ],
    testimonial: {
      quote: "10lonaz replaced four spreadsheets and a contractor with one platform we actually trust.",
      author: "Head of Revenue Operations",
      role: "Fintech scale-up",
    },
  },
  {
    slug: "ai-page-summarizer-extension",
    icon: Chrome,
    title: "AI Web Assistant Extension",
    description: "Chrome extension for instant AI summarization, translation, and smart Q&A on any webpage.",
    overview: "A lightweight Chrome Extension that embeds an intelligent AI copilot directly inside your browser. Highlight text, summarize long research articles, extract key takeaways, or translate content into 30+ languages with a single keyboard shortcut.",
    category: "Browser Extensions",
    client: "Productivity Tools Inc.",
    industry: "Consumer Technology",
    timeline: "2 months — Extension architecture & Web Store release",
    teamSize: "3 specialists",
    challenge: "Knowledge workers spend hours skimming research PDFs and articles without a fast way to digest information.",
    scope: [
      "Manifest V3 Chrome Extension architecture",
      "Context menu integration and quick overlay sidebar",
      "Streaming LLM response parser with markdown rendering",
      "Custom prompt shortcut manager",
    ],
    features: [
      { title: "One-Click Summarization", description: "Generate concise bullet-point summaries of long articles, news, and technical documentation instantly." },
      { title: "In-Context Q&A", description: "Ask questions about the active webpage and receive answers backed by source text citations." },
      { title: "Smart Translation", description: "Translate highlighted paragraphs while retaining technical context and original formatting." },
    ],
    techStack: ["React", "TypeScript", "Chrome Extension API Manifest V3", "Tailwind CSS", "Vite"],
    outcomes: [
      { metric: "50,000+", label: "Active Chrome Web Store installs" },
      { metric: "4.9/5", label: "Average user rating" },
      { metric: "-65%", label: "Time spent reading research papers" },
    ],
    productType: "extension",
    extensionUrl: "https://chromewebstore.google.com",
    livePreviewUrl: "https://extension-demo.10lonaz.dev",
    screenshots: [
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    slug: "fitness-tracker-mobile-app",
    icon: Smartphone,
    title: "FitPulse Mobile Workout App",
    description: "Cross-platform iOS & Android workout planner, habit tracker, and health sync app.",
    overview: "FitPulse is a high-performance React Native mobile app engineered for iOS and Android. It syncs with Apple HealthKit and Google Fit to give users real-time biometric metrics, custom workout plans, and social leaderboards.",
    category: "Mobile Apps",
    client: "Fitness NextGen",
    industry: "Health & Fitness",
    timeline: "4 months — Cross-platform app store launch",
    teamSize: "4 specialists",
    challenge: "Legacy health apps were clunky, lacked offline sync, and didn't support Apple Watch telemetry.",
    scope: [
      "React Native & Expo cross-platform codebase",
      "Apple HealthKit & Google Fit API SDK integration",
      "Offline SQLite storage with background sync",
      "Push notification scheduling engine",
    ],
    features: [
      { title: "Biometric Integration", description: "Sync heart rate, steps, active calories, and sleep statistics automatically." },
      { title: "Custom Workout Builder", description: "Create tailored gym routines with audio cues, rest timers, and exercise demonstration videos." },
      { title: "Social Leaderboards", description: "Challenge friends, share achievements, and stay motivated with weekly community goals." },
    ],
    techStack: ["React Native", "TypeScript", "Expo", "GraphQL", "PostgreSQL", "Firebase"],
    outcomes: [
      { metric: "120k+", label: "App Store downloads" },
      { metric: "84%", label: "Day-30 user retention" },
      { metric: "4.8★", label: "iOS App Store Rating" },
    ],
    productType: "free",
    downloadUrl: "https://fitpulse.10lonaz.dev/download",
    livePreviewUrl: "https://fitpulse.10lonaz.dev",
    screenshots: [
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    slug: "ai-business-tools",
    icon: BrainCircuit,
    title: "AI Enterprise Copilot Platform",
    description: "AI copilots, document Q&A, and workflow automation for modern teams.",
    overview: "An enterprise-grade AI Copilot platform that ingests company knowledge bases (Slack, Notion, Confluence, PDFs) and provides context-aware Q&A, document drafting, and workflow automation while enforcing strict data privacy.",
    category: "AI",
    client: "Knowledge-heavy enterprise team",
    industry: "Technology",
    timeline: "4 months — pilot, evaluation, production",
    teamSize: "5 specialists",
    challenge: "Teams lost hours hunting through thousands of internal documents for answers that already existed.",
    scope: [
      "Document ingestion pipeline with chunking and embeddings",
      "Retrieval-augmented Q&A with cited sources",
      "Role-aware access to sensitive documents",
      "Workflow automation and drafting copilots",
      "Evaluation harness for answer quality",
    ],
    features: [
      { title: "RAG Semantic Search", description: "Search across enterprise documents with instant answers backed by direct citations." },
      { title: "Role-Based Access Control", description: "Ensure employees only receive answers based on their security permissions." },
      { title: "Custom AI Workflows", description: "Automate repetitive document reviews, contract summaries, and ticket triage." },
    ],
    techStack: ["React", "TypeScript", "Edge Functions", "Vector Database", "LLM Gateway", "PostgreSQL"],
    outcomes: [
      { metric: "-70%", label: "Time spent searching documents" },
      { metric: "94%", label: "Answers with verified citations" },
      { metric: "11", label: "Workflows automated end to end" },
    ],
    productType: "paid",
    livePreviewUrl: "https://ai-copilot.10lonaz.dev",
    pricing: {
      price: "$99",
      period: "per user/month",
      trialDays: 30,
      buyUrl: "https://ai-copilot.10lonaz.dev/enterprise",
      trialUrl: "https://ai-copilot.10lonaz.dev/demo",
      features: [
        "Unlimited document ingestion",
        "Custom Vector database hosting",
        "SSO & SOC-2 Compliance",
        "Dedicated Customer Success Manager",
      ],
    },
    screenshots: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    slug: "e-commerce-platform",
    icon: ShoppingBag,
    title: "Headless D2C E-Commerce Platform",
    description: "High-performance storefronts and marketplaces with dynamic checkout and inventory.",
    overview: "A modular, headless e-commerce engine designed for high-volume retail brands. Features instant page loads, dynamic multi-currency checkout, custom promotional rules, and real-time ERP inventory sync.",
    category: "E-commerce",
    client: "Direct-to-consumer retail brand",
    industry: "Retail",
    timeline: "6 months — replatform with zero SEO loss",
    teamSize: "7 specialists",
    challenge: "A slow legacy storefront capped mobile conversion and made every campaign launch a dev ticket.",
    scope: [
      "Headless storefront with CMS-driven merchandising",
      "Cart, checkout, and multi-gateway payments",
      "Shipping rates, fulfilment, and returns",
      "Marketplace seller onboarding and payouts",
      "SEO migration with 301 mapping and structured data",
    ],
    features: [
      { title: "Sub-Second Page Loads", description: "Edge-rendered product pages optimized for maximum Google Core Web Vitals scores." },
      { title: "One-Click Checkout", description: "Streamlined checkout supporting Apple Pay, Google Pay, Stripe, and buy-now-pay-later." },
      { title: "Omnichannel Inventory", description: "Real-time sync across online storefronts, physical retail POS, and warehouse locations." },
    ],
    techStack: ["React", "TypeScript", "Node.js", "PostgreSQL", "Stripe", "CDN Edge Caching"],
    outcomes: [
      { metric: "98", label: "Lighthouse performance score" },
      { metric: "+35%", label: "Mobile conversion rate" },
      { metric: "0%", label: "Organic traffic lost in migration" },
    ],
    productType: "paid",
    livePreviewUrl: "https://store-demo.10lonaz.dev",
    pricing: {
      price: "$199",
      period: "per month",
      trialDays: 14,
      buyUrl: "https://store-demo.10lonaz.dev/get-started",
      trialUrl: "https://store-demo.10lonaz.dev/trial",
      features: [
        "Unlimited products & SKUs",
        "0% transaction fee",
        "Global multi-currency checkout",
        "Built-in headless CMS integration",
      ],
    },
    screenshots: [
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    slug: "school-lms-platform",
    icon: GraduationCap,
    title: "School & LMS Platform",
    description: "Courses, quizzes, attendance, grading, and parent–teacher communication.",
    overview: "A unified Learning Management System designed for educational institutions. Combines interactive virtual classrooms, assignment authoring, real-time gradebooks, and parent portals into one seamless interface.",
    category: "Education",
    client: "K-12 school group",
    industry: "Education",
    timeline: "5 months — delivered before term start",
    teamSize: "6 specialists",
    challenge: "Teachers juggled four tools for lessons, grades, and parent updates, with no single record per student.",
    scope: [
      "Course authoring, assignments, and quiz engine",
      "Attendance, gradebook, and report cards",
      "Parent portal with progress and announcements",
      "Timetable and teacher workload planning",
      "Offline-friendly mobile experience",
    ],
    features: [
      { title: "Interactive Course Studio", description: "Build engaging video lessons, quizzes, and digital assignments with auto-grading." },
      { title: "Parent Portal", description: "Keep parents informed with real-time grade updates, attendance alerts, and direct messaging." },
      { title: "Automated Report Cards", description: "Generate official academic transcripts and progress evaluations in seconds." },
    ],
    techStack: ["React", "TypeScript", "Supabase", "PostgreSQL", "PWA", "Tailwind CSS"],
    outcomes: [
      { metric: "4→1", label: "Tools consolidated per teacher" },
      { metric: "6 hrs", label: "Saved per teacher each week" },
      { metric: "89%", label: "Monthly parent portal engagement" },
    ],
    productType: "free",
    downloadUrl: "https://lms-demo.10lonaz.dev/try-free",
    livePreviewUrl: "https://lms-demo.10lonaz.dev",
    screenshots: [
      "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    slug: "travel-booking-platform",
    icon: Plane,
    title: "Travel & Hospitality Booking Engine",
    description: "Flights, hotels, and package bookings with dynamic pricing and payments.",
    overview: "A next-generation travel marketplace connecting travel operators, hotels, and airlines. Delivers real-time supplier inventory aggregation, dynamic markup control, and instant itinerary generation.",
    category: "Marketplace",
    client: "Regional travel marketplace",
    industry: "Travel & Tourism",
    timeline: "7 months — MVP to multi-market launch",
    teamSize: "8 specialists",
    challenge: "Aggregating supplier inventory in real time while keeping search results under a second.",
    scope: [
      "Supplier and GDS integrations with caching layer",
      "Unified search across flights, stays, and packages",
      "Dynamic pricing, markup, and promo engine",
      "Multi-gateway checkout with 3-D Secure",
      "Agent back office and booking lifecycle tools",
    ],
    features: [
      { title: "Real-time GDS Aggregation", description: "Fetch live flight and hotel inventory across multiple GDS providers in under 800ms." },
      { title: "Dynamic Package Builder", description: "Allow customers to bundle stay, transit, and local activities with instant discounts." },
      { title: "Partner Back-Office", description: "Comprehensive management panel for travel agencies to adjust markups and manage bookings." },
    ],
    techStack: ["React", "TypeScript", "Node.js", "Elasticsearch", "PostgreSQL", "Kubernetes"],
    outcomes: [
      { metric: "780ms", label: "Median search response" },
      { metric: "3", label: "New markets launched in year one" },
      { metric: "+24%", label: "Checkout conversion rate" },
    ],
    productType: "standard",
    livePreviewUrl: "https://travel-demo.10lonaz.dev",
    screenshots: [
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    slug: "restaurant-management-system",
    icon: UtensilsCrossed,
    title: "Restaurant Operations POS System",
    description: "POS, table management, orders, kitchen display, and analytics in one platform.",
    overview: "An all-in-one operations system designed for multi-location restaurant groups. Includes offline-capable POS terminals, kitchen display screens, automated stock deductions, and real-time revenue analytics.",
    category: "Business",
    client: "Multi-location restaurant group",
    industry: "Hospitality & F&B",
    timeline: "4 months — pilot in 2 venues, rollout to 14",
    teamSize: "5 specialists",
    challenge: "Disconnected POS terminals and paper tickets slowed service and hid real-time performance data.",
    scope: [
      "Offline-first POS with tablet and terminal support",
      "Table, floor plan, and reservation management",
      "Kitchen display system with course timing",
      "Menu, recipe, and stock deduction engine",
      "Group-level analytics across all locations",
    ],
    features: [
      { title: "Offline-First POS", description: "Keep accepting orders and processing payments even if internet connectivity drops." },
      { title: "Kitchen Display (KDS)", description: "Eliminate paper kitchen tickets with real-time color-coded order status monitors." },
      { title: "Inventory Recipe Deduction", description: "Deduct raw ingredients automatically as items are ordered from the POS." },
    ],
    techStack: ["React", "PWA", "TypeScript", "Node.js", "PostgreSQL", "WebSockets"],
    outcomes: [
      { metric: "-31%", label: "Average order-to-table time" },
      { metric: "14", label: "Venues live in one quarter" },
      { metric: "+12%", label: "Average check via upsell prompts" },
    ],
    productType: "paid",
    livePreviewUrl: "https://pos-demo.10lonaz.dev",
    pricing: {
      price: "$79",
      period: "per terminal/month",
      trialDays: 14,
      buyUrl: "https://pos-demo.10lonaz.dev/order",
      trialUrl: "https://pos-demo.10lonaz.dev/trial",
      features: [
        "Unlimited menu items & modifiers",
        "Kitchen Display System software included",
        "Real-time multi-venue reporting",
        "Hardware bundle compatible",
      ],
    },
    screenshots: [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    ],
  },
];

const productIcons: Record<string, LucideIcon> = {
  Receipt,
  Chrome,
  Smartphone,
  BrainCircuit,
  ShoppingBag,
  GraduationCap,
  Plane,
  UtensilsCrossed,
  Hotel,
  HeartPulse,
  Users,
  Briefcase,
  Boxes,
  CalendarCheck,
  Sparkles,
  ShieldCheck,
  Download,
  ExternalLink,
  Code2,
};

const seedProductsWithIconNames = seedProducts.map(({ icon, ...product }, order) => ({
  ...product,
  iconName: Object.entries(productIcons).find(([, component]) => component === icon)?.[0] ?? "Code2",
  published: true,
  order,
  featuredOnHome: ["universal-billing-saas", "restaurant-management-system", "ai-business-tools"].includes(product.slug),
}));

export const products: CaseStudy[] = readContentOverride<Array<Omit<CaseStudy, "icon"> & { iconName: string }>>(
  "products",
  seedProductsWithIconNames,
).map(({ iconName, ...product }) => ({
  ...product,
  icon: productIcons[iconName] ?? Code2,
}));

export const productCategories = [
  "All",
  "SaaS",
  "Business",
  "Marketplace",
  "AI",
  "Education",
  "E-commerce",
  "Mobile Apps",
  "Browser Extensions",
] as const;

export const getProductBySlug = (slug?: string) =>
  products.find((p) => p.slug === slug && p.published !== false);