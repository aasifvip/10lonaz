import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Layout, Smartphone, Cloud, Zap, Building2, Server, Bot, Plug, Database, ArrowRight,
} from "lucide-react";
import { products, productCategories } from "@/data/products";
import { SEO } from "@/components/common/SEO";
import { getBreadcrumbSchema } from "@/data/seo";

const technologies = [
  { icon: Layout, title: "Web Applications", description: "Modern SPAs, PWAs, and marketing sites with pixel-perfect UX." },
  { icon: Smartphone, title: "Mobile Applications", description: "Native and cross-platform apps for iOS and Android." },
  { icon: Cloud, title: "SaaS Platforms", description: "Multi-tenant products with subscriptions and role-based access." },
  { icon: Zap, title: "Progressive Web Apps (PWA)", description: "Installable, offline-first experiences that feel native." },
  { icon: Building2, title: "Enterprise Software", description: "Mission-critical systems built for scale and compliance." },
  { icon: Server, title: "Cloud Solutions", description: "Cloud architecture, DevOps, and observability on AWS, GCP, Azure." },
  { icon: Bot, title: "AI Applications", description: "LLM copilots, RAG systems, and intelligent automation." },
  { icon: Plug, title: "API Services", description: "REST and GraphQL APIs, webhooks, and system integrations." },
  { icon: Database, title: "Database Solutions", description: "SQL, NoSQL, and vector databases tuned for performance." },
];

const Portfolio = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const publishedProducts = products.filter((product) => product.published !== false);
  const filteredProducts =
    selectedCategory === "All"
      ? publishedProducts
      : publishedProducts.filter((p) => p.category === selectedCategory);

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Products & Portfolio", path: "/portfolio" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="Products &amp; Case Studies"
        description="Explore the 10lonaz software product line: Multi-tenant billing SaaS, restaurant POS systems, hotel booking platforms, and browser AI extensions."
        canonicalPath="/portfolio"
        schemas={[getBreadcrumbSchema(breadcrumbs)]}
      />
      <Navbar />
      <main>
        <section className="py-20 bg-gradient-to-br from-background via-secondary/20 to-accent/10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <Badge className="mb-4">Products & Portfolio</Badge>
              <h1>Products We've Built. Platforms We Power.</h1>
              <p className="text-xl text-muted-foreground">
                Explore the 10lonaz product line — battle-tested platforms across SaaS, business operations, and AI.
              </p>
            </div>
          </div>
        </section>

        {/* Product Filters */}
        <section className="py-10 border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-3">
              {productCategories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-3 mb-12">
              <h2>Our Products</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Production-ready platforms you can license, extend, or fully customize for your business.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Link
                  key={product.slug}
                  to={`/portfolio/${product.slug}`}
                  className="block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
                  aria-label={`View the ${product.title} case study`}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <product.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                        </div>
                        <Badge variant="secondary" className="text-xs">{product.category}</Badge>
                      </div>
                      <CardTitle className="text-xl">{product.title}</CardTitle>
                      <CardDescription>{product.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <span className="inline-flex items-center text-sm font-medium text-primary">
                        View case study
                        <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Technologies We Build */}
        <section className="py-20 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-3 mb-12">
              <h2>What We Build</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                The full range of software solutions 10lonaz delivers for teams of every size.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {technologies.map((t, i) => (
                <Card key={i} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <t.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{t.title}</CardTitle>
                    <CardDescription>{t.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2>Have a product idea?</h2>
              <p className="text-xl text-muted-foreground">
                We help founders and teams take products from concept to launch — and beyond.
              </p>
              <Button size="lg" asChild>
                <Link to="/contact">Start Your Project</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Portfolio;
