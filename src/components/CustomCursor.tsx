import { useEffect, useState } from "react";
import { AICursor } from "./AICursor";
import { CursorSettings, CursorPreferences } from "./CursorSettings";

const STORAGE_KEY = "cursor-preferences";

const defaultPreferences: CursorPreferences = {
  aiMode: true,
  cursorTheme: "auto",
  reducedMotion: false,
};

export function CustomCursor() {
  const [preferences, setPreferences] = useState<CursorPreferences>(defaultPreferences);

  // Load preferences from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setPreferences(parsed);
      } catch (e) {
        console.error("Failed to parse cursor preferences:", e);
      }
    }

    // Check system preference for reduced motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setPreferences((prev) => ({ ...prev, reducedMotion: true }));
    }

    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setPreferences((prev) => ({ ...prev, reducedMotion: true }));
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Save preferences to localStorage
  const handlePreferencesChange = (newPrefs: CursorPreferences) => {
    setPreferences(newPrefs);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newPrefs));
  };

  return (
    <>
      {/* AI Cursors (automated visual AI interaction) */}
      <AICursor id={1} enabled={preferences.aiMode} reducedMotion={preferences.reducedMotion} />
      <AICursor id={2} enabled={preferences.aiMode} reducedMotion={preferences.reducedMotion} />

      {/* Cursor Settings UI */}
      <CursorSettings preferences={preferences} onPreferencesChange={handlePreferencesChange} />
    </>
  );
}

