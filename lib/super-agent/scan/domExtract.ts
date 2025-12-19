import { fetchWithTimeout } from "../utils/fetchWithTimeout";

function pickTagContent(html: string, tag: string) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const m = html.match(re);
  return m ? m[1].trim().replace(/\s+/g, " ").slice(0, 500) : undefined;
}

function pickMeta(html: string, name: string) {
  const re = new RegExp(`<meta[^>]+name=["']${name}["'][^>]*content=["']([^"']+)["'][^>]*>`, "i");
  const m = html.match(re);
  return m ? m[1].trim().slice(0, 500) : undefined;
}

function pickMetaProperty(html: string, prop: string) {
  const re = new RegExp(`<meta[^>]+property=["']${prop}["'][^>]*content=["']([^"']+)["'][^>]*>`, "i");
  const m = html.match(re);
  return m ? m[1].trim().slice(0, 500) : undefined;
}

function hasMetaViewport(html: string) {
  return /<meta[^>]+name=["']viewport["']/i.test(html);
}

function hasNoindex(html: string) {
  const robots = pickMeta(html, "robots") || "";
  return robots.toLowerCase().includes("noindex");
}

function pickCanonical(html: string) {
  const re = /<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i;
  const m = html.match(re);
  return m ? m[1].trim().slice(0, 500) : undefined;
}

function countTag(html: string, tag: string) {
  const re = new RegExp(`<${tag}(\\s|>)`, "gi");
  const m = html.match(re);
  return m ? m.length : 0;
}

function countLinks(html: string) {
  const re = /<a(\s|>)/gi;
  const m = html.match(re);
  return m ? m.length : 0;
}

function countImages(html: string) {
  const re = /<img(\s|>)/gi;
  const m = html.match(re);
  return m ? m.length : 0;
}

function countImgsMissingAlt(html: string) {
  const imgs = html.match(/<img[\s\S]*?>/gi) || [];
  let missing = 0;
  for (const img of imgs) {
    if (!/alt=["'][^"']*["']/i.test(img)) missing++;
  }
  return missing;
}

export async function fetchDom(siteUrl: string) {
  const started = Date.now();
  const res = await fetchWithTimeout(siteUrl, { method: "GET", headers: { "User-Agent": "Neuromind33ScanBot/1.0" } }, 15000);
  const timingMs = Date.now() - started;

  const fetchedUrl = res.url || siteUrl;
  const httpStatus = res.status;
  const html = await res.text();

  const title = pickTagContent(html, "title");
  const description = pickMeta(html, "description") || pickMetaProperty(html, "og:description");
  const canonical = pickCanonical(html);

  const h1Count = countTag(html, "h1");
  const viewport = hasMetaViewport(html);
  const hasRobotsNoindex = hasNoindex(html);
  const scripts = countTag(html, "script");
  const links = countLinks(html);
  const images = countImages(html);
  const imagesMissingAlt = countImgsMissingAlt(html);

  return {
    html,
    fetchedUrl,
    httpStatus,
    timingMs,
    meta: {
      title,
      description,
      canonical,
      h1Count,
      viewport,
      hasRobotsNoindex,
      scripts,
      links,
      images,
      imagesMissingAlt,
    },
  };
}
