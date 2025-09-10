// src/pages/ProductDetail.jsx
/**
 * Sida: ProductDetail
 * Syfte: hämtar en specifik produkt (via id i URL) och visar detaljer.
 * Extra: "Generera förbättrad beskrivning" som POST:ar till /api/generate.

 */

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
        <aside role='status' aria-live='polite'>
          Laddar…
        </aside>
      </main>
    );
  }

  if (error) {
    return (
      <main className='container'>
        <aside role='alert'>
          Kunde inte hämta produkten: {String(error.message || error)}
        </aside>
        <nav aria-label='Tillbaka' style={{ marginTop: 12 }}>
          <Link className='btn' to='/'>
            ← Tillbaka
          </Link>
        </nav>
      </main>
    );
  }

  if (!product) {
    return (
      <main className='container'>
        <aside role='alert'>Produkten saknas.</aside>
        <nav aria-label='Tillbaka' style={{ marginTop: 12 }}>
          <Link className='btn' to='/'>
            ← Tillbaka
          </Link>
        </nav>
      </main>
    );
  }

  return (
    <main className='container'>
      <nav aria-label='Tillbaka' style={{ marginBottom: 12 }}>
        <Link className='btn' to='/'>
          ← Tillbaka
        </Link>
      </nav>

      {/* En produkt = en artikel */}
      <article className='product-detail'>
        {/* Media */}
        <figure className='detail-media'>
          {product.image ? (
            <img src={product.image} alt={product.title} loading='lazy' />
          ) : (
            <figcaption className='muted' style={{ padding: 16 }}>
              Ingen bild tillgänglig
            </figcaption>
          )}
        </figure>

        {/* Innehåll */}
        <section className='detail-body'>
          <header>
            <h1 className='card-title' style={{ fontSize: '1.4rem' }}>
              {product.title}
            </h1>

            {/* Metadata som termlista i stället för divs */}
            <dl className='detail-meta'>
              <dt>Pris</dt>
              <dd className='detail-price'>{formatPrice(product.price)}</dd>

              <dt>Betyg</dt>
              <dd
                className='detail-rating'
                title={`Betyg ${product?.rating?.rate ?? 0} av 5`}
              >
                <span aria-hidden='true'>⭐</span> {product?.rating?.rate ?? 0}
              </dd>
            </dl>
          </header>

          <p style={{ opacity: 0.9 }}>{product.description}</p>

          <footer style={{ marginTop: 12 }}>
            <button
              className='btn btn--primary'
              onClick={handleGenerate}
              disabled={aiLoading}
            >
              {aiLoading ? 'Genererar…' : 'Generera förbättrad beskrivning'}
            </button>
          </footer>

          {aiText && (
            <section aria-labelledby='ai-desc-title' style={{ marginTop: 12 }}>
              <h2 id='ai-desc-title' className='sr-only'>
                Genererad beskrivning
              </h2>
              <output
                className='info'
                aria-live='polite'
                style={{ whiteSpace: 'pre-wrap' }}
              >
                {aiText}
              </output>
            </section>
          )}
        </section>
      </article>
    </main>
  );
}
