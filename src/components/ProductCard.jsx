import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  const { id, title, price, image, rating } = product;

  const formattedPrice = new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'USD',
  }).format(price);

  const titleId = `product-${id}-title`;

  return (
    <article className='card' aria-labelledby={titleId}>
      <div className='card-media'>
        {image ? (
          <img src={image} alt={title || 'Produktbild'} loading='lazy' />
        ) : (
          // enkel platshållare så layouten inte hoppar
          <div
            data-testid='placeholder-image'
            aria-label='Ingen bild tillgänglig'
            className='card-media--placeholder'
          />
        )}
      </div>

      <div className='card-body'>
        <h2 className='card-title' id={titleId}>
          {title}
        </h2>
        <p className='card-price'>{formattedPrice}</p>

        {rating?.rate != null && (
          <p className='card-rating' aria-label={`Betyg ${rating.rate} av 5`}>
            <span aria-hidden='true'>⭐</span> {rating.rate}
            {typeof rating.count === 'number' ? ` (${rating.count})` : null}
          </p>
        )}

        <Link className='btn' to={`/product/${id}`}>
          Visa detaljer
        </Link>
      </div>
    </article>
  );
}
