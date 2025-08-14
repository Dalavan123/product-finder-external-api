/* Varför?
- startar hämtning vid mount
- visar loading/fel/resultat
- tillgängligt (ARIA) och responsivt
*/
import { useEffect, useMemo, useState } from 'react';
import { fetchProducts, fetchCategories } from '../lib/apiClient.js';
import ProductCard from '../components/ProductCard.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';
import Controls from '../components/Controls.jsx';
export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState('idle'); // idle|loading|success|error
  const [error, setError] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // kontroller
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('relevance');

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        setStatus('loading');
        const [items, categories] = await Promise.all([
          fetchProducts({ signal: controller.signal }),
          fetchCategories({ signal: controller.signal }),
        ]);
        setProducts(items);
        console.log('Fetched products:', items);
        setCategories(categories);
        setStatus('success');
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Något gick fel');
          setStatus('error');
        }
      }
    })();
    return () => controller.abort();
  }, []);

  // Debounce: vänta 200 ms efter att användaren slutat skriva
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 200);
    return () => clearTimeout(t);
  }, [query]);

  const visibleProducts = useMemo(() => {
    let list = [...products];

    //filter: category
    if (category) {
      list = list.filter(p => p.category === category);
    }

    // filter: sök i titel + description (case-insensitive)
    const q = debouncedQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        p =>
          p.title?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    // sortering
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
        /* relevance: låt API-ordningen gälla */ break;
    }

    return list;
  }, [products, category, debouncedQuery, sort]);

  return (
    <main className='container'>
      <header
        className='page-header'
        style={{ display: 'flex', alignItems: 'center', gap: 12 }}
      >
        <div>
          <h1>Produkter</h1>
          <p className='muted'>
            Data hämtas från ett externt API (Fake Store API).
          </p>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <ThemeToggle />
        </div>
      </header>

      {/* kontroller */}
      <Controls
        query={query}
        onQuery={setQuery}
        category={category}
        onCategory={setCategory}
        sort={sort}
        onSort={setSort}
        categories={categories}
      />

      {/* aria-live för antal träffar */}
      <p aria-live='polite' className='muted' style={{ marginTop: 0 }}>
        {status === 'success' ? `${visibleProducts.length} träffar` : '\u00A0'}
      </p>

      {status === 'loading' && (
        <div role='status' aria-live='polite' className='info'>
          Laddar produkter…
        </div>
      )}

      {status === 'error' && (
        <div role='alert' className='error'>
          {error}{' '}
          <button className='btn' onClick={() => location.reload()}>
            Försök igen
          </button>
        </div>
      )}

      {status === 'success' && (
        <section aria-label='Produktlista' className='products-grid'>
          {visibleProducts.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </section>
      )}
    </main>
  );
}
