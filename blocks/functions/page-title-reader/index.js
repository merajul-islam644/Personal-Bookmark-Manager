/**
 * Reads a pasted page and answers its title and site name, so the save form
 * arrives already filled in. Runs on the platform, never in the browser.
 */
export default async function handler(input, ctx) {
  const link = readLink(input);
  if (!link) return { statusCode: 400, body: { error: "A link is needed.", title: "", siteName: "" } };

  const domain = siteNameOf(link);
  let title = "";
  try {
    const answer = await fetch(link, {
      headers: { accept: "text/html,application/xhtml+xml", "user-agent": "BookmarkReader/1.0" },
      redirect: "follow",
      signal: AbortSignal.timeout(10000)
    });
    if (answer.ok) {
      const type = answer.headers.get("content-type") ?? "";
      if (type.includes("html") || type === "") {
        const html = (await answer.text()).slice(0, 200000);
        title = titleFrom(html);
      }
    }
  } catch (error) {
    ctx.log.warn("page could not be read", { message: String(error?.message ?? error) });
  }

  return { statusCode: 200, body: { read: Boolean(title), siteName: domain, title } };
}

function readLink(input) {
  const fromBody = typeof input?.body?.link === "string" ? input.body.link : "";
  const fromBodyText = typeof input?.body === "string" ? input.body : "";
  const fromQuery = typeof input?.query?.link === "string" ? input.query.link : "";
  const candidate = (fromBody || fromQuery || fromBodyText).trim();
  return /^https?:\/\//i.test(candidate) ? candidate : "";
}

function siteNameOf(link) {
  try {
    return new URL(link).hostname.replace(/^www\./i, "");
  } catch {
    return "";
  }
}

function titleFrom(html) {
  const clean = (value) =>
    value
      .replace(/<[^>]*>/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, " ")
      .trim();

  const ogTitle = html.match(/<meta[^>]+property=["']og:title["'][^>]*>/i);
  const ogContent = ogTitle?.[0].match(/content=["']([^"']+)["']/i);
  if (ogContent) return clean(ogContent[1]).slice(0, 200);

  const titleTag = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (titleTag) return clean(titleTag[1]).slice(0, 200);

  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  return h1 ? clean(h1[1]).slice(0, 200) : "";
}
