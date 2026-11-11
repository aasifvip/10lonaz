import { Link } from "react-router-dom";
import {
  Github,
  Linkedin,
  Mail,
  Instagram,
  Youtube,
  Phone,
  MapPin,
  MessageCircle,
  Briefcase,
  HelpCircle,
  ExternalLink,
  LucideIcon,
} from "lucide-react";
import { companyData } from "@/data/company";
import { useLanguage } from "@/hooks/useLanguage";
import { readSiteSettings } from "@/admin/contentRepository";

// Map platforms to their respective Lucide icons
const socialIconMap: Record<string, LucideIcon> = {
  GitHub: Github,
  LinkedIn: Linkedin,
  YouTube: Youtube,
  Instagram: Instagram,
  X: ExternalLink,
};

const footerLinks = {
  company: [
    { name: "About Us", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Products & Portfolio", path: "/portfolio" },
    { name: "Careers (We're Hiring)", path: "/careers", badge: "Hiring" },
    { name: "Articles & Insights", path: "/articles" },
    { name: "Client Reviews", path: "/reviews" },
  ],
  services: [
    { name: "Custom Software Development", path: "/services" },
    { name: "SaaS Product Engineering", path: "/services" },
    { name: "AI Solutions & Copilots", path: "/services" },
    { name: "Web & Mobile Applications", path: "/services" },
    { name: "Cloud & DevOps Infrastructure", path: "/services" },
    { name: "UI/UX Design Systems", path: "/services" },
  ],
  support: [
    { name: "Frequently Asked Questions", path: "/faq" },
    { name: "Contact & Inquiries", path: "/contact" },
    { name: "WhatsApp Direct Chat", path: companyData.contact.whatsappLink, external: true },
    { name: "Careers Desk", path: "/careers" },
    { name: "Latest Announcements", path: "/articles?category=News" },
  ],
};

export function Footer() {
  const { t } = useLanguage();
  const hiringEnabled = readSiteSettings().hiringEnabled;
  const companyLinks = footerLinks.company.filter((link) => hiringEnabled || link.path !== "/careers");
  const supportLinks = footerLinks.support.filter((link) => hiringEnabled || link.path !== "/careers");
  return (
    <footer className="border-t bg-secondary/20 text-foreground transition-colors">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Company Info */}
          <div className="space-y-4 lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-3">
              {companyData.logoUrl ? (
                <img src={companyData.logoUrl} alt={companyData.brandName} className="h-10 w-auto object-contain" />
              ) : (
                <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-primary bg-clip-text text-transparent">
                  {companyData.brandName}
                </span>
              )}
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              {companyData.shortDescription}
            </p>

            <div className="pt-2 space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>{companyData.contact.address.formatted}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                <a
                  href={`mailto:${companyData.contact.email}`}
                  className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:underline"
                >
                  {companyData.contact.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
                <a
                  href={`tel:${companyData.contact.phone}`}
                  className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:underline"
                >
                  {companyData.contact.phoneDisplay}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <a
                  href={companyData.contact.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-500 transition-colors focus-visible:outline-none focus-visible:underline"
                >
                  WhatsApp Business Chat
                </a>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              {t("footer.about.title")}
            </h4>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded"
                  >
                    <span>{link.name}</span>
                    {link.badge && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              {t("services.title")}
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.services.map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Connect Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              {t("footer.quick.title")}
            </h4>
            <ul className="space-y-2.5">
              {supportLinks.map((link, i) => (
                <li key={i}>
                  {link.external ? (
                    <a
                      href={link.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      to={link.path}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            {/* Social Media Links with Fixed Hover / Pointer / Focus States (Requirement 10) */}
            <div className="pt-2">
              <p className="text-xs font-semibold text-muted-foreground mb-3">              {t("footer.social.title")}</p>
              <div className="flex flex-wrap items-center gap-2.5">
                {companyData.socialLinks.map((social) => {
                  const Icon = socialIconMap[social.platform] || ExternalLink;
                  return (
                    <a
                      key={social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${social.label} Profile`}
                      className="group relative flex h-9 w-9 items-center justify-center rounded-lg border border-border/70 bg-card text-muted-foreground transition-all duration-200 hover:border-primary/60 hover:bg-primary/5 hover:text-primary hover:shadow-[0_0_12px_rgba(59,130,246,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-95"
                    >
                      <Icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} {companyData.legalName} — All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
            {hiringEnabled && <Link to="/careers" className="hover:text-foreground transition-colors">Careers</Link>}
            <Link to="/faq" className="hover:text-foreground transition-colors">FAQ</Link>
            <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
