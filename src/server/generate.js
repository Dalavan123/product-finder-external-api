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
