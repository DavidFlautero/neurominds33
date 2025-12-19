export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
export const runtime = "nodejs";

export default function SuperAgentLayout({ children }: { children: React.ReactNode }) {
  return <div style={{ padding: 20 }}>{children}</div>;
}
