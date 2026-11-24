import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../app/providers/AuthProvider";
import { blocksClient } from "../../lib/blocks/client";
import type { Bookmark, Folder } from "./bookmarkTypes";

export type { Bookmark, Folder } from "./bookmarkTypes";

const bookmarkFields = ["link", "title", "siteName", "folderName", "tags", "savedOn", "createdDate"];
const folderFields = ["name", "createdOn", "createdDate"];

function bookmarksCollection() {
  return blocksClient.data.collection<Bookmark>("Bookmark", { fields: bookmarkFields });
}

function foldersCollection() {
  return blocksClient.data.collection<Folder>("Folder", { fields: folderFields });
}

type ListResponse = { data?: { items?: unknown[] }; items?: unknown[] };

/** The gateway names the list after the query, e.g. `getBookmarks`; read it the same way for both types. */
function itemsOf(response: unknown, queryName: string): Record<string, unknown>[] {
  const record = response as ListResponse & { data?: Record<string, { items?: unknown[] }> };
  const named = record?.data?.[queryName]?.items;
  const items = named ?? record?.data?.items ?? record?.items ?? [];
  return items.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object");
}

export function savedAt(bookmark: Bookmark): number {
  const raw = bookmark.savedOn || bookmark.createdDate;
  const time = raw ? Date.parse(raw) : NaN;
  return Number.isNaN(time) ? 0 : time;
}

export async function listBookmarks(): Promise<Bookmark[]> {
  const response = await bookmarksCollection().list({ pageNo: 1, pageSize: 500, sort: { createdDate: -1 } });
  return itemsOf(response, "getBookmarks") as Bookmark[];
}

export async function listFolders(): Promise<Folder[]> {
  const response = await foldersCollection().list({ pageNo: 1, pageSize: 200, sort: { createdDate: 1 } });
  return itemsOf(response, "getFolders") as Folder[];
}

export function useBookmarks() {
  const { status } = useAuth();
  return useQuery({
    enabled: status === "authenticated",
    queryFn: listBookmarks,
    queryKey: ["bookmarks"]
  });
}

export function useFolders() {
  const { status } = useAuth();
  return useQuery({
    enabled: status === "authenticated",
    queryFn: listFolders,
    queryKey: ["folders"]
  });
}
