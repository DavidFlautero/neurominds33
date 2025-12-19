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
  return NextResponse.json({ snippet, endpoint });on" },t`;
> ^C

col@DESKTOP-HG5VNCH MINGW64 ~/desktop/neurominds/neuro1/neurominds33 (main)
$ # 1) Actualiza snippet route para usar NEXT_PUBLIC_APP_URL
cat > app/api/super-agent/sync/snippet/route.ts <<'EOF'
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
echo "OK: snippet uses NEXT_PUBLIC_APP_URL + CORS enabled for sync/event"); });
OK: snippet uses NEXT_PUBLIC_APP_URL + CORS enabled for sync/event

col@DESKTOP-HG5VNCH MINGW64 ~/desktop/neurominds/neuro1/neurominds33 (main)
$ cat > app/api/super-agent/sync/event/route.ts <<'EOF'
im# 2) Habilita CORS en event route (para Tiendanube / cualquier dominio permitdo# 1) Actualiza snippet route para usar NEXT_PUBLIC_APP_URL
  # 1) Actualiza snippet route para usar NEXT_PUBLIC_APP_URL


col@DESKTOP-HG5VNCH MINGW64 ~/desktop/neurominds/neuro1/neurominds33 (main)
$ # 1) Actualiza snippet route para usar NEXT_PUBLIC_APP_URL
cat > app/api/super-agent/sync/snippet/route.ts <<'EOF'
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
    return NextResponse.json(PP_URL?.replace(/\/$/, "") || "";tate";lowlist.e";
> ^C

col@DESKTOP-HG5VNCH MINGW64 ~/desktop/neurominds/neuro1/neurominds33 (main)
$ # 1) Actualiza snippet route para usar NEXT_PUBLIC_APP_URL
cat > app/api/super-agent/sync/snippet/route.ts <<'EOF'
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
echo "OK: snippet uses NEXT_PUBLIC_APP_URL + CORS enabled for sync/event"); });
OK: snippet uses NEXT_PUBLIC_APP_URL + CORS enabled for sync/event

col@DESKTOP-HG5VNCH MINGW64 ~/desktop/neurominds/neuro1/neurominds33 (main)
$ cat > app/api/super-agent/sync/event/route.ts <<'EOF'
im# 2) Habilita CORS en event route (para Tiendanube / cualquier dominio permitdo# 1) Actualiza snippet route para usar NEXT_PUBLIC_APP_URL
  cat > app/api/super-agent/sync/event/route.ts <<'EOF'
im# 2) Habilita CORS en event route (para Tiendanube / cualquier dominio permitdo# 1) Actualiza snippet route para usar NEXT_PUBLIC_APP_URL
  cat > app/api/super-agent/sync/event/route.ts <<'EOF'
im# 2) Habilita CORS en event route (para Tiendanube / cualquier dominio permitdo# 1) Actualiza snippet route para usar NEXT_PUBLIC_APP_URL
  # 1) Actualiza snippet route para usar NEXT_PUBLIC_APP_URL
  git add .

col@DESKTOP-HG5VNCH MINGW64 ~/desktop/neurominds/neuro1/neurominds33 (main)
$ cat > app/api/super-agent/sync/event/route.ts <<'EOF'
im# 2) Habilita CORS en event route (para Tiendanube / cualquier dominio permitdo# 1) Actualiza snippet route para usar NEXT_PUBLIC_APP_URL
  cat > app/api/super-agent/sync/event/route.ts <<'EOF'
im# 2) Habilita CORS en event route (para Tiendanube / cualquier dominio permitdo# 1) Actualiza snippet route para usar NEXT_PUBLIC_APP_URL
  cat > app/api/super-agent/sync/event/route.ts <<'EOF'
im# 2) Habilita CORS en event route (para Tiendanube / cualquier dominio permitdo# 1) Actualiza snippet route para usar NEXT_PUBLIC_APP_URL
  # 1) Actualiza snippet route para usar NEXT_PUBLIC_APP_URL
  git commit -m "fix: REWRITE auth route - BREAK CACHE - GREEN BUILD"
