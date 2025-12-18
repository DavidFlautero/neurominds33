export async function runHeuristics({ dom }: { dom: any }) {
  const ctas = dom?.ctas ?? [];

  const hasClearPrimaryCta = ctas.some((c: any) =>
    /comprar|agregar|carrito|checkout|pagar|whatsapp|cotizar|ver\s+productos/i.test(c.text)
  );

  const heroHasValueProp = Boolean(dom?.h1) && dom.h1.length >= 8;

  // MVP heuristic. Phase 2: measure viewport visibility in mobile with element bounding boxes.
  const mobileCtaVisible = hasClearPrimaryCta;

  const warnings: string[] = [];
  if (!hasClearPrimaryCta) warnings.push("No se detectó CTA primario claro (Comprar/Agregar/Checkout/WhatsApp/Cotizar).");
  if (!heroHasValueProp) warnings.push("El H1/hero no parece comunicar una propuesta de valor clara.");

  return { mobileCtaVisible, hasClearPrimaryCta, heroHasValueProp, warnings };
}
