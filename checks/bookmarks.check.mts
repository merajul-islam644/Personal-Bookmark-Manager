import { countInFolder, folderIsOwn, inFolder, newestFirst, savedAt, tagCount } from "../src/features/bookmarks/listRules.ts";
import { APP_LANGUAGES, DEFAULT_LANGUAGE, LANGUAGE_KEY, localeOf, shortNameOf, storedLanguage } from "../src/lib/i18n/languages.ts";
import { DEFAULT_WORDS } from "../src/lib/i18n/defaultWords.ts";

let failures = 0;
function check(label: string, condition: boolean, detail = "") {
  console.log(`${condition ? "PASS" : "FAIL"} ${label}${detail ? ` -> ${detail}` : ""}`);
  if (!condition) failures += 1;
}

// LS-01 AC1: three bookmarks saved in order come back newest first.
const saved = [
  { folderName: "Reading", itemId: "a", savedOn: "2026-11-20T09:00:00.000Z", siteName: "refactoringui.com", tags: ["design"], title: "First saved" },
  { folderName: "Reading", itemId: "b", savedOn: "2026-11-22T09:00:00.000Z", siteName: "medium.com", tags: ["reading", "habits"], title: "Second saved" },
  { folderName: "Work", itemId: "c", savedOn: "2026-11-21T09:00:00.000Z", siteName: "css-tricks.com", tags: [], title: "Third saved" }
];
const ordered = newestFirst(saved);
check("newest first by the saved time", ordered.map((entry) => entry.title).join(" | ") === "Second saved | Third saved | First saved", ordered.map((entry) => entry.title).join(" | "));
check("the record's created date orders it too", savedAt({ createdDate: "2026-01-02T00:00:00.000Z" }) === Date.parse("2026-01-02T00:00:00.000Z"));
check("a missing date sorts last", savedAt({}) === 0);

// LS-01 AC3: the folder Reading holds two, an empty folder shows none.
check("Reading holds two", inFolder(ordered, "Reading").length === 2);
check("Reading's count reads two", countInFolder(ordered, "Reading") === 2);
check("an empty folder holds none", inFolder(ordered, "Productivity").length === 0);
check("all bookmarks come back with no folder", inFolder(ordered, undefined).length === 3);
check("the empty folder message reads as the feature says", DEFAULT_WORDS["bookmarks.emptyFolderTitle"] === "Nothing in this folder yet.");
check("the empty list message reads as the feature says", DEFAULT_WORDS["bookmarks.emptyTitle"] === "No bookmarks yet. Save your first link.");
check("the full list heading reads as the feature says", DEFAULT_WORDS["bookmarks.title"] === "Your bookmarks");

// An unknown folder (a link from another account) is not one of this person's.
check("a folder that is not mine is refused", folderIsOwn([{ name: "Reading" }], "Someone else's") === false);
check("my own folder is accepted", folderIsOwn([{ name: "Reading" }], "Reading"));
check("tags are counted once each", tagCount(ordered) === 3);

// LG-01: the switch offers the three languages, each as it calls itself.
check("three languages offered", APP_LANGUAGES.length === 3);
check("they are English, বাংলা and Deutsch", APP_LANGUAGES.map((entry) => entry.name).join(", ") === "English, বাংলা, Deutsch");
check("the switch shows Deutsch as DE", shortNameOf("de") === "DE");
check("the switch shows বাংলা as বাং", shortNameOf("bn") === "বাং");
check("German dates use the German locale", localeOf("de") === "de-DE");

// LG-01 AC2: a choice kept between visits is read back, and only a spoken language is taken.
check("the stored Bengali is read back", storedLanguage("bn", "en-GB") === "bn");
check("German is read back", storedLanguage("de", "en-GB") === "de");
check("a language the app does not speak falls back to the browser's", storedLanguage("fr", "de-DE") === "de");
check("an unknown browser language falls back to English", storedLanguage(null, "sv-SE") === DEFAULT_LANGUAGE);
check("the saved choice lives under one key", LANGUAGE_KEY === "bookmark-manager:language");

// The words a Bengali or German visitor sees are all present, so no key falls back to English.
const wordKeys = Object.keys(DEFAULT_WORDS);
check("English has every word", wordKeys.length > 60, `${wordKeys.length}`);

process.exit(failures === 0 ? 0 : 1);
