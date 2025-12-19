export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!baseUrl) {
    return NextResponse.json(
      { error: "Missing NEXT_PUBLIC_APP_URL env var" },
      { status: 500 }
    );
  }

  const endpoint = `${baseUrl}/api/super-agent/sync/event`;

  const snippet = `(function () {
  var endpoint = ${JSON.stringify(endpoint)};
  function post(payload) {
    try {
      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true
      });
    } catch (e) {}
  }
  window.__N33_SUPER_AGENT_SYNC__ = { post: post, endpoint: endpoint };
})();`;

  return NextResponse.json({ snippet, endpoint });
}
