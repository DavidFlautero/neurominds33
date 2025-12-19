import { safeJsonParse } from "../utils/safeJson";

export function normalizeJson(text: string) {
  // Intento best-effort de sacar JSON válido si Gemini mete texto extra
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first >= 0 && last > first) {
    const slice = text.slice(first, last + 1);
    return safeJsonParse<any>(slice, null);
  }
  return null;
}
