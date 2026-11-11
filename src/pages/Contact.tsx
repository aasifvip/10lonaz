import { useState, useId } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageCircle,
  Clock,
  Sparkles,
  Check,
  Copy,
  AlertCircle,
  ArrowRight,
  Briefcase,
} from "lucide-react";
import { toast } from "sonner";
import { SEO } from "@/components/common/SEO";
import { companyData } from "@/data/company";
import { getBreadcrumbSchema } from "@/data/seo";
import { readContentOverride, readSiteSettings, saveSubmission } from "@/admin/contentRepository";
import { faqData } from "@/data/faqs";

const defaultProjectTypes = [
  "Custom Software Development",
  "SaaS Product Engineering",
  "Web Application (SPA/PWA)",
  "Mobile App (iOS/Android)",
  "AI Copilot / RAG System",
  "Cloud Infrastructure & DevOps",
  "UI/UX Design & Prototyping",
  "Code Audit & Modernization",
  "Other Inquiry",
];

const defaultBudgetRanges = [
  "Under $10,000",
  "$10,000 – $25,000",
  "$25,000 – $50,000",
  "$50,000 – $100,000",
  "$100,000+",
  "Flexible / Undecided",
];

const contactOptions = readContentOverride("contactOptions", {
  projectTypes: defaultProjectTypes,
  budgetRanges: defaultBudgetRanges,
  defaultProjectType: "Custom Software Development",
  defaultBudget: "$25,000 – $50,000",
  defaultTimeline: "1 – 3 months",
});
const projectTypes = contactOptions.projectTypes;
const budgetRanges = contactOptions.budgetRanges;

