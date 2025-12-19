export function normalizeUrl(input: string) {
  const raw = input.trim();
  if (!raw) return "";
  try {
    const hasScheme = raw.startsWith("http://") || raw.startsWith("https://");
    const u = new URL(hasScheme ? raw : `https://${raw}`);
    return u.toString().replace(/\/$/, "");
  } catch {
    return "";
  }
}
