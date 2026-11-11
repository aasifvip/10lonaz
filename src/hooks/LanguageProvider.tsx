import { useEffect, useState, type ReactNode } from "react";
import { readContentOverride, readSiteSettings } from "@/admin/contentRepository";
import { LanguageContext } from "@/hooks/language-context";
import { Language, translations } from "@/lib/translations";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    const enabled = readSiteSettings().enabledLanguages;
    return (saved && enabled.includes(saved) ? saved : readSiteSettings().defaultLanguage) as Language;
  });
  const editableTranslations = readContentOverride<Record<string, Record<string, string>>>("translations", {});

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string =>
    editableTranslations[language]?.[key] ||
    translations[language]?.[key] ||
    editableTranslations.en?.[key] ||
    translations.en?.[key] ||
    key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
