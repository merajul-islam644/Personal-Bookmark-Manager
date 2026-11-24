import type { Bookmark } from "./bookmarkTypes";

/** When a bookmark was saved, newest first; the saved date, else the record's created date. */
export function savedAt(bookmark: Bookmark): number {
  const exact = bookmark.savedOn ? Date.parse(bookmark.savedOn) : NaN;
  if (!Number.isNaN(exact)) return exact;
  const created = bookmark.createdDate ? Date.parse(bookmark.createdDate) : NaN;
  return Number.isNaN(created) ? 0 : created;
}

/** The person's bookmarks, newest first. */
export function newestFirst(bookmarks: Bookmark[]): Bookmark[] {
  return [...bookmarks].sort((a, b) => savedAt(b) - savedAt(a));
}

/** The bookmarks inside one folder, or all of them when no folder is chosen. */
export function inFolder(bookmarks: Bookmark[], folder: string | undefined): Bookmark[] {
  return folder ? bookmarks.filter((bookmark) => bookmark.folderName === folder) : bookmarks;
}

/** How many of the person's bookmarks sit in a folder. */
export function countInFolder(bookmarks: Bookmark[], folder: string): number {
  return bookmarks.filter((bookmark) => bookmark.folderName === folder).length;
}

/** Every distinct tag the person has used, each once. */
export function tagCount(bookmarks: Bookmark[]): number {
  return new Set(bookmarks.flatMap((bookmark) => bookmark.tags ?? [])).size;
}

/** True when the chosen folder is one of the person's own folders. */
export function folderIsOwn(folders: { name?: string }[], folder: string | undefined): boolean {
  return !folder || folders.some((entry) => entry.name === folder);
}