[main 6b0d511] fix: REWRITE auth route - BREAK CACHE - GREEN BUILD
 2 files changed, 67 insertions(+), 16 deletions(-)

col@DESKTOP-HG5VNCH MINGW64 ~/desktop/neurominds/neuro1/neurominds33 (main)
$ git push
Enumerating objects: 19, done.
Counting objects: 100% (19/19), done.
Delta compression using up to 8 threads
Compressing objects: 100% (8/8), done.
Writing objects: 100% (10/10), 1.87 KiB | 272.00 KiB/s, done.
Total 10 (delta 4), reused 0 (delta 0), pack-reused 0 (from 0)
remote: Resolving deltas: 100% (4/4), completed with 4 local objects.
To https://github.com/DavidFlautero/neurominds33/
   abed88b..6b0d511  main -> main

col@DESKTOP-HG5VNCH MINGW64 ~/desktop/neurominds/neuro1/neurominds33 (main)
$ fetch("https://neuromid33.online/api/super-agent/sync/event", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    projectId: "demo-project",
    type: "page_view",
    url: location.href
  })
}).then(r => r.json()).then(console.log).catch(console.error);
bash: syntax error near unexpected token `"https://neuromid33.online/api/super-gent/sync/event",'
bash: method:: command not found
bash: headers:: command not found
bash: syntax error near unexpected token `('
bash: projectId:: command not found
bash: type:: command not found
bash: url:: command not found
bash: syntax error near unexpected token `}'
bash: syntax error near unexpected token `}'

col@DESKTOP-HG5VNCH MINGW64 ~/desktop/neurominds/neuro1/neurominds33 (main)
$ ^C

col@DESKTOP-HG5VNCH MINGW64 ~/desktop/neurominds/neuro1/neurominds33 (main)
$ fetch("https://neuromid33.online/api/super-agent/sync/event", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    projectId: "demo-project",
    type: "page_view",
    url: location.href
  })
}).then(r => r.json()).then(console.log).catch(console.error);
bash: syntax error near unexpected token `"https://neuromid33.online/api/super-gent/sync/event",'
bash: method:: command not found
bash: headers:: command not found
bash: syntax error near unexpected token `('
bash: projectId:: command not found
bash: type:: command not found
bash: url:: command not found
bash: syntax error near unexpected token `}'
bash: syntax error near unexpected token `}'

col@DESKTOP-HG5VNCH MINGW64 ~/desktop/neurominds/neuro1/neurominds33 (main)
$ curl -sS -X POST "https://neuromid33.online/api/super-agent/sync/event" \
  -H "Content-Type: application/json" \
  -d '{"projectId":"demo-project","type":"page_view","url":"https://test"}'
curl: (6) Could not resolve host: neuromid33.online

col@DESKTOP-HG5VNCH MINGW64 ~/desktop/neurominds/neuro1/neurominds33 (main)
$ ^C

col@DESKTOP-HG5VNCH MINGW64 ~/desktop/neurominds/neuro1/neurominds33 (main)
$ curl -sS -X POST "https://neuromind33.online/api/super-agent/sync/event" \
  -H "Content-Type: application/json" \
  -d '{"projectId":"demo-project","type":"page_view","url":"https://test"}'
Redirecting...

col@DESKTOP-HG5VNCH MINGW64 ~/desktop/neurominds/neuro1/neurominds33 (main)
$ ^C

col@DESKTOP-HG5VNCH MINGW64 ~/desktop/neurominds/neuro1/neurominds33 (main)
$
col@DESKTOP-HG5VNCH MINGW64 ~/desktop/neurominds/neuro1/neurominds33 (main)
$ curl -sS -X POST "https://neuromind33.online/api/super-agent/sync/event" \
  -H "Content-Type: application/json" \
  -d '{"projectId":"demo-project","type":"page_view","url":"https://test"}'
