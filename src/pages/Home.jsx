/* Varför?
- startar hämtning vid mount
- visar loading/fel/resultat
- tillgängligt (ARIA) och responsivt
*/
import { useEffect, useState } from 'react';
import { fetchProducts } from '../lib/apiClient.js';
import ProductCard from '../components/ProductCard.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('idle'); // idle|loading|success|error
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        setStatus('loading');
        const data = await fetchProducts({ signal: controller.signal });
        setProducts(data);
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
          {products.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </section>
      )}
    </main>
  );
}
