export type LogLevel = "debug" | "info" | "warn" | "error";

export function log(level: LogLevel, message: string, meta?: Record<string, any>) {
  const ts = new Date().toISOString();
  const payload = meta ? ` ${safeStringify(meta)}` : "";
  // eslint-disable-next-line no-console
  console.log(`[${ts}] [${level.toUpperCase()}] ${message}${payload}`);
}

export function safeStringify(obj: any) {
  try {
    return JSON.stringify(obj);
  } catch {
    return "[unserializable]";
  }
}
