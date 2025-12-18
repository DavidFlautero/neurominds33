export type ProjectStatus =
  | "created"
  | "snippet_ready"
  | "syncing"
  | "synced"
  | "context_done"
  | "baseline_done";

export interface ProjectState {
  projectId: string;
  siteUrl: string;
  status: ProjectStatus;
  lastEventAt?: number;
  context?: Record<string, any>;
}

const g = globalThis as any;

if (!g.__NM_PROJECTS__) {
  g.__NM_PROJECTS__ = new Map<string, ProjectState>();
}

export function getProject(projectId: string): ProjectState | null {
  return g.__NM_PROJECTS__.get(projectId) ?? null;
}

export function upsertProject(project: ProjectState) {
  g.__NM_PROJECTS__.set(project.projectId, project);
}

export function updateStatus(projectId: string, status: ProjectStatus) {
  const p = getProject(projectId);
  if (!p) return;
  p.status = status;
  upsertProject(p);
}
