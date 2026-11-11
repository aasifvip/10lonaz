/**
 * 10LONAZ — SEO, AEO & GEO Metadata Configuration & Schema Generators
 * Provides structured Schema.org JSON-LD and page metadata.
 */

import { companyData } from "./company";
import { JobVacancy } from "./careers";
import { Article } from "./articles";
import { FAQItem } from "./faqs";
import { ServiceDetail } from "./services";

export interface PageMetadata {
  title: string;
  description: string;
  keywords?: string[];
  canonicalPath?: string;
  ogType?: "website" | "article" | "profile";
  ogImage?: string;
  noindex?: boolean;
}

export const defaultMetadata: PageMetadata = {
  title: "10lonaz — Custom Software, SaaS & AI Solutions",
  description:
    "10lonaz is a global software engineering company crafting custom software, multi-tenant SaaS platforms, mobile & web applications, AI copilots, and cloud infrastructure.",
  keywords: [
    "10lonaz",
    "software development company",
    "custom software development",
    "SaaS product development",
    "web application development",
    "mobile app development",
    "AI solutions",
    "LLM copilots",
    "cloud DevOps",
    "software engineering",
  ],
  canonicalPath: "/",
  ogType: "website",
  ogImage: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=1200",
};

/**
 * Generate Organization JSON-LD
 */
export const getOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: companyData.name,
    legalName: companyData.legalName,
    alternateName: companyData.brandName,
    url: companyData.siteUrl,
    logo: companyData.logoUrl || `${companyData.siteUrl}/favicon.ico`,
    description: companyData.shortDescription,
    email: companyData.contact.email,
    telephone: companyData.contact.phone,
    foundingDate: `${companyData.foundingYear}-01-01`,
    address: {
      "@type": "PostalAddress",
      streetAddress: companyData.contact.address.line1,
      addressLocality: companyData.contact.address.city,
      addressRegion: companyData.contact.address.region,
      postalCode: companyData.contact.address.postalCode,
      addressCountry: companyData.contact.address.country,
    },
    sameAs: companyData.socialLinks.map((s) => s.url),
    knowsAbout: companyData.knowsAbout ?? [
      "Custom Software Development",
      "SaaS Engineering",
      "Artificial Intelligence & LLMs",
      "Cloud Infrastructure & DevOps",
      "Mobile Applications",
      "Web Application Security",
    ],
  };
};

/**
 * Generate WebSite JSON-LD
 */
export const getWebSiteSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: companyData.name,
    alternateName: companyData.brandName,
    url: companyData.siteUrl,
    description: companyData.tagline,
    publisher: {
      "@type": "Organization",
      name: companyData.name,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${companyData.siteUrl}/articles?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
};

/**
 * Generate BreadcrumbList JSON-LD
 */
export const getBreadcrumbSchema = (
  items: { name: string; path: string }[]
) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${companyData.siteUrl}${item.path}`,
    })),
  };
};

/**
 * Generate JobPosting JSON-LD for Career Vacancy
 */
export const getJobPostingSchema = (job: JobVacancy) => {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: `
      <h3>Role Overview</h3>
      <p>${job.overview}</p>
      <h3>Responsibilities</h3>
      <ul>${job.responsibilities.map((r) => `<li>${r}</li>`).join("")}</ul>
      <h3>Requirements</h3>
      <ul>${job.requirements.map((r) => `<li>${r}</li>`).join("")}</ul>
      <h3>Qualifications</h3>
      <ul>${job.qualifications.map((q) => `<li>${q}</li>`).join("")}</ul>
      <h3>Benefits</h3>
      <ul>${job.benefits.map((b) => `<li>${b}</li>`).join("")}</ul>
    `,
    identifier: {
      "@type": "PropertyValue",
      name: companyData.name,
      value: job.id,
    },
    datePosted: job.postedDate,
    validThrough: job.deadline,
    employmentType:
      job.type === "Full-time"
        ? "FULL_TIME"
        : job.type === "Part-time"
        ? "PART_TIME"
        : "CONTRACTOR",
    hiringOrganization: {
      "@type": "Organization",
      name: companyData.name,
      sameAs: companyData.siteUrl,
      logo: companyData.logoUrl || `${companyData.siteUrl}/favicon.ico`,
    },
    jobLocationType: "TELECOMMUTE",
    applicantLocationRequirements: {
      "@type": "Country",
      name: "Worldwide",
    },
    baseSalary: {
      "@type": "MonetaryAmount",
      currency: "USD",
      value: {
        "@type": "QuantitativeValue",
        value: job.salary,
        unitText: "YEAR",
      },
    },
  };
};

/**
 * Generate FAQPage JSON-LD
 */
export const getFAQPageSchema = (faqs: FAQItem[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
};

/**
 * Generate Article / BlogPosting JSON-LD
 */
export const getArticleSchema = (article: Article) => {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    alternativeHeadline: article.subtitle,
    description: article.excerpt,
    image: article.coverImage,
    datePublished: article.publishDate,
    dateModified: article.updatedDate || article.publishDate,
    author: {
      "@type": "Person",
      name: article.author.name,
      jobTitle: article.author.role,
      image: article.author.avatar,
    },
    publisher: {
      "@type": "Organization",
      name: companyData.name,
      logo: {
        "@type": "ImageObject",
        url: companyData.logoUrl || `${companyData.siteUrl}/favicon.ico`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${companyData.siteUrl}/articles/${article.slug}`,
    },
    keywords: article.tags.join(", "),
  };
};

/**
 * Generate Service JSON-LD
 */
export const getServiceSchema = (service: ServiceDetail) => {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: service.title,
    provider: {
      "@type": "Organization",
      name: companyData.name,
      url: companyData.siteUrl,
    },
    description: service.shortDescription,
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "USD",
    },
  };
};
