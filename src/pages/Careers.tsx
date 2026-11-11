import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Search,
  Filter,
  Sparkles,
  ArrowRight,
  HeartHandshake,
  Globe2,
  GraduationCap,
  ShieldCheck,
  Laptop,
  CheckCircle2,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SEO } from "@/components/common/SEO";
import {
  jobVacancies,
  Department,
  EmploymentType,
  ExperienceLevel,
  getDepartments,
  getEmploymentTypes,
  getExperienceLevels,
} from "@/data/careers";
import { companyData } from "@/data/company";
import { getBreadcrumbSchema } from "@/data/seo";

const cultureBenefits = [
  {
    icon: Globe2,
    title: "100% Remote & Distributed",
    description:
      "Work from anywhere in the world. We value deep work and async communication over rigid 9-to-5 desk hours.",
  },
  {
    icon: DollarSign,
    title: "Top-Tier Transparent Pay",
    description:
      "Competitive global compensation benchmarked against top tech hubs, with annual bonuses and merit increases.",
  },
  {
    icon: Laptop,
    title: "Home Office Stipend",
    description:
      "$1,500 initial setup budget for your ergonomics, 4K monitor, and peripherals, plus the latest MacBook Pro.",
  },
  {
    icon: GraduationCap,
    title: "Learning & Development",
    description:
      "$2,000 annual allowance for conferences, courses, books, and certifications to fuel your technical mastery.",
  },
  {
    icon: HeartHandshake,
    title: "Unlimited Paid Time Off",
    description:
      "We encourage rest and recharge. Take the time you need with a recommended minimum of 25 days annually.",
  },
  {
    icon: ShieldCheck,
    title: "Comprehensive Health",
    description:
      "Premium international medical, dental, and mental wellness coverage for you and your dependents.",
  },
];

