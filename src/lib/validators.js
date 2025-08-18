// src/lib/validators.js

/**
 * Små indata-vakter för sök/kategori.
 * Mål: vara enkla, snabba och lättlästa – inte “fullständiga” säkerhetsfilter.
 */

/**
 * sanitizeQuery(query)
 * 1) Tar bort enkla HTML-taggar (t.ex. <b>, <script>…)
 * 2) Trimmar och kollapsar överflödiga mellanslag.
 *
 * Exempel:
 *   "  <b>  hej  </b>  " -> "hej"
 */
export function sanitizeQuery(query) {
  if (typeof query !== 'string') return '';
  // Ta bort *enkla* taggar. (Räcker för vår användning av sökfält.)
  const withoutTags = query.replace(/<[^>]*>/g, '');
  // Trim + ersätt flera whitespace med ett mellanslag.
  return withoutTags.trim().replace(/\s+/g, ' ');
}

/**
 * isValidCategory(category)
 * Regler:
 * - Måste vara en sträng med bokstäver, mellanslag eller bindestreck
 *   (t.ex. "smartphones", "home decoration", "men-wear").
 * - Enkel svartlista mot uppenbara payloads (SQL-ord mm).
 *
 * Tips:
 * - Vi använder Unicode-flaggan 'u' så \p{L} matchar alla språkets bokstäver.
 */
export function isValidCategory(category) {
  if (typeof category !== 'string') return false;

  const trimmed = category.trim().toLowerCase();
  if (!trimmed) return false; // tomt strängvärde räknas inte

  // Mycket enkel svartlista mot “elaka” ord/sekvenser.
  const blacklist = ['drop table', 'select *', 'delete from'];
  if (blacklist.some(bad => trimmed.includes(bad))) return false;

  // Endast bokstäver, whitespace och bindestreck.
  return /^[\p{L}\s-]+$/u.test(trimmed);
}

/**
 * isValidQuery(q)
 * Regler:
 * - Max 100 tecken
 * - Inga < eller > (vi vill inte råka tolka taggar)
 * - Tillåt bokstäver/siffror/mellanslag samt vanligt förekommande tecken
 * - Kräver minst *en* bokstav/siffra (så att bara "!!!" inte accepteras)
 *
 * Exempel som blir OK: "iphone 14", "men's shoes", "kids (3-5)"
 */
export function isValidQuery(q) {
  if (typeof q !== 'string') return false;
  if (q.length > 100) return false;

  // Blockera potentiella tagg-indikatorer.
  if (/[<>]/.test(q)) return false;

  // Endast “säkra” tecken vi förväntar i en fri text-sökning.
  const allowed = /^[\p{L}\p{N}\s\-\.,_:'"()!?/\\]*$/u;
  if (!allowed.test(q)) return false;

  // Måste innehålla minst en bokstav eller siffra.
  return /[\p{L}\p{N}]/u.test(q);
}
