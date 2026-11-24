import { createFolderRecord, folderNameTaken } from "../src/features/bookmarks/folderApi.ts"
import type { Folder } from "../src/features/bookmarks/bookmarkTypes.ts";

type Sent = { name?: string; createdOn?: string };

function fakeClient(answer: { errors?: unknown; acknowledged?: boolean; data?: { itemId?: string } | null }) {
  const sent: Sent[] = [];
  const client = {
    data: {
      collection: () => ({
        create: async (payload: Sent) => {
          sent.push(payload);
          return answer;
        }
      })
    }
  };
  return { client, sent };
}

let failures = 0;
function check(label: string, condition: boolean) {
  console.log(`${condition ? "PASS" : "FAIL"} ${label}`);
  if (!condition) failures += 1;
}

const folders: Folder[] = [
  { itemId: "f1", name: "Reading" },
  { itemId: "f2", name: "Work" }
];

check("Reading is taken once a folder has it", folderNameTaken(folders, "Reading"));
check("reading in another case is taken too", folderNameTaken(folders, "reading"));
check("Recipes is free", folderNameTaken(folders, "Recipes") === false);

const ok = fakeClient({ acknowledged: true, data: { itemId: "new-1" } });
const created = await createFolderRecord(ok.client as never, "Recipes");
check("a free name is saved", created.ok && ok.sent[0]?.name === "Recipes");
check("its made-on is a full date and time", Boolean(ok.sent[0]?.createdOn && !Number.isNaN(Date.parse(ok.sent[0].createdOn!))));

const refused = fakeClient({ acknowledged: true, data: null, errors: [{ message: "refused" }] });
check("a 200 that carries errors is not a saved folder", (await createFolderRecord(refused.client as never, "Recipes")).ok === false);

const notAcknowledged = fakeClient({ acknowledged: false, data: { itemId: "x" } });
check("a refusal answer is not a saved folder", (await createFolderRecord(notAcknowledged.client as never, "Recipes")).ok === false);

process.exit(failures === 0 ? 0 : 1);
