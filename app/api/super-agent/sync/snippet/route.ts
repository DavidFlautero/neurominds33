import { NextResponse } from "next/server";
import { upsertProject } from "@/ia/super-agent/state/projectState";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { projectId, siteUrl } = await req.json();

  upsertProject({
    projectId,
    siteUrl,
    status: "snippet_ready",
  });

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "";

  if (!baseUrl) {
    return NextResponse.json(
      { error: "Missing NEXT_PUBLIC_APP_URL env var" },
      { status: 500 }
    );
  }

  const endpoint = `${baseUrl}/api/super-agent/sync/event`;

  const snippet = `<script>
(function(){
  var pid = "${projectId}";
  function send(){
    try{
      fetch("${endpoint}", {
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
