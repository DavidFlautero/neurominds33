import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// MVP: status en memoria por proyecto (para no depender DB).
// En tu repo ya tenías NmProject; si está conectado, lo reemplazamos por Prisma.
// Por ahora: si se consulta, devolvemos "created".
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");

  if (!projectId) return NextResponse.json({ ok: false, error: "projectId requerido" }, { status: 400 });

  // Si tu implementación real ya existe, reemplazá este stub por Prisma.
  return NextResponse.json({ status: "created", lastEventAt: null });
}
