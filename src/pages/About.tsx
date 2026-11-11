import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Target,
  Lightbulb,
  Award,
  ArrowRight,
  ShieldCheck,
  Rocket,
  Globe2,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { SEO } from "@/components/common/SEO";
import { companyData } from "@/data/company";
import { getOrganizationSchema, getBreadcrumbSchema } from "@/data/seo";
import { aboutPageCopy } from "@/data/pageCopy";
import { readSiteSettings } from "@/admin/contentRepository";

const aboutCopy = aboutPageCopy;
const valueIconMap = { Target, Lightbulb, Users, Award };
const values = aboutCopy.values.map((value) => ({
  ...value,
  icon: valueIconMap[value.iconName as keyof typeof valueIconMap] ?? Target,
}));
const capabilities = aboutCopy.capabilities;
const milestones = aboutCopy.milestones;

export const About: React.FC = () => {
  const hiringEnabled = readSiteSettings().hiringEnabled;
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="About Us — Mission, Team & Engineering Standards"
        description="Learn about 10lonaz. We are a global software engineering company crafting custom web & mobile apps, multi-tenant SaaS, and enterprise AI copilots."
        canonicalPath="/about"
        schemas={[getOrganizationSchema(), getBreadcrumbSchema(breadcrumbs)]}
      />
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-28 bg-gradient-to-br from-background via-secondary/20 to-accent/10 border-b">
          <div className="container mx-auto px-4 max-w-4xl text-center space-y-6">
            <Badge variant="outline" className="mb-2 px-3.5 py-1 text-xs font-semibold gap-1.5 border-primary/30">
              <Zap className="h-3.5 w-3.5 text-primary" />
              {aboutCopy.badge}
            </Badge>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              {aboutCopy.heading} <span className="text-primary">{aboutCopy.headingAccent}</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              {companyData.fullDescription}
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 max-w-3xl mx-auto">
              <div className="p-4 rounded-xl bg-card border shadow-sm">
                <p className="text-3xl font-extrabold text-primary">{companyData.stats.projectsDelivered}</p>
                <p className="text-xs text-muted-foreground mt-1 font-medium">{aboutCopy.statLabels[0]}</p>
              </div>
              <div className="p-4 rounded-xl bg-card border shadow-sm">
                <p className="text-3xl font-extrabold text-primary">{companyData.stats.clientSatisfaction}</p>
                <p className="text-xs text-muted-foreground mt-1 font-medium">{aboutCopy.statLabels[1]}</p>
              </div>
              <div className="p-4 rounded-xl bg-card border shadow-sm">
                <p className="text-3xl font-extrabold text-primary">{companyData.stats.countriesServed}</p>
                <p className="text-xs text-muted-foreground mt-1 font-medium">{aboutCopy.statLabels[2]}</p>
              </div>
              <div className="p-4 rounded-xl bg-card border shadow-sm">
                <p className="text-3xl font-extrabold text-primary">{companyData.stats.uptimeSLA}</p>
                <p className="text-xs text-muted-foreground mt-1 font-medium">{aboutCopy.statLabels[3]}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="py-20 border-b">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-8 rounded-2xl bg-card border shadow-sm space-y-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Target className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold">{aboutCopy.missionTitle}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {aboutCopy.missionBody}
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-card border shadow-sm space-y-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Rocket className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold">{aboutCopy.visionTitle}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {aboutCopy.visionBody}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Who We Are & Story */}
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Badge variant="secondary">{aboutCopy.whoWeAreBadge}</Badge>
                <h2 className="text-3xl md:text-4xl font-bold">
                  {aboutCopy.whoWeAreHeading}
                </h2>
                {aboutCopy.whoWeAreParagraphs.map((paragraph, index) => <p key={index} className="text-muted-foreground leading-relaxed">{paragraph}</p>)}
                <div className="space-y-2.5 pt-2">
                  {aboutCopy.whoWeAreBullets.map((bullet, index) => <div key={index} className="flex items-center gap-2.5 text-sm font-medium">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>{bullet}</span>
                  </div>)}
                </div>
              </div>

              <div className="relative">
                <img
                  src={aboutCopy.teamImageUrl}
                  alt={aboutCopy.teamImageAlt}
                  loading="lazy"
                  className="rounded-2xl shadow-xl border object-cover w-full aspect-[4/3]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-20 bg-secondary/20 border-y">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center space-y-4 mb-16 max-w-2xl mx-auto">
              <Badge variant="outline">{aboutCopy.valuesBadge}</Badge>
              <h2 className="text-3xl md:text-4xl font-bold">{aboutCopy.valuesHeading}</h2>
              <p className="text-muted-foreground text-base md:text-lg">
                {aboutCopy.valuesIntro}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 bg-card border">
                  <CardContent className="pt-8 space-y-4">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto text-primary">
                      <value.icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-lg font-bold">{value.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Capabilities Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center space-y-4 mb-16 max-w-2xl mx-auto">
              <Badge variant="outline">{aboutCopy.capabilitiesBadge}</Badge>
              <h2 className="text-3xl md:text-4xl font-bold">{aboutCopy.capabilitiesHeading}</h2>
              <p className="text-muted-foreground text-base md:text-lg">
                {aboutCopy.capabilitiesIntro}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {capabilities.map((c, i) => (
                <Card key={i} className="bg-card border hover:border-primary/40 transition-all hover:shadow-md">
                  <CardContent className="pt-6 space-y-2">
                    <h3 className="text-base font-bold text-foreground">{c.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{c.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button asChild size="lg" className="font-semibold gap-2">
                <Link to="/services">
                  {aboutCopy.capabilitiesCtaLabel}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Company Journey / Milestones */}
        <section className="py-20 bg-muted/20 border-t">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center space-y-4 mb-16">
              <Badge variant="outline">{aboutCopy.milestonesBadge}</Badge>
              <h2 className="text-3xl md:text-4xl font-bold">{aboutCopy.milestonesHeading}</h2>
              <p className="text-muted-foreground">{aboutCopy.milestonesIntro}</p>
            </div>

            <div className="space-y-8 relative before:absolute before:inset-0 before:left-9 sm:before:left-24 before:w-0.5 before:bg-border/80">
              {milestones.map((m, index) => (
                <div key={index} className="relative flex items-start gap-6 sm:gap-10">
                  <div className="w-16 sm:w-20 pt-1 shrink-0 text-right font-extrabold text-primary font-mono text-lg">
                    {m.year}
                  </div>
                  <div className="h-4 w-4 rounded-full bg-primary border-4 border-background shrink-0 mt-2 z-10" />
                  <div className="flex-1 bg-card p-5 rounded-xl border shadow-sm">
                    <h3 className="font-bold text-base text-foreground mb-1">{m.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{m.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-20 bg-gradient-to-r from-primary/10 via-secondary/30 to-background border-t text-center">
          <div className="container mx-auto px-4 max-w-3xl space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">{aboutCopy.ctaHeading}</h2>
            <p className="text-lg text-muted-foreground">
              {aboutCopy.ctaBody}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Button asChild size="lg" className="font-semibold">
                <Link to="/contact">{aboutCopy.ctaPrimaryLabel}</Link>
              </Button>
              {hiringEnabled && <Button asChild variant="outline" size="lg"><Link to="/careers">{aboutCopy.ctaSecondaryLabel}</Link></Button>}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