export const Careers: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("All");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedExperience, setSelectedExperience] = useState<string>("All");

  const departments = useMemo(() => ["All", ...getDepartments()], []);
  const employmentTypes = useMemo(() => ["All", ...getEmploymentTypes()], []);
  const experienceLevels = useMemo(() => ["All", ...getExperienceLevels()], []);

  const filteredJobs = useMemo(() => {
    return jobVacancies.filter((job) => {
      if (!job.isOpen) return false;

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          job.title.toLowerCase().includes(q) ||
          job.overview.toLowerCase().includes(q) ||
          job.location.toLowerCase().includes(q) ||
          job.department.toLowerCase().includes(q) ||
          job.techStack.some((t) => t.toLowerCase().includes(q));
        if (!matches) return false;
      }

      // Department filter
      if (selectedDepartment !== "All" && job.department !== selectedDepartment) {
        return false;
      }

      // Employment type filter
      if (selectedType !== "All" && job.type !== selectedType) {
        return false;
      }

      // Experience level filter
      if (selectedExperience !== "All" && job.experience !== selectedExperience) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedDepartment, selectedType, selectedExperience]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedDepartment("All");
    setSelectedType("All");
    setSelectedExperience("All");
  };

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Careers", path: "/careers" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="Careers & Open Positions"
        description="Join 10lonaz. Explore remote-first engineering, AI, UI/UX, and cloud opportunities with transparent pay and exceptional culture."
        canonicalPath="/careers"
        schemas={[getBreadcrumbSchema(breadcrumbs)]}
      />
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-primary/5 via-secondary/20 to-background border-b">
          <div className="container mx-auto px-4 max-w-5xl text-center space-y-6">
            <Badge variant="outline" className="px-3.5 py-1 text-sm font-medium gap-1.5 border-primary/30 bg-primary/5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              We Are Hiring Worldwide
            </Badge>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
              Build the Future of Software at <span className="text-primary">10lonaz</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We are a team of senior engineers, product architects, and designers crafting world-class SaaS, mobile apps, and enterprise AI copilots. If you love shipping elegant, high-impact products, you belong here.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-sm font-medium text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>100% Remote Freedom</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Competitive Global Pay</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Modern Tech Stack</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>No Bureaucracy</span>
              </div>
            </div>
          </div>
        </section>

        {/* Filter and Search Bar Section */}
        <section className="py-8 bg-muted/20 border-b">
          <div className="container mx-auto px-4 max-w-6xl space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search input */}
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by title, skill, or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background"
                />
              </div>

              {/* Filter Selectors / Badges */}
              <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1 mr-1">
                  <Filter className="h-3.5 w-3.5" /> Department:
                </span>
                {departments.map((dept) => (
                  <Button
                    key={dept}
                    size="sm"
                    variant={selectedDepartment === dept ? "default" : "outline"}
                    onClick={() => setSelectedDepartment(dept)}
                    className="h-8 text-xs font-medium"
                  >
                    {dept}
                  </Button>
                ))}
              </div>
            </div>

            {/* Secondary filters: Employment Type & Experience Level */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-border/40">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs text-muted-foreground font-medium">Type:</span>
                {employmentTypes.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedType(t)}
                    className={`text-xs px-2.5 py-1 rounded-full transition-colors ${
                      selectedType === t
                        ? "bg-primary text-primary-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground bg-secondary/60"
                    }`}
                  >
                    {t}
                  </button>
                ))}

                <span className="text-muted-foreground/30 mx-1">|</span>

                <span className="text-xs text-muted-foreground font-medium">Experience:</span>
                {experienceLevels.map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setSelectedExperience(lvl)}
                    className={`text-xs px-2.5 py-1 rounded-full transition-colors ${
                      selectedExperience === lvl
                        ? "bg-primary text-primary-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground bg-secondary/60"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>

              {(searchQuery || selectedDepartment !== "All" || selectedType !== "All" || selectedExperience !== "All") && (
                <Button variant="ghost" size="sm" onClick={resetFilters} className="text-xs h-7 text-muted-foreground hover:text-foreground">
                  Reset Filters
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Job Listings Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">Open Positions</h2>
                <p className="text-sm text-muted-foreground">
                  Showing {filteredJobs.length} {filteredJobs.length === 1 ? "available role" : "available roles"}
                </p>
              </div>
            </div>

            {filteredJobs.length > 0 ? (
              <div className="grid gap-6">
                {filteredJobs.map((job) => (
                  <Card
                    key={job.id}
                    className="group border hover:border-primary/50 transition-all duration-300 hover:shadow-lg bg-card"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <Badge variant="secondary" className="font-medium text-xs">
                              {job.department}
                            </Badge>
                            {job.featured && (
                              <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                                Featured
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {job.experience}
                            </Badge>
                          </div>
                          <CardTitle className="text-xl md:text-2xl font-bold group-hover:text-primary transition-colors">
                            <Link to={`/careers/${job.slug}`}>{job.title}</Link>
                          </CardTitle>
                        </div>

                        <div className="flex items-center gap-3">
                          <Button asChild size="default" className="font-semibold group-hover:translate-x-0.5 transition-transform">
                            <Link to={`/careers/${job.slug}`}>
                              View Role &amp; Apply
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4 pt-1">
                      <p className="text-sm md:text-base text-muted-foreground line-clamp-2 leading-relaxed">
                        {job.overview}
                      </p>

                      {/* Job Metadata Tags */}
                      <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-muted-foreground pt-1 border-t border-border/40">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-primary" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-primary" />
                          <span>{job.type}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <DollarSign className="h-3.5 w-3.5 text-primary" />
                          <span>{job.salary}</span>
                        </div>
                      </div>

                      {/* Tech stack badges */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-xs text-muted-foreground font-medium mr-1">Stack:</span>
                        {job.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 rounded bg-muted text-[11px] font-mono text-muted-foreground"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              /* Attractive Empty State */
              <div className="text-center py-16 px-4 border rounded-2xl bg-muted/10 max-w-2xl mx-auto space-y-5">
                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                  <Briefcase className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">No Matching Positions Found</h3>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                  We don't currently have an opening matching all your search criteria, but we're always interested in meeting exceptional engineers and designers!
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <Button variant="outline" size="sm" onClick={resetFilters}>
                    Clear Filters
                  </Button>
                  <Button asChild size="sm">
                    <a href={`mailto:${companyData.contact.careersEmail}?subject=General%20Application%20-%20Software%20Engineer`}>
                      Send Open Application
                    </a>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Culture & Benefits Section */}
        <section className="py-20 bg-secondary/20 border-y">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
              <Badge variant="outline" className="px-3 py-1 text-xs">
                Perks &amp; Culture
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold">Why You'll Love Building With Us</h2>
              <p className="text-muted-foreground text-base md:text-lg">
                We believe exceptional software is built by healthy, empowered, and well-rewarded creators. Here is how we invest in you:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cultureBenefits.map((benefit, index) => (
                <Card key={index} className="bg-card border hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                      <benefit.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg font-bold">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Open Application CTA */}
        <section className="py-20 bg-gradient-to-br from-background via-primary/5 to-secondary/30">
          <div className="container mx-auto px-4 max-w-4xl text-center space-y-6">
            <Badge variant="secondary" className="px-3 py-1">
              General Inquiries
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">Don't See Your Ideal Role?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We frequently hire ahead of upcoming enterprise and AI contracts. If you are an exceptional full-stack developer, AI engineer, or systems architect, send us your CV and github links!
            </p>
            <div className="pt-2">
              <Button asChild size="lg" className="font-semibold gap-2">
                <a href={`mailto:${companyData.contact.careersEmail}?subject=General%20Application%20-%20Senior%20Talent`}>
                  <Briefcase className="h-4 w-4" />
                  Submit General Application
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Careers;

