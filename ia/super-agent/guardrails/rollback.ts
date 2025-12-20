export function rollbackForCategory(category: string): string[] {
  switch (category) {
    case "ADS_READY":
      return ["No changes executed (safe mode)."];
    case "CRO":
    case "LANDING":
      return ["Revert theme/code change (git revert / previous deploy).", "Restore previous hero/copy.", "Disable A/B experiment."];
    case "SEO":
      return ["Rollback meta/title changes.", "Restore previous sitemap/robots config."];
    case "TRACKING":
      return ["Disable new tag/trigger.", "Restore last known-good GTM container."];
    default:
      return ["Revert last change.", "Pause related experiments.", "Return to baseline configuration."];
  }
}
