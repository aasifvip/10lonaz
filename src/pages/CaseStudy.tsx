import { Link, useParams, Navigate } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, CheckCircle2, Clock, Users, Building2, ExternalLink,
  Github, Download, Chrome, Sparkles, ShieldCheck, Check, DollarSign, Image as ImageIcon
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getProductBySlug, products } from "@/data/products";
import { SEO } from "@/components/common/SEO";
import { getBreadcrumbSchema } from "@/data/seo";

const CaseStudy = () => {
  const { slug } = useParams();
  const product = getProductBySlug(slug);

  if (!product) return <Navigate to="/portfolio" replace />;

  const Icon = product.icon;
  const index = products.findIndex((p) => p.slug === product.slug);
  const related = products.filter((p, i) => i !== index && p.category === product.category).slice(0, 3);

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Portfolio", path: "/portfolio" },
    { name: product.title, path: `/portfolio/${product.slug}` },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title={`${product.title} — Case Study`}
        description={product.overview.substring(0, 155)}
        canonicalPath={`/portfolio/${product.slug}`}
        schemas={[getBreadcrumbSchema(breadcrumbs)]}
      />
      <Navbar />
      <main className="flex-grow">
        {/* Hero */}
        <section className="py-20 bg-gradient-to-br from-background via-secondary/20 to-accent/10">
          <div className="container mx-auto px-4">
            <Button variant="ghost" size="sm" asChild className="mb-6">
              <Link to="/portfolio">
                <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                Back to Portfolio
              </Link>
            </Button>
            <div className="max-w-4xl space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="h-7 w-7 text-primary" aria-hidden="true" />
                </div>
                <Badge variant="secondary" className="text-sm px-3 py-1">{product.category}</Badge>
                {product.productType && (
                  <Badge variant="outline" className="text-xs uppercase tracking-wider">
                    {product.productType === "extension" ? "Browser Extension" : product.productType}
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight">{product.title}</h1>
              <p className="text-xl text-muted-foreground max-w-3xl">{product.description}</p>
              
              {/* Primary Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                {product.extensionUrl && (
                  <Button size="lg" asChild className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
                    <a href={product.extensionUrl} target="_blank" rel="noopener noreferrer">
                      <Chrome className="h-5 w-5" />
                      Install Extension
                    </a>
                  </Button>
                )}

                {product.pricing?.buyUrl && (
                  <Button size="lg" asChild className="gap-2">
                    <a href={product.pricing.buyUrl} target="_blank" rel="noopener noreferrer">
                      <DollarSign className="h-5 w-5" />
                      Buy Now ({product.pricing.price})
                    </a>
                  </Button>
                )}

                {product.pricing?.trialUrl && (
                  <Button size="lg" variant="outline" asChild className="gap-2">
                    <a href={product.pricing.trialUrl} target="_blank" rel="noopener noreferrer">
                      <Sparkles className="h-5 w-5" />
                      Start {product.pricing.trialDays}-Day Free Trial
                    </a>
                  </Button>
                )}

                {product.downloadUrl && (
                  <Button size="lg" asChild className="gap-2 bg-primary">
                    <a href={product.downloadUrl} target="_blank" rel="noopener noreferrer">
                      <Download className="h-5 w-5" />
                      Download / Use Free
                    </a>
                  </Button>
                )}

                {product.livePreviewUrl && (
                  <Button size="lg" variant={product.extensionUrl || product.pricing || product.downloadUrl ? "outline" : "default"} asChild className="gap-2">
                    <a href={product.livePreviewUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                      Live Preview
                    </a>
                  </Button>
                )}

                {product.sourceCodeUrl && (
                  <Button size="lg" variant="outline" asChild className="gap-2">
                    <a href={product.sourceCodeUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4" />
                      Source Code
                    </a>
                  </Button>
                )}
              </div>
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 max-w-4xl">
              {[
                { icon: Building2, label: "Client & Industry", value: `${product.client} · ${product.industry}` },
                { icon: Clock, label: "Timeline", value: product.timeline },
                { icon: Users, label: "Team", value: product.teamSize },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border bg-card p-5 shadow-sm">
                  <dt className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <item.icon className="h-4 w-4 text-primary" aria-hidden="true" />
                    {item.label}
                  </dt>
                  <dd className="font-medium">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Project Overview */}
        <section className="py-16 border-b">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-bold mb-4">Project Overview</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {product.overview}
            </p>
          </div>
        </section>

        {/* Screenshots / Gallery */}
        {product.screenshots && product.screenshots.length > 0 && (
          <section className="py-16 bg-secondary/20 border-b">
            <div className="container mx-auto px-4">
              <div className="text-center space-y-3 mb-10">
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  <ImageIcon className="h-4 w-4" />
                  Visual Showcase
                </div>
                <h2 className="text-2xl font-bold">Screenshots & Product Gallery</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                {product.screenshots.map((src, i) => (
                  <div key={i} className="overflow-hidden rounded-xl border bg-card shadow-md transition-all duration-300 hover:shadow-xl group">
                    <img
                      src={src}
                      alt={`${product.title} screenshot ${i + 1}`}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Browser Extension Dedicated Action Banner */}
        {product.category === "Browser Extensions" && product.extensionUrl && (
          <section className="py-12 bg-emerald-500/10 border-y border-emerald-500/20">
            <div className="container mx-auto px-4 text-center max-w-3xl space-y-4">
              <Badge className="bg-emerald-600 text-white">Official Browser Extension</Badge>
              <h3 className="text-2xl font-bold">Install directly from Chrome Web Store</h3>
              <p className="text-muted-foreground">
                Enhance your browser workflow with instant AI summarization and Q&A. One-click setup, no complex installation required.
              </p>
              <Button size="lg" asChild className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                <a href={product.extensionUrl} target="_blank" rel="noopener noreferrer">
                  <Chrome className="h-5 w-5" />
                  Install Extension Now
                </a>
              </Button>
            </div>
          </section>
        )}

        {/* Paid Product Pricing Section */}
        {product.pricing && (
          <section className="py-16 bg-secondary/30 border-b">
            <div className="container mx-auto px-4 max-w-4xl">
              <div className="text-center space-y-3 mb-10">
                <Badge variant="secondary">Flexible Licensing</Badge>
                <h2 className="text-3xl font-bold">Pricing & Plans</h2>
                <p className="text-muted-foreground">License this production-ready platform or request custom modifications.</p>
              </div>
              <Card className="max-w-md mx-auto border-2 border-primary/50 shadow-xl">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl">{product.title}</CardTitle>
                  <CardDescription>Full Commercial License</CardDescription>
                  <div className="mt-4 flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-extrabold">{product.pricing.price}</span>
                    {product.pricing.period && (
                      <span className="text-muted-foreground">{product.pricing.period}</span>
                    )}
                  </div>
                  {product.pricing.trialDays && (
                    <Badge variant="outline" className="mt-2 text-xs text-primary border-primary">
                      {product.pricing.trialDays}-Day Risk-Free Trial
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  {product.pricing.features && (
                    <ul className="space-y-3 text-sm">
                      {product.pricing.features.map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="flex flex-col gap-3 pt-2">
                    {product.pricing.buyUrl && (
                      <Button size="lg" asChild className="w-full">
                        <a href={product.pricing.buyUrl} target="_blank" rel="noopener noreferrer">
                          Buy Now
                        </a>
                      </Button>
                    )}
                    {product.pricing.trialUrl && (
                      <Button size="lg" variant="outline" asChild className="w-full">
                        <a href={product.pricing.trialUrl} target="_blank" rel="noopener noreferrer">
                          Start Free Trial
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* Features */}
        {product.features && product.features.length > 0 && (
          <section className="py-20 border-b">
            <div className="container mx-auto px-4 max-w-5xl">
              <div className="text-center space-y-3 mb-12">
                <h2 className="text-3xl font-bold">Key Features</h2>
                <p className="text-lg text-muted-foreground">Architected for scalability, speed, and real-world reliability.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {product.features.map((feat, idx) => (
                  <Card key={idx} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        {feat.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{feat.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Challenge + Scope */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">The Challenge</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">{product.challenge}</p>
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Scope of Work</h2>
                <ul className="space-y-3">
                  {product.scope.map((item) => (
                    <li key={item} className="flex gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Tech stack */}
        <section className="py-20 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-3 mb-10">
              <h2 className="text-2xl font-bold">Tech Stack</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Modern tools and frameworks powering {product.title}.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
              {product.techStack.map((tech) => (
                <Badge key={tech} variant="outline" className="text-sm px-4 py-2 bg-background font-mono">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        {/* Outcomes */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-3 mb-12">
              <h2 className="text-2xl font-bold">Measured Outcomes</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Quantifiable impact achieved after deployment.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {product.outcomes.map((outcome) => (
                <Card key={outcome.label} className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="pt-8 pb-8">
                    <p className="text-4xl font-bold text-primary mb-2">{outcome.metric}</p>
                    <p className="text-sm text-muted-foreground">{outcome.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {product.testimonial && (
              <blockquote className="max-w-3xl mx-auto mt-16 text-center space-y-4 p-8 rounded-2xl bg-secondary/20 border">
                <p className="text-xl italic">“{product.testimonial.quote}”</p>
                <footer className="text-sm font-medium text-muted-foreground">
                  {product.testimonial.author} — {product.testimonial.role}
                </footer>
              </blockquote>
            )}
          </div>
        </section>

        {/* Related Case Studies */}
        {related.length > 0 && (
          <section className="py-20 bg-secondary/30 border-t">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold text-center mb-12">Related Case Studies</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {related.map((item) => (
                  <Link key={item.slug} to={`/portfolio/${item.slug}`} className="block group">
                    <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <CardHeader>
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <item.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                        </div>
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <CardDescription>{item.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl font-bold">Want results like these?</h2>
              <p className="text-xl text-muted-foreground">
                Tell us about your product vision and we'll map out architecture, timeline, and tech stack.
              </p>
              <Button size="lg" asChild>
                <Link to="/contact">
                  Start Your Project
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CaseStudy;