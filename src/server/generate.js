//src/server/generate.js

/**
 * Route: POST /api/generate
 * Body: { title, description, tone }
 * Syfte: generera säljtext baserat på titel/beskrivning (mockad i dev innan implementering av riktig AI).
 */

export async function generateImprovedText({
  title,
  description,
  tone = 'säljande',
}) {
  const t = String(title ?? '').trim();
  const d = String(description ?? '').trim();
  if (!t || !d) {
    const err = new Error('title och description krävs');
    err.status = 400;
    throw err;
  }
  return `**${t}** – förbättrad beskrivning (${tone})\n\n${d}\n\n• Fördelar: hög kvalitet, bra pris, snabb leverans`;
}
