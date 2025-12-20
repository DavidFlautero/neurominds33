export type SAStore = {
  projects: Record<string, { id: string; name?: string; siteUrl?: string; createdAt: number }>;
  context: Record<string, any>;
  scans: Record<string, any>;
  plans: Record<string, any>;
  logs: Record<string, any[]>;
};

declare global {
  // eslint-disable-next-line no-var
  var __SA_STORE__: SAStore | undefined;
}

function initStore(): SAStore {
  return {
    projects: {},
    context: {},
    scans: {},
    plans: {},
    logs: {},
  };
}

export function getStore(): SAStore {
  if (!globalThis.__SA_STORE__) globalThis.__SA_STORE__ = initStore();
  return globalThis.__SA_STORE__;
}

export function logEvent(projectId: string, entry: any) {
  const store = getStore();
  if (!store.logs[projectId]) store.logs[projectId] = [];
  store.logs[projectId].unshift({
    ts: Date.now(),
    ...entry,
  });
  // cap logs
  store.logs[projectId] = store.logs[projectId].slice(0, 200);
}

export function upsertProject(project: { id: string; name?: string; siteUrl?: string }) {
  const store = getStore();
  const prev = store.projects[project.id];
  store.projects[project.id] = {
    id: project.id,
    name: project.name ?? prev?.name,
    siteUrl: project.siteUrl ?? prev?.siteUrl,
    createdAt: prev?.createdAt ?? Date.now(),
  };
  return store.projects[project.id];
}

export function setContext(projectId: string, ctx: any) {
  const store = getStore();
  store.context[projectId] = ctx;
}

export function setScan(projectId: string, scan: any) {
  const store = getStore();
  store.scans[projectId] = scan;
}

export function setPlan(projectId: string, plan: any) {
  const store = getStore();
  store.plans[projectId] = plan;
}

export function getProject(projectId: string) {
  return getStore().projects[projectId] ?? null;
}

export function getContext(projectId: string) {
  return getStore().context[projectId] ?? null;
}

export function getScan(projectId: string) {
  return getStore().scans[projectId] ?? null;
}

export function getPlan(projectId: string) {
  return getStore().plans[projectId] ?? null;
}

export function getLogs(projectId: string) {
  return getStore().logs[projectId] ?? [];
}
