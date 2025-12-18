import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const projectId = String(body.projectId || "").trim();
    const context = body.context || {};

    if (!projectId) return NextResponse.json({ ok: false, error: "projectId required" }, { status: 400 });

    // Guardamos el contexto como JSON en el proyecto (simple y robusto).
    // Si en tu schema ya tenés otra tabla, lo cambiamos luego.
    const updated = await prisma.nmProject.update({
      where: { id: projectId },
      data: {
        status: "context_ready",
        // @ts-ignore
        contextJson: context, // si tu schema no tiene esto, ver nota abajo
      },
      select: { id: true, status: true },
    });

    return NextResponse.json({ ok: true, project: updated });
  } catch (e: any) {
    // Si tu NmProject aún NO tiene contextJson, devolvemos error claro para que lo migremos.
    const msg = e?.message || "error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
