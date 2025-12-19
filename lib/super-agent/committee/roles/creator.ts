import { callGemini } from "../geminiClient";
import { rolePrompt } from "../prompts";

export async function creator(scanJson: string) {
  const prompt = rolePrompt("creator", scanJson);
  return callGemini(prompt);
}
