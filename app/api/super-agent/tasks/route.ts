import { NextResponse } from "next/server";
import { store } from "../_store";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const projectId = url.searchParams.get("projectId") || "local";
  const tasks = store.tasksByProject.get(projectId) ?? [];
  return NextResponse.json({ projectId, tasks });
}
