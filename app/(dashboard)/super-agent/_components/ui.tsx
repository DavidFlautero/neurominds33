export function Card({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      {title ? <div className="font-semibold mb-2">{title}</div> : null}
      {children}
    </div>
  );
}

export function Pill({ label, tone }: { label: string; tone: "green" | "yellow" | "red" | "gray" }) {
  const cls =
    tone === "green" ? "bg-green-50 text-green-700 border-green-200"
    : tone === "yellow" ? "bg-yellow-50 text-yellow-800 border-yellow-200"
    : tone === "red" ? "bg-red-50 text-red-700 border-red-200"
    : "bg-gray-50 text-gray-700 border-gray-200";

  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${cls}`}>
      {label}
    </span>
  );
}
