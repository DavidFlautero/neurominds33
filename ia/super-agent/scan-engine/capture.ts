import { chromium } from "playwright";
import { randomUUID } from "crypto";
import type { ProjectConfig, ScanArtifact } from "../types";
import { extractDom } from "./domExtract";
import { runHeuristics } from "./heuristics";
import { log } from "../utils/logger";

/**
 * MVP storage strategy:
 * - returns URLs like /scans/<id>/desktop.png
 * - you'll later implement real upload to S3/R2 and return signed/public URLs.
 */
export async function runScan(cfg: ProjectConfig): Promise<ScanArtifact> {
  const scanId = randomUUID();
  const createdAt = new Date().toISOString();

  log("info", "Starting scan", { scanId, url: cfg.siteUrl });

  const browser = await chromium.launch({ headless: true });

  // Desktop
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  await page.goto(cfg.siteUrl, { waitUntil: "networkidle", timeout: 120_000 });

  const desktopPng = await page.screenshot({ fullPage: true });
  void desktopPng; // TODO upload
  const desktopUrl = `/scans/${scanId}/desktop.png`;

  // Mobile
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobile.goto(cfg.siteUrl, { waitUntil: "networkidle", timeout: 120_000 });

  const mobilePng = await mobile.screenshot({ fullPage: true });
  void mobilePng; // TODO upload
  const mobileUrl = `/scans/${scanId}/mobile.png`;

  const dom = await extractDom(page);
  const heuristics = await runHeuristics({ dom });

  // MVP sections: improved later with real section detection
  const sections = [
    { key: "header", label: "Header", url: desktopUrl },
    { key: "hero", label: "Hero", url: desktopUrl },
    { key: "aboveFold", label: "Above the fold", url: desktopUrl },
  ];

  await browser.close();

  log("info", "Scan completed", { scanId });

  return {
    scanId,
    projectId: cfg.projectId,
    url: cfg.siteUrl,
    createdAt,
    screenshots: {
      desktopFull: desktopUrl,
      mobileFull: mobileUrl,
      sections,
    },
    dom,
    heuristics,
    metrics: {},
  };
}
