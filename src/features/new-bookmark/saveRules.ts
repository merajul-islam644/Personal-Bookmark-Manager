import type { Bookmark } from "../bookmarks/bookmarkTypes";

export type SaveDraft = {
  folderName: string;
  link: string;
  siteName: string;
  tags: string[];
  title: string;
};

export type SaveOutcome = { itemId?: string; ok: boolean };

type SaveAnswer = { errors?: unknown; acknowledged?: boolean; data?: { itemId?: string } | null };
type CreatingClient = {
  data: { collection: (schema: string, options?: { fields?: string[] }) => { create: (payload: Partial<Bookmark>) => Promise<unknown> } };
};

/** The link the form accepts: http:// or https:// followed by something. */
export function linkAccepted(link: string): boolean {
  return /^https?:\/\/\S+$/i.test(link.trim());
}

/** Adds a typed tag to the chips, unless one by that name (any case) is already there. */
export function tagNamesFrom(current: string[], typed: string): string[] {
  const name = typed.trim().slice(0, 40);
  if (!name) return current;
  return current.some((tag) => tag.toLowerCase() === name.toLowerCase()) ? current : [...current, name];
}

/** Saves the form's bookmark. An empty or bad link stops it before anything is sent. */
export async function requestSave(client: CreatingClient, draft: SaveDraft): Promise<SaveOutcome> {
  const link = draft.link.trim();
  if (!linkAccepted(link)) return { ok: false };
  const tags = [...new Set(draft.tags.map((tag) => tag.trim().slice(0, 40)).filter(Boolean))];
  const response = (await client.data.collection("Bookmark", { fields: ["link", "title", "siteName", "folderName", "tags", "savedOn"] }).create({
    folderName: draft.folderName,
    link,
    savedOn: new Date().toISOString(),
    siteName: draft.siteName.trim(),
    tags,
    title: draft.title.trim().slice(0, 200)
  })) as SaveAnswer;
  const errors = response?.errors;
  const refused = Array.isArray(errors) ? errors.length > 0 : Boolean(errors);
  const itemId = response?.data?.itemId;
  if (refused || response?.acknowledged === false || !itemId) return { ok: false };
  return { itemId, ok: true };
}
