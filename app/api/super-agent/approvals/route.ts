export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

import { NextResponse } from "next/server";
import { z } from "zod";
import { store } from "../_store";

const PatchSchema = z.object({
  projectId: z.string().min(1),
  approvalId: z.string().min(1),
  action: z.enum(["APPROVE", "REJECT"]),
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const projectId = url.searchParams.get("projectId") || "local";
  const approvals = store.approvalsByProject.get(projectId) ?? [];
  return NextResponse.json({ projectId, approvals });
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const { projectId, approvalId, action } = PatchSchema.parse(body);

  const approvals = store.approvalsByProject.get(projectId) ?? [];
  const idx = approvals.findIndex(a => a.id === approvalId);
  if (idx === -1) return NextResponse.json({ error: "Approval not found." }, { status: 404 });

  approvals[idx] = { ...approvals[idx], status: action === "APPROVE" ? "approved" : "rejected" };
  store.approvalsByProject.set(projectId, approvals);

  return NextResponse.json({ approval: approvals[idx] });
}
