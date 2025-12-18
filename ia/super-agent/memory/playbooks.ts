/**
 * Phase 2: store reusable patterns per vertical.
 * MVP: placeholder.
 */
export type Playbook = {
  vertical: string;
  patterns: string[];
};

export function defaultPlaybooks(): Playbook[] {
  return [
    { vertical: "general_ecommerce", patterns: ["CTA visible mobile", "Trust blocks near CTA", "Remarketing abandonment"] },
  ];
}
