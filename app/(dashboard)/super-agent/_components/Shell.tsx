import Link from "next/link";

export function Shell({
  title,
  subtitle,
  projectId,
  status,
  children,
}: {
  title: string;
  subtitle?: string;
  projectId?: string;
  status?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {projectId && <div>Project: {projectId}</div>}
      </div>
      {children}
    </div>
  );
}
