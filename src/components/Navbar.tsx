import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Moon, Sun, Monitor, Menu, X, Globe, Sparkles } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";
import { languages } from "@/lib/translations";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { readSiteSettings } from "@/admin/contentRepository";
import { companyData } from "@/data/company";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const siteSettings = readSiteSettings();

  const navLinks = [
    { name: t("nav.home") || "Home", path: "/" },
    { name: t("nav.about") || "About", path: "/about" },
    { name: t("nav.services") || "Services", path: "/services" },
    { name: t("nav.portfolio") || "Portfolio", path: "/portfolio" },
    ...(siteSettings.hiringEnabled ? [{ name: t("nav.careers") || "Careers", path: "/careers", badge: "Hiring" }] : []),
    { name: t("nav.articles") || "Articles", path: "/articles" },
    { name: t("nav.faq") || "FAQ", path: "/faq" },
    { name: t("nav.reviews") || "Reviews", path: "/reviews" },
    { name: t("nav.contact") || "Contact", path: "/contact" },
  ].filter((link) => siteSettings.visibleNavigation.includes(link.path));

  const isLinkActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const handleHomeClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cycleTheme = () => {
    if (theme === "system") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("system");
    }
  };

  const renderThemeIcon = () => {
    if (theme === "dark") return <Moon className="h-4 w-4" />;
    if (theme === "light") return <Sun className="h-4 w-4" />;
    return <Monitor className="h-4 w-4" />;
  };

  const getThemeLabel = () => {
    if (theme === "dark") return "Dark Mode (Click for Light)";
    if (theme === "light") return "Light Mode (Click for System)";
    return "System Mode (Click for Dark)";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/85 backdrop-blur-xl transition-colors">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Brand Logo */}
          <Link
            to="/"
            onClick={handleHomeClick}
            className="flex items-center space-x-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md py-1"
          >
            {companyData.logoUrl ? (
              <img src={companyData.logoUrl} alt={companyData.brandName} className="max-h-9 max-w-36 object-contain" />
            ) : (
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-primary bg-clip-text text-transparent">
                {companyData.brandName}
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav aria-label="Main Navigation" className="hidden lg:flex items-center space-x-6 xl:space-x-7">
            {navLinks.map((link) => {
              const active = isLinkActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={link.path === "/" ? handleHomeClick : undefined}
                  className={cn(
                    "relative py-1 text-sm font-medium transition-colors hover:text-primary flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded",
                    active ? "text-primary font-semibold" : "text-muted-foreground"
                  )}
                >
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-primary/15 text-primary border border-primary/20">
                      {link.badge}
                    </span>
                  )}
                  {active && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-[-16px] left-0 right-0 h-0.5 bg-primary rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Controls: Language Switcher, Theme Switcher, Mobile Toggle */}
          <div className="flex items-center space-x-2">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-muted-foreground hover:text-foreground"
                  aria-label="Change language"
                >
                  <Globe className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44 max-h-72 overflow-y-auto">
                {languages.filter((lang) => siteSettings.enabledLanguages.includes(lang.code)).map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={cn(
                      "cursor-pointer flex items-center justify-between text-xs py-2",
                      language === lang.code && "bg-secondary font-semibold text-primary"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base">{lang.flag}</span>
                      <span>{lang.name}</span>
                    </span>
                    {language === lang.code && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* 3-Way Theme Toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={cycleTheme}
                  aria-label={getThemeLabel()}
                  className="h-9 w-9 text-muted-foreground hover:text-foreground"
                >
                  {renderThemeIcon()}
                </Button>
              </TooltipTrigger>
              <TooltipContent align="end">
                <p className="text-xs">{getThemeLabel()}</p>
              </TooltipContent>
            </Tooltip>

            {/* Quick Contact CTA on desktop */}
            <Button asChild size="sm" className="hidden sm:inline-flex h-9 text-xs font-semibold ml-1">
              <Link to="/contact">Get in Touch</Link>
            </Button>

            {/* Mobile Menu Hamburger */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-9 w-9 text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden py-4 border-t border-border/40 space-y-1.5"
            >
              {navLinks.map((link) => {
                const active = isLinkActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (link.path === "/") handleHomeClick();
                    }}
                    className={cn(
                      "flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      active
                        ? "bg-secondary text-primary font-semibold"
                        : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                    )}
                  >
                    <span>{link.name}</span>
                    {link.badge && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}

              <div className="pt-3 border-t border-border/40 mt-2">
                <Button asChild className="w-full text-xs font-semibold" onClick={() => setMobileMenuOpen(false)}>
                  <Link to="/contact">Request a Quote</Link>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

export default Navbar;
