import { callGemini } from "../geminiClient";
import { rolePrompt } from "../prompts";

export async function optimizer(scanJson: string) {
  const prompt = rolePrompt("optimizer", scanJson);
  return callGemini(prompt);
}
