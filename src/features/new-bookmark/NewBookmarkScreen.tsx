// Ported by Studio from the agreed design .studio/designs/screens/new-bookmark.html, at the start of a build.
// Its markup, classes and CSS are the design's: wire real data, translation keys, routes and SDK
// actions into it and change nothing visual. Studio writes it again only when the design is redrawn;
// then `git diff` shows what to carry over.
import { useState } from "react";
import type { FormEvent, KeyboardEvent, MouseEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { HeaderPart } from "../../app/layout/HeaderPart";
import { blocksClient } from "../../lib/blocks/client";
import { useT } from "../../lib/i18n/LocalizationProvider";
import { useCurrentUser, userDisplayName } from "../account/useCurrentUser";
import { useFolders } from "../bookmarks/bookmarksApi";
import { saveBookmark, siteNameOf } from "./saveBookmark";
import "./NewBookmarkScreen.css";
import "./NewBookmarkScreen.wiring.css";

/** The situations the design shows: the screen as it usually is, then each one drawn. Show the one the real data or request is in. */
export type NewBookmarkScreenSituation = "normal" | "loading" | "error" | "empty" | "done";

type SavedBookmark = { folderName: string; link: string; siteName: string; tags: string[]; title: string };

export function NewBookmarkScreen({ situation, onNavigate }: { situation?: NewBookmarkScreenSituation; onNavigate?: (path: string) => void }) {
  const goTo = (path: string) => (event: MouseEvent) => {
    if (!onNavigate) return;
    event.preventDefault();
    onNavigate(path);
  };
  const { t, language } = useT();
  const queryClient = useQueryClient();
  const me = useCurrentUser();
  const foldersQuery = useFolders();
  const folders = foldersQuery.data ?? [];

  const [link, setLink] = useState("");
  const [title, setTitle] = useState("");
  const [siteName, setSiteName] = useState("");
  const [folder, setFolder] = useState("");
  const [tagDraft, setTagDraft] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [reading, setReading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [linkError, setLinkError] = useState<string>();
  const [failed, setFailed] = useState(false);
  const [saved, setSaved] = useState<SavedBookmark>();

  const chosenFolder = folder || folders[0]?.name || "";
  const resolved: NewBookmarkScreenSituation =
    situation ?? (foldersQuery.isLoading ? "loading" : folders.length === 0 ? "empty" : saved ? "done" : "normal");

  async function readPage(pasted: string) {
    setReading(true);
    try {
      const answer = await blocksClient.logic.functions.call<{ siteName?: string; title?: string }>(
        "9d84c164-c629-4844-aec9-24b0f1dde75d",
        { body: { link: pasted }, method: "POST" }
      );
      if (answer?.title) setTitle((current) => current || answer.title || "");
      setSiteName((current) => current || answer?.siteName || siteNameOf(pasted));
    } catch (caught) {
      console.error("The page could not be read", caught);
      setSiteName((current) => current || siteNameOf(pasted));
    } finally {
      setReading(false);
    }
  }

  function handleLinkChange(next: string) {
    setLink(next);
    setLinkError(undefined);
    const clean = next.trim();
    if (/^https?:\/\/\S+$/i.test(clean)) {
      void readPage(clean);
    } else if (siteName === "" || siteName === siteNameOf(link)) {
      setSiteName(siteNameOf(clean));
    }
  }

  function addTag(raw: string) {
    const name = raw.trim().slice(0, 40);
    if (!name) return;
    setTags((current) => (current.some((tag) => tag.toLowerCase() === name.toLowerCase()) ? current : [...current, name]));
    setTagDraft("");
  }

  function handleTagKey(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter" && event.key !== ",") return;
    event.preventDefault();
    addTag(tagDraft);
  }

  async function handleSave(event: FormEvent) {
    event.preventDefault();
    setFailed(false);
    const cleanLink = link.trim();
    if (!/^https?:\/\/\S+$/i.test(cleanLink)) {
      setLinkError(t("newBookmark.linkError"));
      return;
    }
    setLinkError(undefined);
    const pendingTags = tagDraft.trim() ? [...tags, tagDraft.trim().slice(0, 40)] : tags;
    setSaving(true);
    try {
      const result = await saveBookmark(blocksClient, {
        folderName: chosenFolder,
        link: cleanLink,
        siteName: siteName.trim(),
        tags: pendingTags,
        title: (title.trim() || siteNameOf(cleanLink) || cleanLink).slice(0, 200)
      });
      if (!result.ok) throw new Error("The bookmark was refused.");
      await queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      setSaved({ folderName: chosenFolder, link: cleanLink, siteName: siteName.trim(), tags: pendingTags, title: title.trim() });
    } catch (caught) {
      console.error("The bookmark could not be saved", caught);
      setFailed(true);
    } finally {
      setSaving(false);
    }
  }

  const shown = saved;
  const savedDate = new Date().toLocaleString(language === "bn" ? "bn-BD" : language === "de" ? "de-DE" : "en-GB", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    year: "numeric"
  });

  return (
    <div className="studio-screen-new-bookmark" style={{ display: "contents" }}>
      <main data-screen="new-bookmark">
        <HeaderPart onNavigate={onNavigate} />
        {resolved === "empty" ? (
          <section data-state="empty">
            <div className="nb-head">
              <div className="ds-page">
                <div className="ds-page-head">
                  <div>
                    <span className="ds-eyebrow">{t("nav.bookmarks")}</span>
                    <h1 className="ds-h1" style={{ marginTop: "8px" }}>{t("newBookmark.title")}</h1>
                    <p className="ds-muted" style={{ margin: "6px 0 0" }}>{t("newBookmark.sub")}</p>
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
                  <b style={{ color: "hsl(var(--foreground))" }}>{t("newBookmark.noFolders")}</b>
                  {" "}
                  <span>{t("newBookmark.noFoldersText")}</span>
                  {" "}
                  <a href="/bookmarks" className="ds-btn ds-btn-sm" style={{ marginTop: "8px" }} data-goto="bookmarks" onClick={goTo("/bookmarks")}>{t("newBookmark.makeFolder")}</a>
                </div>
              </div>
            </div>
          </section>
        ) : null}
        {resolved === "done" && shown ? (
          <section data-state="done">
            <div className="nb-head">
              <div className="ds-page">
                <div className="ds-page-head">
                  <div>
                    <span className="ds-eyebrow">{t("nav.bookmarks")}</span>
                    <h1 className="ds-h1" style={{ marginTop: "8px" }}>{t("newBookmark.savedTitle")}</h1>
                    <p className="ds-muted" style={{ margin: "6px 0 0" }}>{t("newBookmark.savedSub")}</p>
                  </div>
                  <div className="ds-actions">
                    <a href="/bookmarks/new" className="ds-btn ds-btn-secondary" data-goto="bookmarks/new" onClick={goTo("/bookmarks/new")}>{t("newBookmark.saveAnother")}</a>
                    {" "}
                    <a href="/bookmarks" className="ds-btn" data-goto="bookmarks" onClick={goTo("/bookmarks")}>{t("newBookmark.seeBookmarks")}</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="ds-page nb-body">
              <div className="nb-form-card">
                <div className="ds-notice ds-notice-success" style={{ marginBottom: "calc(16px * var(--space-scale, 1))" }}>{t("bookmarks.saved")}</div>
                <div className="ds-stack-tight">
                  <a href={shown.link} target="_blank" rel="noreferrer noopener" style={{ fontSize: "18px", fontWeight: "650", color: "hsl(var(--foreground))", textDecoration: "none" }}>{shown.title}</a>
                  {" "}
                  <span className="ds-muted" style={{ fontSize: "14px" }}>{shown.siteName}</span>
                </div>
                <div className="nb-chip-row" style={{ marginTop: "calc(16px * var(--space-scale, 1))" }}>
                  <span className="ds-badge ds-badge-quiet">{shown.folderName}</span>
                  {" "}
                  {shown.tags.map((tag) => (
                    <span className="nb-chip" key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : null}
        {resolved === "normal" || resolved === "loading" ? (
          <div>
            <div className="nb-head">
              <div className="ds-deco nb-deco-ring" aria-hidden="true" />
              <div className="ds-deco nb-deco-dot" aria-hidden="true" />
              <div className="ds-page">
                <div className="ds-page-head">
                  <div>
                    <span className="ds-eyebrow">{t("nav.bookmarks")}</span>
                    <h1 className="ds-h1" style={{ marginTop: "8px" }}>{t("newBookmark.title")}</h1>
                    <p className="ds-muted" style={{ margin: "6px 0 0" }}>{t("newBookmark.sub")}</p>
                  </div>
                  <div className="ds-actions">
                    <a href="/bookmarks" className="ds-btn ds-btn-ghost" data-goto="bookmarks" onClick={goTo("/bookmarks")}>{t("common.cancel")}</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="ds-page nb-body">
              <div className="nb-layout">
                <div className="nb-form-card">
                  <form className="ds-form" onSubmit={handleSave} noValidate>
                    <div className="ds-field">
                      <label className="ds-label" htmlFor="nb-link">{t("newBookmark.link")}</label>
                      {" "}
                      <input className="ds-input" id="nb-link" type="url" value={link} aria-invalid={linkError ? "true" : undefined} onChange={(event) => handleLinkChange(event.target.value)} />
                      {" "}
                      <span className="ds-hint">{t("newBookmark.linkHint")}</span>
                      {linkError ? <span className="ds-error" role="alert">{linkError}</span> : null}
                      {reading ? (
                        <span className="nb-reading">
                          <span className="nb-dot" aria-hidden="true" />
                          <span>{t("newBookmark.reading")}</span>
                        </span>
                      ) : null}
                    </div>
                    <div className="ds-field">
                      <label className="ds-label" htmlFor="nb-title">{t("newBookmark.pageTitle")}</label>
                      {" "}
                      <input className="ds-input" id="nb-title" type="text" maxLength={200} value={title} onChange={(event) => setTitle(event.target.value)} />
                      {" "}
                      <span className="ds-hint">{t("newBookmark.titleHint")}</span>
                    </div>
                    <div className="ds-field">
                      <label className="ds-label" htmlFor="nb-site">{t("newBookmark.siteName")}</label>
                      {" "}
                      <input className="ds-input" id="nb-site" type="text" maxLength={100} value={siteName} onChange={(event) => setSiteName(event.target.value)} />
                      {" "}
                      <span className="ds-hint">{t("newBookmark.siteHint")}</span>
                    </div>
                    <div className="ds-field">
                      <label className="ds-label" htmlFor="nb-folder">{t("newBookmark.folder")}</label>
                      <select className="ds-select" id="nb-folder" value={chosenFolder} onChange={(event) => setFolder(event.target.value)}>
                        {folders.map((entry) => (
                          <option key={entry.itemId ?? entry.name} value={entry.name}>{entry.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="ds-field">
                      <label className="ds-label" htmlFor="nb-tags">{t("newBookmark.tags")}</label>
                      {" "}
                      <input className="ds-input" id="nb-tags" type="text" placeholder={t("newBookmark.tagsPlaceholder")} value={tagDraft} onChange={(event) => setTagDraft(event.target.value)} onKeyDown={handleTagKey} onBlur={() => addTag(tagDraft)} />
                      {" "}
                      <span className="ds-hint">{t("newBookmark.tagsHint")}</span>
                      <div className="nb-chip-row">
                        {tags.map((tag) => (
                          <span className="nb-chip" key={tag}>{tag}<button type="button" aria-label={t("newBookmark.removeTag", { tag })} onClick={() => setTags((current) => current.filter((entry) => entry !== tag))}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6 6 18" /></svg></button></span>
                        ))}
                      </div>
                    </div>
                    {failed ? <div className="ds-notice ds-notice-danger">{t("newBookmark.failed")}</div> : null}
                    <div className="ds-form-actions">
                      <a href="/bookmarks" className="ds-btn ds-btn-secondary" data-goto="bookmarks" onClick={goTo("/bookmarks")}>{t("common.cancel")}</a>
                      {" "}
                      <button className="ds-btn" type="submit" disabled={saving}>{saving ? t("newBookmark.saving") : t("common.save")}</button>
                    </div>
                  </form>
                </div>
                <aside className="nb-side">
                  <div className="nb-side-card">
                    <h2 className="ds-h3" style={{ margin: "0 0 calc(12px * var(--space-scale, 1))" }}>{t("newBookmark.keepsTitle")}</h2>
                    <dl className="nb-facts">
                      <div>
                        <dt>{t("newBookmark.folder")}</dt>
                        <dd>{chosenFolder}</dd>
                      </div>
                      <div>
                        <dt>{t("newBookmark.tags")}</dt>
                        <dd>{tagDraft.trim() ? tags.length + 1 : tags.length}</dd>
                      </div>
                      <div>
                        <dt>{t("newBookmark.savedBy")}</dt>
                        <dd>{userDisplayName(me.data?.data) || me.data?.data?.email || ""}</dd>
                      </div>
                      <div>
                        <dt>{t("newBookmark.savedOn")}</dt>
                        <dd>{savedDate}</dd>
                      </div>
                    </dl>
                  </div>
                  <div className="nb-side-card">
                    <h2 className="ds-h3" style={{ margin: "0 0 calc(12px * var(--space-scale, 1))" }}>{t("newBookmark.howTitle")}</h2>
                    <ol className="nb-steps">
                      <li className="nb-step-on">
                        <span className="nb-step-num">1</span>
                        <span>{t("newBookmark.step1")}</span>
                      </li>
                      <li>
                        <span className="nb-step-num">2</span>
                        <span>{t("newBookmark.step2")}</span>
                      </li>
                      <li>
                        <span className="nb-step-num">3</span>
                        <span>{t("newBookmark.step3")}</span>
                      </li>
                      <li>
                        <span className="nb-step-num">4</span>
                        <span>{t("newBookmark.step4")}</span>
                      </li>
                    </ol>
                    <div className="nb-folder-note">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                        <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
                      </svg>
                      {" "}
                      <span>{t("newBookmark.folderNote")} <a href="/bookmarks" data-goto="bookmarks" onClick={goTo("/bookmarks")}>{t("newBookmark.folderNoteLink")}</a> {t("newBookmark.folderNoteEnd")}</span>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        ) : null}
        {resolved === "loading" ? (
          <section data-state="loading">
            <div className="ds-page nb-body" style={{ paddingTop: "calc(24px * var(--space-scale, 1))" }}>
              <div className="nb-form-card">
                <span className="nb-reading">
                  <span className="nb-dot" aria-hidden="true" />
                  <span>{t("newBookmark.reading")}</span>
                </span>
              </div>
            </div>
          </section>
        ) : null}
        {resolved === "error" ? (
          <section data-state="error">
            <div className="ds-page nb-body" style={{ paddingTop: "calc(24px * var(--space-scale, 1))" }}>
              <div className="nb-form-card">
                <div className="ds-notice ds-notice-danger" style={{ marginBottom: "calc(12px * var(--space-scale, 1))" }}>{t("newBookmark.linkError")}</div>
                <div className="ds-field">
                  <label className="ds-label" htmlFor="nb-link-err">{t("newBookmark.link")}</label>
                  {" "}
                  <input className="ds-input" id="nb-link-err" type="url" aria-invalid="true" value="" readOnly />
                  {" "}
                  <span className="ds-error">{t("newBookmark.linkError")}</span>
                </div>
              </div>
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}
