// app/api/leads/route.ts
export async function POST(req: Request) {
  try {
    const data = await req.json();
    // TODO: acá después lo conectamos a Supabase / Drizzle / email
    console.log("Lead recibido:", data);
    return Response.json({ ok: true });
  } catch (e) {
    console.error(e);
    return new Response("Bad Request", { status: 400 });
  }
}
