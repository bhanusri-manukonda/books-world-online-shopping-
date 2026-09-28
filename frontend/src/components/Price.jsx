import { rupees, finalPriceOf } from '../utils/price.js';

// Shows the discounted price first, then the struck-out printed price
// and the percentage off. Used on cards, details, cart and checkout.
export default function Price({ book, size = 'normal' }) {
  const final = finalPriceOf(book);
  const hasDiscount = (book.discountPercent || 0) > 0;

  return (
    <span className={`price-tag ${size === 'large' ? 'price-large' : ''}`}>
      <strong>{rupees(final)}</strong>
      {hasDiscount && (
        <>
          <s className="price-was">{rupees(book.price)}</s>
          <span className="off">{book.discountPercent}% off</span>
        </>
      )}
    </span>
  );
}
