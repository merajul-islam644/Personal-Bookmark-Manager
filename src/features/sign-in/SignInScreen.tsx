// Ported by Studio from the agreed design .studio/designs/screens/sign-in.html, at the start of a build.
// Its markup, classes and CSS are the design's: wire real data, translation keys, routes and SDK
// actions into it and change nothing visual. Studio writes it again only when the design is redrawn;
// then `git diff` shows what to carry over.
import type { MouseEvent } from "react";
import "./SignInScreen.css";

export function SignInScreen({ onNavigate }: { onNavigate?: (path: string) => void }) {
  const goTo = (path: string) => (event: MouseEvent) => {
    if (!onNavigate) return;
    event.preventDefault();
    onNavigate(path);
  };
  return (
    <div className="studio-screen-sign-in" style={{ display: "contents" }}>
      <main data-screen="sign-in" className="si-root">
        <header>
          <div className="ds-bar si-bar">
            <a href="/bookmarks" className="ds-brand-link" data-goto="bookmarks" onClick={goTo("/bookmarks")}>
              {" "}
              <img className="ds-brand ds-brand-light" src="https://blocksprod.blob.core.windows.net/d26f14b9f1c604c01a164ff065c1abf39/Public/2804d313-cc60-4015-b637-4dbedff4963a/836c6b1f-b7e8-4f8a-bf23-f22cdccc20fb/pikachu.png" alt="Personal Bookmark Manager app" />
              {" "}
              <img className="ds-brand ds-brand-dark" src="https://blocksprod.blob.core.windows.net/d26f14b9f1c604c01a164ff065c1abf39/Public/5b695b07-e721-4223-ad5a-31c80c14aab4/1e34634a-8dd0-4db4-bd93-e8ef1497c988/download-removebg-preview.png" alt="Personal Bookmark Manager app" />
              {" "}
            </a>
            <div className="si-switches">
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
          </div>
        </header>
        <div className="ds-page si-main">
          <div className="si-stage">
            <div className="si-promise">
              <span className="ds-eyebrow">Personal Bookmark Manager</span>
              <h1 className="ds-display">Every link you keep, in one place.</h1>
              <p className="si-lede">Save a link once, file it in a folder and tag it. Your bookmarks stay yours: no one else sees them, on any device you sign in from.</p>
              <ul className="si-claim">
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M4 7h16M4 12h16M4 17h10" /></svg>Folders for each subject</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M20 12v7H4v-7M12 3v12M8 11l4 4 4-4" /></svg>Tags across your links</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M12 3l7 4v6c0 4-3 6.5-7 8-4-1.5-7-4-7-8V7Z" /></svg>Private to your account</li>
              </ul>
            </div>
            <div className="si-panel">
              <div className="si-panel-top">
                <span className="si-dot" aria-hidden="true" />
                {" "}
                <span data-sample="">Last saved: Tuesday</span>
              </div>
              <div className="si-panel-body" data-sample="" aria-hidden="true">
                <div className="si-row">
                  <span className="si-thumb">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                      <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7L11.5 6.8" />
                      <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1.5-1.5" />
                    </svg>
                  </span>
                  <div>
                    <div className="si-row-title">A field guide to slow reading</div>
                    <div className="si-row-meta">Notebook Review</div>
                    <div className="si-tags">
                      <span className="si-tag">design</span>
                      <span className="si-tag">web</span>
                    </div>
                  </div>
                  <span className="ds-badge ds-badge-info">Reading</span>
                </div>
                <div className="si-row">
                  <span className="si-thumb">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="m3 8 9 6 9-6" />
                    </svg>
                  </span>
                  <div>
                    <div className="si-row-title">সংখ্যা ও পরিসংখ্যানের সহজ পাঠ</div>
                    <div className="si-row-meta">প্রথম আলো</div>
                  </div>
                  <span className="ds-badge ds-badge-info">Study</span>
                </div>
                <div className="si-row">
                  <span className="si-thumb">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                      <path d="M4 19V5h16v14z" />
                      <path d="M8 15l3-3 2 2 3-4" />
                    </svg>
                  </span>
                  <div>
                    <div className="si-row-title">Werkzeuge für ein ruhiges Notizbuch</div>
                    <div className="si-row-meta">Notizblog</div>
                    <div className="si-tags">
                      <span className="si-tag">tools</span>
                    </div>
                  </div>
                  <span className="ds-badge ds-badge-info">Work</span>
                </div>
                <div className="si-folders">
                  <div className="si-folder">
                    <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" /></svg>Reading</span>
                    <span className="si-count">42</span>
                  </div>
                  <div className="si-folder">
                    <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" /></svg>Work</span>
                    <span className="si-count">18</span>
                  </div>
                  <div className="si-folder">
                    <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" /></svg>Recipes</span>
                    <span className="si-count">9</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="si-action">
            <button className="ds-btn ds-btn-lg" data-goto="bookmarks" onClick={goTo("/bookmarks")}> Sign in or create an account <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg> </button>
            <p className="si-note">Signing up, a new password and a forgotten one all happen on the sign-in page. The same sign-in opens every app in this project.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
