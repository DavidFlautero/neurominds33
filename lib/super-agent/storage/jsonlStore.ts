import { promises as fs } from "fs";
import path from "path";

type Json = Record<string, any>;

const mem = new Map<string, Json[]>();

function isVercel() {
  return !!process.env.VERCEL;
}

function baseDir() {
  // Local: persistente en repo
  // Vercel: FS es efímero; igual funciona para la request, pero no persistirá entre invocaciones.
  return path.join(process.cwd(), "data", "super-agent");
}

async function ensureDir() {
  const dir = baseDir();
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch {
    // ignore
  }
  return dir;
}

export async function appendJSONL(file: string, row: Json) {
  const key = file;
  if (isVercel()) {
    const arr = mem.get(key) ?? [];
    arr.push(row);
    mem.set(key, arr);
    return { persisted: false, mode: "memory" as const };
  }

  const dir = await ensureDir();
  const full = path.join(dir, file);
  const line = JSON.stringify(row) + "\n";
  await fs.appendFile(full, line, "utf8");
  return { persisted: true, mode: "file" as const, path: full };
}

export async function readJSONL(file: string, limit = 500): Promise<Json[]> {
  const key = file;
  if (isVercel()) {
    const arr = mem.get(key) ?? [];
    return arr.slice(-limit);
  }

  const dir = await ensureDir();
  const full = path.join(dir, file);
  try {
    const raw = await fs.readFile(full, "utf8");
    const lines = raw.split("\n").filter(Boolean);
    const parsed = lines.slice(-limit).map((l) => {
      try { return JSON.parse(l); } catch { return null; }
    }).filter(Boolean) as Json[];
    return parsed;
  } catch {
    return [];
  }
}
