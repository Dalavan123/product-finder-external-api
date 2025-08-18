// src/components/Controls.jsx

/**
 * Filterkontroller
 * Syfte: sök-input, kategorilista och sorteringsselect + Rensa-knapp.
 * Viktigt: aria-labels på alla inputs/selects för tillgänglighet.
 */

export default function Controls({
  query,
  onQuery,
  category,
  onCategory,
  sort,
  onSort,
  categories = [],
}) {
  function handleClear() {
    onQuery('');
    onCategory('');
    onSort('relevance');
  }

  const isPristine = !query && !category && sort === 'relevance';

  return (
    <form className='controls' onSubmit={e => e.preventDefault()}>
      <input
        type='search'
        placeholder='Sök produkter…'
        value={query}
        onChange={e => onQuery(e.target.value)}
        aria-label='Sök produkter'
      />
      <select
        value={category}
        onChange={e => onCategory(e.target.value)}
        aria-label='Kategori'
      >
        <option value=''>Alla kategorier</option>
        {categories.map(c => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <select
        value={sort}
        onChange={e => onSort(e.target.value)}
        aria-label='Sortering'
      >
        <option value='relevance'>Sortering</option>
        <option value='price_asc'>Pris: lågt → högt</option>
        <option value='price_desc'>Pris: högt → lågt</option>
        <option value='rating_desc'>Betyg: högst → lägst</option>
      </select>

      {/* Rensa-knapp (valfri, men skön att ha) */}
      <button
        className='btn'
        type='button'
        onClick={handleClear}
        aria-label='Rensa sök och filter'
        disabled={isPristine}
        title={isPristine ? 'Inget att rensa' : undefined}
      >
        Rensa
      </button>
    </form>
  );
}
