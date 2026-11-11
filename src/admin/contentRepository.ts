export const CONTENT_STORAGE_KEY = "10lonaz.content.v1";
export const SUBMISSION_STORAGE_KEY = "10lonaz.submissions.v1";
export const ADMIN_SESSION_KEY = "10lonaz.admin.local-session";

export type ContentSection =
  | "company"
  | "services"
  | "products"
  | "jobs"
  | "faqs"
  | "testimonials"
  | "articles"
  | "authors"
  | "settings"
  | "translations"
  | "homeHero"
  | "aboutCopy"
  | "contactOptions"
  | "seo";

export interface ContentBundle {
  version: 1;
  updatedAt: string;
  sections: Partial<Record<ContentSection, unknown>>;
}

export interface SiteSettings {
  hiringEnabled: boolean;
  maintenanceMode: boolean;
  recipientEmails: string[];
  analyticsMeasurementId: string;
  defaultLanguage: string;
  enabledLanguages: string[];
  visibleNavigation: string[];
}

export interface SubmissionRecord {
  id: string;
  kind: "inquiry" | "application";
  status: "new" | "reviewed" | "archived";
  submittedAt: string;
  details: Record<string, unknown>;
  summaryText: string;
}

export interface ContentRepository {
  getSection(section: ContentSection): unknown;
  saveSection(section: ContentSection, value: unknown): void;
  saveSections(sections: Partial<Record<ContentSection, unknown>>): void;
  listSubmissions(): SubmissionRecord[];
  saveSubmission(submission: Omit<SubmissionRecord, "id" | "status" | "submittedAt"> & { submittedAt?: string }): SubmissionRecord;
  updateSubmissionStatus(id: string, status: SubmissionRecord["status"]): void;
}

const defaultSettings: SiteSettings = {
  hiringEnabled: true,
  maintenanceMode: false,
  recipientEmails: [],
  analyticsMeasurementId: "",
  defaultLanguage: "en",
  enabledLanguages: ["en", "zh", "ja", "si", "ta", "ar", "es", "ml", "hi"],
  visibleNavigation: ["/", "/about", "/services", "/portfolio", "/careers", "/articles", "/faq", "/reviews", "/contact"],
};

function readBundle(): ContentBundle | null {
  if (typeof window === "undefined") return null;
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(CONTENT_STORAGE_KEY);
  } catch (error) {
    console.error("Unable to access 10LONAZ browser storage.", error);
    return null;
  }
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "version" in parsed &&
      parsed.version === 1 &&
      "sections" in parsed &&
      typeof parsed.sections === "object" &&
      parsed.sections !== null
    ) {
      return parsed as ContentBundle;
    }
    console.error("Stored 10LONAZ content has an unsupported format.");
    return null;
  } catch (error) {
    console.error("Unable to read stored 10LONAZ content.", error);
    return null;
  }
}

function writeBundle(bundle: ContentBundle): void {
  try {
    window.localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(bundle));
  } catch (error) {
    console.error("Unable to save 10LONAZ content to browser storage.", error);
    throw new Error("Could not save changes in this browser. Check available storage and try again.");
  }
}

export function readContentOverride<T>(section: ContentSection, fallback: T): T {
  const value = contentRepository.getSection(section);
  if (value === undefined) return fallback;
  if (Array.isArray(value)) {
    return [...value].sort((a, b) => {
      const left = typeof a === "object" && a !== null && "order" in a ? Number(a.order) : 0;
      const right = typeof b === "object" && b !== null && "order" in b ? Number(b.order) : 0;
      return left - right;
    }) as T;
  }
  return value as T;
}

export function saveContentSection(section: ContentSection, value: unknown): void {
  contentRepository.saveSection(section, value);
}

export function saveContentSections(sections: Partial<Record<ContentSection, unknown>>): void {
  contentRepository.saveSections(sections);
}

export function readSiteSettings(): SiteSettings {
  const stored = readContentOverride<Partial<SiteSettings>>("settings", {});
  return { ...defaultSettings, ...stored };
}

export function saveSiteSettings(settings: SiteSettings): void {
  saveContentSection("settings", settings);
}

function readSubmissions(): SubmissionRecord[] {
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(SUBMISSION_STORAGE_KEY);
  } catch (error) {
    console.error("Unable to access stored website submissions.", error);
    return [];
  }
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as SubmissionRecord[];
    console.error("Stored 10LONAZ submissions have an unsupported format.");
    return [];
  } catch (error) {
    console.error("Unable to read stored 10LONAZ submissions.", error);
    return [];
  }
}

export function listSubmissions(): SubmissionRecord[] {
  return contentRepository.listSubmissions();
}

export function saveSubmission(
  submission: Omit<SubmissionRecord, "id" | "status" | "submittedAt"> & { submittedAt?: string },
): SubmissionRecord {
  return contentRepository.saveSubmission(submission);
}

export function updateSubmissionStatus(id: string, status: SubmissionRecord["status"]): void {
  contentRepository.updateSubmissionStatus(id, status);
}

export class BrowserStorageContentRepository implements ContentRepository {
  getSection(section: ContentSection): unknown {
    return readBundle()?.sections[section];
  }

  saveSection(section: ContentSection, value: unknown): void {
    this.saveSections({ [section]: value });
  }

  saveSections(sections: Partial<Record<ContentSection, unknown>>): void {
    const current = readBundle();
    writeBundle({
      version: 1,
      updatedAt: new Date().toISOString(),
      sections: { ...current?.sections, ...sections },
    });
  }

  listSubmissions(): SubmissionRecord[] {
    return readSubmissions().sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
  }

  saveSubmission(submission: Omit<SubmissionRecord, "id" | "status" | "submittedAt"> & { submittedAt?: string }): SubmissionRecord {
    const saved: SubmissionRecord = {
      ...submission,
      id: globalThis.crypto?.randomUUID?.() ?? `submission-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      status: "new",
      submittedAt: submission.submittedAt ?? new Date().toISOString(),
    };
    try {
      window.localStorage.setItem(SUBMISSION_STORAGE_KEY, JSON.stringify([saved, ...readSubmissions()]));
    } catch (error) {
      console.error("Unable to save the website submission in browser storage.", error);
      throw new Error("Your submission could not be saved on this device. Please use the email fallback.");
    }
    return saved;
  }

  updateSubmissionStatus(id: string, status: SubmissionRecord["status"]): void {
    const updated = readSubmissions().map((submission) =>
      submission.id === id ? { ...submission, status } : submission,
    );
    try {
      window.localStorage.setItem(SUBMISSION_STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error("Unable to update the submission status.", error);
      throw new Error("Could not update this submission. Check available browser storage and try again.");
    }
  }
}

export const contentRepository: ContentRepository = new BrowserStorageContentRepository();

export function hasLocalAdminSession(): boolean {
  return window.sessionStorage.getItem(ADMIN_SESSION_KEY) === "acknowledged-local-access";
}

export function startLocalAdminSession(): void {
  window.sessionStorage.setItem(ADMIN_SESSION_KEY, "acknowledged-local-access");
}

export function endLocalAdminSession(): void {
  window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
}

export function getContentBundleForExport(): ContentBundle {
  return readBundle() ?? { version: 1, updatedAt: new Date().toISOString(), sections: {} };
}
