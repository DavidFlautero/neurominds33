export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Importante: NO hagas throws por env faltante en top-level.
    // Validá acá adentro.
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? null;

    // Si tu lógica real depende de DB/keys, hacelo acá adentro
    // y devolvé 500 en vez de throw.
    // Ejemplo placeholder:
    return NextResponse.json({
      ok: true,
      appUrl,
      context: {},
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "context endpoint failed" },
      { status: 500 }
    );
  }
}
