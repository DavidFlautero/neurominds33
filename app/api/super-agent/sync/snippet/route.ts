import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const projectId = String(body.projectId || "").trim();
    const siteUrl = String(body.siteUrl || "").trim();

    if (!projectId) return NextResponse.json({ ok: false, error: "projectId required" }, { status: 400 });
    if (!siteUrl) return NextResponse.json({ ok: false, error: "siteUrl required" }, { status: 400 });

    const project = await prisma.nmProject.upsert({
      where: { id: projectId },
      create: { id: projectId, siteUrl, status: "snippet_issued" },
      update: { siteUrl, status: "snippet_issued" },
      select: { id: true },
    });

    const base = process.env.NEXT_PUBLIC_APP_URL || "";
    const endpoint = `${base.replace(/\/$/, "")}/api/super-agent/sync/event`;

    const snippet = `<script>
(function(){
  var pid = ${JSON.stringify(project.id)};
  function send(){
    try{
      fetch(${JSON.stringify(endpoint)}, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: pid,
          type: "page_view",
          url: location.href,
          ref: document.referrer || null,
          ua: navigator.userAgent
        })
      });
    }catch(e){}
  }
  if (document.readyState === "complete") send();
  else window.addEventListener("load", send);
})();
</script>`;

    return NextResponse.json({ snippet, endpoint });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "error" }, { status: 500 });
  }
}
