export type ProjectStatus = "created" | "synced" | "paused";

export type NmProjectDTO = {
  id: string;
  siteUrl: string;
  status: ProjectStatus;
  lastEventAt: number | null;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateProjectInput = {
  id: string;
  siteUrl: string;
};

export type SnippetRequest = {
  projectId: string;
  siteUrl: string;
};

export type SnippetResponse = {
  snippet: string;
  endpoint: string;
};
