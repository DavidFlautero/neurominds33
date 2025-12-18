import type { Preferences } from "../types";

/**
 * MVP: simple merge.
 * Later: persist per project, and update based on user rejections.
 */
export function mergePreferences(current: Preferences | undefined, patch: Partial<Preferences>) {
  return { ...(current || {}), ...patch };
}
