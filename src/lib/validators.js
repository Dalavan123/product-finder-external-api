// src/lib/validators.js

/**
 * Tar bort HTML-taggar (inklusive <script>) och trimmar whitespace.
 */
export function sanitizeQuery(query) {
  if (typeof query !== 'string') return '';
  const withoutTags = query.replace(/<[^>]*>/g, '');
  return withoutTags.trim();
}

/**
 * Returnerar true om kategorin är tillåten och inte innehåller förbjudna ord.
 */
export function isValidCategory(category) {
  if (typeof category !== 'string') return false;
  const trimmed = category.trim().toLowerCase();

  // svartlista farliga mönster
  const blacklist = ['drop table', 'select *', 'delete from'];
  if (blacklist.some(bad => trimmed.includes(bad))) {
    return false;
  }

  // endast bokstäver och mellanslag
  return /^[\p{L} ]+$/u.test(trimmed);
}
