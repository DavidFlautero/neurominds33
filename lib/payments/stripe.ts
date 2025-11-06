/**
 * Stripe deshabilitado temporalmente.
 * Stub para evitar errores de build y satisfacer imports.
 */

export const stripe = {} as any;

export async function createCheckoutSession(..._args: any[]) {
  // Devolvemos una URL dummy o null (ajustá si tu UI espera algo concreto)
  return { url: "/billing-disabled" } as any;
}

export async function createCustomerPortalSession(..._args: any[]) {
  return { url: "/billing-disabled" } as any;
}

export async function handleSubscriptionChange(..._args: any[]) {
  return { ok: true };
}

// Algunas UIs del starter leen productos/precios:
export async function getStripeProducts(..._args: any[]) {
  return [];
}

export async function getStripePrices(..._args: any[]) {
  return [];
}
