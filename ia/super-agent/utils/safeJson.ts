export function safeJsonParse(input: string): any | null {
  if (!input || typeof input !== "string") return null;
  try {
    return JSON.parse(input);
  } catch {
    return null;
  }
}

/**
 * Extract first JSON array or object from a string (useful if an LLM returns extra text).
 */
export function extractJson(input: string): any | null {
  if (!input) return null;
  const firstObj = input.indexOf("{");
  const firstArr = input.indexOf("[");
  const start = firstObj === -1 ? firstArr : firstArr === -1 ? firstObj : Math.min(firstObj, firstArr);
  if (start === -1) return null;

  const chunk = input.slice(start).trim();
  // Try parse as-is
  const parsed = safeJsonParse(chunk);
  if (parsed) return parsed;

  // Best-effort trim to last closing brace/bracket
  const lastBrace = Math.max(chunk.lastIndexOf("}"), chunk.lastIndexOf("]"));
  if (lastBrace === -1) return null;
  return safeJsonParse(chunk.slice(0, lastBrace + 1));
}
