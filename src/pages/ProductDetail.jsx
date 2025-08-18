// src/pages/ProductDetail.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProductById } from '../lib/apiClient';

console.log('ProductDetail monterades');

function formatPrice(n) {
  try {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'USD',
    }).format(n);
  } catch {
    return `${n} US$`;
  }
}

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aiText, setAiText] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    setProduct(null);

    fetchProductById(id)
      .then(p => {
        if (!active) return;
        if (p) setProduct(p);
        else setError(new Error('Produkten hittades inte'));
      })
      .catch(e => {
        if (!active) return;
        setError(e);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  async function handleGenerate() {
    if (!product) return;
    setAiLoading(true);
    setError(null);
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
      setError(e instanceof Error ? e.message : 'Något gick fel');
    } finally {
      setAiLoading(false);
    }
  }

  if (loading) {
    return (
      <main className='container'>
        <p role='status' aria-live='polite'>
          Laddar…
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className='container'>
        <p role='alert'>
          Kunde inte hämta produkten: {String(error.message || error)}
        </p>
        <Link className='btn' to='/'>
          {' '}
          ← Tillbaka{' '}
        </Link>
      </main>
    );
  }

  if (!product) {
    return (
      <main className='container'>
        <p role='alert'>Produkten saknas.</p>
        <Link className='btn' to='/'>
          ← Tillbaka
        </Link>
      </main>
    );
  }

  return (
    <main className='container'>
      <Link className='btn' to='/' style={{ marginBottom: 12 }}>
        ← Tillbaka
      </Link>

      <section className='product-detail'>
        <figure className='detail-media'>
          {product.image ? (
            <img src={product.image} alt={product.title} loading='lazy' />
          ) : (
            <div className='muted' style={{ padding: 16 }}>
              Ingen bild
            </div>
          )}
        </figure>

        <article className='detail-body'>
          <h1 className='card-title' style={{ fontSize: '1.4rem' }}>
            {product.title}
          </h1>

          <div className='detail-meta'>
            <div className='detail-price'>{formatPrice(product.price)}</div>
            <div
              className='detail-rating'
              aria-label={`Betyg ${product?.rating?.rate ?? 0} av 5`}
              title={`Betyg ${product?.rating?.rate ?? 0} av 5`}
            >
              <span aria-hidden='true'>⭐</span>
              {product?.rating?.rate ?? 0}
            </div>
          </div>

          <p style={{ opacity: 0.9 }}>{product.description}</p>

          <div style={{ marginTop: 12 }}>
            <button
              className='btn btn--primary'
              onClick={handleGenerate}
              disabled={aiLoading}
            >
              {aiLoading ? 'Genererar…' : 'Generera förbättrad beskrivning'}
            </button>
          </div>

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
      </section>
    </main>
  );
}
