// Ported by Studio from the agreed design .studio/designs/parts/header.html, at the start of a build.
// Its markup, classes and CSS are the design's: wire real data, translation keys, routes and SDK
// actions into it and change nothing visual. Studio writes it again only when the design is redrawn;
// then `git diff` shows what to carry over.
import type { MouseEvent } from "react";
import "./HeaderPart.css";

export function HeaderPart({ onNavigate }: { onNavigate?: (path: string) => void }) {
  const goTo = (path: string) => (event: MouseEvent) => {
    if (!onNavigate) return;
    event.preventDefault();
    onNavigate(path);
  };
  return (
    <div className="studio-part-header" data-part-root="header" style={{ display: "contents" }}>
      <header style={{ background: "hsl(var(--card))", borderBottom: "1px solid hsl(var(--border))" }}>
        <div className="ds-bar hdr">
          <details className="ds-menu ds-only-narrow">
            <summary className="ds-menu-button" aria-label="Open the menu">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </summary>
            <div className="ds-menu-list hdr-narrow-list">
              <a href="/bookmarks" className="ds-nav-item ds-active" data-goto="bookmarks" onClick={goTo("/bookmarks")}> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z" /></svg> Bookmarks </a>
              {" "}
              <a href="/bookmarks/new" className="ds-nav-item" data-goto="new-bookmark" onClick={goTo("/bookmarks/new")}> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M12 5v14M5 12h14" /></svg> New bookmark </a>
              <div className="ds-theme-switch" role="group" aria-label="Colour mode">
                <button className="ds-active" aria-label="Light">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                  </svg>
                </button>
                {" "}
                <button aria-label="Dark">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
                  </svg>
                </button>
                {" "}
                <button aria-label="Auto">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <circle cx="12" cy="12" r="8" />
                    <path d="M12 4a8 8 0 0 1 0 16Z" fill="currentColor" />
                  </svg>
                </button>
              </div>
            </div>
          </details>
          <a href="/bookmarks" className="ds-brand-link ds-only-narrow" data-goto="bookmarks" onClick={goTo("/bookmarks")}>
            {" "}
            <img className="ds-brand ds-brand-light" src="https://blocksprod.blob.core.windows.net/d26f14b9f1c604c01a164ff065c1abf39/Public/2804d313-cc60-4015-b637-4dbedff4963a/836c6b1f-b7e8-4f8a-bf23-f22cdccc20fb/pikachu.png" alt="Personal Bookmark Manager app" />
            {" "}
            <img className="ds-brand ds-brand-dark" src="https://blocksprod.blob.core.windows.net/d26f14b9f1c604c01a164ff065c1abf39/Public/5b695b07-e721-4223-ad5a-31c80c14aab4/1e34634a-8dd0-4db4-bd93-e8ef1497c988/download-removebg-preview.png" alt="Personal Bookmark Manager app" />
            {" "}
          </a>
          {" "}
          <a href="/bookmarks" className="ds-brand-link ds-only-wide" data-goto="bookmarks" onClick={goTo("/bookmarks")}>
            {" "}
            <img className="ds-brand ds-brand-light" src="https://blocksprod.blob.core.windows.net/d26f14b9f1c604c01a164ff065c1abf39/Public/2804d313-cc60-4015-b637-4dbedff4963a/836c6b1f-b7e8-4f8a-bf23-f22cdccc20fb/pikachu.png" alt="Personal Bookmark Manager app" />
            {" "}
            <img className="ds-brand ds-brand-dark" src="https://blocksprod.blob.core.windows.net/d26f14b9f1c604c01a164ff065c1abf39/Public/5b695b07-e721-4223-ad5a-31c80c14aab4/1e34634a-8dd0-4db4-bd93-e8ef1497c988/download-removebg-preview.png" alt="Personal Bookmark Manager app" />
            {" "}
          </a>
          <nav className="ds-nav hdr-nav ds-only-wide" aria-label="Main">
            <a href="/bookmarks" className="ds-nav-item ds-active" data-goto="bookmarks" onClick={goTo("/bookmarks")}>Bookmarks</a>
            {" "}
            <a href="/bookmarks/new" className="ds-nav-item" data-goto="new-bookmark" onClick={goTo("/bookmarks/new")}>New bookmark</a>
          </nav>
          <div className="hdr-right">
            <button className="ds-lang-switch" aria-label="Language">
              {" "}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
              </svg>
              {" "}
              <span>EN</span>
              {" "}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="m6 9 6 6 6-6" />
              </svg>
              {" "}
            </button>
            <div className="ds-theme-switch ds-only-wide" role="group" aria-label="Colour mode">
              <button className="ds-active" aria-label="Light">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                </svg>
              </button>
              {" "}
              <button aria-label="Dark">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
                </svg>
              </button>
              {" "}
              <button aria-label="Auto">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <circle cx="12" cy="12" r="8" />
                  <path d="M12 4a8 8 0 0 1 0 16Z" fill="currentColor" />
                </svg>
              </button>
            </div>
            <details className="ds-menu ds-menu-left hdr-user">
              <summary aria-label="Account menu">
                <span className="ds-avatar" data-sample="">PS</span>
                {" "}
                <span className="hdr-user-name" data-sample="me.name">Priya Shah</span>
                {" "}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </summary>
              <div className="ds-menu-list">
                <div className="hdr-menu-head">
                  <b data-sample="me.name">Priya Shah</b>
                  {" "}
                  <span data-sample="me.role">Owner</span>
                </div>
                <a href="/bookmarks" data-goto="bookmarks" onClick={goTo("/bookmarks")}> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z" /></svg> Bookmarks </a>
                {" "}
                <a href="/bookmarks/new" data-goto="new-bookmark" onClick={goTo("/bookmarks/new")}> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M12 5v14M5 12h14" /></svg> New bookmark </a>
                {" "}
                <button type="button">Sign out</button>
              </div>
            </details>
          </div>
        </div>
      </header>
    </div>
  );
}
