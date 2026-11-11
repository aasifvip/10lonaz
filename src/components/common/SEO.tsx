import { useEffect } from "react";
import { companyData } from "@/data/company";
import { defaultMetadata } from "@/data/seo";
import { readContentOverride } from "@/admin/contentRepository";

interface PageSeoOverride {
  id: string;
  title?: string;
  description?: string;
  canonicalPath: string;
  keywords?: string[];
  ogImage?: string;
}

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalPath?: string;
  ogType?: "website" | "article" | "profile";
  ogImage?: string;
  schemas?: object[];
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  canonicalPath = "/",
  ogType = "website",
  ogImage,
  schemas = [],
}) => {
  const seoOverrides = readContentOverride<PageSeoOverride[]>("seo", []);
  const routeOverride = seoOverrides.find((item) => item.canonicalPath === canonicalPath);
  const resolvedTitle = routeOverride?.title || title || defaultMetadata.title;
  const fullTitle = resolvedTitle === defaultMetadata.title ? resolvedTitle : `${resolvedTitle} | ${companyData.brandName || "10lonaz"}`;
  const metaDescription = routeOverride?.description || description || defaultMetadata.description;
  const resolvedPath = routeOverride?.canonicalPath || canonicalPath;
  const canonicalUrl = `${companyData.siteUrl}${resolvedPath.startsWith("/") ? resolvedPath : `/${resolvedPath}`}`;
  const metaImage = ogImage || routeOverride?.ogImage || companyData.defaultOgImage || defaultMetadata.ogImage;
  const metaKeywords = keywords ? keywords.join(", ") : routeOverride?.keywords?.join(", ") || defaultMetadata.keywords?.join(", ");

  useEffect(() => {
    // 1. Update Title
    document.title = fullTitle;

    // Helper to update or create meta tags
    const setMeta = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? "property" : "name";
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // 2. Standard Meta
    setMeta("description", metaDescription);
    if (metaKeywords) setMeta("keywords", metaKeywords);

    // 3. Canonical Link
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement("link");
      canonicalTag.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute("href", canonicalUrl);

    // 4. OpenGraph
    setMeta("og:title", fullTitle, true);
    setMeta("og:description", metaDescription, true);
    setMeta("og:type", ogType, true);
    setMeta("og:url", canonicalUrl, true);
    if (metaImage) setMeta("og:image", metaImage, true);

    // 5. Twitter Card
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", metaDescription);
    if (metaImage) setMeta("twitter:image", metaImage);

    const faviconUrl = companyData.faviconUrl;
    if (faviconUrl) {
      let favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
      if (!favicon) {
        favicon = document.createElement("link");
        favicon.rel = "icon";
        document.head.appendChild(favicon);
      }
      favicon.href = faviconUrl;
    }

    // 6. JSON-LD Schemas injection
    const scriptId = "dynamic-json-ld-scripts";
    let scriptContainer = document.getElementById(scriptId);
    if (!scriptContainer) {
      scriptContainer = document.createElement("div");
      scriptContainer.id = scriptId;
      document.head.appendChild(scriptContainer);
    }

    // Clean old schemas and inject current ones
    scriptContainer.innerHTML = "";
    schemas.forEach((schemaData) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.text = JSON.stringify(schemaData);
      scriptContainer?.appendChild(script);
    });

    return () => {
      // Cleanup schemas on unmount
      if (scriptContainer) {
        scriptContainer.innerHTML = "";
      }
    };
  }, [fullTitle, metaDescription, canonicalUrl, metaImage, metaKeywords, ogType, schemas]);

  return null;
};

export default SEO;
