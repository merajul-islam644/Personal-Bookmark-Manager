import type { Bookmark } from "../bookmarks/bookmarkTypes";
import { linkAccepted, requestSave } from "./saveRules";

type BookmarkCreatingClient = {
  data: { collection: (schema: string, options?: { fields?: string[] }) => { create: (payload: Partial<Bookmark>) => Promise<unknown> } };
};

/** The site name shown when a link is pasted: its domain without a leading www. */
export function siteNameOf(link: string): string {
  try {
    return new URL(link.trim()).hostname.replace(/^www\./i, "");
  } catch {
    return "";
  }
}

export { linkAccepted };

/** Saves a bookmark for the signed-in person, through the same rule the form uses. */
export function saveBookmark(
  client: BookmarkCreatingClient,
  draft: { folderName: string; link: string; siteName: string; tags: string[]; title: string }
): Promise<{ ok: boolean; itemId?: string }> {
  return requestSave(client, draft);
}
