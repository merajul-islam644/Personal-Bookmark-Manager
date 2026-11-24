import { createContext, useContext, useMemo, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { blocksClient } from "../blocks/client";
import { defaultDictionary } from "./dictionary";
import type { TranslationKey } from "./dictionary";
import { APP_LANGUAGES, MODULES } from "./languages";

type Dictionary = Record<string, string>;
type LocalizationValue = {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
};

const LocalizationContext = createContext<LocalizationValue | undefined>(undefined);
const LANGUAGE_KEY = "bookmark-manager:language";

function readLanguage(): string {
  const stored = localStorage.getItem(LANGUAGE_KEY);
  if (stored && APP_LANGUAGES.some((entry) => entry.code === stored)) return stored;
  const browser = (navigator.language || "en").slice(0, 2);
  return APP_LANGUAGES.some((entry) => entry.code === browser) ? browser : "en";
}

function fill(text: string, vars?: Record<string, string | number>): string {
  if (!vars) return text;
  return text.replace(/\{(\w+)\}/g, (match, name: string) => (name in vars ? String(vars[name]) : match));
}

export function LocalizationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState(readLanguage);

  function setLanguage(next: string) {
    localStorage.setItem(LANGUAGE_KEY, next);
    setLanguageState(next);
  }

  // One cached query per module for the active language -- switching
  // languages never re-fetches a (language, module) pair already in cache.
  const moduleQueries = useQueries({
    queries: MODULES.map((moduleName) => ({
      queryFn: () => blocksClient.localization.translations(moduleName, language),
      queryKey: ["i18n", "translations", language, moduleName],
      staleTime: 5 * 60_000
    }))
  });

  const cloudDictionary = useMemo<Dictionary>(() => {
    const merged: Dictionary = {};
    moduleQueries.forEach((query, index) => {
      const moduleName = MODULES[index];
      for (const [key, value] of Object.entries(query.data ?? {})) {
        merged[`${moduleName}.${key}`] = String(value);
      }
    });
    return merged;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleQueries.map((query) => query.dataUpdatedAt).join()]);

  const value = useMemo<LocalizationValue>(() => ({
    language,
    setLanguage,
    t: (key, vars) => {
      const cloud = cloudDictionary[`${MODULES[0]}.${key}`];
      const text = cloud && !cloud.trim().startsWith("[") ? cloud : defaultDictionary[key] ?? key;
      return fill(text, vars);
    }
  }), [cloudDictionary, language]);

  return <LocalizationContext.Provider value={value}>{children}</LocalizationContext.Provider>;
}

export function useT() {
  const context = useContext(LocalizationContext);
  if (!context) throw new Error("useT must be used within LocalizationProvider");
  return context;
}
