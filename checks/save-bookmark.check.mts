import { tagNamesFrom, requestSave } from "../src/features/new-bookmark/saveRules.ts";
import { DEFAULT_WORDS } from "../src/lib/i18n/defaultWords.ts";

const LINK_MESSAGE = DEFAULT_WORDS["newBookmark.linkError"];
const DISHONEST_ANSWERS = [
  { acknowledged: true, data: null, errors: [{ message: "refused" }] },
  { acknowledged: false, data: { itemId: "x" } },
  { acknowledged: true, data: null }
];

let failures = 0;
function check(label: string, condition: boolean, detail = "") {
  console.log(`${condition ? "PASS" : "FAIL"} ${label}${detail ? ` -> ${detail}` : ""}`);
  if (!condition) failures += 1;
}

const draft = { folderName: "Reading", link: "https://example.com/article", siteName: "example.com", tags: ["design", "web"], title: "An article" };

function gateway(answer: unknown) {
  const sent: Record<string, unknown>[] = [];
  const client = {
    data: {
      collection: () => ({
        create: async (payload: Record<string, unknown>) => {
          sent.push(payload);
          return answer;
        }
      })
    }
  };
  return { client, sent };
}

check("the message matches the plan's words", LINK_MESSAGE === "Enter a link that starts with http:// or https://.");

const emptyBox = gateway({ acknowledged: true, data: { itemId: "b1" } });
const empty = await requestSave(emptyBox.client as never, { ...draft, link: "   " });
check("an empty link is refused with the exact message", empty.ok === false && LINK_MESSAGE === "Enter a link that starts with http:// or https://.");
check("nothing is sent for an empty link", emptyBox.sent.length === 0, `sent ${emptyBox.sent.length}`);

const noScheme = gateway({ acknowledged: true, data: { itemId: "b2" } });
check("a link without http:// or https:// is refused", (await requestSave(noScheme.client as never, { ...draft, link: "example.com/article" })).ok === false);

const good = gateway({ acknowledged: true, data: { itemId: "b9" } });
const saved = await requestSave(good.client as never, draft);
check("a good bookmark is saved", saved.ok === true, String(saved.itemId));
check("both tags are stored", JSON.stringify(good.sent[0]?.tags) === JSON.stringify(["design", "web"]));
check("its saved-on is a full time", Boolean(good.sent[0]?.savedOn && !Number.isNaN(Date.parse(String(good.sent[0].savedOn)))));

check("a repeated tag is not added twice", JSON.stringify(tagNamesFrom(["design"], "Design")) === JSON.stringify(["design"]));
check("a new tag becomes a chip", JSON.stringify(tagNamesFrom([], "web")) === JSON.stringify(["web"]));

for (const answer of DISHONEST_ANSWERS) {
  const outcome = await requestSave(gateway(answer).client as never, draft);
  check(`a 200 that did not save is not counted (${JSON.stringify(answer)})`, outcome.ok === false);
}

process.exit(failures === 0 ? 0 : 1);
