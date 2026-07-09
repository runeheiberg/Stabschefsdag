


 
export async function onRequestPost({ request, env }) {
  if (!env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: "Mangler ANTHROPIC_API_KEY i Pages-projektets miljøvariabler." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
 
  const upstream = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: await request.text(),
  });
 
  return new Response(await upstream.text(), {
    status: upstream.status,
    headers: { "Content-Type": "application/json" },
  });
}
 
// Svar pænt på andre metoder end POST (fx hvis nogen åbner /api/spar i browseren).
export async function onRequest({ request }) {
  if (request.method === "POST") return; // håndteres af onRequestPost
  return new Response("Brug POST.", { status: 405 });
}
 
