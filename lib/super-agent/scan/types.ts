export type Priority = "P0" | "P1" | "P2";
export type FindingType = "SEO" | "CRO" | "UX" | "ADS" | "TECH";

export type ScanFinding = {
  id: string;
  type: FindingType;
  priority: Priority;
  title: string;
  advantage: string;
  risk: string;
  expectedResult: string;
  action: string;
  evidence?: string[];
};

export type AdsReadiness = {
  verdict: "APTO" | "NO_APTO" | "RIESGO";
  reasons: string[];
  score: number; // 0-100
};

export type ScanResult = {
  ok: boolean;
  projectId?: string;
  siteUrl: string;
  fetchedUrl?: string;
  httpStatus?: number;
  timingMs: number;
  meta: {
    title?: string;
    description?: string;
    canonical?: string;
    h1Count: number;
    viewport: boolean;
    hasRobotsNoindex: boolean;
    scripts: number;
    links: number;
    images: number;
    imagesMissingAlt: number;
  };
  scores: {
    seo: number;
    cro: number;
    ux: number;
    tech: number;
    overall: number;
  };
  adsReadiness: AdsReadiness;
  findings: ScanFinding[];
  createdAt: number;
  warnings?: string[];
};