Redirecting...

bash: syntax error near unexpected token `('
bash: $: command not found
bash: Redirecting...: command not found

col@DESKTOP-HG5VNCH MINGW64 ~/desktop/neurominds/neuro1/neurominds33 (main)
$
col@DESKTOP-HG5VNCH MINGW64 ~/desktop/neurominds/neuro1/neurominds33 (main)
$ curl -sS -X POST "https://neuromind33.online/api/super-agent/sync/event" \
  -H "Content-Type: application/json" \
  -d '{"projectId":"demo-project","type":"page_v^Cw","url":"https://test"}'
Redirecting...



col@DESKTOP-HG5VNCH MINGW64 ~/desktop/neurominds/neuro1/neurominds33 (main)
$ curl -sS "https://neuromind33.online/api/super-agent/sync/status?projectId=deo-project"
Redirecting...

col@DESKTOP-HG5VNCH MINGW64 ~/desktop/neurominds/neuro1/neurominds33 (main)
$ curl -L -sS -X POST "https://neuromind33.online/api/super-agent/sync/event" \
  -H "Content-Type: application/json" \
  -d '{"projectId":"demo-project","type":"page_view","url":"https://test"}'
{"ok":false,"error":"project not found"}
col@DESKTOP-HG5VNCH MINGW64 ~/desktop/neurominds/neuro1/neurominds33 (main)
$ npx prisma -v
Need to install the following packages:
prisma@7.2.0
Ok to proceed? (y) y

prisma               : 7.2.0
@prisma/client       : Not found
Operating System     : win32
Architecture         : x64
Node.js              : v22.14.0
TypeScript           : unknown
Query Compiler       : enabled
PSL                  : @prisma/prisma-schema-wasm 7.2.0-4.0c8ef2ce45c83248ab3df
73180d5eda9e8be7a3
Schema Engine        : schema-engine-cli 0c8ef2ce45c83248ab3df073180d5eda9e8be7
3 (at ..\..\..\..\AppData\Local\npm-cache\_npx\2778af9cee32ff87\node_modules\@p
isma\engines\schema-engine-windows.exe)
Default Engines Hash : 0c8ef2ce45c83248ab3df073180d5eda9e8be7a3
Studio               : 0.9.0

col@DESKTOP-HG5VNCH MINGW64 ~/desktop/neurominds/neuro1/neurominds33 (main)
$ mkdir -p prisma

cat >> prisma/schema.prisma <<'EOF'

/// --- Super Agent (Sync + Context) ---

model NmProject {
  id          String   @id
  siteUrl     String   @map("site_url")
  status      String   @default("created")
  lastEventAt DateTime? @map("last_event_at")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  events      NmSyncEvent[]
  context     NmProjectContext?

  @@map("nm_projects")
}

model NmSyncEvent {
  id        BigInt   @id @default(autoincrement())
  projectId String   @map("project_id")
  type      String
EOF@map("nm_project_context")on(fields: [projectId], references: [id], onDelete

col@DESKTOP-HG5VNCH MINGW64 ~/desktop/neurominds/neuro1/neurominds33 (main)
$ npx prisma migrate dev --name super_agent_sync
Prisma schema loaded from prisma\schema.prisma.
Error: The datasource.url property is required in your Prisma config file when
sing prisma migrate dev.

col@DESKTOP-HG5VNCH MINGW64 ~/desktop/neurominds/neuro1/neurominds33 (main)
$ npx prisma migrate dev --name super_agent_sync
Prisma schema loaded from prisma\schema.prisma.
Error: The datasource.url property is required in your Prisma config file when
sing prisma migrate dev.

col@DESKTOP-HG5VNCH MINGW64 ~/desktop/neurominds/neuro1/neurominds33 (main)
$ .cat > .env <<'EOF'
DATABASE_URL="postgresql://postgres:gHElMR3Ym6y3EAXM@db.bqkanqvqryirddipabjr.suabase.co:5432/postgres?sslmode=require"
