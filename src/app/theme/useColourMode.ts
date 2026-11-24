import { useEffect, useState } from "react";

export type ColourMode = "light" | "dark" | "auto";

const MODE_KEY = "bookmark-manager:colour-mode";

function readMode(): ColourMode {
  const stored = localStorage.getItem(MODE_KEY);
  return stored === "light" || stored === "dark" || stored === "auto" ? stored : "auto";
}

function systemPrefersDark(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyMode(mode: ColourMode, systemDark: boolean) {
  const dark = mode === "dark" || (mode === "auto" && systemDark);
  document.documentElement.classList.toggle("dark", dark);
}

export function useColourMode() {
  const [mode, setModeState] = useState<ColourMode>(readMode);
  const [systemDark, setSystemDark] = useState(systemPrefersDark);

  useEffect(() => {
    applyMode(mode, systemDark);
  }, [mode, systemDark]);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setSystemDark(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  function setMode(next: ColourMode) {
    localStorage.setItem(MODE_KEY, next);
    setModeState(next);
  }

  return { mode, setMode };
}