export const Contact: React.FC = () => {
  const [searchParams] = useSearchParams();
  const preselectedService = searchParams.get("service") || "";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: preselectedService || contactOptions.defaultProjectType,
    budget: contactOptions.defaultBudget,
    timeline: contactOptions.defaultTimeline,
    message: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSummaryDialogOpen, setIsSummaryDialogOpen] = useState(false);
  const [stagedInquiryText, setStagedInquiryText] = useState("");
  const [hasCopiedInquiry, setHasCopiedInquiry] = useState(false);

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Full name is required";
    if (!formData.email.trim() || !formData.email.includes("@")) {
      errors.email = "A valid business email is required";
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errors.message = "Please provide a brief description of your project (min 10 characters)";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fill in the required fields marked in red.");
      return;
    }

    setIsSubmitting(true);

    let summary = `=========================================\n`;
    summary += `10LONAZ NEW PROJECT INQUIRY\n`;
    summary += `Date: ${new Date().toISOString().split("T")[0]}\n`;
    summary += `=========================================\n\n`;

    summary += `1. CONTACT DETAILS\n`;
    summary += `Name: ${formData.name}\n`;
    summary += `Email: ${formData.email}\n`;
    summary += `Phone: ${formData.phone || "Not provided"}\n\n`;

    summary += `2. PROJECT PARAMETERS\n`;
    summary += `Service / Domain: ${formData.projectType}\n`;
    summary += `Estimated Budget: ${formData.budget}\n`;
    summary += `Desired Timeline: ${formData.timeline}\n\n`;

    summary += `3. PROJECT BRIEF & SCOPE\n`;
    summary += `${formData.message}\n`;

    setStagedInquiryText(summary);
    setIsSummaryDialogOpen(true);
    setIsSubmitting(false);

    // Build Mailto URI
    const subject = `New Project Inquiry: ${formData.projectType} - ${formData.name}`;
    const body = encodeURIComponent(
      `Dear 10lonaz Solutions Team,\n\nI would like to inquire about initiating a project with 10lonaz:\n\n${summary}\n\nPlease let me know your availability for an introductory technical call.\n\nBest regards,\n${formData.name}`
    );

    const recipients = readSiteSettings().recipientEmails;
    const recipient = recipients.length ? recipients.join(",") : companyData.contact.email;
    try {
      saveSubmission({
        kind: "inquiry",
        details: { ...formData },
        summaryText: summary,
      });
      toast.success("Inquiry saved in this browser. Email is not sent until you send the draft.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "The inquiry could not be saved in this browser.");
    }

    const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${body}`;

    // Safely trigger mail client
    window.location.href = mailtoUrl;
  };

  const handleCopyInquiry = () => {
    navigator.clipboard.writeText(stagedInquiryText);
    setHasCopiedInquiry(true);
    toast.success("Inquiry summary copied to clipboard!");
    setTimeout(() => setHasCopiedInquiry(false), 2500);
  };

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="Contact Us &amp; Request a Quote"
        description="Connect with 10lonaz. Schedule a technical discovery session, discuss software architecture, or request a detailed proposal for your project."
        canonicalPath="/contact"
        schemas={[getBreadcrumbSchema(breadcrumbs)]}
      />
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-28 bg-gradient-to-br from-background via-secondary/20 to-accent/10 border-b">
          <div className="container mx-auto px-4 max-w-4xl text-center space-y-6">
            <Badge variant="outline" className="px-3.5 py-1 text-xs font-semibold gap-1.5 border-primary/30">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Let's Build Together
            </Badge>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              Start Your Project with <span className="text-primary">10lonaz</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Tell us about your product roadmap. Our senior engineering leads will review your requirements and reply with architectural feedback and an estimate within 24 hours.
            </p>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-12 bg-muted/20 border-b">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Email */}
              <div className="p-6 rounded-2xl bg-card border shadow-sm space-y-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                  <Mail className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-sm">General Inquiries</h3>
                <a
                  href={`mailto:${companyData.contact.email}`}
                  className="text-xs text-primary font-mono hover:underline block truncate"
                >
                  {companyData.contact.email}
                </a>
                <p className="text-[11px] text-muted-foreground">Response within 24 hours</p>
              </div>

              {/* Phone */}
              <div className="p-6 rounded-2xl bg-card border shadow-sm space-y-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                  <Phone className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-sm">Direct Phone</h3>
                <a
                  href={`tel:${companyData.contact.phone}`}
                  className="text-xs text-primary font-mono hover:underline block truncate"
                >
                  {companyData.contact.phoneDisplay}
                </a>
                <p className="text-[11px] text-muted-foreground">Mon–Fri: 9am–6pm EST</p>
              </div>

              {/* WhatsApp */}
              <div className="p-6 rounded-2xl bg-card border shadow-sm space-y-2">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-sm">WhatsApp Business</h3>
                <a
                  href={companyData.contact.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline block"
                >
                  Chat with Our Team
                </a>
                <p className="text-[11px] text-muted-foreground">Instant messaging support</p>
              </div>

              {/* Recruitment */}
              <div className="p-6 rounded-2xl bg-card border shadow-sm space-y-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                  <Briefcase className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-sm">Careers &amp; Hiring</h3>
                <a
                  href={`mailto:${companyData.contact.careersEmail}`}
                  className="text-xs text-primary font-mono hover:underline block truncate"
                >
                  {companyData.contact.careersEmail}
                </a>
                <Link to="/careers" className="text-[11px] text-muted-foreground hover:text-foreground underline block">
                  View open vacancies &rarr;
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <Card className="border shadow-xl bg-card">
              <CardHeader className="text-center space-y-2 border-b pb-6">
                <CardTitle className="text-2xl md:text-3xl font-bold">Request a Technical Proposal</CardTitle>
                <CardDescription>
                  Tell us about your timelines, goals, and technical stack. We'll get back to you with a transparent plan.
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-8">
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  {/* Name and Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">
                        Your Full Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="e.g. Alex Rivera"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={formErrors.name ? "border-destructive focus-visible:ring-destructive" : ""}
                      />
                      {formErrors.name && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> {formErrors.name}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Business Email <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="alex@yourcompany.com"
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

                  {/* Phone & Project Type */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium">
                        Phone / WhatsApp <span className="text-muted-foreground text-xs font-normal">(Optional)</span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="projectType" className="text-sm font-medium">
                        Primary Service Needed
                      </Label>
                      <select
                        id="projectType"
                        value={formData.projectType}
                        onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                        className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        {projectTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Budget & Timeline */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="budget" className="text-sm font-medium">
                        Estimated Budget Range
                      </Label>
                      <select
                        id="budget"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        {budgetRanges.map((range) => (
                          <option key={range} value={range}>
                            {range}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timeline" className="text-sm font-medium">
                        Target Timeline
                      </Label>
                      <Input
                        id="timeline"
                        type="text"
                        placeholder="e.g. 2 months / ASAP"
                        value={formData.timeline}
                        onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm font-medium">
                      Project Description &amp; Scope <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="message"
                      rows={5}
                      placeholder="Describe what you want to build, existing systems/codebase, key objectives, and any technical preferences..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className={formErrors.message ? "border-destructive focus-visible:ring-destructive" : ""}
                    />
                    {formErrors.message && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {formErrors.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 space-y-3">
                    <Button type="submit" size="lg" className="w-full font-semibold gap-2" disabled={isSubmitting}>
                      <Send className="h-4 w-4" />
                      Format Inquiry &amp; Launch Email
                    </Button>
                    <p className="text-center text-xs text-muted-foreground">
                      Your inquiry is stored in this browser only. Do not include sensitive information; the email draft is not sent until you send it.
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
        <section className="border-t bg-muted/20 py-16">
          <div className="container mx-auto max-w-4xl px-4">
            <h2 className="mb-6 text-center text-2xl font-bold">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqData.filter((faq) => faq.featured).slice(0, 4).map((faq) => (
                <details key={faq.id} className="rounded-xl border border-border bg-card p-4">
                  <summary className="cursor-pointer font-semibold">{faq.question}</summary>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{faq.answer}</p>
                </details>
              ))}
            </div>
            <Link to="/faq" className="mt-5 inline-block text-sm font-medium underline underline-offset-4">Browse all questions</Link>
          </div>
        </section>
      </main>

      {/* Summary Dialog */}
      <Dialog open={isSummaryDialogOpen} onOpenChange={setIsSummaryDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-emerald-500" />
              Inquiry Formatted for Submission
            </DialogTitle>
            <DialogDescription>
              Your inquiry was saved on this device. The email draft is not sent until you press Send in your email app.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="p-4 rounded-lg bg-secondary/50 border text-xs text-muted-foreground leading-relaxed">
              <strong>Email fallback:</strong> If your email app did not open, copy the text below and email <strong className="text-foreground">{readSiteSettings().recipientEmails.join(", ") || companyData.contact.email}</strong>. No server-side email service is connected.
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Formatted Inquiry
                </span>
                <Button variant="ghost" size="sm" onClick={handleCopyInquiry} className="h-7 text-xs gap-1.5">
                  {hasCopiedInquiry ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{hasCopiedInquiry ? "Copied" : "Copy Inquiry"}</span>
                </Button>
              </div>
              <pre className="p-4 rounded-lg bg-muted text-xs font-mono whitespace-pre-wrap max-h-60 overflow-y-auto border">
                {stagedInquiryText}
              </pre>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsSummaryDialogOpen(false)}>
              Close
            </Button>
            <Button asChild className="gap-2">
              <a
                href={companyData.contact.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4" />
                Follow up on WhatsApp
              </a>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Contact;
