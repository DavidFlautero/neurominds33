/**
 * In-memory store (MVP)
 * En producción: reemplazar por DB (Prisma/Supabase) o Redis/KV.
 */

import type { Approval, Quote, Recommendation, ScanArtifact, Task } from "@/ia/super-agent/types";

export const store = {
  competitorsByProject: new Map<string, { name: string; url: string }[]>(),
  lastScanByProject: new Map<string, ScanArtifact>(),
  recommendationsByProject: new Map<string, Recommendation[]>(),
  quotesByProject: new Map<string, Quote[]>(),
  tasksByProject: new Map<string, Task[]>(),
  approvalsByProject: new Map<string, Approval[]>(),
};

/** Helpers (evitan imports frágiles de Maps) */
export function getScan(projectId: string) {
  return store.lastScanByProject.get(projectId) ?? null;
}

export function setScan(projectId: string, scan: ScanArtifact) {
  store.lastScanByProject.set(projectId, scan);
}

export function getRecommendations(projectId: string) {
  return store.recommendationsByProject.get(projectId) ?? [];
}

export function setRecommendations(projectId: string, recs: Recommendation[]) {
  store.recommendationsByProject.set(projectId, recs);
}

export function getQuotes(projectId: string) {
  return store.quotesByProject.get(projectId) ?? [];
}

export function setQuotes(projectId: string, quotes: Quote[]) {
  store.quotesByProject.set(projectId, quotes);
}

export function getTasks(projectId: string) {
  return store.tasksByProject.get(projectId) ?? [];
}

export function setTasks(projectId: string, tasks: Task[]) {
  store.tasksByProject.set(projectId, tasks);
}

export function getApprovals(projectId: string) {
  return store.approvalsByProject.get(projectId) ?? [];
}

export function setApprovals(projectId: string, approvals: Approval[]) {
  store.approvalsByProject.set(projectId, approvals);
}

export function getCompetitors(projectId: string) {
  return store.competitorsByProject.get(projectId) ?? [];
}

export function setCompetitors(projectId: string, competitors: { name: string; url: string }[]) {
  store.competitorsByProject.set(projectId, competitors);
}
