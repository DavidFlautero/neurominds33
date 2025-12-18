import type { Page } from "playwright";

export async function extractDom(page: Page) {
  return page.evaluate(() => {
    const title = document.title;
    const h1 = document.querySelector("h1")?.textContent?.trim() ?? undefined;

    const ctas = Array.from(document.querySelectorAll("a,button"))
      .map((el) => ({
        text: (el.textContent || "").trim(),
        href: (el as HTMLAnchorElement).href || undefined,
      }))
      .filter((x) => x.text && x.text.length <= 80)
      .slice(0, 40);

    const forms = Array.from(document.querySelectorAll("form"))
      .map((f) => ({
        fields: Array.from(f.querySelectorAll("input,select,textarea"))
          .map((i) => (i.getAttribute("name") || i.getAttribute("id") || i.tagName).toString())
          .slice(0, 25),
      }))
      .slice(0, 10);

    const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute("content") ?? undefined;
    const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? undefined;

    return {
      title,
      h1,
      ctas,
      forms,
      meta: { description: metaDescription, canonical },
    };
  });
}
