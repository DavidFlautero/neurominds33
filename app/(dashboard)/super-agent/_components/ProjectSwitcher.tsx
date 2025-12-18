"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Project = {
  id: string;
  siteUrl: string;
  status: string;
  lastEventAt: number | null;
};

export default function ProjectSwitcher() {
  const [projects, setProjects] = useState<Project[]>([]);
  const router = useRouter();
  const sp = useSearchParams();
  const current = sp.get("projectId") || "";

  useEffect(() => {
    fetch("/api/super-agent/projects")
      .then(r => r.json())
      .then(d => setProjects(d.projects || []))
      .catch(() => setProjects([]));
  }, []);

  const selected = useMemo(() => {
    return projects.find(p => p.id === current) || projects[0];
  }, [projects, current]);

  useEffect(() => {
    if (!current && selected?.id) {
      router.replace(`/super-agent?projectId=${encodeURIComponent(selected.id)}`);
    }
  }, [current, selected, router]);

  if (!projects.length) {
    return (
      <div className="text-sm text-muted-foreground">Cargando proyectos…</div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Proyecto</span>
      <select
        className="border rounded-md px-2 py-1 text-sm bg-white"
        value={selected?.id || ""}
        onChange={(e) => router.push(`/super-agent?projectId=${encodeURIComponent(e.target.value)}`)}
      >
        {projects.map(p => (
          <option key={p.id} value={p.id}>
            {p.id} — {p.siteUrl}
          </option>
        ))}
      </select>
    </div>
  );
}
