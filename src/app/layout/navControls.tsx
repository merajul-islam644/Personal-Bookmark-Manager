import { useEffect, useRef } from "react";
import type { MouseEvent } from "react";
import { useColourMode } from "../theme/useColourMode";
import { useT } from "../../lib/i18n/LocalizationProvider";
import { APP_LANGUAGES } from "../../lib/i18n/languages";

const SHORT: Record<string, string> = { bn: "বাং", de: "DE", en: "EN" };

export function useDsMenus() {
  const scope = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = scope.current;
    if (!root) return;
    const closeAll = () => {
      root.querySelectorAll<HTMLDetailsElement>("details.ds-menu[open]").forEach((el) => {
        el.open = false;
      });
    };
    const onDocumentClick = (event: Event) => {
      const target = event.target as Element | null;
      root.querySelectorAll<HTMLDetailsElement>("details.ds-menu[open]").forEach((el) => {
        if (!target || !el.contains(target)) el.open = false;
      });
      if (target?.closest(".ds-menu-list a, .ds-menu-list > button")) closeAll();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeAll();
    };
    document.addEventListener("click", onDocumentClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocumentClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return scope;
}

export function ThemeSwitch() {
  const { mode, setMode } = useColourMode();
  const { t } = useT();
  const items = [
    { key: "light", label: t("nav.light") },
    { key: "dark", label: t("nav.dark") },
    { key: "auto", label: t("nav.auto") }
  ] as const;
  return (
    <div className="ds-theme-switch" role="group" aria-label={t("nav.colourMode")}>
      {items.map((item) => (
        <button key={item.key} type="button" className={mode === item.key ? "ds-active" : ""} aria-label={item.label} onClick={() => setMode(item.key)}>
          <ThemeIcon name={item.key} />
        </button>
      ))}
    </div>
  );
}

function ThemeIcon({ name }: { name: "light" | "dark" | "auto" }) {
  if (name === "light") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    );
  }
  if (name === "dark") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 4a8 8 0 0 1 0 16Z" fill="currentColor" />
    </svg>
  );
}

export function LanguageSwitch({ className }: { className?: string }) {
  const { language, setLanguage, t } = useT();
  const onChoose = (code: string) => (event: MouseEvent) => {
    event.preventDefault();
    setLanguage(code);
  };
  return (
    <details className={`ds-menu ${className ?? ""}`}>
      <summary className="ds-lang-switch" aria-label={t("nav.language")}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
        </svg>
        <span>{SHORT[language] ?? language.toUpperCase()}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </summary>
      <div className="ds-menu-list ds-lang-list">
        {APP_LANGUAGES.map((entry) => (
          <button key={entry.code} type="button" className={entry.code === language ? "ds-active" : ""} onClick={onChoose(entry.code)}>
            {entry.name}
            {entry.code === language ? " \u2713" : ""}
          </button>
        ))}
      </div>
    </details>
  );
}
