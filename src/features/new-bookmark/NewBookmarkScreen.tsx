// Ported by Studio from the agreed design .studio/designs/screens/new-bookmark.html, at the start of a build.
// Its markup, classes and CSS are the design's: wire real data, translation keys, routes and SDK
// actions into it and change nothing visual. Studio writes it again only when the design is redrawn;
// then `git diff` shows what to carry over.
import type { MouseEvent } from "react";
import { HeaderPart } from "../../app/layout/HeaderPart";
import "./NewBookmarkScreen.css";

/** The situations the design shows: the screen as it usually is, then each one drawn. Show the one the real data or request is in. */
export type NewBookmarkScreenSituation = "normal" | "loading" | "error" | "empty" | "done";

export function NewBookmarkScreen({ situation = "normal", onNavigate }: { situation?: NewBookmarkScreenSituation; onNavigate?: (path: string) => void }) {
  const goTo = (path: string) => (event: MouseEvent) => {
    if (!onNavigate) return;
    event.preventDefault();
    onNavigate(path);
  };
  return (
    <div className="studio-screen-new-bookmark" style={{ display: "contents" }}>
      <main data-screen="new-bookmark">
        <HeaderPart onNavigate={onNavigate} />
        {situation === "empty" ? (
          <section data-state="empty">
            <div className="nb-head">
              <div className="ds-page">
                <div className="ds-page-head">
                  <div>
                    <span className="ds-eyebrow">Bookmarks</span>
                    <h1 className="ds-h1" style={{ marginTop: "8px" }}>Save a bookmark</h1>
                    <p className="ds-muted" style={{ margin: "6px 0 0" }}>Paste a link, give it a folder and add tags if you like.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="ds-page nb-body">
              <div className="ds-table-wrap">
                <div className="ds-empty">
                  <span className="ds-empty-icon">
                    {" "}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
                      <path d="M12 11v6M9 14h6" />
                    </svg>
                    {" "}
                  </span>
                  {" "}
                  <b style={{ color: "hsl(var(--foreground))" }}>No folders yet. Make a folder before you save a link.</b>
                  {" "}
                  <span>A folder keeps each bookmark in one place. Make your first one, then come back here.</span>
                  {" "}
                  <a href="/bookmarks" className="ds-btn ds-btn-sm" style={{ marginTop: "8px" }} data-goto="bookmarks" onClick={goTo("/bookmarks")}>Make a folder</a>
                </div>
              </div>
            </div>
          </section>
        ) : null}
        {situation === "done" ? (
          <section data-state="done">
            <div className="nb-head">
              <div className="ds-page">
                <div className="ds-page-head">
                  <div>
                    <span className="ds-eyebrow">Bookmarks</span>
                    <h1 className="ds-h1" style={{ marginTop: "8px" }}>Bookmark saved</h1>
                    <p className="ds-muted" style={{ margin: "6px 0 0" }}>It sits at the top of your list with its folder and tags.</p>
                  </div>
                  <div className="ds-actions">
                    <a href="/bookmarks/new" className="ds-btn ds-btn-secondary" data-goto="bookmarks/new" onClick={goTo("/bookmarks/new")}>Save another</a>
                    {" "}
                    <a href="/bookmarks" className="ds-btn" data-goto="bookmarks" onClick={goTo("/bookmarks")}>See your bookmarks</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="ds-page nb-body">
              <div className="nb-form-card">
                <div className="ds-notice ds-notice-success" style={{ marginBottom: "calc(16px * var(--space-scale, 1))" }}>Bookmark saved.</div>
                <div className="ds-stack-tight">
                  <a href="#" style={{ fontSize: "18px", fontWeight: "650", color: "hsl(var(--foreground))", textDecoration: "none" }} data-sample="Bookmark#1.title">The quiet web: notes on reading slowly</a>
                  {" "}
                  <span className="ds-muted" style={{ fontSize: "14px" }} data-sample="Bookmark#1.siteName">Are.na Editorial</span>
                </div>
                <div className="nb-chip-row" style={{ marginTop: "calc(16px * var(--space-scale, 1))" }}>
                  <span className="ds-badge ds-badge-quiet" data-sample="Bookmark#1.folder">Reading</span>
                  {" "}
                  <span className="nb-chip" data-sample="">design</span>
                  {" "}
                  <span className="nb-chip" data-sample="">web</span>
                  {" "}
                  <span className="nb-chip" data-sample="">long reads</span>
                </div>
              </div>
            </div>
          </section>
        ) : null}
        {situation !== "empty" && situation !== "done" ? (
          <div>
            <div className="nb-head">
              <div className="ds-deco nb-deco-ring" aria-hidden="true" />
              <div className="ds-deco nb-deco-dot" aria-hidden="true" />
              <div className="ds-page">
                <div className="ds-page-head">
                  <div>
                    <span className="ds-eyebrow">Bookmarks</span>
                    <h1 className="ds-h1" style={{ marginTop: "8px" }}>Save a bookmark</h1>
                    <p className="ds-muted" style={{ margin: "6px 0 0" }}>Paste a link, give it a folder and add tags if you like.</p>
                  </div>
                  <div className="ds-actions">
                    <a href="/bookmarks" className="ds-btn ds-btn-ghost" data-goto="bookmarks" onClick={goTo("/bookmarks")}>Cancel</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="ds-page nb-body">
              <div className="nb-layout">
                <div className="nb-form-card">
                  <form className="ds-form">
                    <div className="ds-field">
                      <label className="ds-label" htmlFor="nb-link">Link</label>
                      {" "}
                      <input className="ds-input" id="nb-link" type="url" defaultValue="https://www.are.na/editorial/the-quiet-web" data-sample="Bookmark#1.link" />
                      {" "}
                      <span className="ds-hint">Starts with http:// or https://</span>
                      {" "}
                      <span className="nb-reading">
                        <span className="nb-dot" aria-hidden="true" />
                        <span data-sample="">Reading the page…</span>
                      </span>
                    </div>
                    <div className="ds-field">
                      <label className="ds-label" htmlFor="nb-title">Page title</label>
                      {" "}
                      <input className="ds-input" id="nb-title" type="text" maxLength={200} defaultValue="The quiet web: notes on reading slowly" data-sample="Bookmark#1.title" />
                      {" "}
                      <span className="ds-hint">Filled in from the page. Change it if you need to.</span>
                    </div>
                    <div className="ds-field">
                      <label className="ds-label" htmlFor="nb-site">Site name</label>
                      {" "}
                      <input className="ds-input" id="nb-site" type="text" maxLength={100} defaultValue="Are.na Editorial" data-sample="Bookmark#1.siteName" />
                      {" "}
                      <span className="ds-hint">Optional, up to 100 characters.</span>
                    </div>
                    <div className="ds-field">
                      <label className="ds-label" htmlFor="nb-folder">Folder</label>
                      <select className="ds-select" id="nb-folder" defaultValue="Reading">
                        <option data-sample="Bookmark#1.folder">Reading</option>
                        <option data-sample="">Design</option>
                        <option data-sample="">Work</option>
                        <option data-sample="">Someday</option>
                      </select>
                    </div>
                    <div className="ds-field">
                      <label className="ds-label" htmlFor="nb-tags">Tags</label>
                      {" "}
                      <input className="ds-input" id="nb-tags" type="text" placeholder="Type a tag and press Enter" />
                      {" "}
                      <span className="ds-hint">Up to 40 characters each. Press Enter after every tag.</span>
                      <div className="nb-chip-row" data-sample="">
                        <span className="nb-chip">design<button type="button" aria-label="Remove the tag design"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6 6 18" /></svg></button></span>
                        {" "}
                        <span className="nb-chip">web<button type="button" aria-label="Remove the tag web"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6 6 18" /></svg></button></span>
                        {" "}
                        <span className="nb-chip">long reads<button type="button" aria-label="Remove the tag long reads"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6 6 18" /></svg></button></span>
                      </div>
                    </div>
                    <div className="ds-form-actions">
                      <a href="/bookmarks" className="ds-btn ds-btn-secondary" data-goto="bookmarks" onClick={goTo("/bookmarks")}>Cancel</a>
                      {" "}
                      <button className="ds-btn" type="submit" data-situation="done">Save</button>
                    </div>
                  </form>
                </div>
                <aside className="nb-side">
                  <div className="nb-side-card">
                    <h2 className="ds-h3" style={{ margin: "0 0 calc(12px * var(--space-scale, 1))" }}>What this save keeps</h2>
                    <dl className="nb-facts">
                      <div>
                        <dt>Folder</dt>
                        <dd data-sample="Bookmark#1.folder">Reading</dd>
                      </div>
                      <div>
                        <dt>Tags</dt>
                        <dd data-sample="">3 tags</dd>
                      </div>
                      <div>
                        <dt>Saved by</dt>
                        <dd data-sample="me.name">Priya Shah</dd>
                      </div>
                      <div>
                        <dt>Saved on</dt>
                        <dd data-sample="">Mon 20 Oct 2025, 14:32</dd>
                      </div>
                    </dl>
                  </div>
                  <div className="nb-side-card">
                    <h2 className="ds-h3" style={{ margin: "0 0 calc(12px * var(--space-scale, 1))" }}>How saving works</h2>
                    <ol className="nb-steps">
                      <li className="nb-step-on">
                        <span className="nb-step-num">1</span>
                        <span>Paste the link and we read the page for you.</span>
                      </li>
                      <li>
                        <span className="nb-step-num">2</span>
                        <span>Pick one folder. Every bookmark needs one.</span>
                      </li>
                      <li>
                        <span className="nb-step-num">3</span>
                        <span>Add tags, or none at all.</span>
                      </li>
                      <li>
                        <span className="nb-step-num">4</span>
                        <span>Save, and it sits at the top of your list.</span>
                      </li>
                    </ol>
                    <div className="nb-folder-note">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                        <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
                      </svg>
                      {" "}
                      <span>Need a new place for it? <a href="/bookmarks" data-goto="bookmarks" onClick={goTo("/bookmarks")}>Make a folder on your bookmarks</a> first.</span>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        ) : null}
        {situation === "loading" ? (
          <section data-state="loading">
            <div className="ds-page nb-body" style={{ paddingTop: "calc(24px * var(--space-scale, 1))" }}>
              <div className="nb-form-card">
                <span className="nb-reading">
                  <span className="nb-dot" aria-hidden="true" />
                  <span>Reading the page…</span>
                </span>
              </div>
            </div>
          </section>
        ) : null}
        {situation === "error" ? (
          <section data-state="error">
            <div className="ds-page nb-body" style={{ paddingTop: "calc(24px * var(--space-scale, 1))" }}>
              <div className="nb-form-card">
                <div className="ds-notice ds-notice-danger" style={{ marginBottom: "calc(12px * var(--space-scale, 1))" }}>Enter a link that starts with http:// or https://.</div>
                <div className="ds-field">
                  <label className="ds-label" htmlFor="nb-link-err">Link</label>
                  {" "}
                  <input className="ds-input" id="nb-link-err" type="url" aria-invalid="true" defaultValue="" />
                  {" "}
                  <span className="ds-error">Enter a link that starts with http:// or https://.</span>
                </div>
              </div>
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}
