import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop Component
 * Ensures every route transition starts at the top of the viewport.
 * If an anchor hash exists (e.g., #faq), smoothly scrolls to that element
 * with an offset accounting for the sticky navbar (64px + padding).
 */
export const ScrollToTop: React.FC = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Small timeout to allow destination page content to render
      const timer = setTimeout(() => {
        const id = hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          const navHeight = 72; // sticky header offset
          const elementPosition = element.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: Math.max(0, elementPosition - navHeight),
            behavior: "smooth",
          });
        }
      }, 80);
      return () => clearTimeout(timer);
    } else {
      // Normal route navigation: reset scroll position to top
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant" as ScrollBehavior,
      });
    }
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
