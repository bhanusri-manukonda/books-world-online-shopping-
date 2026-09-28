import { Link } from 'react-router-dom';
import { generatedCover, handleCoverError } from '../utils/cover.js';
import { useWishlist } from '../context/WishlistContext.jsx';
import Price from './Price.jsx';

export default function BookCard({ book }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const discount = book.discountPercent || 0;
  const inWishlist = isInWishlist(book._id);

  const handleHeartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(book);
  };

  return (
    <article className="book-card">
      <div className="cover-wrap">
        <Link to={`/books/${book._id}`}>
          {discount > 0 && <span className="deal-flag">{discount}% off</span>}
          <img
            className="cover"
            src={book.image || generatedCover(book.title)}
            alt={`Cover of ${book.title}`}
            loading="lazy"
            onError={(e) => handleCoverError(e, book.title)}
          />
        </Link>

        {/* Wishlist Heart Button */}
        <button
          type="button"
          className={`wishlist-heart-btn ${inWishlist ? 'active' : ''}`}
          onClick={handleHeartClick}
          title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill={inWishlist ? '#ef4444' : 'rgba(0, 0, 0, 0.45)'}
            stroke={inWishlist ? '#ef4444' : '#ffffff'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>

      <div className="body">
        <h3>
          <Link to={`/books/${book._id}`}>{book.title}</Link>
        </h3>
        <p className="small muted">{book.author}</p>
        <p className="small muted">{book.category}</p>
        <div className="price">
          <Price book={book} />
          {book.countInStock === 0 && (
            <span className="badge badge-red" style={{ marginLeft: 8 }}>
              Out of stock
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
