// Ported by Studio from the agreed design .studio/designs/parts/header.html, at the start of a build.
// Its markup, classes and CSS are the design's: wire real data, translation keys, routes and SDK
// actions into it and change nothing visual. Studio writes it again only when the design is redrawn;
// then `git diff` shows what to carry over.
import { useAuth } from "../providers/AuthProvider";
import { useCurrentUser, userDisplayName, userInitials } from "../../features/account/useCurrentUser";
import { useT } from "../../lib/i18n/LocalizationProvider";
import { LanguageSwitch, ThemeSwitch, useDsMenus } from "./navControls";
import "./navControls.css";
import "./HeaderPart.css";

export function HeaderPart({ onNavigate }: { onNavigate?: (path: string) => void }) {
  const goTo = (path: string) => (event: React.MouseEvent) => {
    if (!onNavigate) return;
    event.preventDefault();
    onNavigate(path);
  };
  const { logout } = useAuth();
  const { t } = useT();
  const scope = useDsMenus();
  const me = useCurrentUser();
  const profile = me.data?.data;
  const name = userDisplayName(profile) || profile?.email || "";
  const initials = userInitials(profile);

  async function handleSignOut() {
    await logout();
    onNavigate?.("/");
  }

  return (
    <div ref={scope} className="studio-part-header" data-part-root="header" style={{ display: "contents" }}>
      <header style={{ background: "hsl(var(--card))", borderBottom: "1px solid hsl(var(--border))" }}>
        <div className="ds-bar hdr">
          <details className="ds-menu ds-only-narrow">
            <summary className="ds-menu-button" aria-label={t("nav.openMenu")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </summary>
            <div className="ds-menu-list hdr-narrow-list">
              <a href="/" className="ds-nav-item ds-active" onClick={goTo("/")}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z" /></svg>
                {t("nav.bookmarks")}
              </a>
              <a href="/bookmarks/new" className="ds-nav-item" onClick={goTo("/bookmarks/new")}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M12 5v14M5 12h14" /></svg>
                {t("nav.newBookmark")}
              </a>
            </div>
          </details>
          <a href="/" className="ds-brand-link ds-only-narrow" onClick={goTo("/")}>
            <img className="ds-brand ds-brand-light" src="/brand/logo.png" alt={t("brand.alt")} />
            <img className="ds-brand ds-brand-dark" src="/brand/logo-dark.png" alt={t("brand.alt")} />
          </a>
          <a href="/" className="ds-brand-link ds-only-wide" onClick={goTo("/")}>
            <img className="ds-brand ds-brand-light" src="/brand/logo.png" alt={t("brand.alt")} />
            <img className="ds-brand ds-brand-dark" src="/brand/logo-dark.png" alt={t("brand.alt")} />
          </a>
          <nav className="ds-nav hdr-nav ds-only-wide" aria-label={t("nav.main")}>
            <a href="/" className="ds-nav-item ds-active" onClick={goTo("/")}>{t("nav.bookmarks")}</a>
            <a href="/bookmarks/new" className="ds-nav-item" onClick={goTo("/bookmarks/new")}>{t("nav.newBookmark")}</a>
          </nav>
          <div className="hdr-right">
            <LanguageSwitch />
            <div className="hdr-theme">
              <ThemeSwitch />
            </div>
            <details className="ds-menu ds-menu-left hdr-user">
              <summary aria-label={t("nav.accountMenu")}>
                <span className="ds-avatar">{initials}</span>
                <span className="hdr-user-name">{name}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </summary>
              <div className="ds-menu-list">
                <div className="hdr-menu-head">
                  <b>{name}</b>
                  <span>{profile?.email ?? ""}</span>
                </div>
                <a href="/" onClick={goTo("/")}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z" /></svg>
                  {t("nav.bookmarks")}
                </a>
                <a href="/bookmarks/new" onClick={goTo("/bookmarks/new")}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M12 5v14M5 12h14" /></svg>
                  {t("nav.newBookmark")}
                </a>
                <div className="hdr-menu-theme">
                  <ThemeSwitch />
                </div>
                <button type="button" onClick={handleSignOut}>{t("nav.signOut")}</button>
              </div>
            </details>
          </div>
        </div>
      </header>
    </div>
  );
}
