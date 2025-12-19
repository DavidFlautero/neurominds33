export async function fetchWithTimeout(
  url: string,
  init: RequestInit = {},
  timeoutMs = 12000
) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), timeoutMs);

  try {
    const res = await fetch(url, { ...init, signal: ctrl.signal, redirect: "follow" });
    return res;
  } finally {
    clearTimeout(id);
  }
}
