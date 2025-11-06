export async function POST() {
  return new Response(JSON.stringify({ message: "Stripe disabled temporarily" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
