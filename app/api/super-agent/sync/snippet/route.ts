import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const projectId = String(body.projectId || "").trim();
  const siteUrl = String(body.siteUrl || "").trim();

  if (!projectId) return NextResponse.json({ ok: false, error: "projectId requerido" }, { status: 400 });
  if (!/^https?:\/\//i.test(siteUrl)) return NextResponse.json({ ok: false, error: "siteUrl inválida" }, { status: 400 });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const endpoint = `${appUrl.replace(/\/$/, "")}/api/super-agent/sync/event`;

  const snippet = `<script>
(function(){
  var pid = ${JSON.stringify(projectId)};
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
}
