import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/hooks/LanguageProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CustomCursor } from "@/components/CustomCursor";
import { AIChatButton } from "@/components/chat/AIChatButton";
import { ScrollToTop } from "@/components/common/ScrollToTop";

// Pages
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Portfolio from "./pages/Portfolio";
import CaseStudy from "./pages/CaseStudy";
import Reviews from "./pages/Reviews";
import Articles from "./pages/Articles";
import ArticleDetails from "./pages/ArticleDetails";
import Careers from "./pages/Careers";
import JobDetails from "./pages/JobDetails";
import FAQPage from "./pages/FAQPage";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import { CONTENT_STORAGE_KEY, readSiteSettings } from "./admin/contentRepository";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { GoogleAnalytics } from "./components/common/GoogleAnalytics";
import { useEffect } from "react";

function CareersDisabled() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-6 py-24 text-center">
        <div className="max-w-xl space-y-4">
          <h1 className="text-3xl font-bold">Hiring is currently paused</h1>
          <p className="text-muted-foreground">There are no active career listings at this time. Please check back later or contact our team.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function PublicWidgets() {
  const { pathname } = useLocation();
  if (pathname.startsWith("/admin")) return null;
  return (
    <>
      <CustomCursor />
      <AIChatButton />
    </>
  );
}

function PublicContentSync() {
  const { pathname } = useLocation();

  useEffect(() => {
    const syncContent = (event: StorageEvent) => {
      if (event.key === CONTENT_STORAGE_KEY && !pathname.startsWith("/admin")) {
        window.location.reload();
      }
    };
    window.addEventListener("storage", syncContent);
    return () => window.removeEventListener("storage", syncContent);
  }, [pathname]);

  return null;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function AnimatedRoutes() {
  const location = useLocation();
  const siteSettings = readSiteSettings();

  if (siteSettings.maintenanceMode && !location.pathname.startsWith("/admin")) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
        <div className="max-w-xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">10LONAZ</p>
          <h1 className="text-3xl font-bold">We’ll be back soon</h1>
          <p className="text-muted-foreground">The website is temporarily unavailable while we make updates.</p>
        </div>
      </main>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <Index />
            </motion.div>
          }
        />
        <Route
          path="/about"
          element={
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <About />
            </motion.div>
          }
        />
        <Route
          path="/services"
          element={
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <Services />
            </motion.div>
          }
        />
        <Route
          path="/portfolio"
          element={
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <Portfolio />
            </motion.div>
          }
        />
        <Route
          path="/portfolio/:slug"
          element={
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <CaseStudy />
            </motion.div>
          }
        />
        <Route
          path="/careers"
          element={
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              {siteSettings.hiringEnabled ? <Careers /> : <CareersDisabled />}
            </motion.div>
          }
        />
        <Route
          path="/careers/:slug"
          element={
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              {siteSettings.hiringEnabled ? <JobDetails /> : <CareersDisabled />}
            </motion.div>
          }
        />
        <Route
          path="/faq"
          element={
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <FAQPage />
            </motion.div>
          }
        />
        <Route
          path="/reviews"
          element={
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <Reviews />
            </motion.div>
          }
        />
        <Route
          path="/articles"
          element={
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <Articles />
            </motion.div>
          }
        />
        <Route
          path="/articles/:slug"
          element={
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <ArticleDetails />
            </motion.div>
          }
        />
        <Route
          path="/contact"
          element={
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <Contact />
            </motion.div>
          }
        />
        {/* Catch-all 404 Route */}
        <Route
          path="*"
          element={
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <NotFound />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <PublicContentSync />
            <GoogleAnalytics />
            <PublicWidgets />
            <AnimatedRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
