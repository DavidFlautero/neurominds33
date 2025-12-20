import { appendJSONL, readJSONL } from "./storage/jsonlStore";

export type Project = {
  id: string;
  name: string;
  siteUrl: string;
  status: "created" | "synced" | "ready";
  createdAt: number;
  updatedAt: number;
  lastEventAt?: number | null;
};

const FILE = "projects.jsonl";

function normUrl(url: string) {
  try {
    const u = new URL(url);
    return u.origin;
  } catch {
    return url.trim();
  }
}

export async function listProjects(): Promise<Project[]> {
  const rows = await readJSONL(FILE, 2000);
  // latest wins by id
  const map = new Map<string, Project>();
  for (const r of rows) map.set(r.id, r as Project);
  return Array.from(map.values()).sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function getProject(id: string): Promise<Project | null> {
  const all = await listProjects();
  return all.find((p) => p.id === id) ?? null;
}

export async function upsertProject(input: Partial<Project> & { id: string }): Promise<Project> {
  const existing = await getProject(input.id);
  const now = Date.now();
  const p: Project = {
    id: input.id,
    name: input.name ?? existing?.name ?? input.id,
    siteUrl: normUrl(input.siteUrl ?? existing?.siteUrl ?? ""),
    status: (input.status ?? existing?.status ?? "created") as Project["status"],
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    lastEventAt: input.lastEventAt ?? existing?.lastEventAt ?? null,
  };
  await appendJSONL(FILE, p);
  return p;
}

export async function setProjectEvent(id: string, lastEventAt: number) {
  const existing = await getProject(id);
  if (!existing) return null;
  return upsertProject({ id, lastEventAt, status: "synced" });
}
