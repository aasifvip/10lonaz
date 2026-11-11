import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  HelpCircle,
  Search,
  Filter,
  Sparkles,
  ArrowRight,
  MessageSquare,
  Mail,
  ChevronDown,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { SEO } from "@/components/common/SEO";
import { faqData, searchFaqs } from "@/data/faqs";
import { companyData } from "@/data/company";
import { getFAQPageSchema, getBreadcrumbSchema } from "@/data/seo";

export const FAQPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = useMemo(() => ["All", ...new Set(faqData.map((faq) => faq.category))], []);

  const filteredFaqs = useMemo(() => {
    return searchFaqs(searchQuery, selectedCategory);
  }, [searchQuery, selectedCategory]);

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "FAQ", path: "/faq" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="Frequently Asked Questions (FAQ)"
        description="Find answers to common questions about 10lonaz software development services, multi-tenant SaaS architecture, pricing models, project timelines, and 24/7 maintenance support."
        canonicalPath="/faq"
        schemas={[getFAQPageSchema(filteredFaqs), getBreadcrumbSchema(breadcrumbs)]}
      />
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-24 bg-gradient-to-b from-primary/5 via-secondary/20 to-background border-b">
          <div className="container mx-auto px-4 max-w-4xl text-center space-y-6">
            <Badge variant="outline" className="px-3.5 py-1 text-sm font-medium gap-1.5 border-primary/30 bg-primary/5">
              <HelpCircle className="h-3.5 w-3.5 text-primary" />
              Help &amp; Knowledge Base
            </Badge>

            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
              Frequently Asked Questions
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Clear, transparent answers about our engineering process, custom software services, pricing, multi-tenant SaaS, and ongoing support.
            </p>

            {/* Live Search Bar */}
            <div className="relative max-w-xl mx-auto pt-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search questions (e.g. pricing, SaaS, AI, security, SLA)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-6 text-base rounded-xl shadow-sm bg-background border-border/80"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Categories Bar */}
        <section className="py-6 bg-muted/20 border-b sticky top-16 z-20 backdrop-blur-md">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1 mr-2 shrink-0">
                <Filter className="h-3.5 w-3.5" /> Category:
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

        {/* FAQs Accordion List */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="flex items-center justify-between mb-8">
              <p className="text-sm font-medium text-muted-foreground">
                Showing {filteredFaqs.length} {filteredFaqs.length === 1 ? "question" : "questions"}
                {selectedCategory !== "All" && ` in ${selectedCategory}`}
                {searchQuery && ` matching "${searchQuery}"`}
              </p>
            </div>

            {filteredFaqs.length > 0 ? (
              <Accordion type="single" collapsible className="space-y-4">
                {filteredFaqs.map((faq, index) => (
                  <AccordionItem
                    key={faq.id}
                    value={faq.id}
                    className="border rounded-xl px-6 bg-card transition-all hover:border-primary/40 shadow-sm"
                  >
                    <AccordionTrigger className="text-left text-base md:text-lg font-semibold py-5 hover:no-underline gap-4">
                      <span className="flex-1">{faq.question}</span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground font-normal shrink-0 hidden sm:inline-block">
                        {faq.category}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm md:text-base leading-relaxed pb-6 pt-1 border-t border-border/40 mt-1">
                      {faq.answer}
                      {faq.tags && faq.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-4">
                          {faq.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              /* Empty state */
              <div className="text-center py-16 px-4 border rounded-2xl bg-muted/10 space-y-4">
                <HelpCircle className="h-10 w-10 text-muted-foreground mx-auto" />
                <h3 className="text-xl font-bold">No Questions Match Your Search</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  We couldn't find any questions matching "{searchQuery}". You can clear your search or ask our engineering team directly!
                </p>
                <div className="flex justify-center gap-3 pt-2">
                  <Button variant="outline" size="sm" onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}>
                    Reset Filters
                  </Button>
                  <Button asChild size="sm">
                    <Link to="/contact">Ask a Question</Link>
                  </Button>
                </div>
              </div>
            )}

            {/* Need More Help Card */}
            <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-primary/10 via-secondary/30 to-background border text-center space-y-4">
              <h3 className="text-2xl font-bold">Still Have Unanswered Questions?</h3>
              <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
                Our senior engineering team is ready to review your project specs, discuss architectural tradeoffs, and provide a transparent quote within one business day.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <Button asChild size="lg" className="font-semibold gap-2">
                  <Link to="/contact">
                    <MessageSquare className="h-4 w-4" />
                    Contact Our Engineers
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="gap-2">
                  <a href={`mailto:${companyData.contact.email}`}>
                    <Mail className="h-4 w-4" />
                    Email Us Directly
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FAQPage;
