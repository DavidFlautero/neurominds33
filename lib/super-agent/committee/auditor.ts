import { callGemini } from "./geminiClient";
import { auditorPrompt } from "./prompts";

export async function auditor(debateJson: string) {
  const prompt = auditorPrompt(debateJson);
  return callGemini(prompt);
}
