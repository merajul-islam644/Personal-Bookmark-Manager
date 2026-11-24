// Ported by Studio from the agreed design .studio/designs/screens/sign-in.html, at the start of a build.
// Its markup, classes and CSS are the design's: wire real data, translation keys, routes and SDK
// actions into it and change nothing visual. Studio writes it again only when the design is redrawn;
// then `git diff` shows what to carry over.
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { MouseEvent } from "react";
import { useAuth } from "../../app/providers/AuthProvider";
import { LanguageSwitch, ThemeSwitch, useDsMenus } from "../../app/layout/navControls";
import { useT } from "../../lib/i18n/LocalizationProvider";
import { blocksClient } from "../../lib/blocks/client";
import "./SignInScreen.css";
import "./SignInScreen.wiring.css";

export function SignInScreen({ onNavigate }: { onNavigate?: (path: string) => void }) {
  const goTo = (path: string) => (event: MouseEvent) => {
    if (!onNavigate) return;
    event.preventDefault();
    onNavigate(path);
  };
  const { login } = useAuth();
  const { t } = useT();
  const scope = useDsMenus();
  const signupQuery = useQuery({
    queryFn: () => blocksClient.iam.signupSettings.get(),
    queryKey: ["iam", "signup-settings"],
    staleTime: 5 * 60_000
  });
  const signUpOn = Boolean((signupQuery.data as { isSignUpEnable?: boolean } | undefined)?.isSignUpEnable);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);

  async function handleSignIn() {
    setError(false);
    setPending(true);
    try {
      await login("/");
    } catch (caught) {
      console.error("Sign-in could not be started", caught);
      setError(true);
      setPending(false);
    }
  }

  return (
    <div className="studio-screen-sign-in" style={{ display: "contents" }}>
      <main data-screen="sign-in" className="si-root">
        <div ref={scope}>
          <header>
            <div className="ds-bar si-bar">
              <a href="/" className="ds-brand-link" onClick={goTo("/")}>
                <img className="ds-brand ds-brand-light" src="/brand/logo.png" alt={t("brand.alt")} />
                <img className="ds-brand ds-brand-dark" src="/brand/logo-dark.png" alt={t("brand.alt")} />
              </a>
              <div className="si-switches">
                <LanguageSwitch />
                <ThemeSwitch />
              </div>
            </div>
          </header>
        </div>
        <div className="ds-page si-main">
          <div className="si-stage">
            <div className="si-promise">
              <span className="ds-eyebrow">{t("signIn.eyebrow")}</span>
              <h1 className="ds-display">{t("signIn.headline")}</h1>
              <p className="si-lede">{t("signIn.lede")}</p>
              <ul className="si-claim">
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M4 7h16M4 12h16M4 17h10" /></svg>{t("signIn.claimFolders")}</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M20 12v7H4v-7M12 3v12M8 11l4 4 4-4" /></svg>{t("signIn.claimTags")}</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M12 3l7 4v6c0 4-3 6.5-7 8-4-1.5-7-4-7-8V7Z" /></svg>{t("signIn.claimPrivate")}</li>
              </ul>
            </div>
            <div className="si-panel">
              <div className="si-panel-top">
                <span className="si-dot" aria-hidden="true" />
                {" "}
                <span>{t("signIn.panelTop")}</span>
              </div>
              <div className="si-panel-body" aria-hidden="true">
                <div className="si-row">
                  <span className="si-thumb">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                      <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7L11.5 6.8" />
                      <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1.5-1.5" />
                    </svg>
                  </span>
                  <div>
                    <div className="si-row-title">
                      <span className="si-skeleton" />
                    </div>
                    <div className="si-row-meta">
                      <span className="si-skeleton si-skeleton-sm" />
                    </div>
                  </div>
                  <span className="si-skeleton si-skeleton-badge" />
                </div>
                <div className="si-row">
                  <span className="si-thumb">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="m3 8 9 6 9-6" />
                    </svg>
                  </span>
                  <div>
                    <div className="si-row-title">
                      <span className="si-skeleton" />
                    </div>
                    <div className="si-row-meta">
                      <span className="si-skeleton si-skeleton-sm" />
                    </div>
                  </div>
                  <span className="si-skeleton si-skeleton-badge" />
                </div>
                <div className="si-row">
                  <span className="si-thumb">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                      <path d="M4 19V5h16v14z" />
                      <path d="M8 15l3-3 2 2 3-4" />
                    </svg>
                  </span>
                  <div>
                    <div className="si-row-title">
                      <span className="si-skeleton" />
                    </div>
                    <div className="si-row-meta">
                      <span className="si-skeleton si-skeleton-sm" />
                    </div>
                  </div>
                  <span className="si-skeleton si-skeleton-badge" />
                </div>
                <div className="si-folders">
                  <div className="si-folder">
                    <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" /></svg><span className="si-skeleton si-skeleton-sm" /></span>
                    <span className="si-count"><span className="si-skeleton si-skeleton-sm" /></span>
                  </div>
                  <div className="si-folder">
                    <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" /></svg><span className="si-skeleton si-skeleton-sm" /></span>
                    <span className="si-count"><span className="si-skeleton si-skeleton-sm" /></span>
                  </div>
                  <div className="si-folder">
                    <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" /></svg><span className="si-skeleton si-skeleton-sm" /></span>
                    <span className="si-count"><span className="si-skeleton si-skeleton-sm" /></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="si-action">
            {error ? (
              <p className="si-error" role="alert">{t("signIn.failed")}</p>
            ) : null}
            <button className="ds-btn ds-btn-lg" onClick={handleSignIn} disabled={pending}>
              {" "}
              {pending ? t("signIn.opening") : signUpOn ? t("signIn.buttonSignUp") : t("signIn.button")}
              {" "}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              {" "}
            </button>
            <p className="si-note">{signUpOn ? t("signIn.noteSignUp") : t("signIn.note")}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
