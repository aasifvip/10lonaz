import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, ShieldCheck, CheckCircle2, MessageSquare, ArrowRight, Filter } from "lucide-react";
import { SEO } from "@/components/common/SEO";
import { testimonialsData, clientLogos, Testimonial } from "@/data/testimonials";
import { getBreadcrumbSchema } from "@/data/seo";

export const Reviews: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredTestimonials = useMemo(() => {
    if (selectedCategory === "All") return testimonialsData;
    return testimonialsData.filter((t) => t.category === selectedCategory);
  }, [selectedCategory]);

  const averageRating = useMemo(() => {
    const total = testimonialsData.reduce((acc, t) => acc + t.rating, 0);
    return (total / testimonialsData.length).toFixed(1);
  }, []);

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Reviews", path: "/reviews" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="Client Reviews & Testimonials"
        description="Read verified client feedback from CEOs, CTOs, and Product Leaders who partner with 10lonaz for custom software, multi-tenant SaaS, and AI engineering."
        canonicalPath="/reviews"
        schemas={[getBreadcrumbSchema(breadcrumbs)]}
      />
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-28 bg-gradient-to-br from-background via-secondary/20 to-accent/10 border-b">
          <div className="container mx-auto px-4 max-w-4xl text-center space-y-6">
            <Badge variant="outline" className="px-3.5 py-1 text-xs font-semibold gap-1.5 border-primary/30">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              Verified Client Feedback
            </Badge>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              Trusted by Founders &amp; <span className="text-primary">Engineering Leaders</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Don't just take our word for it — explore how 10lonaz helps high-growth startups and enterprises architect, launch, and scale modern software.
            </p>

            {/* Rating Summary Card */}
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-5 rounded-2xl bg-card border shadow-sm">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <div className="text-sm font-semibold">
                <span className="text-lg font-bold text-foreground">{averageRating}</span> / 5.0 Rating
              </div>
              <span className="hidden sm:inline text-muted-foreground/30">•</span>
              <div className="text-xs text-muted-foreground font-medium">
                Based on {testimonialsData.length} client evaluations
              </div>
            </div>
          </div>
        </section>

        {/* Filter Pills */}
        <section className="py-6 bg-muted/20 border-b sticky top-16 z-20 backdrop-blur-md">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1 mr-2 shrink-0">
                <Filter className="h-3.5 w-3.5" /> Project Domain:
              </span>
              {["All", ...new Set(testimonialsData.map((testimonial) => testimonial.category).filter((category): category is string => Boolean(category)))].map((cat) => (
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

        {/* Testimonials Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex items-center justify-between mb-8">
              <p className="text-sm font-medium text-muted-foreground">
                Showing {filteredTestimonials.length} verified reviews
                {selectedCategory !== "All" && ` in ${selectedCategory}`}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTestimonials.map((testimonial) => (
                <Card
                  key={testimonial.id}
                  className="flex flex-col justify-between border hover:border-primary/50 transition-all duration-300 hover:shadow-lg bg-card"
                >
                  <CardContent className="pt-6 space-y-4">
                    {/* Stars and Verified Badge */}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      {testimonial.verified && (
                        <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Verified Partner</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed italic">
                      "{testimonial.content}"
                    </p>

                    {/* Project Tag */}
                    <div>
                      <Badge variant="secondary" className="text-xs font-mono font-normal">
                        {testimonial.project}
                      </Badge>
                    </div>

                    {/* Author */}
                    <div className="flex items-center gap-3 pt-4 border-t border-border/40">
                      <Avatar className="h-11 w-11 border">
                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                        <AvatarFallback>
                          {testimonial.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="overflow-hidden">
                        <p className="font-bold text-sm text-foreground truncate">{testimonial.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{testimonial.role}</p>
                        <p className="text-xs font-medium text-primary truncate">{testimonial.company}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Client Logos Carousel / Grid */}
        <section className="py-16 bg-secondary/20 border-y">
          <div className="container mx-auto px-4 max-w-5xl text-center space-y-8">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Powering Modern Software Products Across Global Industries
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-75">
              {clientLogos.map((logo, i) => (
                <div
                  key={i}
                  className="px-4 py-2 rounded-lg bg-card border font-semibold text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors shadow-sm"
                >
                  {logo}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-20 bg-gradient-to-r from-background via-primary/5 to-secondary/30 text-center">
          <div className="container mx-auto px-4 max-w-3xl space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Experience the 10lonaz Difference</h2>
            <p className="text-muted-foreground text-base md:text-lg">
              Let's build a software product your users love and your investors praise.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Button asChild size="lg" className="font-semibold gap-2">
                <Link to="/contact">
                  <MessageSquare className="h-4 w-4" />
                  Schedule a Discovery Call
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/portfolio">Explore Our Products</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Reviews;
