import { readContentOverride } from "@/admin/contentRepository";

/**
 * 10LONAZ — Company Information & Master Configuration
 * Centralized content source for contact details, social links, and branding.
 * Easily editable and ready for future Firebase / Admin panel sync.
 */

export interface SocialLink {
  platform: string;
  url: string;
  label: string;
  handle: string;
}

export interface CompanyInfo {
  name: string;
  legalName: string;
  brandName: string;
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  foundingYear: number;
  headquarters: string;
  workingModel: string;
  contact: {
    email: string;
    careersEmail: string;
    supportEmail: string;
    phone: string;
    phoneDisplay: string;
    whatsapp: string;
    whatsappLink: string;
    address: {
      line1: string;
      line2: string;
      city: string;
      region: string;
      country: string;
      postalCode: string;
      formatted: string;
    };
    workingHours: string;
  };
  socialLinks: SocialLink[];
  stats: {
    projectsDelivered: string;
    clientSatisfaction: string;
    countriesServed: string;
    uptimeSLA: string;
    yearsInBusiness: string;
  };
  siteUrl: string;
  logoUrl?: string;
  faviconUrl?: string;
  defaultOgImage?: string;
  knowsAbout?: string[];
}

const seedCompanyData: CompanyInfo = {
  name: "10lonaz",
  legalName: "10lonaz Technologies Inc.",
  brandName: "10LONAZ",
  tagline: "Custom Software, SaaS & AI Solutions Engineered for Growth",
  shortDescription:
    "10lonaz is a global software company crafting custom software, SaaS products, mobile & web apps, AI solutions, and cloud platforms that help modern businesses scale with confidence.",
  fullDescription:
    "Founded in 2020, 10lonaz engineers high-performance digital products for startups, scale-ups, and global enterprises. We specialize in end-to-end full-stack web and mobile development, multi-tenant SaaS architecture, generative AI copilots, and cloud DevOps infrastructure.",
  foundingYear: 2020,
  headquarters: "Global · Remote-First Operations",
  workingModel: "100% Distributed Global Engineering Team",
  contact: {
    email: "hello@10lonaz.com",
    careersEmail: "careers@10lonaz.com",
    supportEmail: "support@10lonaz.com",
    phone: "+94 78 804 2003",
    phoneDisplay: "+(94) 78-804-2003",
    whatsapp: "+94 78 804 2003",
    whatsappLink: "https://wa.me/94788042003?text=Hello%2010lonaz%2C%20I%20would%20like%20to%20discuss%20a%20software%20project.",
    address: {
      line1: "100 Innovation Boulevard",
      line2: "Suite 400",
      city: "San Francisco",
      region: "CA",
      country: "United States",
      postalCode: "94105",
      formatted: "100 Innovation Blvd, Suite 400, San Francisco, CA 94105 & Worldwide Remote",
    },
    workingHours: "Monday – Friday: 9:00 AM – 6:00 PM EST (24/7 Client Emergency On-Call)",
  },
  socialLinks: [
    {
      platform: "GitHub",
      url: "https://github.com/10lonaz",
      label: "GitHub",
      handle: "@10lonaz",
    },
    {
      platform: "LinkedIn",
      url: "https://linkedin.com/company/10lonaz",
      label: "LinkedIn",
      handle: "10lonaz",
    },
    {
      platform: "YouTube",
      url: "https://youtube.com/@10lonaz",
      label: "YouTube",
      handle: "@10lonaz",
    },
    {
      platform: "Instagram",
      url: "https://instagram.com/10lonaz",
      label: "Instagram",
      handle: "@10lonaz",
    },
    {
      platform: "X",
      url: "https://x.com/10lonaz",
      label: "X (Twitter)",
      handle: "@10lonaz",
    },
  ],
  stats: {
    projectsDelivered: "120+",
    clientSatisfaction: "99.2%",
    countriesServed: "15+",
    uptimeSLA: "99.95%",
    yearsInBusiness: "6+",
  },
  siteUrl: "https://10lonaz.com",
  logoUrl: "/10lonaz.svg",
  faviconUrl: "/10lonaz.svg",
};

export const companyData = readContentOverride<CompanyInfo>("company", seedCompanyData);

export default companyData;
