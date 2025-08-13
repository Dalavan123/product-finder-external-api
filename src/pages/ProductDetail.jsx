import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState('loading'); // loading|ok|error
  const [aiText, setAiText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const c = new AbortController();
    (async () => {
      try {
        const res = await fetch(`https://fakestoreapi.com/products/${id}`, {
          signal: c.signal,
        });
        if (!res.ok)
          throw new Error(`Kunde inte hämta produkt (HTTP ${res.status})`);
        setProduct(await res.json());
        setStatus('ok');
      } catch (e) {
        if (e.name !== 'AbortError') setStatus('error');
      }
    })();
    return () => c.abort();
  }, [id]);

  async function handleGenerate() {
    if (!product) return;
    setLoading(true);
    setError('');
    setAiText('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: product.title,
          description: product.description,
          tone: 'säljande',
        }),
      });
      if (!res.ok) throw new Error('Kunde inte generera text');
      const data = await res.json();
      setAiText(data.text || '');
    } catch (e) {
      setError(e.message || 'Något gick fel');
    } finally {
      setLoading(false);
    }
  }

  if (status === 'loading')
    return (
      <main className='container'>
        <p role='status' aria-live='polite'>
          Laddar…
        </p>
      </main>
    );
  if (status === 'error')
    return (
      <main className='container'>
        <p role='alert'>Kunde inte hämta produkten.</p>
        <Link className='btn' to='/'>
          ← Tillbaka
        </Link>
      </main>
    );

  return (
    <main className='container'>
      <Link className='btn' to='/' style={{ marginBottom: 12 }}>
        ← Tillbaka
      </Link>
      <article className='card' style={{ padding: 16 }}>
        <h1 className='card-title'>{product.title}</h1>
        <p style={{ opacity: 0.9 }}>{product.description}</p>

        <div style={{ marginTop: 12 }}>
          <button
            className='btn btn--primary'
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? 'Genererar…' : 'Generera förbättrad beskrivning'}
          </button>
        </div>

        {error && (
          <div role='alert' className='error' style={{ marginTop: 12 }}>
            {error}
          </div>
        )}
        {aiText && (
          <div
            className='info'
            aria-live='polite'
            style={{ whiteSpace: 'pre-wrap', marginTop: 12 }}
          >
            {aiText}
          </div>
        )}
      </article>
    </main>
  );
}
