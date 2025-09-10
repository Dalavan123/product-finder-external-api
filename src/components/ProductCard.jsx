/**
 * Produktkort
 * Syfte: visar bild, titel, pris, betyg + länk till detaljsida.
 * Krav: behåll centrerad text (din .card-body) och ingen <meter>.
 * Layout-stabilitet: återgår till <div class="card-media"> (som i original) för att matcha din befintliga CSS.
 */

import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  const { id, title, price, image, rating } = product;

  const formattedPrice = new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'USD',
  }).format(price);

  const titleId = `product-${id}-title`;
  const metaId = `${titleId}-meta`;

  return (
    <article className='card' aria-labelledby={titleId}>
      {/* Media: tillbaka till div.card-media för oförändrad höjd/utrymme */}
      <div className='card-media'>
        {image ? (
          <img src={image} alt={title || 'Produktbild'} loading='lazy' />
        ) : (
          <div
            data-testid='placeholder-image'
            aria-label='Ingen bild tillgänglig'
            role='img'
            className='card-media--placeholder'
          />
        )}
      </div>

      {/* Behåll .card-body för centrerad text enligt din CSS */}
      <section className='card-body' aria-describedby={metaId}>
        <h2 className='card-title' id={titleId}>
          {title}
        </h2>

        <p className='card-price'>{formattedPrice}</p>

        {rating?.rate != null && (
          <p
            id={metaId}
            className='card-rating'
            aria-label={`Betyg ${rating.rate} av 5`}
          >
            <span aria-hidden='true'>⭐</span> {rating.rate}
            {typeof rating.count === 'number' ? ` (${rating.count})` : null}
          </p>
        )}

        <Link
          className='btn'
          to={`/product/${id}`}
          aria-label={`Visa detaljer om ${title}`}
        >
          Visa detaljer
        </Link>
      </section>
    </article>
  );
}
