import { safeJsonParse } from "../utils/safeJson";

export async function callGemini(prompt: string) {
  const key = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-1.5-pro";

  if (!key) {
    return { ok: false, error: "GEMINI_API_KEY no configurada", text: "" };
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.6, maxOutputTokens: 900 },
      }),
    });

    const raw = await res.text();
    const json = safeJsonParse<any>(raw, null);

    if (!res.ok || !json) {
      return { ok: false, error: `Gemini error (${res.status})`, text: raw.slice(0, 500) };
    }

    const text =
      json?.candidates?.[0]?.content?.parts?.map((p: any) => p?.text).filter(Boolean).join("\n") || "";

    return { ok: true, error: null, text };
  } catch (e: any) {
    return { ok: false, error: e?.message || "Gemini fetch failed", text: "" };
  }
}
