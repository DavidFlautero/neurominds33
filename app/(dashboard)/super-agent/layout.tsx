import "./styles.css";

export default function SuperAgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="sa-shell">
      {children}
    </div>
  );
}
