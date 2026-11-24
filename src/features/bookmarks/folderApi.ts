import type { Folder } from "./bookmarkTypes";

type FolderCreateAnswer = { errors?: unknown; acknowledged?: boolean; data?: { itemId?: string } | null };
type FolderCreatingClient = {
  data: { collection: (schema: string, options?: { fields?: string[] }) => { create: (payload: Partial<Folder>) => Promise<unknown> } };
};

/** True when the person already has a folder by this name, ignoring case. */
export function folderNameTaken(folders: Folder[], name: string): boolean {
  const wanted = name.trim().toLowerCase();
  return folders.some((folder) => (folder.name ?? "").trim().toLowerCase() === wanted);
}

/**
 * Saves a folder for the signed-in person. The gateway can answer 200 and still refuse:
 * the reason lands in `errors` and the item comes back null, so both are checked here.
 */
export async function createFolderRecord(client: FolderCreatingClient, name: string): Promise<{ ok: boolean; itemId?: string }> {
  const response = (await client.data
    .collection("Folder", { fields: ["name", "createdOn"] })
    .create({ createdOn: new Date().toISOString(), name: name.trim() })) as FolderCreateAnswer;
  const errors = response?.errors;
  const refused = Array.isArray(errors) ? errors.length > 0 : Boolean(errors);
  const itemId = response?.data?.itemId;
  if (refused || response?.acknowledged === false || !itemId) return { ok: false };
  return { itemId, ok: true };
}
