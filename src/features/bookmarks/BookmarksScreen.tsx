// Ported by Studio from the agreed design .studio/designs/screens/bookmarks.html, at the start of a build.
// Its markup, classes and CSS are the design's: wire real data, translation keys, routes and SDK
// actions into it and change nothing visual. Studio writes it again only when the design is redrawn;
// then `git diff` shows what to carry over.
import type { MouseEvent } from "react";
import { HeaderPart } from "../../app/layout/HeaderPart";
import "./BookmarksScreen.css";

/** The situations the design shows: the screen as it usually is, then each one drawn. Show the one the real data or request is in. */
export type BookmarksScreenSituation = "normal" | "empty" | "empty-folder" | "loading" | "done";

export function BookmarksScreen({ situation = "normal", onNavigate }: { situation?: BookmarksScreenSituation; onNavigate?: (path: string) => void }) {
  const goTo = (path: string) => (event: MouseEvent) => {
    if (!onNavigate) return;
    event.preventDefault();
    onNavigate(path);
  };
  return (
    <div className="studio-screen-bookmarks" style={{ display: "contents" }}>
      <main data-screen="bookmarks">
        <HeaderPart onNavigate={onNavigate} />
        {situation === "empty" ? (
          <section data-state="empty">
            <div className="ds-page bm-page">
              <div className="ds-page-head bm-head">
                <div>
                  <span className="bm-eyebrow"> <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z" /></svg> 0 bookmarks </span>
                  <h1 className="ds-h1 bm-title">Your bookmarks</h1>
                  <p className="bm-sub">Everything you have saved, newest first, sorted into folders and tags.</p>
                </div>
                <div className="ds-actions">
                  <a href="/bookmarks/new" className="ds-btn" data-goto="new-bookmark" onClick={goTo("/bookmarks/new")}> <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg> New bookmark </a>
                </div>
              </div>
              <div className="ds-card" style={{ padding: "calc(48px * var(--space-scale, 1)) calc(24px * var(--space-scale, 1))" }}>
                <div className="ds-empty">
                  <span className="ds-empty-icon">
                    {" "}
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                      <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z" />
                    </svg>
                    {" "}
                  </span>
                  {" "}
                  <b style={{ color: "hsl(var(--foreground))", fontSize: "16px" }}>No bookmarks yet. Save your first link.</b>
                  {" "}
                  <span>Paste a link, pick a folder, add tags. It lands here newest first.</span>
                  {" "}
                  <a href="/bookmarks/new" className="ds-btn" style={{ marginTop: "8px" }} data-goto="new-bookmark" onClick={goTo("/bookmarks/new")}>New bookmark</a>
                </div>
              </div>
            </div>
          </section>
        ) : null}
        {situation === "empty-folder" ? (
          <section data-state="empty-folder">
            <div className="ds-page bm-page">
              <div className="ds-page-head bm-head">
                <div>
                  <span className="bm-eyebrow">
                    {" "}
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
                    </svg>
                    {" "}
                    <span data-sample="">Productivity</span>
                    {" "}
                  </span>
                  <h1 className="ds-h1 bm-title">Your bookmarks</h1>
                  <p className="bm-sub">Everything you have saved, newest first, sorted into folders and tags.</p>
                </div>
                <div className="ds-actions">
                  <a href="/bookmarks/new" className="ds-btn" data-goto="new-bookmark" onClick={goTo("/bookmarks/new")}> <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg> New bookmark </a>
                </div>
              </div>
              <div className="bm-layout">
                <div>
                  <div className="bm-listhead">
                    <h2 data-sample="">Productivity</h2>
                  </div>
                  <div className="ds-card" style={{ padding: "0" }}>
                    <div className="ds-empty" style={{ padding: "calc(48px * var(--space-scale, 1)) calc(24px * var(--space-scale, 1))" }}>
                      <span className="ds-empty-icon">
                        {" "}
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                          <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
                        </svg>
                        {" "}
                      </span>
                      {" "}
                      <b style={{ color: "hsl(var(--foreground))", fontSize: "16px" }}>Nothing in this folder yet.</b>
                      {" "}
                      <span>Save a link into this folder and it shows here.</span>
                      {" "}
                      <a href="/bookmarks/new" className="ds-btn ds-btn-sm" style={{ marginTop: "8px" }} data-goto="new-bookmark" onClick={goTo("/bookmarks/new")}>New bookmark</a>
                    </div>
                  </div>
                </div>
                <aside className="bm-rail">
                  <div className="bm-rail-card">
                    <div className="bm-rail-head">
                      <h2 className="bm-rail-title">Folders</h2>
                    </div>
                    <ul className="bm-folders">
                      <li>
                        <button className="bm-folder">
                          {" "}
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                            <path d="M4 6h16M4 12h16M4 18h16" />
                          </svg>
                          {" "}
                          <span className="bm-folder-name">All bookmarks</span>
                          {" "}
                          <span className="bm-count" data-sample="Folder#all.count">5</span>
                          {" "}
                        </button>
                      </li>
                      <li>
                        <button className="bm-folder">
                          {" "}
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                            <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
                          </svg>
                          {" "}
                          <span className="bm-folder-name" data-sample="Folder#1.name">Design</span>
                          {" "}
                          <span className="bm-count" data-sample="Folder#1.count">1</span>
                          {" "}
                        </button>
                      </li>
                      <li>
                        <button className="bm-folder">
                          {" "}
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                            <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
                          </svg>
                          {" "}
                          <span className="bm-folder-name" data-sample="Folder#2.name">Reading</span>
                          {" "}
                          <span className="bm-count" data-sample="Folder#2.count">2</span>
                          {" "}
                        </button>
                      </li>
                      <li>
                        <button className="bm-folder">
                          {" "}
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                            <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
                          </svg>
                          {" "}
                          <span className="bm-folder-name" data-sample="Folder#3.name">Work</span>
                          {" "}
                          <span className="bm-count" data-sample="Folder#3.count">1</span>
                          {" "}
                        </button>
                      </li>
                      <li>
                        <button className="bm-folder is-active" aria-current="true">
                          {" "}
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                            <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
                          </svg>
                          {" "}
                          <span className="bm-folder-name" data-sample="Folder#4.name">Productivity</span>
                          {" "}
                          <span className="bm-count" data-sample="Folder#4.count">0</span>
                          {" "}
                        </button>
                      </li>
                    </ul>
                    <form className="bm-newfolder" data-situation="done">
                      <label className="ds-label" htmlFor="newfolder-empty">New folder</label>
                      {" "}
                      <input className="ds-input" id="newfolder-empty" name="foldername" placeholder="e.g. Recipes" maxLength={60} />
                      <div className="ds-hint">Up to 60 characters. Names are yours alone.</div>
                      <button className="ds-btn ds-btn-secondary" type="submit">Create</button>
                    </form>
                  </div>
                </aside>
              </div>
            </div>
          </section>
        ) : null}
        {situation === "loading" ? (
          <section data-state="loading">
            <div className="ds-page bm-page">
              <div className="ds-page-head bm-head">
                <div>
                  <span className="bm-eyebrow">
                    {" "}
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                      <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z" />
                    </svg>
                    {" "}
                    <span data-sample="">Loading</span>
                    {" "}
                  </span>
                  <h1 className="ds-h1 bm-title">Your bookmarks</h1>
                  <p className="bm-sub">Everything you have saved, newest first, sorted into folders and tags.</p>
                </div>
                <div className="ds-actions">
                  <a href="/bookmarks/new" className="ds-btn" data-goto="new-bookmark" onClick={goTo("/bookmarks/new")}> <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg> New bookmark </a>
                </div>
              </div>
              <div className="ds-card" style={{ padding: "calc(24px * var(--space-scale, 1))" }}>
                <div className="ds-stack">
                  <div className="ds-progress">
                    <span style={{ width: "65%" }} />
                  </div>
                  <p className="ds-muted" style={{ margin: "0" }}>Loading your bookmarks…</p>
                </div>
              </div>
            </div>
          </section>
        ) : null}
        {situation !== "empty" && situation !== "empty-folder" && situation !== "loading" ? (
          <div>
            <div className="ds-page bm-page">
              <div className="ds-page-head bm-head">
                <div>
                  <span className="bm-eyebrow">
                    {" "}
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                      <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z" />
                    </svg>
                    {" "}
                    <span data-sample="">5 bookmarks</span>
                    {" "}
                  </span>
                  <h1 className="ds-h1 bm-title">Your bookmarks</h1>
                  <p className="bm-sub">Everything you have saved, newest first, sorted into folders and tags.</p>
                </div>
                <div className="ds-actions">
                  <a href="/bookmarks/new" className="ds-btn" data-goto="new-bookmark" onClick={goTo("/bookmarks/new")}> <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg> New bookmark </a>
                </div>
              </div>
              <div className="ds-band bm-band" style={{ marginBottom: "calc(24px * var(--space-scale, 1))" }}>
                <div className="bm-hero-inner">
                  <div>
                    <div className="bm-hero-label">All bookmarks</div>
                    <div className="bm-hero-num" data-sample="">5</div>
                  </div>
                  <div className="bm-hero-divider" aria-hidden="true" />
                  <div>
                    <div className="bm-hero-label">Folders</div>
                    <div className="bm-hero-num" data-sample="">4</div>
                  </div>
                  <div className="bm-hero-divider" aria-hidden="true" />
                  <div>
                    <div className="bm-hero-label">Tags</div>
                    <div className="bm-hero-num" data-sample="">7</div>
                  </div>
                  <span className="ds-spacer" />
                  <div className="ds-muted" style={{ fontSize: "13px", maxWidth: "30ch" }}>Saved newest first. Open a folder on the right to narrow the list.</div>
                </div>
              </div>
              <div className="bm-layout">
                <div>
                  <div className="bm-listhead">
                    <h2 data-sample="">All bookmarks</h2>
                    <span className="bm-listcount" data-sample="">5 saved</span>
                  </div>
                  <div className="ds-card" style={{ padding: "0", overflow: "hidden" }}>
                    <div className="bm-list" data-sample="">
                      <div className="bm-item">
                        <span className="bm-thumb">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                            <path d="M4 5h16v14H4z" />
                            <path d="M4 9h16M8 13h8" />
                          </svg>
                        </span>
                        <div className="bm-body">
                          <a className="bm-link" href="#" data-sample="Bookmark#1.title">Designing with a spacing scale</a>
                          <div className="bm-meta">
                            <span className="bm-site" data-sample="Bookmark#1.siteName">refactoringui.com</span>
                            {" "}
                            <span className="bm-folder-tag">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                                <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
                              </svg>
                              <span data-sample="Bookmark#1.folder">Design</span>
                            </span>
                          </div>
                          <div className="bm-tags">
                            <span className="bm-tag" data-sample="Bookmark#1.tag#1">design</span>
                            <span className="bm-tag" data-sample="Bookmark#1.tag#2">reference</span>
                          </div>
                        </div>
                        <span className="bm-when" data-sample="Bookmark#1.savedOn">Oct 22, 2025</span>
                      </div>
                      <div className="bm-item">
                        <span className="bm-thumb">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                            <path d="M4 19V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v13" />
                            <path d="M8 8h8M8 12h8M8 16h5" />
                          </svg>
                        </span>
                        <div className="bm-body">
                          <a className="bm-link" href="#" data-sample="Bookmark#2.title">The complete guide to slow reading: how I stopped skimming and started remembering what I read</a>
                          <div className="bm-meta">
                            <span className="bm-site" data-sample="Bookmark#2.siteName">medium.com</span>
                            {" "}
                            <span className="bm-folder-tag">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                                <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
                              </svg>
                              <span data-sample="Bookmark#2.folder">Reading</span>
                            </span>
                          </div>
                          <div className="bm-tags">
                            <span className="bm-tag" data-sample="Bookmark#2.tag#1">reading</span>
                            <span className="bm-tag" data-sample="Bookmark#2.tag#2">habits</span>
                          </div>
                        </div>
                        <span className="bm-when" data-sample="Bookmark#2.savedOn">Oct 19, 2025</span>
                      </div>
                      <div className="bm-item">
                        <span className="bm-thumb">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                            <circle cx="12" cy="12" r="9" />
                            <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
                          </svg>
                        </span>
                        <div className="bm-body">
                          <a className="bm-link" href="#" data-sample="Bookmark#3.title">বাংলা ভাষার ইতিহাস সংক্ষেপে</a>
                          <div className="bm-meta">
                            <span className="bm-site" data-sample="Bookmark#3.siteName">bn.wikipedia.org</span>
                            {" "}
                            <span className="bm-folder-tag">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                                <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
                              </svg>
                              <span data-sample="Bookmark#3.folder">Reading</span>
                            </span>
                          </div>
                          <div className="bm-tags">
                            <span className="bm-tag" data-sample="Bookmark#3.tag#1">language</span>
                          </div>
                        </div>
                        <span className="bm-when" data-sample="Bookmark#3.savedOn">Oct 15, 2025</span>
                      </div>
                      <div className="bm-item">
                        <span className="bm-thumb">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                            <rect x="3" y="5" width="18" height="14" rx="2" />
                            <path d="m8 11-2 2 2 2M16 11l2 2-2 2" />
                          </svg>
                        </span>
                        <div className="bm-body">
                          <a className="bm-link" href="#" data-sample="Bookmark#4.title">CSS grid: a practical reference</a>
                          <div className="bm-meta">
                            <span className="bm-site" data-sample="Bookmark#4.siteName">css-tricks.com</span>
                            {" "}
                            <span className="bm-folder-tag">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                                <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
                              </svg>
                              <span data-sample="Bookmark#4.folder">Work</span>
                            </span>
                          </div>
                        </div>
                        <span className="bm-when" data-sample="Bookmark#4.savedOn">Oct 12, 2025</span>
                      </div>
                      <div className="bm-item">
                        <span className="bm-thumb">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                            <path d="M4 4h16v16H4z" />
                            <path d="M8 8h8v8H8z" />
                          </svg>
                        </span>
                        <div className="bm-body">
                          <a className="bm-link" href="#" data-sample="Bookmark#5.title">Was ist die Pomodoro-Technik?</a>
                          <div className="bm-meta">
                            <span className="bm-site" data-sample="Bookmark#5.siteName">zeit.de</span>
                            {" "}
                            <span className="bm-folder-tag">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                                <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
                              </svg>
                              <span data-sample="Bookmark#5.folder">Productivity</span>
                            </span>
                          </div>
                          <div className="bm-tags">
                            <span className="bm-tag" data-sample="Bookmark#5.tag#1">focus</span>
                          </div>
                        </div>
                        <span className="bm-when" data-sample="Bookmark#5.savedOn">Oct 08, 2025</span>
                      </div>
                    </div>
                  </div>
                </div>
                <aside className="bm-rail">
                  <div className="bm-rail-card">
                    <div className="bm-rail-head">
                      <h2 className="bm-rail-title">Folders</h2>
                      <span className="ds-badge ds-badge-quiet" data-sample="">4</span>
                    </div>
                    <ul className="bm-folders">
                      <li>
                        <button className="bm-folder is-active" aria-current="true">
                          {" "}
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                            <path d="M4 6h16M4 12h16M4 18h16" />
                          </svg>
                          {" "}
                          <span className="bm-folder-name">All bookmarks</span>
                          {" "}
                          <span className="bm-count" data-sample="">5</span>
                          {" "}
                        </button>
                      </li>
                      <li>
                        <button className="bm-folder">
                          {" "}
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                            <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
                          </svg>
                          {" "}
                          <span className="bm-folder-name" data-sample="Folder#1.name">Design</span>
                          {" "}
                          <span className="bm-count" data-sample="Folder#1.count">1</span>
                          {" "}
                        </button>
                      </li>
                      <li>
                        <button className="bm-folder">
                          {" "}
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                            <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
                          </svg>
                          {" "}
                          <span className="bm-folder-name" data-sample="Folder#2.name">Reading</span>
                          {" "}
                          <span className="bm-count" data-sample="Folder#2.count">2</span>
                          {" "}
                        </button>
                      </li>
                      <li>
                        <button className="bm-folder">
                          {" "}
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                            <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
                          </svg>
                          {" "}
                          <span className="bm-folder-name" data-sample="Folder#3.name">Work</span>
                          {" "}
                          <span className="bm-count" data-sample="Folder#3.count">1</span>
                          {" "}
                        </button>
                      </li>
                      <li>
                        <button className="bm-folder">
                          {" "}
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                            <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
                          </svg>
                          {" "}
                          <span className="bm-folder-name" data-sample="Folder#4.name">Productivity</span>
                          {" "}
                          <span className="bm-count" data-sample="Folder#4.count">1</span>
                          {" "}
                        </button>
                      </li>
                    </ul>
                    <form className="bm-newfolder" data-situation="done">
                      <label className="ds-label" htmlFor="newfolder">New folder</label>
                      {" "}
                      <input className="ds-input" id="newfolder" name="foldername" placeholder="e.g. Recipes" maxLength={60} />
                      <div className="ds-hint">Up to 60 characters. Names are yours alone.</div>
                      <button className="ds-btn ds-btn-secondary" type="submit">Create</button>
                    </form>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        ) : null}
        {situation === "done" ? (
          <section data-state="done">
            <div className="ds-page bm-page" style={{ paddingBottom: "0" }}>
              <div className="ds-notice ds-notice-success bm-saved" style={{ marginTop: "calc(16px * var(--space-scale, 1))" }}>Bookmark saved.</div>
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}
