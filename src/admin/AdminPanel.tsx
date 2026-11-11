import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Activity, AlertTriangle, ArrowDown, ArrowLeft, ArrowRight, ArrowUp, BriefcaseBusiness,
  Building2, Check, FileText, Globe2, Home, LayoutDashboard,
  LogOut, Mail, MessageSquare, Plus, Save, Settings2, ShieldAlert, Trash2, Upload,
  X,
} from "lucide-react";
import { articles } from "@/data/articles";
import { companyData } from "@/data/company";
import { jobVacancies } from "@/data/careers";
import { faqData } from "@/data/faqs";
import { products } from "@/data/products";
import { servicesData } from "@/data/services";
import { testimonialsData } from "@/data/testimonials";
import { defaultAboutPageCopy } from "@/data/pageCopy";
import { languages, translations } from "@/lib/translations";
import {
  ContentSection,
  endLocalAdminSession,
  getContentBundleForExport,
  hasLocalAdminSession,
  listSubmissions,
  readContentOverride,
  readSiteSettings,
  saveContentSection,
  saveContentSections,
  saveSiteSettings,
  SiteSettings,
  startLocalAdminSession,
  SubmissionRecord,
  updateSubmissionStatus,
} from "./contentRepository";

type JsonRecord = Record<string, unknown>;

const iconNames: Record<string, string> = {
  "universal-billing-saas": "Receipt",
  "ai-page-summarizer-extension": "Chrome",
  "fitness-tracker-mobile-app": "Smartphone",
  "ai-business-tools": "BrainCircuit",
  "e-commerce-platform": "ShoppingBag",
  "school-lms-platform": "GraduationCap",
  "travel-booking-platform": "Plane",
  "restaurant-management-system": "UtensilsCrossed",
};

const productRecords = products.map(({ icon: _icon, ...product }) => ({
  ...product,
  iconName: iconNames[product.slug] ?? "Code2",
  published: product.published !== false,
  featuredOnHome: product.featuredOnHome ?? [
    "universal-billing-saas",
    "restaurant-management-system",
    "ai-business-tools",
  ].includes(product.slug),
  order: product.order ?? products.indexOf(products.find((item) => item.slug === product.slug)!),
}));

const withOrder = <T extends JsonRecord>(values: T[]): T[] =>
  values.map((value, order) => ({ ...value, order: Number(value.order ?? order) }));

const navItems = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/homepage", label: "Homepage", icon: Home },
  { path: "/admin/about", label: "About", icon: Building2 },
  { path: "/admin/services", label: "Services", icon: Settings2 },
  { path: "/admin/portfolio", label: "Portfolio", icon: Activity },
  { path: "/admin/careers", label: "Careers & jobs", icon: BriefcaseBusiness },
  { path: "/admin/applications", label: "Applications", icon: FileText },
  { path: "/admin/contact", label: "Contact & FAQ", icon: MessageSquare },
  { path: "/admin/inquiries", label: "Inquiries", icon: Mail },
  { path: "/admin/reviews", label: "Reviews", icon: MessageSquare },
  { path: "/admin/articles", label: "Articles", icon: FileText },
  { path: "/admin/languages", label: "Languages", icon: Globe2 },
  { path: "/admin/seo", label: "SEO", icon: Activity },
  { path: "/admin/settings", label: "Settings", icon: Settings2 },
];

const sectionTitles: Record<string, string> = {
  "/admin/homepage": "Homepage content",
  "/admin/about": "About content",
  "/admin/services": "Services",
  "/admin/portfolio": "Portfolio",
  "/admin/careers": "Careers & job vacancies",
  "/admin/applications": "Job applications",
  "/admin/contact": "Contact & FAQ",
  "/admin/inquiries": "Contact inquiries",
  "/admin/reviews": "Client reviews",
  "/admin/articles": "Articles & news",
  "/admin/languages": "Language management",
  "/admin/seo": "SEO metadata",
  "/admin/settings": "Website settings",
};

function blankFrom(value: unknown): unknown {
  if (Array.isArray(value)) return [];
  if (typeof value === "string") return "";
  if (typeof value === "number") return 0;
  if (typeof value === "boolean") return false;
  if (typeof value === "object" && value !== null) {
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, blankFrom(child)]));
  }
  return "";
}

function blankArrayEntry(kind: string, name: string): unknown {
  if (kind === "products" && name === "features") return { title: "", description: "" };
  if (kind === "products" && name === "outcomes") return { metric: "", label: "" };
  if (kind === "jobs" && name === "customQuestions") return { id: "", label: "", placeholder: "", type: "text", options: [], required: false };
  if (kind === "articles" && name === "content") return { type: "paragraph", text: "" };
  if (kind === "company" && name === "socialLinks") return { platform: "", url: "", label: "", handle: "" };
  if (kind === "about" && name === "values") return { iconName: "Target", title: "", description: "" };
  if (kind === "about" && name === "capabilities") return { title: "", description: "" };
  if (kind === "about" && name === "milestones") return { year: "", title: "", event: "" };
  return {};
}

