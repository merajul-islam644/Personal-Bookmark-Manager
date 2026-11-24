// Ported by Studio from the agreed design .studio/designs/screens/bookmarks.html, at the start of a build.
// Its markup, classes and CSS are the design's: wire real data, translation keys, routes and SDK
// actions into it and change nothing visual. Studio writes it again only when the design is redrawn;
// then `git diff` shows what to carry over.
import { useState } from "react";
import type { FormEvent, MouseEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { HeaderPart } from "../../app/layout/HeaderPart";
import { blocksClient } from "../../lib/blocks/client";
import { useT } from "../../lib/i18n/LocalizationProvider";
import { useBookmarks, useFolders } from "./bookmarksApi";
import { countInFolder, folderIsOwn, inFolder, newestFirst, tagCount } from "./listRules";
import { localeOf } from "../../lib/i18n/languages";
import { createFolderRecord, folderNameTaken } from "./folderApi";
import type { Bookmark } from "./bookmarksApi";
import "./BookmarksScreen.css";
import "./BookmarksScreen.wiring.css";

/** The situations the design shows: the screen as it usually is, then each one drawn. Show the one the real data or request is in. */
export type BookmarksScreenSituation = "normal" | "empty" | "empty-folder" | "loading" | "done";

export type BookmarksScreenProps = {
  situation?: BookmarksScreenSituation;
  onNavigate?: (path: string) => void;
  /** The folder chosen in the rail, if any. */
  activeFolder?: string;
  /** A short confirmation shown above the list, such as a folder just made. */
  notice?: string;
};

function formatSaved(raw: string | undefined, language: string): string {
  if (!raw) return "";
  const time = Date.parse(raw);
  if (Number.isNaN(time)) return "";
  return new Date(time).toLocaleDateString(localeOf(language), { day: "2-digit", month: "short", year: "numeric" });
}

function recordId(record: { itemId?: string; id?: string }): string {
  return record.itemId ?? record.id ?? "";
}

export function BookmarksScreen({ situation, onNavigate, activeFolder, notice }: BookmarksScreenProps) {
  const goTo = (path: string) => (event: MouseEvent) => {
    if (!onNavigate) return;
    event.preventDefault();
    onNavigate(path);
  };
  const { t, language } = useT();
  const queryClient = useQueryClient();
  const bookmarksQuery = useBookmarks();
  const foldersQuery = useFolders();
  const [folderName, setFolderName] = useState("");
  const [folderError, setFolderError] = useState<string>();
  const [creating, setCreating] = useState(false);

  const bookmarks = newestFirst(bookmarksQuery.data ?? []);
  const folders = foldersQuery.data ?? [];
  const tags = tagCount(bookmarks);
  const shown = inFolder(bookmarks, activeFolder);
  const countIn = (name: string) => countInFolder(bookmarks, name);
  const activeExists = folderIsOwn(folders, activeFolder);

  const resolved: BookmarksScreenSituation =
    situation ?? (bookmarksQuery.isLoading || foldersQuery.isLoading ? "loading" : bookmarks.length === 0 ? "empty" : "normal");

  async function createFolder(event: FormEvent) {
    event.preventDefault();
    const name = folderName.trim();
    setFolderError(undefined);
    if (!name) {
      setFolderError(t("bookmarks.folderRequired"));
      return;
    }
    if (folderNameTaken(folders, name)) {
      setFolderError(t("bookmarks.duplicateFolder", { name: `"${name}"` }));
      return;
    }
    setCreating(true);
    try {
      const saved = await createFolderRecord(blocksClient, name);
      if (!saved.ok) {
        throw new Error("The folder was refused.");
      }
      setFolderName("");
      await queryClient.invalidateQueries({ queryKey: ["folders"] });
      onNavigate?.("/bookmarks?folder=" + encodeURIComponent(name) + "&created=" + encodeURIComponent(name));
    } catch (caught) {
      console.error("Folder could not be saved", caught);
      setFolderError(t("bookmarks.folderFailed"));
    } finally {
      setCreating(false);
    }
  }

  function folderNameOf(bookmark: Bookmark) {
    return bookmark.folderName ?? "";
  }

  return (
    <div className="studio-screen-bookmarks" style={{ display: "contents" }}>
      <main data-screen="bookmarks">
        <HeaderPart onNavigate={onNavigate} />
        {resolved === "loading" ? (
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
                    <span>{t("bookmarks.loadingEyebrow")}</span>
                    {" "}
                  </span>
                  <h1 className="ds-h1 bm-title">{t("bookmarks.title")}</h1>
                  <p className="bm-sub">{t("bookmarks.sub")}</p>
                </div>
                <div className="ds-actions">
                  <a href="/bookmarks/new" className="ds-btn" data-goto="new-bookmark" onClick={goTo("/bookmarks/new")}> <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg> {t("bookmarks.newBookmark")} </a>
                </div>
              </div>
              <div className="ds-card" style={{ padding: "calc(24px * var(--space-scale, 1))" }}>
                <div className="ds-stack">
                  <div className="ds-progress">
                    <span style={{ width: "65%" }} />
                  </div>
                  <p className="ds-muted" style={{ margin: "0" }}>{t("bookmarks.loading")}</p>
                </div>
              </div>
            </div>
          </section>
        ) : null}
        {resolved === "empty" ? (
          <section data-state="empty">
            <div className="ds-page bm-page">
              <div className="ds-page-head bm-head">
                <div>
                  <span className="bm-eyebrow"> <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z" /></svg> {t("bookmarks.count", { count: 0 })} </span>
                  <h1 className="ds-h1 bm-title">{t("bookmarks.title")}</h1>
                  <p className="bm-sub">{t("bookmarks.sub")}</p>
                </div>
                <div className="ds-actions">
                  <a href="/bookmarks/new" className="ds-btn" data-goto="new-bookmark" onClick={goTo("/bookmarks/new")}> <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg> {t("bookmarks.newBookmark")} </a>
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
                  <b style={{ color: "hsl(var(--foreground))", fontSize: "16px" }}>{t("bookmarks.emptyTitle")}</b>
                  {" "}
                  <span>{t("bookmarks.emptyText")}</span>
                  {" "}
                  <a href="/bookmarks/new" className="ds-btn" style={{ marginTop: "8px" }} data-goto="new-bookmark" onClick={goTo("/bookmarks/new")}>{t("bookmarks.newBookmark")}</a>
                </div>
              </div>
            </div>
          </section>
        ) : null}
        {resolved === "normal" && !activeExists ? (
          <section data-state="empty">
            <div className="ds-page bm-page">
              <div className="ds-card" style={{ padding: "calc(48px * var(--space-scale, 1)) calc(24px * var(--space-scale, 1))" }}>
                <div className="ds-empty">
                  <span className="ds-empty-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
                    </svg>
                  </span>
                  <b style={{ color: "hsl(var(--foreground))", fontSize: "16px" }}>{t("bookmarks.folderForeign")}</b>
                  <a href="/bookmarks" className="ds-btn ds-btn-sm" style={{ marginTop: "8px" }} onClick={goTo("/bookmarks")}>{t("bookmarks.allBookmarks")}</a>
                </div>
              </div>
            </div>
          </section>
        ) : null}
        {resolved === "normal" && activeExists ? (
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
                    <span>{t("bookmarks.count", { count: bookmarks.length })}</span>
                    {" "}
                  </span>
                  <h1 className="ds-h1 bm-title">{t("bookmarks.title")}</h1>
                  <p className="bm-sub">{t("bookmarks.sub")}</p>
                </div>
                <div className="ds-actions">
                  <a href="/bookmarks/new" className="ds-btn" data-goto="new-bookmark" onClick={goTo("/bookmarks/new")}> <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg> {t("bookmarks.newBookmark")} </a>
                </div>
              </div>
              {bookmarksQuery.isError ? <div className="ds-notice ds-notice-danger bm-load-error">{t("bookmarks.loadFailed")}</div> : null}
              {notice ? <div className="ds-notice ds-notice-success bm-saved">{notice}</div> : null}
              {activeFolder && shown.length === 0 ? (
                <div className="ds-card" style={{ padding: "0", marginBottom: "calc(24px * var(--space-scale, 1))" }}>
                  <div className="ds-empty" style={{ padding: "calc(48px * var(--space-scale, 1)) calc(24px * var(--space-scale, 1))" }}>
                    <span className="ds-empty-icon">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                        <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
                      </svg>
                    </span>
                    <b style={{ color: "hsl(var(--foreground))", fontSize: "16px" }}>{t("bookmarks.emptyFolderTitle")}</b>
                    <span>{t("bookmarks.emptyFolderText")}</span>
                    <a href="/bookmarks/new" className="ds-btn ds-btn-sm" style={{ marginTop: "8px" }} data-goto="new-bookmark" onClick={goTo("/bookmarks/new")}>{t("bookmarks.newBookmark")}</a>
                  </div>
                </div>
              ) : null}
              <div className="ds-band bm-band" style={{ marginBottom: "calc(24px * var(--space-scale, 1))" }}>
                <div className="bm-hero-inner">
                  <div>
                    <div className="bm-hero-label">{t("bookmarks.allBookmarks")}</div>
                    <div className="bm-hero-num">{bookmarks.length}</div>
                  </div>
                  <div className="bm-hero-divider" aria-hidden="true" />
                  <div>
                    <div className="bm-hero-label">{t("bookmarks.folders")}</div>
                    <div className="bm-hero-num">{folders.length}</div>
                  </div>
                  <div className="bm-hero-divider" aria-hidden="true" />
                  <div>
                    <div className="bm-hero-label">{t("bookmarks.tags")}</div>
                    <div className="bm-hero-num">{tags}</div>
                  </div>
                  <span className="ds-spacer" />
                  <div className="ds-muted" style={{ fontSize: "13px", maxWidth: "30ch" }}>{t("bookmarks.bandNote")}</div>
                </div>
              </div>
              <div className="bm-layout">
                <div>
                  <div className="bm-listhead">
                    <h2>{activeFolder ?? t("bookmarks.allBookmarks")}</h2>
                    <span className="bm-listcount">{t("bookmarks.savedItems", { count: shown.length })}</span>
                  </div>
                  <div className="ds-card" style={{ padding: "0", overflow: "hidden" }}>
                    <div className="bm-list">
                      {shown.map((bookmark) => (
                        <div className="bm-item" key={recordId(bookmark)}>
                          <span className="bm-thumb">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                              <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7L11.5 6.8" />
                              <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1.5-1.5" />
                            </svg>
                          </span>
                          <div className="bm-body">
                            <a className="bm-link" href={bookmark.link} target="_blank" rel="noreferrer noopener">{bookmark.title}</a>
                            <div className="bm-meta">
                              {bookmark.siteName ? <span className="bm-site">{bookmark.siteName}</span> : null}
                              {" "}
                              <span className="bm-folder-tag">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                                  <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
                                </svg>
                                <span>{folderNameOf(bookmark)}</span>
                              </span>
                            </div>
                            {bookmark.tags && bookmark.tags.length > 0 ? (
                              <div className="bm-tags">
                                {bookmark.tags.map((tag) => (
                                  <span className="bm-tag" key={tag}>{tag}</span>
                                ))}
                              </div>
                            ) : null}
                          </div>
                          <span className="bm-when">{formatSaved(bookmark.savedOn ?? bookmark.createdDate, language)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <aside className="bm-rail">
                  <div className="bm-rail-card">
                    <div className="bm-rail-head">
                      <h2 className="bm-rail-title">{t("bookmarks.folders")}</h2>
                      <span className="ds-badge ds-badge-quiet">{folders.length}</span>
                    </div>
                    <ul className="bm-folders">
                      <li>
                        <button className={"bm-folder" + (activeFolder ? "" : " is-active")} aria-current={activeFolder ? undefined : "true"} onClick={() => onNavigate?.("/bookmarks")}>
                          {" "}
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                            <path d="M4 6h16M4 12h16M4 18h16" />
                          </svg>
                          {" "}
                          <span className="bm-folder-name">{t("bookmarks.allBookmarks")}</span>
                          {" "}
                          <span className="bm-count">{bookmarks.length}</span>
                          {" "}
                        </button>
                      </li>
                      {folders.map((folder) => (
                        <li key={recordId(folder)}>
                          <button className={"bm-folder" + (activeFolder === folder.name ? " is-active" : "")} aria-current={activeFolder === folder.name ? "true" : undefined} onClick={() => onNavigate?.("/bookmarks?folder=" + encodeURIComponent(folder.name ?? ""))}>
                            {" "}
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                              <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
                            </svg>
                            {" "}
                            <span className="bm-folder-name">{folder.name}</span>
                            {" "}
                            <span className="bm-count">{countIn(folder.name ?? "")}</span>
                            {" "}
                          </button>
                        </li>
                      ))}
                    </ul>
                    {folders.length === 0 ? <p className="bm-empty-note">{t("bookmarks.emptyFolders")}</p> : null}
                    <form className="bm-newfolder" onSubmit={createFolder}>
                      <label className="ds-label" htmlFor="newfolder">{t("bookmarks.newFolder")}</label>
                      {" "}
                      <input className="ds-input" id="newfolder" name="foldername" placeholder={t("bookmarks.folderPlaceholder")} maxLength={60} value={folderName} onChange={(event) => setFolderName(event.target.value)} />
                      <div className="ds-hint">{t("bookmarks.folderHint")}</div>
                      {folderError ? <p className="bm-form-error" role="alert">{folderError}</p> : null}
                      <button className="ds-btn ds-btn-secondary" type="submit" disabled={creating}>{t("bookmarks.create")}</button>
                    </form>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        ) : null}
        {resolved === "done" ? (
          <section data-state="done">
            <div className="ds-page bm-page" style={{ paddingBottom: "0" }}>
              <div className="ds-notice ds-notice-success bm-saved" style={{ marginTop: "calc(16px * var(--space-scale, 1))" }}>
                {t("bookmarks.saved")}
              </div>
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}
