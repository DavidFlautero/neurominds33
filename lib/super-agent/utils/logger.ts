type Level = "debug" | "info" | "warn" | "error";

function fmt(level: Level, msg: string, meta?: any) {
  const base = `[super-agent:${level}] ${msg}`;
  if (!meta) return base;
  try {
    return `${base} ${JSON.stringify(meta)}`;
  } catch {
    return base;
  }
}

export const logger = {
  debug: (msg: string, meta?: any) => console.log(fmt("debug", msg, meta)),
  info: (msg: string, meta?: any) => console.log(fmt("info", msg, meta)),
  warn: (msg: string, meta?: any) => console.warn(fmt("warn", msg, meta)),
  error: (msg: string, meta?: any) => console.error(fmt("error", msg, meta)),
};
