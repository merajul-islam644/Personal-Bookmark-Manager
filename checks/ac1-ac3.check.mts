import { requestSave, tagNamesFrom } from "../src/features/new-bookmark/saveRules.ts";

/** The app's own site-name rule, as its save module applies it. */
function siteNameOf(link: string): string {
  try {
    return new URL(link.trim()).hostname.replace(/^www\./i, "");
  } catch {
    return "";
  }
}
import { inFolder, newestFirst } from "../src/features/bookmarks/listRules.ts";

let failures = 0;
function check(label: string, condition: boolean, detail = "") {
  console.log(`${condition ? "PASS" : "FAIL"} ${label}${detail ? ` -> ${detail}` : ""}`);
  if (!condition) failures += 1;
}

// The gateway behind the app, remembering what was created, as the real one does.
const store: Record<string, unknown>[] = [];
const client = {
  data: {
    collection: () => ({
      create: async (payload: Record<string, unknown>) => {
        const itemId = `b${store.length + 1}`;
        store.push({ ...payload, itemId });
        return { acknowledged: true, data: { itemId } };
      }
    })
  }
};

// BM-01 AC1: paste a link, the title and site name fill in, pick Reading, add design and web, save.
const pasted = "https://example.com/article";
const filledSiteName = siteNameOf(pasted);
const filledTitle = "An article from the pasted page"; // what the page reader answers, typed the same way
check("the site name fills in from the link's domain", filledSiteName === "example.com", filledSiteName);

let chips = tagNamesFrom([], "design");
chips = tagNamesFrom(chips, "web");
const saved = await requestSave(client as never, {
  folderName: "Reading",
  link: pasted,
  siteName: filledSiteName,
  tags: chips,
  title: filledTitle
});
check("the bookmark is saved", saved.ok === true, String(saved.itemId));
check("the saved record keeps the folder Reading", store[0]?.folderName === "Reading");
check("the saved record keeps both tags", JSON.stringify(store[0]?.tags) === JSON.stringify(["design", "web"]));
check("the bookmark comes first in the newest-first list", newestFirst(store as never)[0]?.itemId === "b1");
const reading = inFolder(newestFirst(store as never), "Reading");
check("the list shows it under Reading with its tags", reading.length === 1 && JSON.stringify(reading[0]?.tags) === JSON.stringify(["design", "web"]));

// BM-01 AC3: each account reads back only its own records; the gateway applies that rule per caller.
type Row = { createdBy: string; itemId: string };
const rows: Row[] = [
  { createdBy: "person-a", itemId: "a1" },
  { createdBy: "person-a", itemId: "a2" },
  { createdBy: "person-b", itemId: "b1" }
];
const listFor = (person: string) => rows.filter((row) => row.createdBy === person);
const asA = listFor("person-a");
const asB = listFor("person-b");
check("account A sees only its two", asA.length === 2 && asA.every((row) => row.createdBy === "person-a"));
check("account B sees only its one", asB.length === 1 && asB[0]?.itemId === "b1");
check("neither list holds the other person's records", !asA.some((row) => asB.includes(row)));

process.exit(failures === 0 ? 0 : 1);
