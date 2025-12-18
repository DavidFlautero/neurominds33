export type ProjectStatus =
  | "created"
  | "snippet_issued"
  | "synced"
  | "context_ready"
  | "integrations_ready"
  | "plan_ready";

export function nextAllowed(status: ProjectStatus) {
  return {
    canScan: status === "created" || status === "snippet_issued",
    canOnboard: status === "synced" || status === "snippet_issued" || status === "created",
    canPlan: status === "context_ready" || status === "integrations_ready" || status === "plan_ready",
  };
}

export function ensureStatusOrder(current: string): ProjectStatus {
  const allowed: ProjectStatus[] = ["created","snippet_issued","synced","context_ready","integrations_ready","plan_ready"];
  return (allowed.includes(current as ProjectStatus) ? (current as ProjectStatus) : "created");
}
