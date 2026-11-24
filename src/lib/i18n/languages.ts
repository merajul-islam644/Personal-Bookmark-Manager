export const APP_LANGUAGES = [
  { code: "en", name: "English", short: "EN", locale: "en-GB" },
  { code: "bn", name: "বাংলা", short: "বাং", locale: "bn-BD" },
  { code: "de", name: "Deutsch", short: "DE", locale: "de-DE" }
] as const;

export type AppLanguageCode = (typeof APP_LANGUAGES)[number]["code"];

export const DEFAULT_LANGUAGE: AppLanguageCode = "en";
export const LANGUAGE_KEY = "bookmark-manager:language";

/** The stored language, else the browser's when the app speaks it, else English. */
export function storedLanguage(stored: string | null | undefined, browser: string | undefined): AppLanguageCode {
  const known = (value: string | undefined | null): value is AppLanguageCode => APP_LANGUAGES.some((entry) => entry.code === value);
  if (known(stored)) return stored;
  const fromBrowser = (browser ?? "").slice(0, 2);
  return known(fromBrowser) ? fromBrowser : DEFAULT_LANGUAGE;
}

export function localeOf(code: string): string {
  return APP_LANGUAGES.find((entry) => entry.code === code)?.locale ?? "en-GB";
}

export function shortNameOf(code: string): string {
  return APP_LANGUAGES.find((entry) => entry.code === code)?.short ?? code.toUpperCase();
}

export const MODULES = ["app-8e0d504e"];
