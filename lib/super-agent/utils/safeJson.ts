export function safeJsonParse<T = any>(input: string, fallback: T): T {
  try {
    return JSON.parse(input) as T;
  } catch {
    return fallback;
  }
}

export function safeJsonStringify(input: any, fallback = "{}"): string {
  try {
    return JSON.stringify(input);
  } catch {
    return fallback;
  }
}
