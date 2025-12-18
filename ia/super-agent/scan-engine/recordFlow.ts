import { chromium } from "playwright";
import type { ProjectConfig } from "../types";
import { log } from "../utils/logger";

/**
 * MVP: Recording is a stub that documents a flow.
 * Phase 2: enable video recording output and store it (Playwright supports video per context).
 */
export async function recordCriticalFlow(cfg: ProjectConfig) {
  log("info", "Recording critical flow (stub)", { url: cfg.siteUrl });

  // Basic smoke navigation, without storing video yet.
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });

  const steps = ["Home"];
  try {
    await page.goto(cfg.siteUrl, { waitUntil: "domcontentloaded", timeout: 120_000 });
    // Optional: click first product link if exists
    const firstLink = page.locator("a").first();
    const href = await firstLink.getAttribute("href");
    if (href) steps.push("First link");
  } catch (e: any) {
    log("warn", "Flow recording error (non-blocking)", { error: String(e?.message ?? e) });
  } finally {
    await browser.close();
  }

  return {
    url: cfg.siteUrl,
    steps,
  };
}