function labelFor(key: string): string {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function validateEditorData(value: unknown, path = ""): string | null {
  if (Array.isArray(value)) {
    for (const [index, child] of value.entries()) {
      const issue = validateEditorData(child, `${path}.${index}`);
      if (issue) return issue;
    }
    return null;
  }
  if (typeof value === "object" && value !== null) {
    for (const [key, child] of Object.entries(value)) {
      const issue = validateEditorData(child, path ? `${path}.${key}` : key);
      if (issue) return issue;
    }
    return null;
  }
  if (typeof value !== "string" || !value.trim()) return null;
  const field = path.split(".").pop() ?? "";
  if (/email$/i.test(field) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return `${labelFor(field)} must be a valid email address.`;
  }
  if (/(url|link|image|avatar|favicon|logo|photo|coverimage)$/i.test(field)) {
    try {
      if (new URL(value).protocol !== "https:") return `${labelFor(field)} must use an https:// URL.`;
    } catch {
      return `${labelFor(field)} must be a valid https:// URL.`;
    }
  }
  return null;
}

function TextControl({
  label,
  value,
  onChange,
  multiline = false,
  placeholder,
  type = "text",
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  placeholder?: string;
  type?: string;
  hint?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          rows={4}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      )}
      {hint && <span className="block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

function FieldEditor({
  name,
  value,
  onChange,
  kind,
  depth = 0,
}: {
  name: string;
  value: unknown;
  onChange: (value: unknown) => void;
  kind: string;
  depth?: number;
}) {
  const label = labelFor(name);
  if (typeof value === "boolean") {
    return (
      <label className="flex items-center justify-between gap-4 rounded-lg border border-border px-3 py-2.5">
        <span className="text-sm font-medium">{label}</span>
        <input
          type="checkbox"
          checked={value}
          onChange={(event) => onChange(event.target.checked)}
          className="h-4 w-4 accent-primary"
        />
      </label>
    );
  }
  if (Array.isArray(value)) {
    const primitiveList = value.every((item) => ["string", "number", "boolean"].includes(typeof item));
    const objectList = value.some((item) => typeof item === "object" && item !== null) ||
      (!value.length && ((kind === "products" && ["features", "outcomes"].includes(name)) ||
        (kind === "jobs" && name === "customQuestions") ||
        (kind === "articles" && name === "content") ||
        (kind === "company" && name === "socialLinks") ||
        (kind === "about" && ["values", "capabilities", "milestones"].includes(name))));
    if (primitiveList && !objectList) {
      return (
        <TextControl
          label={`${label} (one item per line)`}
          value={value.join("\n")}
          onChange={(text) => onChange(text.split(/\r?\n/).filter((line) => line.length > 0))}
          multiline
          placeholder="Add one value per line"
        />
      );
    }
    return (
      <fieldset className="space-y-3 rounded-xl border border-border p-3">
        <legend className="px-1 text-sm font-semibold">{label}</legend>
        {value.map((item, index) => (
          <div className="rounded-lg bg-muted/40 p-3" key={index}>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">{label} {index + 1}</span>
              <button
                type="button"
                onClick={() => onChange(value.filter((_, itemIndex) => itemIndex !== index))}
                className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                aria-label={`Remove ${label} ${index + 1}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <FieldEditor
              name={`${name} ${index + 1}`}
              value={item}
              kind={kind}
              depth={depth + 1}
              onChange={(next) => onChange(value.map((child, itemIndex) => itemIndex === index ? next : child))}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...value, value.length ? blankFrom(value[0]) : blankArrayEntry(kind, name)])}
          className="inline-flex items-center gap-1 rounded-lg border border-dashed border-border px-3 py-2 text-sm hover:bg-muted"
        >
          <Plus className="h-4 w-4" /> Add {label.toLowerCase()}
        </button>
      </fieldset>
    );
  }
  if (typeof value === "object" && value !== null) {
    return (
      <fieldset className="space-y-3 rounded-xl border border-border p-3">
        <legend className="px-1 text-sm font-semibold">{label}</legend>
        <div className={`grid gap-3 ${depth === 0 ? "md:grid-cols-2" : ""}`}>
          {Object.entries(value).map(([key, child]) => (
            <FieldEditor
              key={key}
              name={key}
              value={child}
              kind={kind}
              depth={depth + 1}
              onChange={(next) => onChange({ ...value, [key]: next })}
            />
          ))}
        </div>
      </fieldset>
    );
  }
  if (typeof value === "number") {
    return (
      <TextControl
        label={label}
        type="number"
        value={String(value)}
        onChange={(next) => onChange(next === "" ? 0 : Number(next))}
      />
    );
  }
  if (kind === "jobs" && depth === 0 && name === "type") {
    return (
      <label className="block space-y-1.5">
        <span className="text-sm font-medium">{label}</span>
        <select value={String(value)} onChange={(event) => onChange(event.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
          {["Contract", "Freelance", "Full-time", "Part-time", "Internship"].map((item) => <option key={item}>{item}</option>)}
        </select>
        <span className="text-xs font-medium text-primary">Contract and freelance are preferred engagement types.</span>
      </label>
    );
  }
  if (kind === "jobs" && depth > 0 && name === "type") {
    return (
      <label className="block space-y-1.5">
        <span className="text-sm font-medium">{label}</span>
        <select value={String(value)} onChange={(event) => onChange(event.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
          {["text", "textarea", "select"].map((item) => <option key={item}>{item}</option>)}
        </select>
      </label>
    );
  }
  if (kind === "jobs" && depth === 0 && name === "locationType") {
    return (
      <label className="block space-y-1.5">
        <span className="text-sm font-medium">{label}</span>
        <select value={String(value)} onChange={(event) => onChange(event.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
          {["remote", "hybrid", "on-site"].map((item) => <option key={item}>{item}</option>)}
        </select>
      </label>
    );
  }
  if (kind === "jobs" && depth === 0 && name === "salaryPeriod") {
    return (
      <label className="block space-y-1.5">
        <span className="text-sm font-medium">{label}</span>
        <select value={String(value)} onChange={(event) => onChange(event.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
          {["hourly", "daily", "monthly", "project-based", "yearly"].map((item) => <option key={item}>{item}</option>)}
        </select>
      </label>
    );
  }
  const isLong = /description|overview|responsibilit|qualification|requirement|answer|content|summary|challenge|benefit|bio|quote|caption|event|text|message|scope/i.test(name);
  const isUrl = /url|image|avatar|favicon|logo|photo|screenshots/i.test(name);
  return (
    <div className="space-y-2">
      <TextControl label={label} value={String(value ?? "")} onChange={onChange} multiline={isLong} type={isUrl ? "url" : "text"} placeholder={isUrl ? "https://..." : undefined} />
      {isUrl && typeof value === "string" && value.startsWith("https://") && /image|avatar|photo|logo|cover/i.test(name) && (
        <img src={value} alt={`${label} preview`} className="h-24 max-w-full rounded-lg border object-cover" />
      )}
    </div>
  );
}

function CollectionManager({
  title,
  section,
  initialRecords,
  kind,
  prepare,
}: {
  title: string;
  section: ContentSection;
  initialRecords: JsonRecord[];
  kind: string;
  prepare?: (record: JsonRecord) => JsonRecord;
}) {
  const [records, setRecords] = useState<JsonRecord[]>(() => withOrder(initialRecords));
  const [selected, setSelected] = useState<number | null>(null);
  const [draft, setDraft] = useState<JsonRecord | null>(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const persist = (next: JsonRecord[]) => {
    try {
      const ordered = next.map((record, order) => ({ ...record, order }));
      saveContentSection(section, ordered.map((record) => prepare ? prepare(record) : record));
      setRecords(ordered);
      setError("");
      setSaved(true);
      window.setTimeout(() => window.location.reload(), 250);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not save this section.");
    }
  };

  const edit = (index: number) => {
    setSelected(index);
    setDraft({ ...records[index] });
    setError("");
    setSaved(false);
  };

  const create = () => {
    const template = records[0] ?? { id: "", title: "", order: records.length };
    const next = blankFrom(template) as JsonRecord;
    if ("id" in next) next.id = `${section}-${Date.now()}`;
    if ("slug" in next) next.slug = "";
    if ("order" in next) next.order = records.length;
    if ("published" in template) next.published = true;
    if ("isOpen" in template) next.isOpen = true;
    setSelected(null);
    setDraft(next);
    setError("");
  };

  const validate = (record: JsonRecord): string | null => {
    const requiredByKind: Record<string, string[]> = {
      services: ["id", "slug", "title", "shortDescription"],
      products: ["slug", "title", "description"],
      jobs: ["id", "slug", "title", "department", "type", "experience", "overview"],
      faqs: ["id", "question", "answer", "category"],
      testimonials: ["id", "name", "content", "company"],
      articles: ["id", "slug", "title", "excerpt"],
    };
    const missing = (requiredByKind[kind] ?? ["id"]).find((field) => !String(record[field] ?? "").trim());
    if (missing) return `${labelFor(missing)} is required.`;
    const keyField = "slug" in record ? "slug" : "id";
    if (selected === null && records.some((item) => item[keyField] === record[keyField])) return `${labelFor(keyField)} must be unique.`;
    if (selected !== null && records.some((item, index) => index !== selected && item[keyField] === record[keyField])) return `${labelFor(keyField)} must be unique.`;
    if (kind === "testimonials" && (Number(record.rating) < 1 || Number(record.rating) > 5)) return "Rating must be between 1 and 5.";
    return validateEditorData(record);
  };

  const save = () => {
    if (!draft) return;
    const issue = validate(draft);
    if (issue) {
      setError(issue);
      return;
    }
    const next = [...records];
    if (selected === null) next.push(draft);
    else next[selected] = draft;
    persist(next);
  };

  const remove = (index: number) => {
    const label = String(records[index].title ?? records[index].question ?? records[index].name ?? records[index].slug ?? records[index].id);
    if (!window.confirm(`Delete "${label}"? This takes effect on the public website when the page reloads.`)) return;
    persist(records.filter((_, itemIndex) => itemIndex !== index));
    setDraft(null);
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= records.length) return;
    const next = [...records];
    [next[index], next[target]] = [next[target], next[index]];
    persist(next);
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(240px,0.75fr)_minmax(0,1.5fr)]">
      <section className="rounded-2xl border border-border bg-card p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div><h2 className="font-semibold">{title}</h2><p className="text-xs text-muted-foreground">{records.length} records</p></div>
          <button type="button" onClick={create} className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"><Plus className="h-4 w-4" /> Add</button>
        </div>
        <div className="max-h-[65vh] space-y-2 overflow-auto">
          {records.map((record, index) => (
            <div key={String(record.slug ?? record.id ?? index)} className={`flex items-center gap-1 rounded-xl border p-2 ${selected === index ? "border-primary bg-primary/5" : "border-border"}`}>
              <button type="button" onClick={() => edit(index)} className="min-w-0 flex-1 px-2 py-1 text-left">
                <span className="block truncate text-sm font-medium">{String(record.title ?? record.question ?? record.name ?? record.slug ?? record.id ?? "Untitled")}</span>
                <span className="block truncate text-xs text-muted-foreground">{String(record.slug ?? record.category ?? record.type ?? "")}</span>
              </button>
              <button type="button" onClick={() => move(index, -1)} aria-label="Move up" className="rounded p-1 hover:bg-muted"><ArrowUp className="h-3.5 w-3.5" /></button>
              <button type="button" onClick={() => move(index, 1)} aria-label="Move down" className="rounded p-1 hover:bg-muted"><ArrowDown className="h-3.5 w-3.5" /></button>
              <button type="button" onClick={() => remove(index)} aria-label="Delete record" className="rounded p-1 text-destructive hover:bg-destructive/10"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          ))}
          {records.length === 0 && <p className="rounded-lg bg-muted/40 p-4 text-sm text-muted-foreground">No records yet. Add the first item to begin.</p>}
        </div>
      </section>
      <section className="rounded-2xl border border-border bg-card p-4 sm:p-6">
        {draft ? (
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div><h2 className="text-lg font-semibold">{selected === null ? `Create ${title.slice(0, -1)}` : "Edit record"}</h2><p className="text-sm text-muted-foreground">Save publishes this change directly to the website content store.</p></div>
              <button type="button" onClick={() => setDraft(null)} className="rounded-lg p-2 hover:bg-muted" aria-label="Close editor"><X className="h-4 w-4" /></button>
            </div>
            <div className="grid gap-3">
              {Object.entries(draft).map(([key, value]) => (
                <FieldEditor key={key} name={key} value={value} kind={kind} onChange={(next) => setDraft({ ...draft, [key]: next })} />
              ))}
            </div>
            {error && <p role="alert" className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
            {saved && <p className="text-sm text-emerald-700">Saved. Reloading to sync the public site…</p>}
            <button type="button" onClick={save} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"><Save className="h-4 w-4" /> Save changes</button>
          </div>
        ) : (
          <div className="flex min-h-64 flex-col items-center justify-center text-center">
            <FileText className="mb-3 h-8 w-8 text-muted-foreground" />
            <h2 className="font-semibold">Select a record to edit</h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">Use the list to edit, reorder, publish, or remove content. Changes are shared with public pages through the local content repository.</p>
          </div>
        )}
      </section>
    </div>
  );
}

function Dashboard() {
  const submissions = listSubmissions();
  const settings = readSiteSettings();
  const analyticsMeasurementId = settings.analyticsMeasurementId || import.meta.env.VITE_GA_MEASUREMENT_ID || "";
  const metrics = [
    ["Services", servicesData.filter((item) => item.published !== false).length],
    ["Portfolio projects", products.filter((item) => item.published !== false).length],
    ["Active vacancies", settings.hiringEnabled ? jobVacancies.filter((item) => item.isOpen).length : 0],
    ["FAQs", faqData.length],
    ["Reviews", testimonialsData.length],
    ["Articles", articles.length],
    ["New inquiries", submissions.filter((item) => item.kind === "inquiry" && item.status === "new").length],
    ["New applications", submissions.filter((item) => item.kind === "application" && item.status === "new").length],
  ];
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Website overview</h2>
        <p className="mt-1 text-sm text-muted-foreground">Live counts from the shared content and browser submission store.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(([label, value]) => <div key={String(label)} className="rounded-2xl border border-border bg-card p-4"><p className="text-xs font-medium text-muted-foreground">{label}</p><p className="mt-2 text-3xl font-bold">{value}</p></div>)}
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2"><Activity className="h-4 w-4 text-primary" /><h3 className="font-semibold">Website analytics</h3></div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {["Visitors", "Page views", "Popular pages", "Traffic sources"].map((metric) => <div key={metric} className="rounded-xl bg-muted/50 p-3"><p className="text-xs text-muted-foreground">{metric}</p><p className="mt-2 text-lg font-semibold">Unavailable</p></div>)}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">{analyticsMeasurementId ? "Google Analytics page-view tracking is configured. Reporting still requires a secure Google Analytics Data API backend; no metrics are fabricated." : "Google Analytics is not configured. Configure a measurement ID in Settings; reports still require a secure Data API backend."}</p>
        </section>
        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-amber-600" /><h3 className="font-semibold">System status</h3></div>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 text-emerald-600" /> Public sections read from the same local content overrides as admin saves.</li>
            <li className="flex items-start gap-2"><ShieldAlert className="mt-0.5 h-4 w-4 text-amber-600" /> Local editor mode is not secure authentication; protect this route behind a real backend before deployment.</li>
            <li className="flex items-start gap-2"><Mail className="mt-0.5 h-4 w-4 text-amber-600" /> Browser storage cannot send email or safely store CV files. Applicants must use the visible email fallback.</li>
            <li className="flex items-start gap-2"><Activity className="mt-0.5 h-4 w-4 text-muted-foreground" /> Analytics reports unavailable until a server-side provider integration is connected.</li>
          </ul>
        </section>
      </div>
      <section className="rounded-2xl border border-border bg-card p-5">
        <h3 className="font-semibold">Recent website activity</h3>
        {submissions.length ? (
          <div className="mt-3 divide-y divide-border">
            {submissions.slice(0, 5).map((submission) => <p key={submission.id} className="flex flex-wrap justify-between gap-2 py-3 text-sm"><span>{submission.kind === "inquiry" ? "Contact inquiry" : "Job application"} · {String(submission.details.name ?? submission.details.fullName ?? "Applicant")}</span><span className="text-muted-foreground">{new Date(submission.submittedAt).toLocaleString()}</span></p>)}
          </div>
        ) : <p className="mt-3 rounded-xl bg-muted/40 p-4 text-sm text-muted-foreground">No submissions have been saved in this browser.</p>}
      </section>
    </div>
  );
}

function LocalAccessGate({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <section className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="mr-1 inline h-4 w-4" /> Public website</Link>
        <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-primary">10LONAZ · Local editor</p>
        <h1 className="mt-2 text-2xl font-bold">Admin control panel</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">This phase uses browser storage only. It does not provide real authentication, authorization, or secure protection for personal data. Do not deploy the admin route publicly until Firebase Authentication and server-side authorization are implemented.</p>
        <div className="mt-5 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm">
          <p className="font-semibold">Local-only access warning</p>
          <p className="mt-1 text-muted-foreground">Continuing only sets a temporary session flag in this browser; it is not a password or security boundary.</p>
        </div>
        <button onClick={onOpen} className="mt-6 w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground">Continue to local editor</button>
      </section>
    </div>
  );
}

function SubmissionInbox({ kind }: { kind: SubmissionRecord["kind"] }) {
  const [items, setItems] = useState(() => listSubmissions().filter((item) => item.kind === kind));
  const [error, setError] = useState("");
  const updateStatus = (id: string, status: SubmissionRecord["status"]) => {
    try {
      updateSubmissionStatus(id, status);
      setItems((current) => current.map((item) => item.id === id ? { ...item, status } : item));
      setError("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to update status.");
    }
  };
  return (
    <section className="space-y-4">
      <div><h2 className="text-xl font-semibold">{kind === "inquiry" ? "Contact inquiries" : "Job applications"}</h2><p className="mt-1 text-sm text-muted-foreground">Saved in this browser only. The visitor’s email is not automatically sent.</p></div>
      {error && <p role="alert" className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
      {!items.length ? <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center"><Mail className="mx-auto h-8 w-8 text-muted-foreground" /><h3 className="mt-3 font-semibold">No {kind === "inquiry" ? "inquiries" : "applications"} yet</h3><p className="mt-1 text-sm text-muted-foreground">New public form submissions saved on this browser will appear here.</p></div> : items.map((item) => {
        const applicantEmail = String(item.details.email ?? "");
        const applicantName = String(item.details.name ?? item.details.fullName ?? "Applicant");
        return (
          <article key={item.id} className="rounded-2xl border border-border bg-card p-4 sm:p-5">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
              <div><h3 className="font-semibold">{applicantName}</h3><p className="text-sm text-muted-foreground">{applicantEmail} · {new Date(item.submittedAt).toLocaleString()}</p></div>
              <select aria-label="Submission status" value={item.status} onChange={(event) => updateStatus(item.id, event.target.value as SubmissionRecord["status"])} className="rounded-lg border border-border bg-background px-3 py-2 text-sm">
                {["new", "reviewed", "archived"].map((status) => <option key={status} value={status}>{labelFor(status)}</option>)}
              </select>
            </div>
            <dl className="mt-4 grid gap-2 sm:grid-cols-2">
              {Object.entries(item.details).filter(([key]) => key !== "resumeFile" && key !== "privacyConsent" && key !== "customAnswers").map(([key, value]) => (
                <div key={key} className="min-w-0 rounded-lg bg-muted/40 p-3"><dt className="text-xs font-medium text-muted-foreground">{labelFor(key)}</dt><dd className="mt-1 break-words text-sm">{typeof value === "object" ? JSON.stringify(value) : String(value ?? "—")}</dd></div>
              ))}
              {item.details.customAnswers && <div className="rounded-lg bg-muted/40 p-3 sm:col-span-2"><dt className="text-xs font-medium text-muted-foreground">Custom answers</dt><dd className="mt-1 whitespace-pre-wrap text-sm">{JSON.stringify(item.details.customAnswers, null, 2)}</dd></div>}
              {item.details.resumeFile && <div className="rounded-lg bg-amber-500/5 p-3 sm:col-span-2"><dt className="text-xs font-medium">Resume</dt><dd className="mt-1 text-sm">{String(item.details.resumeFile)} · File not uploaded or stored</dd></div>}
            </dl>
            <p className="mt-4 whitespace-pre-wrap rounded-lg border border-border p-3 text-sm">{item.summaryText}</p>
            <a href={`mailto:${encodeURIComponent(applicantEmail)}?subject=${encodeURIComponent(`10LONAZ ${kind === "inquiry" ? "inquiry" : "application"} follow-up`)}`} className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted"><Mail className="h-4 w-4" /> Contact applicant by email</a>
          </article>
        );
      })}
    </section>
  );
}

function LanguageManager() {
  const initial = useMemo(() => readContentOverride<Record<string, Record<string, string>>>("translations", translations), []);
  const [dictionaries, setDictionaries] = useState(initial);
  const [enabled, setEnabled] = useState(readSiteSettings().enabledLanguages);
  const [defaultLanguage, setDefaultLanguage] = useState(readSiteSettings().defaultLanguage);
  const [search, setSearch] = useState("");
  const [newKey, setNewKey] = useState("");
  const [notice, setNotice] = useState("");
  const keys = Object.keys(dictionaries.en ?? {}).filter((key) => key.toLowerCase().includes(search.toLowerCase()));
  const save = () => {
    try {
      const settings = readSiteSettings();
      saveContentSections({
        translations: dictionaries,
        settings: {
          ...settings,
          enabledLanguages: enabled,
          defaultLanguage: enabled.includes(defaultLanguage) ? defaultLanguage : "en",
        },
      });
      setNotice("Translations saved. Reloading so public pages use the updated strings…");
      window.setTimeout(() => window.location.reload(), 300);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not save translations.");
    }

  };
  const addKey = () => {
    const key = newKey.trim();
    if (!key || dictionaries.en?.[key]) return;
    setDictionaries((current) => {
      const next = { ...current };
      for (const language of languages) next[language.code] = { ...next[language.code], [key]: "" };
      return next;
    });
    setNewKey("");
  };
  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-border bg-card p-5">
        <h2 className="font-semibold">Available languages</h2>
        <p className="mt-1 text-sm text-muted-foreground">Disabling a language removes it from the public switcher. Existing translations are preserved.</p>
        <div className="mt-4 flex flex-wrap gap-2">{languages.map((language) => <label key={language.code} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm"><input type="checkbox" checked={enabled.includes(language.code)} disabled={language.code === "en"} onChange={(event) => setEnabled(event.target.checked ? [...enabled, language.code] : enabled.filter((code) => code !== language.code))} />{language.flag} {language.name}</label>)}</div>
        <label className="mt-4 block max-w-xs space-y-1.5"><span className="text-sm font-medium">Fallback language</span><select value={defaultLanguage} onChange={(event) => setDefaultLanguage(event.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">{languages.filter((language) => enabled.includes(language.code)).map((language) => <option key={language.code} value={language.code}>{language.name}</option>)}</select></label>
      </section>
      <div className="flex flex-col gap-3 md:flex-row">
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search translation keys" className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm" />
        <div className="flex gap-2"><input value={newKey} onChange={(event) => setNewKey(event.target.value)} placeholder="new.section.key" className="min-w-0 rounded-lg border border-border bg-background px-3 py-2 text-sm" /><button onClick={addKey} className="rounded-lg border border-border px-3 py-2 text-sm"><Plus className="inline h-4 w-4" /> Add key</button></div>
      </div>
      <div className="space-y-3">
        {keys.map((key) => (
          <article key={key} className="rounded-xl border border-border bg-card p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><h3 className="font-mono text-sm font-semibold">{key}</h3><span className="rounded-full bg-primary/5 px-2 py-1 text-xs text-primary">{key.startsWith("nav.") || key.startsWith("hero.") ? "Used on public website" : "Available to public components using t()"}</span></div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {languages.filter((language) => enabled.includes(language.code)).map((language) => {
                const text = dictionaries[language.code]?.[key] ?? "";
                const missing = language.code !== "en" && !text.trim();
                return <label key={language.code} className="space-y-1"><span className="flex justify-between text-xs font-medium"><span>{language.flag} {language.name}</span>{missing && <span className="text-amber-700">Missing translation</span>}</span><textarea rows={2} value={text} onChange={(event) => setDictionaries((current) => ({ ...current, [language.code]: { ...current[language.code], [key]: event.target.value } }))} className="w-full rounded-lg border border-border bg-background px-2.5 py-2 text-sm" /></label>;
              })}
            </div>
          </article>
        ))}
        {!keys.length && <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">No matching keys.</p>}
      </div>
      {notice && <p role="status" className="text-sm text-muted-foreground">{notice}</p>}
      <button onClick={save} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"><Save className="h-4 w-4" /> Save translations</button>
    </div>
  );
}

function ContactOptionsManager() {
  const defaults = {
    projectTypes: [
      "Custom Software Development", "SaaS Product Engineering", "Web Application (SPA/PWA)",
      "Mobile App (iOS/Android)", "AI Copilot / RAG System", "Cloud Infrastructure & DevOps",
      "UI/UX Design & Prototyping", "Code Audit & Modernization", "Other Inquiry",
    ],
    budgetRanges: ["Under $10,000", "$10,000 – $25,000", "$25,000 – $50,000", "$50,000 – $100,000", "$100,000+", "Flexible / Undecided"],
    defaultProjectType: "Custom Software Development",
    defaultBudget: "$25,000 – $50,000",
    defaultTimeline: "1 – 3 months",
  };
  const [options, setOptions] = useState(() => readContentOverride("contactOptions", defaults));
  const [notice, setNotice] = useState("");
  const save = () => {
    if (!options.projectTypes.length || !options.budgetRanges.length) {
      setNotice("Add at least one project type and budget range.");
      return;
    }
    try {
      saveContentSection("contactOptions", options);
      setNotice("Contact form settings saved. Reloading…");
      window.setTimeout(() => window.location.reload(), 250);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not save contact form settings.");
    }
  };
  return (
    <section className="space-y-4 rounded-2xl border border-border bg-card p-4 sm:p-6">
      <div><h2 className="text-lg font-semibold">Contact form options</h2><p className="text-sm text-muted-foreground">These options are independent from the Services catalog.</p></div>
      <div className="grid gap-3 md:grid-cols-2">
        <TextControl label="Project types (one per line)" multiline value={options.projectTypes.join("\n")} onChange={(text) => setOptions({ ...options, projectTypes: text.split(/\r?\n/).filter(Boolean) })} />
        <TextControl label="Budget ranges (one per line)" multiline value={options.budgetRanges.join("\n")} onChange={(text) => setOptions({ ...options, budgetRanges: text.split(/\r?\n/).filter(Boolean) })} />
        <TextControl label="Default project type" value={options.defaultProjectType} onChange={(defaultProjectType) => setOptions({ ...options, defaultProjectType })} />
        <TextControl label="Default budget range" value={options.defaultBudget} onChange={(defaultBudget) => setOptions({ ...options, defaultBudget })} />
        <TextControl label="Default timeline" value={options.defaultTimeline} onChange={(defaultTimeline) => setOptions({ ...options, defaultTimeline })} />
      </div>
      {notice && <p role="status" className="text-sm text-muted-foreground">{notice}</p>}
      <button onClick={save} className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">Save contact form</button>
    </section>
  );
}

const pageSeoSeeds: JsonRecord[] = [
  { id: "home", canonicalPath: "/", title: "Custom Software, SaaS & AI Solutions", description: "", keywords: [], ogImage: "" },
  { id: "about", canonicalPath: "/about", title: "About Us — Mission, Team & Engineering Standards", description: "", keywords: [], ogImage: "" },
  { id: "services", canonicalPath: "/services", title: "Custom Software, SaaS & AI Engineering Services", description: "", keywords: [], ogImage: "" },
  { id: "portfolio", canonicalPath: "/portfolio", title: "Products & Case Studies", description: "", keywords: [], ogImage: "" },
  { id: "careers", canonicalPath: "/careers", title: "Careers & Open Positions", description: "", keywords: [], ogImage: "" },
  { id: "faq", canonicalPath: "/faq", title: "Frequently Asked Questions (FAQ)", description: "", keywords: [], ogImage: "" },
  { id: "reviews", canonicalPath: "/reviews", title: "Client Reviews & Testimonials", description: "", keywords: [], ogImage: "" },
  { id: "articles", canonicalPath: "/articles", title: "Articles, Engineering Insights & News", description: "", keywords: [], ogImage: "" },
  { id: "contact", canonicalPath: "/contact", title: "Contact Us & Request a Quote", description: "", keywords: [], ogImage: "" },
];

function SettingsManager() {
  const [company, setCompany] = useState<JsonRecord>(() => ({
    ...companyData,
    logoUrl: companyData.logoUrl ?? "",
    faviconUrl: companyData.faviconUrl ?? "",
    defaultOgImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
  }));
  const [settings, setSettings] = useState<SiteSettings>(readSiteSettings);
  const [recipientInput, setRecipientInput] = useState(settings.recipientEmails.join("\n"));
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [fileInputKey, setFileInputKey] = useState(0);
  const save = () => {
    const recipients = recipientInput.split(/[\s,;]+/).filter(Boolean);
    if (recipients.some((email) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
      setError("Enter valid notification email addresses.");
      return;
    }
    if (settings.analyticsMeasurementId && !/^G-[A-Z0-9]+$/i.test(settings.analyticsMeasurementId)) {
      setError("Google Analytics measurement IDs should use the G-XXXXXXXXXX format.");
      return;
    }
    const companyIssue = validateEditorData(company);
    if (companyIssue) {
      setError(companyIssue);
      return;
    }
    try {
      saveContentSections({ company, settings: { ...settings, recipientEmails: recipients } });
      setNotice("Settings saved. Reloading to apply public-site changes…");
      setError("");
      window.setTimeout(() => window.location.reload(), 300);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not save settings.");
    }
  };
  const downloadBundle = () => {
    const bundle = getContentBundleForExport();
    const file = new Blob([JSON.stringify(bundle, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(file);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "10lonaz-content-backup.json";
    anchor.click();
    URL.revokeObjectURL(url);
  };
  const importBundle = async (file?: File) => {
    if (!file) return;
    try {
      const parsed: unknown = JSON.parse(await file.text());
      if (typeof parsed !== "object" || parsed === null || !("version" in parsed) || parsed.version !== 1 || !("sections" in parsed) || typeof parsed.sections !== "object" || parsed.sections === null) {
        throw new Error("This is not a supported 10LONAZ content bundle.");
      }
      const sections = parsed.sections as Record<string, unknown>;
      const allowed: ContentSection[] = ["company", "services", "products", "jobs", "faqs", "testimonials", "articles", "authors", "settings", "translations", "homeHero", "aboutCopy", "contactOptions", "seo"];
      const imported: Partial<Record<ContentSection, unknown>> = {};
      for (const section of allowed) if (section in sections) imported[section] = sections[section];
      saveContentSections(imported);
      setNotice("Content backup imported. Reloading…");
      window.setTimeout(() => window.location.reload(), 300);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not import this content backup.");
    } finally {
      setFileInputKey((key) => key + 1);
    }
  };
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm"><strong>Browser-only storage:</strong> website edits are visible only in this browser and do not deploy to visitors. Do not store sensitive secrets or treat this as authentication.</div>
      <section className="rounded-2xl border border-border bg-card p-4 sm:p-6">
        <h2 className="mb-4 text-lg font-semibold">Company, branding & contact</h2>
        <div className="space-y-3">{Object.entries(company).map(([key, value]) => <FieldEditor key={key} name={key} value={value} kind="company" onChange={(next) => setCompany({ ...company, [key]: next })} />)}</div>
      </section>
      <section className="rounded-2xl border border-border bg-card p-4 sm:p-6">
        <h2 className="text-lg font-semibold">Website controls</h2>
        <p className="mt-1 text-sm text-muted-foreground">Changing public visibility is immediate after save.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="flex items-center justify-between rounded-xl border border-border p-3 text-sm"><span><strong>Hiring enabled</strong><small className="mt-1 block text-muted-foreground">Controls the public Careers link and page state.</small></span><input type="checkbox" checked={settings.hiringEnabled} onChange={(event) => setSettings({ ...settings, hiringEnabled: event.target.checked })} /></label>
          <label className="flex items-center justify-between rounded-xl border border-border p-3 text-sm"><span><strong>Maintenance mode</strong><small className="mt-1 block text-muted-foreground">Hides public routes; admin remains available.</small></span><input type="checkbox" checked={settings.maintenanceMode} onChange={(event) => setSettings({ ...settings, maintenanceMode: event.target.checked })} /></label>
          <TextControl label="Google Analytics measurement ID" value={settings.analyticsMeasurementId} onChange={(analyticsMeasurementId) => setSettings({ ...settings, analyticsMeasurementId })} placeholder="G-XXXXXXXXXX" hint="A browser measurement ID does not provide dashboard reports. A secure GA Data API backend is required." />
          <label className="block space-y-1.5"><span className="text-sm font-medium">Default language</span><select value={settings.defaultLanguage} onChange={(event) => setSettings({ ...settings, defaultLanguage: event.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">{languages.filter((language) => settings.enabledLanguages.includes(language.code)).map((language) => <option key={language.code} value={language.code}>{language.name}</option>)}</select></label>
          <TextControl label="Company notification email addresses" value={recipientInput} onChange={setRecipientInput} multiline hint="One address per line. Local mode cannot send notifications; the configured recipients are used only for the email fallback." />
          <div className="rounded-xl border border-border p-3 text-sm"><strong>Media assets</strong><p className="mt-1 text-muted-foreground">Image URLs and previews are editable above. Uploads are unavailable until a protected Storage backend is configured.</p></div>
        </div>
        <div className="mt-5">
          <h3 className="text-sm font-semibold">Public navigation visibility</h3>
          <div className="mt-2 flex flex-wrap gap-2">{["/", "/about", "/services", "/portfolio", "/careers", "/articles", "/faq", "/reviews", "/contact"].map((path) => {
            const label = path === "/" ? "Home" : labelFor(path.slice(1));
            const checked = settings.visibleNavigation.includes(path);
            return <label key={path} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm"><input type="checkbox" checked={checked} disabled={path === "/careers" && settings.hiringEnabled} onChange={(event) => setSettings({ ...settings, visibleNavigation: event.target.checked ? [...settings.visibleNavigation, path] : settings.visibleNavigation.filter((item) => item !== path) })} />{label}</label>;
          })}</div>
          <p className="mt-2 text-xs text-muted-foreground">Careers visibility is controlled by Hiring enabled. Navigation paths remain fixed to the routes shipped by the site.</p>
        </div>
      </section>
      <section className="rounded-2xl border border-border bg-card p-4 sm:p-6">
        <h2 className="font-semibold">Content backup</h2><p className="mt-1 text-sm text-muted-foreground">Export or restore the browser-stored website content bundle. This backup does not include contact or job submissions.</p>
        <div className="mt-4 flex flex-wrap gap-2"><button onClick={downloadBundle} className="rounded-lg border border-border px-3 py-2 text-sm"><Upload className="mr-1 inline h-4 w-4 rotate-180" /> Export content JSON</button><label className="cursor-pointer rounded-lg border border-border px-3 py-2 text-sm"><Upload className="mr-1 inline h-4 w-4" /> Import content JSON<input key={fileInputKey} type="file" accept="application/json,.json" className="sr-only" onChange={(event) => void importBundle(event.target.files?.[0])} /></label></div>
      </section>
      {notice && <p role="status" className="text-sm text-emerald-700">{notice}</p>}{error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <button onClick={save} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"><Save className="h-4 w-4" /> Save website settings</button>
    </div>
  );
}

function HomepageManager() {
  const initial = readContentOverride("homeHero", { statsValues: ["500+", "300+", "10+", "4.9/5"], primaryPath: "/contact", secondaryPath: "/services" });
  const [hero, setHero] = useState(initial);
  const [notice, setNotice] = useState("");
  const save = () => {
    if (hero.statsValues.length !== 4 || hero.statsValues.some((value) => !String(value).trim())) {
      setNotice("Enter all four homepage statistic values.");
      return;
    }
    try {
      saveContentSection("homeHero", hero);
      setNotice("Homepage hero settings saved. Reloading…");
      window.setTimeout(() => window.location.reload(), 250);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not save homepage content.");
    }
  };
  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-border bg-card p-4 sm:p-6">
        <h2 className="text-lg font-semibold">Homepage hero and promotional stats</h2>
        <p className="mt-1 text-sm text-muted-foreground">Hero heading, subtitle, badges and button labels are edited in Languages under the existing hero.* keys.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {hero.statsValues.map((value, index) => <TextControl key={index} label={`Statistic ${index + 1} value`} value={String(value)} onChange={(next) => setHero({ ...hero, statsValues: hero.statsValues.map((item, itemIndex) => itemIndex === index ? next : item) })} />)}
          <TextControl label="Primary button destination" value={hero.primaryPath} onChange={(primaryPath) => setHero({ ...hero, primaryPath })} />
          <TextControl label="Secondary button destination" value={hero.secondaryPath} onChange={(secondaryPath) => setHero({ ...hero, secondaryPath })} />
        </div>
      </section>
      <section className="rounded-2xl border border-border bg-card p-4 sm:p-6"><h2 className="font-semibold">Homepage data sections</h2><p className="mt-1 text-sm text-muted-foreground">Services, featured portfolio projects, testimonials and FAQs are managed in their corresponding sections. Public sections use those same shared records; there is no separate copy.</p></section>
      {notice && <p role="status" className="text-sm text-muted-foreground">{notice}</p>}
      <button onClick={save} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"><Save className="h-4 w-4" /> Save homepage</button>
    </div>
  );
}

function AboutManager() {
  const [copy, setCopy] = useState(() => readContentOverride("aboutCopy", defaultAboutPageCopy));
  const [notice, setNotice] = useState("");
  const save = () => {
    try {
      saveContentSection("aboutCopy", copy);
      setNotice("About content saved. Reloading…");
      window.setTimeout(() => window.location.reload(), 250);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not save About content.");
    }
  };
  return <div className="space-y-5"><div className="rounded-2xl border border-border bg-card p-4 sm:p-6"><h2 className="text-lg font-semibold">About page content</h2><p className="mb-4 mt-1 text-sm text-muted-foreground">Company description and statistics are managed in Settings. Update narrative copy, mission, vision, team image, values, capabilities and timeline here.</p><div className="space-y-3">{Object.entries(copy).map(([key, value]) => <FieldEditor key={key} name={key} value={value} kind="about" onChange={(next) => setCopy({ ...copy, [key]: next })} />)}</div></div>{notice && <p role="status" className="text-sm text-muted-foreground">{notice}</p>}<button onClick={save} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"><Save className="h-4 w-4" /> Save About page</button></div>;
}

function AdminPanel() {
  const location = useLocation();
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(hasLocalAdminSession);
  const path = location.pathname.replace(/\/+$/, "") || "/admin";
  if (!authorized) return <LocalAccessGate onOpen={() => { startLocalAdminSession(); setAuthorized(true); }} />;
  const active = navItems.find((item) => item.path === path) ?? navItems[0];
  const title = sectionTitles[path] ?? (path === "/admin" ? "Dashboard" : "Admin");

  const serviceRecords = withOrder(servicesData.map((item, order) => ({ ...item, published: item.published !== false, imageUrl: item.imageUrl ?? "", pricing: item.pricing ?? "", order: item.order ?? order }))) as JsonRecord[];
  const jobRecords = withOrder(jobVacancies.map((item, order) => ({ ...item, order: item.order ?? order }))) as JsonRecord[];
  for (const [index, job] of jobRecords.entries()) {
    job.salaryAmount ??= "";
    job.salaryCurrency ??= "USD";
    job.salaryPeriod ??= "yearly";
    job.locationType ??= "remote";
    job.country ??= "Worldwide";
    job.openings ??= 1;
    job.order ??= index;
  }
  const faqRecords = withOrder(faqData.map((item, order) => ({ ...item, order: item.order ?? order }))) as JsonRecord[];
  const reviewRecords = withOrder(testimonialsData.map((item, order) => ({ ...item, order: item.order ?? order }))) as JsonRecord[];
  const articleRecords = withOrder(articles.map((item, order) => ({ ...item, order: item.order ?? order }))) as JsonRecord[];

  const content = (() => {
    switch (path) {
      case "/admin/homepage": return <HomepageManager />;
      case "/admin/about": return <AboutManager />;
      case "/admin/services": return <CollectionManager title="Services" section="services" initialRecords={serviceRecords} kind="services" />;
      case "/admin/portfolio": return <CollectionManager title="Portfolio projects" section="products" initialRecords={productRecords as JsonRecord[]} kind="products" />;
      case "/admin/careers": return <CollectionManager title="Job vacancies" section="jobs" initialRecords={jobRecords} kind="jobs" />;
      case "/admin/applications": return <SubmissionInbox kind="application" />;
      case "/admin/contact": return <div className="space-y-5"><ContactOptionsManager /><CollectionManager title="FAQ questions" section="faqs" initialRecords={faqRecords} kind="faqs" /></div>;
      case "/admin/inquiries": return <SubmissionInbox kind="inquiry" />;
      case "/admin/reviews": return <CollectionManager title="Reviews" section="testimonials" initialRecords={reviewRecords} kind="testimonials" />;
      case "/admin/articles": return <CollectionManager title="Articles" section="articles" initialRecords={articleRecords} kind="articles" />;
      case "/admin/languages": return <LanguageManager />;
      case "/admin/seo": return <CollectionManager title="Page SEO" section="seo" initialRecords={readContentOverride<JsonRecord[]>("seo", pageSeoSeeds)} kind="seo" />;
      case "/admin/settings": return <SettingsManager />;
      default: return <Dashboard />;
    }
  })();

  return (
    <div className="min-h-screen bg-muted/20 text-foreground">
      <div className="min-h-screen lg:grid lg:grid-cols-[250px_minmax(0,1fr)]">
        <aside className="border-b border-border bg-card p-4 lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r lg:p-5">
          <Link to="/" className="flex items-center gap-2 text-base font-bold"><span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-sm text-primary-foreground">10</span><span>10LONAZ <span className="font-normal text-muted-foreground">Admin</span></span></Link>
          <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/5 p-2.5 text-xs leading-5 text-muted-foreground"><strong className="text-amber-800">Local browser mode</strong><br />Not secure authentication. Do not deploy without backend auth.</div>
          <nav aria-label="Admin navigation" className="mt-5 flex gap-1 overflow-x-auto pb-2 lg:block lg:space-y-1 lg:overflow-visible">
            {navItems.map((item) => {
              const Icon = item.icon;
              const selected = item.path === path;
              return <Link key={item.path} to={item.path} className={`flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm ${selected ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}><Icon className="h-4 w-4" />{item.label}</Link>;
            })}
          </nav>
          <div className="mt-4 flex gap-2 lg:mt-8">
            <Link to="/" className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-border px-2 py-2 text-xs hover:bg-muted"><ArrowLeft className="h-3.5 w-3.5" /> Website</Link>
            <button onClick={() => { endLocalAdminSession(); setAuthorized(false); navigate("/admin"); }} className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-border px-2 py-2 text-xs hover:bg-muted"><LogOut className="h-3.5 w-3.5" /> Exit</button>
          </div>
        </aside>
        <main className="min-w-0">
          <header className="sticky top-0 z-10 flex min-h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur sm:px-6 lg:px-8">
            <div className="min-w-0"><p className="text-xs text-muted-foreground">Website management</p><h1 className="truncate text-lg font-semibold">{title}</h1></div>
            <Link to="/" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">View site <ArrowRight className="h-3.5 w-3.5" /></Link>
          </header>
          <div className="mx-auto max-w-[1440px] space-y-5 p-4 sm:p-6 lg:p-8">
            {content}
            <footer className="border-t border-border pt-4 text-xs leading-5 text-muted-foreground">Changes persist in this browser and synchronize with public pages on this same device only. Deployment, secure authentication, file uploads, email delivery, analytics reporting and multi-user access require a backend integration.</footer>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminPanel;
