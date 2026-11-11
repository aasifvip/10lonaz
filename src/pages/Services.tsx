import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Code2,
  Boxes,
  Globe,
  Smartphone,
  Building2,
  Brain,
  Cloud,
  Palette,
  Plug,
  Search,
  Wrench,
  Compass,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  HelpCircle,
  LucideIcon,
} from "lucide-react";
import { SEO } from "@/components/common/SEO";
import { servicesData, ServiceDetail } from "@/data/services";
import { getServiceSchema, getBreadcrumbSchema } from "@/data/seo";

// Map iconName strings to Lucide components
const iconMap: Record<string, LucideIcon> = {
  Code2,
  Boxes,
  Globe,
  Smartphone,
  Building2,
  Brain,
  Cloud,
  Palette,
  Plug,
  Search,
  Wrench,
  Compass,
};

const categories = [
  "All",
  "Development",
  "Architecture & Cloud",
  "Design & Strategy",
  "Growth & Operations",
];

export const Services: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredServices = useMemo(() => {
    const published = servicesData.filter((service) => service.published !== false);
    if (selectedCategory === "All") return published;
    return published.filter((s) => s.category === selectedCategory);
  }, [selectedCategory]);

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="Custom Software, SaaS & AI Engineering Services"
        description="Comprehensive software development services: Bespoke web & mobile applications, multi-tenant SaaS architecture, enterprise AI copilots, cloud DevOps, and 24/7 maintenance."
        canonicalPath="/services"
        schemas={[
          ...servicesData.filter((service) => service.published !== false).slice(0, 5).map((s) => getServiceSchema(s)),
          getBreadcrumbSchema(breadcrumbs),
        ]}
      />
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-28 bg-gradient-to-br from-background via-secondary/20 to-accent/10 border-b">
          <div className="container mx-auto px-4 max-w-4xl text-center space-y-6">
            <Badge variant="outline" className="px-3.5 py-1 text-xs font-semibold gap-1.5 border-primary/30">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              End-to-End Capabilities
            </Badge>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              Software Services Built for <span className="text-primary">Scale &amp; Precision</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              From architectural discovery to zero-downtime deployment — 10lonaz delivers custom software, SaaS products, and intelligent AI systems engineered to accelerate your business.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Button asChild size="lg" className="font-semibold gap-2">
                <Link to="/contact">
                  Request a Free Technical Proposal
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/portfolio">Explore Our Products &amp; Case Studies</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Category Filters */}
        <section className="py-6 bg-muted/20 border-b sticky top-16 z-20 backdrop-blur-md">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mr-2 shrink-0">
                Filter by practice:
              </span>
              {categories.map((cat) => (
                <Button
                  key={cat}
                  size="sm"
                  variant={selectedCategory === cat ? "default" : "outline"}
                  onClick={() => setSelectedCategory(cat)}
                  className="h-8 text-xs font-medium shrink-0 rounded-full"
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex items-center justify-between mb-8">
              <p className="text-sm font-medium text-muted-foreground">
                Showing {filteredServices.length} specialized {filteredServices.length === 1 ? "service" : "services"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredServices.map((service) => {
                const IconComponent = iconMap[service.iconName] || Code2;
                return (
                  <Card
                    key={service.id}
                    id={service.slug}
                    className="group flex flex-col justify-between border hover:border-primary/50 transition-all duration-300 hover:shadow-xl bg-card"
                  >
                    <div>
                      {service.imageUrl && <img src={service.imageUrl} alt="" loading="lazy" className="h-48 w-full rounded-t-xl object-cover" />}
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="w-13 h-13 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                            <IconComponent className="h-6 w-6" />
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <Badge variant="secondary" className="text-[11px] font-medium">
                              {service.category}
                            </Badge>
                            {service.popular && (
                              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                                Popular
                              </span>
                            )}
                          </div>
                        </div>

                        <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                          {service.title}
                        </CardTitle>
                        <CardDescription className="text-sm leading-relaxed mt-1">
                          {service.shortDescription}
                        </CardDescription>
                        {service.pricing && <p className="mt-2 text-sm font-semibold text-primary">{service.pricing}</p>}
                      </CardHeader>

                      <CardContent className="space-y-4 pt-0">
                        {/* Key Features */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                            What's Included
                          </h4>
                          <ul className="space-y-1.5 text-xs text-muted-foreground">
                            {service.features.map((feat, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <CheckCircle2 className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Deliverables */}
                        <div className="space-y-2 pt-2 border-t border-border/40">
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                            Key Deliverables
                          </h4>
                          <ul className="space-y-1 text-xs text-muted-foreground">
                            {service.deliverables.slice(0, 3).map((del, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-primary font-bold">•</span>
                                <span>{del}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Tech Stack */}
                        <div className="space-y-1.5 pt-2 border-t border-border/40">
                          <h4 className="text-xs font-semibold text-muted-foreground">Core Tech:</h4>
                          <div className="flex flex-wrap gap-1">
                            {service.techStack.map((tech) => (
                              <Badge key={tech} variant="outline" className="text-[10px] font-mono px-2 py-0">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </div>

                    {/* Card Footer: Timeline & Action */}
                    <div className="p-6 pt-0 mt-4 border-t border-border/40 flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                        <Clock className="h-3.5 w-3.5 text-primary" />
                        <span>{service.timeline}</span>
                      </div>
                      <Button asChild size="sm" variant="ghost" className="font-semibold text-primary hover:text-primary gap-1 group-hover:translate-x-1 transition-transform">
                        <Link to={`/contact?service=${encodeURIComponent(service.title)}`}>
                          Request Quote
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why Choose 10lonaz Engineering Section */}
        <section className="py-20 bg-secondary/20 border-y">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center space-y-4 mb-16 max-w-2xl mx-auto">
              <Badge variant="outline">The 10lonaz Standard</Badge>
              <h2 className="text-3xl md:text-4xl font-bold">Why Companies Trust 10lonaz</h2>
              <p className="text-muted-foreground text-base md:text-lg">
                We combine product strategy, senior engineering craft, and transparent remote delivery.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl bg-card border shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                  01
                </div>
                <h3 className="text-lg font-bold">Senior Talent Exclusively</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  No junior handoffs. Every sprint is executed by staff-level engineers and architects with 5+ years of production experience.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-card border shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                  02
                </div>
                <h3 className="text-lg font-bold">100% IP &amp; Code Ownership</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  You own all Git repositories, infrastructure scripts, and design tokens with zero proprietary lock-in or licensing fees.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-card border shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                  03
                </div>
                <h3 className="text-lg font-bold">Guaranteed SLA &amp; Support</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Every product comes backed by post-launch warranty, automated uptime monitoring, and sub-1-hour emergency response times.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Consultation Call to Action */}
        <section className="py-20 bg-gradient-to-r from-background via-primary/5 to-secondary/30">
          <div className="container mx-auto px-4 max-w-3xl text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Start Your Software Project?</h2>
            <p className="text-lg text-muted-foreground">
              Share your project goals and requirements. We'll reply within 24 hours with an architecture roadmap, estimated timeline, and transparent quote.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Button asChild size="lg" className="font-semibold gap-2">
                <Link to="/contact">
                  Start Technical Discovery
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/faq">Read Common Service FAQs</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Services;
