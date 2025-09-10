// src/pages/Home.jsx
/**
 * Sida: Home (produktlista)
 * Gör: hämtar produkter + kategorier, låter användaren söka/filter/sortera
 * Varför så här?
 *  - Hämtning i useEffect + AbortController för att undvika state-uppdatering efter unmount
 *    (dvs. aborten tillåter appen avsluta en pågående fetch om komponenten försvinner/användaren lämnar sidan.)
 *  - Debounce på sök (200ms) för att undvika onödiga filteromräkningar
 *  - useMemo för att härleda "visibleProducts" effektivt (filter + sort endast när inputs ändras)
 *    (state är ingredienserna; memo är den färdiga rätten som inte lagas om i onödan)
 */

import { useEffect, useMemo, useState } from 'react';
import { fetchProducts, fetchCategories } from '../lib/apiClient.js';
import ProductCard from '../components/ProductCard.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';
import Controls from '../components/Controls.jsx';

export default function Home() {
  // UI-state
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState('idle'); // 'idle' (startvärde, inget hänt än) | 'loading' | 'success' | 'error'
  const [error, setError] = useState('');

  // kontroller (inputs)
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('relevance');

  // debounced söksträng (för att inte filtrera på varje tangenttryck)
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Hämta produkter + kategorier på mount
  useEffect(() => {
    const controller = new AbortController(); // gör att vi kan avbryta fetch om komponenten unmountas
    (async () => {
      try {
        setStatus('loading');
        const [items, cats] = await Promise.all([
          fetchProducts({ signal: controller.signal }),
          fetchCategories({ signal: controller.signal }),
        ]);
        setProducts(items);
        setCategories(cats);
        setStatus('success');
      } catch (err) {
        // ignorera AbortError (den kastas när vi avbryter)
        if (err.name !== 'AbortError') {
          setError(err.message || 'Något gick fel');
          setStatus('error');
        }
      }
    })();
    return () => controller.abort(); // avbryt på unmount
  }, []);

  // Debounce: vänta 200 ms efter att användaren slutat skriva innan vi filtrerar
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 200);
    return () => clearTimeout(t);
  }, [query]);

  // Härled synlig lista (filter + sort) när inputs ändras
  const visibleProducts = useMemo(() => {
    let list = [...products];

    if (category) {
      list = list.filter(p => p.category === category);
    }

    const q = debouncedQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        p =>
          p.title?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    switch (sort) {
      case 'price_asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating_desc':
        list.sort((a, b) => (b.rating?.rate ?? 0) - (a.rating?.rate ?? 0));
        break;
      default:
      // relevance → behåll API-ordningen
    }

    return list;
  }, [products, category, debouncedQuery, sort]);

  return (
    <main className='container'>
      <header
        className='page-header'
        style={{ display: 'flex', alignItems: 'center', gap: 12 }}
      >
        <section>
          <h1>Produkter</h1>
          <p className='muted'>Data hämtas från ett externt API (DummyJSON).</p>
        </section>
        <section aria-label='Tema' style={{ marginLeft: 'auto' }}>
          <ThemeToggle />
        </section>
      </header>

      {/* Filter- och sortkontroller */}
      <section aria-label='Filter och sortering'>
        <Controls
          query={query}
          onQuery={setQuery}
          category={category}
          onCategory={setCategory}
          sort={sort}
          onSort={setSort}
          categories={categories}
        />
      </section>

      {/* aria-live gör att hjälpmedel (skärmläsare) får uppdatering när antal träffar ändras */}
      <p className='muted' style={{ marginTop: 0 }}>
        <output aria-live='polite'>
          {status === 'success' ? `${visibleProducts.length} träffar` : ' '}
        </output>
      </p>

      {status === 'loading' && (
        <aside role='status' aria-live='polite' className='info'>
          Laddar produkter…
        </aside>
      )}

      {status === 'error' && (
        <aside role='alert' className='error'>
          {error}{' '}
          <button className='btn' onClick={() => location.reload()}>
            Försök igen
          </button>
        </aside>
      )}

      {status === 'success' && (
        <section aria-label='Produktlista'>
          <ul className='products-grid' role='list'>
            {visibleProducts.map(p => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
          {visibleProducts.length === 0 && (
            <p className='muted' role='status' style={{ padding: 12 }}>
              Inga produkter matchar dina filter.
            </p>
          )}
        </section>
      )}
    </main>
  );
}
