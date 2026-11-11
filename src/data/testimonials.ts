import { readContentOverride } from "@/admin/contentRepository";

/**
 * 10LONAZ — Testimonials & Client Reviews Data
 * Centralized, structured data prepared for future admin panel or Firebase integration.
 */

export interface Testimonial {
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
  order?: number;
}

const seedTestimonialsData: Testimonial[] = [
  {
    id: "rev-01",
    name: "Sarah Johnson",
    role: "CEO & Co-Founder",
    company: "TechStart Inc",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    content:
      "10lonaz delivered an exceptional multi-tenant cloud platform that exceeded our expectations. The team's expertise in cloud architecture and their ability to translate complex business workflows into an intuitive UX was truly impressive. Our platform now handles 10x the traffic with zero downtime.",
    rating: 5,
    project: "Enterprise Cloud Platform",
    category: "Cloud & SaaS",
    featured: true,
    verified: true,
  },
  {
    id: "rev-02",
    name: "Michael Chen",
    role: "Chief Technology Officer",
    company: "FinanceFlow Systems",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    content:
      "Reliable delivery, scalable microservices, and transparent communication throughout the entire 5-month engagement. They understood our strict security and data residency requirements and delivered a SOC2-compliant billing architecture ahead of schedule. Highly recommended for enterprise engineering.",
    rating: 5,
    project: "Multi-Region Billing Engine",
    category: "Fintech",
    featured: true,
    verified: true,
  },
  {
    id: "rev-03",
    name: "Emily Davis",
    role: "Founder & Head of Product",
    company: "HealthTech Solutions",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200",
    content:
      "They transformed our product vision into reality with remarkable speed and technical precision. The cross-platform mobile app they built in React Native has received overwhelmingly positive ratings from over 30,000 active patients and clinic providers.",
    rating: 5,
    project: "Patient Telehealth Mobile App",
    category: "Mobile",
    featured: true,
    verified: true,
  },
  {
    id: "rev-04",
    name: "David Rodriguez",
    role: "VP of Digital Commerce",
    company: "RetailCo Brands",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    content:
      "The headless e-commerce platform 10lonaz built transformed our online revenue. Organic search traffic doubled and mobile conversion rates increased by 250% in the first quarter post-launch. Their understanding of Core Web Vitals and payment gateways is world-class.",
    rating: 5,
    project: "Headless E-commerce Platform",
    category: "E-Commerce",
    featured: false,
    verified: true,
  },
  {
    id: "rev-05",
    name: "Lisa Wang",
    role: "VP of Engineering",
    company: "DataSync Global",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    content:
      "Professional, responsive, and deeply knowledgeable. They integrated 14 external partner APIs into a unified real-time event pipeline. The automated test coverage and clean TypeScript codebase made ongoing maintenance straightforward for our in-house team.",
    rating: 5,
    project: "Distributed API Integration Pipeline",
    category: "APIs & Integration",
    featured: false,
    verified: true,
  },
  {
    id: "rev-06",
    name: "James Miller",
    role: "Co-Founder & COO",
    company: "EduLearn Interactive",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
    content:
      "Working with 10lonaz was seamless from day one. They delivered our interactive learning management platform on time and strictly within budget. Their senior developers proactively identified architecture bottlenecks before they impacted launch day.",
    rating: 5,
    project: "Interactive Learning Management System",
    category: "Education",
    featured: false,
    verified: true,
  },
  {
    id: "rev-07",
    name: "Maria Garcia",
    role: "Director of Engineering",
    company: "FoodHub Logistics",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    content:
      "They engineered our driver dispatch and real-time tracking engine using WebSockets and Redis. Even during peak dinner surges, latency remains under 40ms. Their backend engineers are top-notch.",
    rating: 5,
    project: "Real-Time Fleet & Dispatch Engine",
    category: "Logistics",
    featured: false,
    verified: true,
  },
  {
    id: "rev-08",
    name: "Robert Taylor",
    role: "Chief Information Officer",
    company: "LogiTech Solutions",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200",
    content:
      "Modernizing our 12-year-old monolithic inventory system felt like an impossible task until we brought in 10lonaz. They executed an incremental strangler-fig migration without a single minute of customer-facing downtime. Outstanding technical leadership.",
    rating: 5,
    project: "Legacy Modernization & Cloud Migration",
    category: "Enterprise",
    featured: false,
    verified: true,
  },
];

export const testimonialsData = readContentOverride<Testimonial[]>("testimonials", seedTestimonialsData);

export const clientLogos = [
  "TechStart Inc",
  "FinanceFlow Systems",
  "HealthTech Solutions",
  "RetailCo Brands",
  "DataSync Global",
  "EduLearn Interactive",
  "FoodHub Logistics",
  "LogiTech Solutions",
];

export const getFeaturedTestimonials = (): Testimonial[] =>
  testimonialsData.filter((t) => t.featured);

export const getAllTestimonials = (): Testimonial[] => testimonialsData;
