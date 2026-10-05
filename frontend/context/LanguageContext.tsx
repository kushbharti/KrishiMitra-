"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import en from "@/locales/en.json";
import hi from "@/locales/hi.json";
import mr from "@/locales/mr.json";

// Added 'export' keyword to make types available across the SaaS architecture
export type Language = "en" | "hi" | "mr";
export type Translations = typeof en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const dictionaries: Record<Language, Translations> = {
  en,
  hi,
  mr,
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Default to 'en' — matches SSR default, so no hydration mismatch.
  // Language preference is applied asynchronously after mount via useEffect.
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    // Restore persisted preference after hydration (client-only, non-blocking)
    try {
      const stored = localStorage.getItem("krishimitra_language") as Language;
      if (stored && dictionaries[stored]) {
        setLanguageState(stored);
      }
    } catch (error) {
      console.warn(
        "Failed to read language preference from localStorage:",
        error,
      );
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("krishimitra_language", lang);
    } catch (error) {
      console.warn(
        "Failed to save language preference to localStorage:",
        error,
      );
    }
  };

  const value = {
    language,
    setLanguage,
    t: dictionaries[language] || en,
  };

  // Always render children immediately — no mounted gate.
  // The initial 'en' default is identical on server and client, so there is
  // no hydration mismatch. The language preference update happens silently
  // after mount without blocking the initial paint.
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
};
