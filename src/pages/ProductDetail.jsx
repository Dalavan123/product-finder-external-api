import { useState } from 'react';

export default function ProductDetail({ product }) {
  const [aiText, setAiText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleGenerate() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: product?.title || 'Red Shirt',
          description: product?.description || 'Soft cotton tee',
          tone: 'säljande',
        }),
      });
      if (!res.ok) throw new Error('Kunde inte generera text');
      const data = await res.json();
      setAiText(data.text);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Genererar…' : 'Generera förbättrad beskrivning'}
      </button>
      {error && <p role='alert'>{error}</p>}
      {aiText && <pre>{aiText}</pre>}
    </div>
  );
}
