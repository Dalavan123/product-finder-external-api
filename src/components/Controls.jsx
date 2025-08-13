// src/components/Controls.jsx
export default function Controls({
  query,
  onQuery,
  category,
  onCategory,
  sort,
  onSort,
  categories = [],
}) {
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
        <option value='relevance'>Relevans</option>
        <option value='price_asc'>Pris: lågt → högt</option>
        <option value='price_desc'>Pris: högt → lågt</option>
        <option value='rating_desc'>Betyg: högst → lägst</option>
      </select>
    </form>
  );
}
