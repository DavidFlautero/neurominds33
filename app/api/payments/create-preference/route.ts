import { NextResponse } from "next/server";

const mercadopago = require('mercadopago');

export async function POST(req: Request) {
  const { title, amount, external_reference, return_url } = await req.json();
  mercadopago.configure({ access_token: process.env.MP_ACCESS_TOKEN! });

  const preference = {
    items: [{ title, quantity: 1, unit_price: Number(amount) }],
    external_reference,
    back_urls: { success: return_url, failure: return_url, pending: return_url },
    auto_return: "approved",
    // notification_url: process.env.MP_WEBHOOK_URL, // activar en Fase 2
  };

  const res = await mercadopago.preferences.create(preference as any);
  return NextResponse.json({ prefId: res.body.id, initPoint: res.body.init_point });
}
