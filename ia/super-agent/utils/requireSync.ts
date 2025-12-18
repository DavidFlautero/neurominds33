export function requireSync(status: string) {
  return status === "synced" || status === "context_done" || status === "baseline_done";
}
