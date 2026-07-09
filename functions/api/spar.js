
Spar · JS
// Cloudflare Pages Function — proxy til AI-sparringen.
//
// PLACERING I REPOET (vigtigt):
//   Læg denne fil som:  functions/api/spar.js
//   Mappen "functions" skal ligge i roden af det, Cloudflare udgiver.
//   Så bliver endpointet automatisk tilgængeligt på:  /api/spar
//
// I index.html skal AI_ENDPOINT pege på samme sti:
//   const AI_ENDPOINT = "/api/spar";
//
// NØGLEN: sæt en miljøvariabel i Pages-projektet (Settings →
//   Environment variables) med navnet præcis ANTHROPIC_API_KEY,
//   markeret som secret. Kør derefter en ny deployment, så den slår
//   igennem. Nøglen ligger dermed serverside — aldrig i repoet.
//
// Backend og side deler adresse, så der er ingen CORS at sætte op.
 
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
 
