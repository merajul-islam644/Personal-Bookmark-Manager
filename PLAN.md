# Plan 1 · First version (this run: T02)

**How to build it** (from `.studio/plan.md`)
What kind of thing this is: Records app. Pages behind the hosted sign-in page. Bookmarks, folders and tags are records that belong to the person who made them, and access rules on those records keep one person's records out of another's. Every label comes in English, Bengali and German, and the language switch changes all of them.
- No library beyond the starter's.
- Not a single page holding everything in the browser.
- Not filtering on screen to hide other people's records: the records decide.
- Prove by running: BM-01 AC2, BM-01 AC3 (two accounts separate), LS-01 AC1 (newest first), LG-01 AC2 (Bengali sticks, folder name unchanged), each with a `check_verified` line `by: ran`.

## Steps

### T01 Sign in and land on your own empty bookmarks screen (GT-01, LS-01)
- [x] Scaffold the starter app and keep the ported screens (`blocks-bootstrap`)
- [x] Brand: tokens, fonts, design kit, logo, title, favicon (`no skill`)
- [x] Define Bookmark and Folder schemas with per-person access (`blocks-data-gateway-configuration`)
- [x] Wire sign-in screen, hosted sign-in button and sign-out (`blocks-iam-account`)
- [x] Language switch and app words in English, Bengali, German (`blocks-localization-configuration`, `blocks-localization-implementation`)
- [x] Bookmarks screen: own list newest first, empty state, header (`blocks-data-gateway-crud`)
- [x] Check and build app

### T02 Make folders and add them to the save form (OR-01)
- [x] Show no-folders note and folder counts on the list (`blocks-data-gateway-crud`)
- [x] Save a folder, refusing a duplicate name with its message (`blocks-data-gateway-crud`)
- [x] Offer the person's folders in the Save a bookmark form (`blocks-data-gateway-crud`)
- [x] Check and build app

### Planned for later steps (not this run)
- T03 Save a bookmark from a pasted link with tags (BM-01, OR-02)
- T04 Read the list with folders and tags, and switch language (LS-01, LG-01)
