import { NextResponse } from "next/server";
import { upsertProject } from "@/ia/super-agent/state/projectState";

export async function POST(req: Request) {
  const { projectId, siteUrl } = await req.json();

  upsertProject({
    projectId,
    siteUrl,
    status: "snippet_ready",
  });

  const snippet = `<script>
(function(){
  const pid = "${projectId}";
  fetch("https://YOUR_DOMAIN/api/super-agent/sync/event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      projectId: pid,
      type: "page_view",
      url: location.href,
      ua: navigator.userAgent
    })
  });
})();
</script>`;

  return NextResponse.json({ snippet });
}
