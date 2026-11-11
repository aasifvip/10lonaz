import { useState, useRef, useId } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  Share2,
  Copy,
  Check,
  Twitter,
  Linkedin,
  Mail,
  UploadCloud,
  FileText,
  X,
  AlertCircle,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Send,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { SEO } from "@/components/common/SEO";
import { getJobBySlug, JobVacancy } from "@/data/careers";
import { companyData } from "@/data/company";
import { getJobPostingSchema, getBreadcrumbSchema } from "@/data/seo";
import { readSiteSettings, saveSubmission } from "@/admin/contentRepository";

export const JobDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const job = getJobBySlug(slug);

  const formRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    experienceYears: "",
    experienceSummary: "",
    education: "",
    skills: "",
    coverLetter: "",
    privacyConsent: false,
    customAnswers: {} as Record<string, string>,
  });

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSummaryDialogOpen, setIsSummaryDialogOpen] = useState(false);
  const [stagedApplicationText, setStagedApplicationText] = useState("");
  const [hasCopiedShareLink, setHasCopiedShareLink] = useState(false);
  const [hasCopiedSummary, setHasCopiedSummary] = useState(false);

  if (!job || !job.isOpen) {
    return <Navigate to="/careers" replace />;
  }

  const currentUrl = typeof window !== "undefined" ? window.location.href : `${companyData.siteUrl}/careers/${job.slug}`;

  // Handle Share Links
  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setHasCopiedShareLink(true);
    toast.success("Job link copied to clipboard!");
    setTimeout(() => setHasCopiedShareLink(false), 2500);
  };

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this role at 10lonaz: ${job.title}`)}&url=${encodeURIComponent(currentUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
    email: `mailto:?subject=${encodeURIComponent(`Job Opening at 10lonaz: ${job.title}`)}&body=${encodeURIComponent(`Hi,\n\nI found this open position at 10lonaz that might interest you:\n\n${job.title} (${job.location})\n${currentUrl}\n\nBest regards.`)}`,
  };

  const scrollToApplication = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Handle File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type: PDF, DOC, DOCX
    const validExtensions = [".pdf", ".doc", ".docx"];
    const fileExt = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    if (!validExtensions.includes(fileExt)) {
      toast.error("Please upload a PDF, DOC, or DOCX resume document.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Validate max size: 5MB
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Resume file size must be less than 5MB.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setResumeFile(file);
    setFormErrors((prev) => {
      const updated = { ...prev };
      delete updated.resume;
      return updated;
    });
    toast.success(`Resume attached: ${file.name}`);
  };

  const handleRemoveFile = () => {
    setResumeFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Validation
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      errors.fullName = "Full name is required";
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      errors.email = "A valid email address is required";
    }
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    }
    if (!formData.location.trim()) {
      errors.location = "Your current city/country is required";
    }
    if (!formData.experienceYears.trim()) {
      errors.experienceYears = "Please state your years of experience";
    }
    if (!formData.skills.trim()) {
      errors.skills = "Please list your primary skills or tech stack";
    }
    if (!formData.privacyConsent) {
      errors.privacyConsent = "You must agree to the privacy consent to submit an application";
    }

    // Custom job questions validation
    if (job.customQuestions) {
      job.customQuestions.forEach((q) => {
        if (q.required && (!formData.customAnswers[q.id] || !formData.customAnswers[q.id].trim())) {
          errors[q.id] = `${q.label} is required`;
        }
      });
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields marked in red.");
      return;
    }

    setIsSubmitting(true);

    // Format Structured Application Summary
    let summary = `=========================================\n`;
    summary += `10LONAZ JOB APPLICATION\n`;
    summary += `Role: ${job.title} (${job.id})\n`;
    summary += `Department: ${job.department} | Location: ${job.location}\n`;
    summary += `Date: ${new Date().toISOString().split("T")[0]}\n`;
    summary += `=========================================\n\n`;

    summary += `1. APPLICANT DETAILS\n`;
    summary += `Full Name: ${formData.fullName}\n`;
    summary += `Email: ${formData.email}\n`;
    summary += `Phone: ${formData.phone}\n`;
    summary += `Location: ${formData.location}\n\n`;

    summary += `2. EXPERIENCE & QUALIFICATIONS\n`;
    summary += `Years of Experience: ${formData.experienceYears}\n`;
    summary += `Primary Skills: ${formData.skills}\n`;
    if (formData.education) summary += `Education: ${formData.education}\n`;
    if (formData.experienceSummary) summary += `Experience Summary:\n${formData.experienceSummary}\n\n`;

    if (job.customQuestions && job.customQuestions.length > 0) {
      summary += `3. JOB-SPECIFIC QUESTIONS\n`;
      job.customQuestions.forEach((q) => {
        summary += `${q.label}: ${formData.customAnswers[q.id] || "N/A"}\n`;
      });
      summary += `\n`;
    }

    if (formData.coverLetter) {
      summary += `4. COVER LETTER\n`;
      summary += `${formData.coverLetter}\n\n`;
    }

    summary += `5. RESUME ATTACHMENT\n`;
    summary += resumeFile
      ? `Attached Document: ${resumeFile.name} (${(resumeFile.size / 1024).toFixed(1)} KB)\n`
      : `Resume: Not attached directly in browser form (Please attach manually to your email)\n`;

    setStagedApplicationText(summary);
    setIsSummaryDialogOpen(true);
    setIsSubmitting(false);

    // Construct Mailto URI to open applicant's email client
    const mailSubject = `Job Application: ${job.title} - ${formData.fullName}`;
    const mailBody = encodeURIComponent(
      `Dear 10lonaz Recruitment Team,\n\nI am applying for the ${job.title} position (${job.id}). Below are my application details:\n\n` +
      summary +
      `\n\n[NOTE FOR APPLICANT]: Please ensure your resume file (${resumeFile ? resumeFile.name : "Resume.pdf"}) is attached to this email before pressing Send.\n\nThank you,\n${formData.fullName}`
    );

    const recipients = readSiteSettings().recipientEmails;
    const recipient = recipients.length ? recipients.join(",") : companyData.contact.careersEmail;
    try {
      saveSubmission({
        kind: "application",
        details: {
          ...formData,
          jobId: job.id,
          jobSlug: job.slug,
          jobTitle: job.title,
          resumeFile: resumeFile?.name ?? "",
          resumeSizeBytes: resumeFile?.size ?? 0,
        },
        summaryText: summary,
      });
      toast.success("Application saved in this browser. Email is not sent until you send the draft.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "The application could not be saved in this browser.");
    }

    const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(mailSubject)}&body=${mailBody}`;

    // Open mail client safely
    window.location.href = mailtoUrl;
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(stagedApplicationText);
    setHasCopiedSummary(true);
    toast.success("Application summary copied to clipboard!");
    setTimeout(() => setHasCopiedSummary(false), 2500);
  };

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Careers", path: "/careers" },
    { name: job.title, path: `/careers/${job.slug}` },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title={`${job.title} — Careers`}
        description={job.overview.substring(0, 155)}
        canonicalPath={`/careers/${job.slug}`}
        schemas={[getJobPostingSchema(job), getBreadcrumbSchema(breadcrumbs)]}
      />
      <Navbar />

      <main className="flex-1">
        {/* Navigation Breadcrumb & Back button */}
        <section className="pt-8 pb-4 border-b bg-muted/20">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Button variant="ghost" size="sm" asChild className="gap-2">
                <Link to="/careers">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Careers
                </Link>
              </Button>

              {/* Breadcrumbs */}
              <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
                <Link to="/" className="hover:text-foreground">Home</Link>
                <ChevronRight className="h-3 w-3" />
                <Link to="/careers" className="hover:text-foreground">Careers</Link>
                <ChevronRight className="h-3 w-3" />
                <span className="text-foreground font-medium truncate max-w-[200px]">{job.title}</span>
              </nav>
            </div>
          </div>
        </section>

        {/* Job Header Hero */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-muted/20 via-background to-background border-b">
          <div className="container mx-auto px-4 max-w-5xl space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="px-3 py-1 font-semibold text-xs">
                {job.department}
              </Badge>
              <Badge variant="outline" className="px-3 py-1 text-xs">
                {job.experience}
              </Badge>
              {job.featured && (
                <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                  Featured Role
                </Badge>
              )}
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
              {job.title}
            </h1>

            {/* Quick Metadata Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-card border shadow-sm">
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                  <MapPin className="h-3.5 w-3.5 text-primary" /> Location
                </span>
                <p className="text-sm font-semibold">{job.location}</p>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                  <Clock className="h-3.5 w-3.5 text-primary" /> Employment Type
                </span>
                <p className="text-sm font-semibold">{job.type}</p>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                  <DollarSign className="h-3.5 w-3.5 text-primary" /> Salary Range
                </span>
                <p className="text-sm font-semibold text-primary">{job.salary}</p>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                  <Calendar className="h-3.5 w-3.5 text-primary" /> Deadline
                </span>
                <p className="text-sm font-semibold">{job.deadline}</p>
              </div>
            </div>

            {/* CTAs & Social Share */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <Button size="lg" onClick={scrollToApplication} className="font-semibold gap-2 shadow-md">
                <Briefcase className="h-4 w-4" />
                Apply for this Role
              </Button>

              {/* Share Job Buttons */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-medium mr-1 hidden sm:inline">
                  Share this job:
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9"
                  onClick={handleCopyShareLink}
                  aria-label="Copy job link"
                  title="Copy link"
                >
                  {hasCopiedShareLink ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="icon" className="h-9 w-9" asChild aria-label="Share on LinkedIn">
                  <a href={shareUrls.linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" size="icon" className="h-9 w-9" asChild aria-label="Share on Twitter/X">
                  <a href={shareUrls.twitter} target="_blank" rel="noopener noreferrer">
                    <Twitter className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" size="icon" className="h-9 w-9" asChild aria-label="Share via Email">
                  <a href={shareUrls.email}>
                    <Mail className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Job Content Body */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left 2 Cols: Details */}
            <div className="lg:col-span-2 space-y-10">
              {/* Role Overview */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight">Role Overview</h2>
                <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
                  {job.overview}
                </p>
              </div>

              {/* Responsibilities */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight">Key Responsibilities</h2>
                <ul className="space-y-3">
                  {job.responsibilities.map((resp, i) => (
                    <li key={i} className="flex items-start gap-3 text-muted-foreground leading-relaxed">
                      <span className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Requirements */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight">Requirements &amp; Experience</h2>
                <ul className="space-y-3">
                  {job.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-3 text-muted-foreground leading-relaxed">
                      <span className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Qualifications */}
              {job.qualifications && job.qualifications.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold tracking-tight">Preferred Qualifications</h2>
                  <ul className="space-y-3">
                    {job.qualifications.map((qual, i) => (
                      <li key={i} className="flex items-start gap-3 text-muted-foreground leading-relaxed">
                        <span className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                        <span>{qual}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Benefits */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight">What We Offer</h2>
                <ul className="space-y-3">
                  {job.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-3 text-muted-foreground leading-relaxed">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 mt-2 shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tech Stack */}
              <div className="space-y-3 pt-4 border-t">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Primary Technologies &amp; Tools
                </h3>
                <div className="flex flex-wrap gap-2">
                  {job.techStack.map((tech) => (
                    <Badge key={tech} variant="secondary" className="px-3 py-1 font-mono text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 1 Col: Quick Card & Hiring Process */}
            <div className="space-y-6">
              <Card className="border shadow-sm bg-card sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg">Ready to Join Us?</CardTitle>
                  <CardDescription>
                    Applications are reviewed within 48 business hours by our engineering leads.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="p-3.5 rounded-lg bg-muted/40 space-y-2">
                    <p className="font-semibold text-foreground">Interview Process</p>
                    <ol className="list-decimal list-inside space-y-1.5 text-xs text-muted-foreground">
                      <li>Application &amp; CV review</li>
                      <li>30-min Culture &amp; Technical Intro</li>
                      <li>Practical architecture discussion (No LeetCode)</li>
                      <li>Offer &amp; Seamless Remote Onboarding</li>
                    </ol>
                  </div>

                  <Button onClick={scrollToApplication} className="w-full font-semibold">
                    Jump to Application Form
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Application Form Section (Requirement 2) */}
        <section ref={formRef} className="py-16 bg-muted/20 border-t">
          <div className="container mx-auto px-4 max-w-3xl">
            <Card className="border shadow-lg bg-card">
              <CardHeader className="text-center space-y-2 border-b pb-6">
                <Badge variant="outline" className="w-fit mx-auto px-3 py-0.5 text-xs">
                  Apply Now
                </Badge>
                <CardTitle className="text-2xl md:text-3xl font-bold">
                  Apply for {job.title}
                </CardTitle>
                <CardDescription>
                  Complete the application form below. Submitting will validate your information and launch your email client with your application formatted for <span className="font-mono text-foreground">{companyData.contact.careersEmail}</span>.
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-8">
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  {/* Full Name & Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-sm font-medium">
                        Full Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="e.g. Alex Rivera"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className={formErrors.fullName ? "border-destructive focus-visible:ring-destructive" : ""}
                      />
                      {formErrors.fullName && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> {formErrors.fullName}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email Address <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="alex@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={formErrors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                      />
                      {formErrors.email && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> {formErrors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Phone & Location */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium">
                        Phone Number <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className={formErrors.phone ? "border-destructive focus-visible:ring-destructive" : ""}
                      />
                      {formErrors.phone && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> {formErrors.phone}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-sm font-medium">
                        Location (City, Country) <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="location"
                        type="text"
                        placeholder="e.g. Austin, TX, USA or Berlin, Germany"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className={formErrors.location ? "border-destructive focus-visible:ring-destructive" : ""}
                      />
                      {formErrors.location && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> {formErrors.location}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Experience Years & Education */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="experienceYears" className="text-sm font-medium">
                        Relevant Experience (Years) <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="experienceYears"
                        type="text"
                        placeholder="e.g. 5+ years"
                        value={formData.experienceYears}
                        onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                        className={formErrors.experienceYears ? "border-destructive focus-visible:ring-destructive" : ""}
                      />
                      {formErrors.experienceYears && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> {formErrors.experienceYears}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="education" className="text-sm font-medium">
                        Education &amp; Qualifications
                      </Label>
                      <Input
                        id="education"
                        type="text"
                        placeholder="e.g. B.S. in Computer Science or Equivalent"
                        value={formData.education}
                        onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="space-y-2">
                    <Label htmlFor="skills" className="text-sm font-medium">
                      Primary Skills &amp; Technologies <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="skills"
                      type="text"
                      placeholder="e.g. React, TypeScript, Node.js, PostgreSQL, Docker, AWS"
                      value={formData.skills}
                      onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                      className={formErrors.skills ? "border-destructive focus-visible:ring-destructive" : ""}
                    />
                    {formErrors.skills && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {formErrors.skills}
                      </p>
                    )}
                  </div>

                  {/* Experience Summary */}
                  <div className="space-y-2">
                    <Label htmlFor="experienceSummary" className="text-sm font-medium">
                      Experience Summary / Key Achievements
                    </Label>
                    <Textarea
                      id="experienceSummary"
                      rows={3}
                      placeholder="Briefly highlight relevant products you've built or major problems you've solved..."
                      value={formData.experienceSummary}
                      onChange={(e) => setFormData({ ...formData, experienceSummary: e.target.value })}
                    />
                  </div>

                  {/* Job-Specific Questions */}
                  {job.customQuestions && job.customQuestions.length > 0 && (
                    <div className="space-y-4 pt-4 border-t border-border/60">
                      <h4 className="text-sm font-semibold tracking-wide text-foreground flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" /> Role-Specific Questions
                      </h4>
                      {job.customQuestions.map((q) => (
                        <div key={q.id} className="space-y-2">
                          <Label htmlFor={q.id} className="text-sm font-medium">
                            {q.label} {q.required && <span className="text-destructive">*</span>}
                          </Label>
                          {q.type === "select" ? (
                            <select
                              id={q.id}
                              value={formData.customAnswers[q.id] || ""}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  customAnswers: { ...formData.customAnswers, [q.id]: e.target.value },
                                })
                              }
                              className={`w-full rounded-md border bg-background px-3 py-2 text-sm ${formErrors[q.id] ? "border-destructive" : "border-input"}`}
                            >
                              <option value="">Select an option</option>
                              {(q.options ?? []).map((option) => <option key={option} value={option}>{option}</option>)}
                            </select>
                          ) : q.type === "textarea" ? (
                            <Textarea
                              id={q.id}
                              rows={3}
                              placeholder={q.placeholder}
                              value={formData.customAnswers[q.id] || ""}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  customAnswers: {
                                    ...formData.customAnswers,
                                    [q.id]: e.target.value,
                                  },
                                })
                              }
                              className={formErrors[q.id] ? "border-destructive focus-visible:ring-destructive" : ""}
                            />
                          ) : (
                            <Input
                              id={q.id}
                              type="text"
                              placeholder={q.placeholder}
                              value={formData.customAnswers[q.id] || ""}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  customAnswers: {
                                    ...formData.customAnswers,
                                    [q.id]: e.target.value,
                                  },
                                })
                              }
                              className={formErrors[q.id] ? "border-destructive focus-visible:ring-destructive" : ""}
                            />
                          )}
                          {formErrors[q.id] && (
                            <p className="text-xs text-destructive flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" /> {formErrors[q.id]}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* CV / Resume Upload */}
                  <div className="space-y-2 pt-4 border-t border-border/60">
                    <Label className="text-sm font-medium">
                      CV / Resume Document <span className="text-muted-foreground font-normal">(PDF, DOC, DOCX up to 5MB)</span>
                    </Label>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={handleFileChange}
                      className="hidden"
                      id="resume-upload"
                    />

                    {resumeFile ? (
                      <div className="flex items-center justify-between p-3.5 rounded-lg border bg-secondary/40 text-sm">
                        <div className="flex items-center gap-2.5 truncate">
                          <FileText className="h-5 w-5 text-primary shrink-0" />
                          <div className="truncate">
                            <p className="font-medium text-foreground truncate">{resumeFile.name}</p>
                            <p className="text-xs text-muted-foreground">{(resumeFile.size / 1024).toFixed(1)} KB</p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={handleRemoveFile}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          aria-label="Remove uploaded resume"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <label
                        htmlFor="resume-upload"
                        className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-all text-center"
                      >
                        <UploadCloud className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-sm font-medium text-foreground">Click to upload or drag &amp; drop your CV</span>
                        <span className="text-xs text-muted-foreground mt-1">Supported formats: PDF, DOC, DOCX (Max 5MB)</span>
                      </label>
                    )}
                  </div>

                  {/* Cover Letter */}
                  <div className="space-y-2">
                    <Label htmlFor="coverLetter" className="text-sm font-medium">
                      Cover Letter or Note to the Team <span className="text-muted-foreground font-normal">(Optional)</span>
                    </Label>
                    <Textarea
                      id="coverLetter"
                      rows={4}
                      placeholder="Tell us what excites you about this role at 10lonaz and why you're a great fit..."
                      value={formData.coverLetter}
                      onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                    />
                  </div>

                  {/* Privacy Consent */}
                  <div className="pt-2">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="privacyConsent"
                        checked={formData.privacyConsent}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, privacyConsent: checked === true })
                        }
                        className={formErrors.privacyConsent ? "border-destructive" : ""}
                      />
                      <div className="space-y-1">
                        <Label
                          htmlFor="privacyConsent"
                          className="text-xs leading-relaxed text-muted-foreground cursor-pointer"
                        >
                          I consent to 10lonaz processing my application data for recruitment purposes in accordance with confidentiality and data protection standards. <span className="text-destructive">*</span>
                        </Label>
                        {formErrors.privacyConsent && (
                          <p className="text-xs text-destructive flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" /> {formErrors.privacyConsent}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button type="submit" size="lg" className="w-full font-semibold gap-2" disabled={isSubmitting}>
                      <Send className="h-4 w-4" />
                      Save Application &amp; Open Email Draft
                    </Button>
                    <p className="text-center text-xs text-muted-foreground mt-3">
                      Your application is stored in this browser only. Email is not sent automatically; attach your CV to the email draft and press Send.
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Structured Summary Dialog (Requirement 2) */}
      <Dialog open={isSummaryDialogOpen} onOpenChange={setIsSummaryDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-emerald-500" />
              Application Staged for Submission
            </DialogTitle>
            <DialogDescription>
              The application is stored in this browser. Your email draft is not sent until you press Send.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-600 dark:text-amber-400 leading-relaxed">
              <strong>Important:</strong> No secure email backend or CV upload is connected. Your application is stored only on this device; attach your CV file {resumeFile ? `(${resumeFile.name})` : ""} and press <strong>"Send"</strong> in your email app. Do not treat this local copy as a secure applicant record.
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Application Summary Preview
                </span>
                <Button variant="ghost" size="sm" onClick={handleCopySummary} className="h-7 text-xs gap-1.5">
                  {hasCopiedSummary ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{hasCopiedSummary ? "Copied" : "Copy Summary Text"}</span>
                </Button>
              </div>
              <pre className="p-4 rounded-lg bg-muted text-xs font-mono whitespace-pre-wrap max-h-60 overflow-y-auto border">
                {stagedApplicationText}
              </pre>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsSummaryDialogOpen(false)}>
              Done
            </Button>
            <Button asChild>
              <a href={`mailto:${companyData.contact.careersEmail}?subject=${encodeURIComponent(`Job Application: ${job.title} - ${formData.fullName}`)}&body=${encodeURIComponent(stagedApplicationText)}`}>
                Re-open Email Client
              </a>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default JobDetails;
