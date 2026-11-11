import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { readSiteSettings } from "@/admin/contentRepository";

declare global {
  interface Window {
    dataLayer?: unknown[][];
    gtag?: (...args: unknown[]) => void;
  }
}

export function GoogleAnalytics() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith("/admin")) return;
    const measurementId = readSiteSettings().analyticsMeasurementId || import.meta.env.VITE_GA_MEASUREMENT_ID || "";
    if (!/^G-[A-Z0-9]+$/i.test(measurementId)) return;

    let script = document.querySelector<HTMLScriptElement>(`script[data-ga-id="${measurementId}"]`);
    if (!script) {
      script = document.createElement("script");
      script.async = true;
      script.dataset.gaId = measurementId;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
      document.head.appendChild(script);
      window.dataLayer = window.dataLayer ?? [];
      window.gtag = (...args: unknown[]) => {
        window.dataLayer?.push(args);
      };
      window.gtag("js", new Date());
      window.gtag("config", measurementId, { send_page_view: false });
    }

    window.gtag?.("event", "page_view", {
      page_path: `${location.pathname}${location.search}${location.hash}`,
      page_title: document.title,
    });
  }, [location.pathname, location.search, location.hash]);

  return null;
}
