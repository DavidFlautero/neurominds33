import { callGemini } from "../geminiClient";
import { rolePrompt } from "../prompts";

export async function analyst(scanJson: string) {
  const prompt = rolePrompt("analyst", scanJson);
  return callGemini(prompt);
}
