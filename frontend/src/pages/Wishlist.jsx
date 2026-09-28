import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { generatedCover, handleCoverError } from '../utils/cover.js';
import Price from '../components/Price.jsx';
import Loader from '../components/Loader.jsx';
import Message from '../components/Message.jsx';

export default function Wishlist() {
  const { wishlist, loading, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (book) => {
    addToCart(book, 1);
    removeFromWishlist(book._id);
  };

  const handleAddAllToCart = () => {
    wishlist.forEach((book) => {
      if (book.countInStock > 0) {
        addToCart(book, 1);
      }
    });
  };

  if (loading) {
    return (
      <div className="container page">
        <Loader text="Loading your saved books…" />
      </div>
    );
  }

  return (
    <div className="container page">
      <div className="cart-header">
        <div>
          <h1>My Wishlist</h1>
          <p className="muted small">
            {wishlist.length} item{wishlist.length === 1 ? '' : 's'} saved for later
          </p>
        </div>
        {wishlist.length > 0 && (
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button className="btn-amber btn-sm" onClick={handleAddAllToCart}>
              Add Available to Cart
            </button>
            <button className="btn-ghost btn-sm" onClick={clearWishlist}>
              Clear Wishlist
            </button>
          </div>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div className="panel" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--amber)' }}>♡</div>
          <h2>Your wishlist is empty</h2>
          <p className="muted" style={{ maxWidth: 420, margin: '0.5rem auto 1.5rem auto' }}>
            Save books you like by clicking the heart icon on any book cover while browsing.
          </p>
          <Link to="/" className="btn-amber">
            Browse Books
          </Link>
        </div>
      ) : (
        <div className="grid">
          {wishlist.map((book) => {
            const discount = book.discountPercent || 0;
            const inStock = book.countInStock > 0;

            return (
              <article key={book._id} className="book-card">
                <Link to={`/books/${book._id}`} className="cover-wrap">
                  {discount > 0 && <span className="deal-flag">{discount}% off</span>}
                  <img
                    className="cover"
                    src={book.image || generatedCover(book.title)}
                    alt={`Cover of ${book.title}`}
                    loading="lazy"
                    onError={(e) => handleCoverError(e, book.title)}
                  />
                </Link>

                <div className="body">
                  <h3>
                    <Link to={`/books/${book._id}`}>{book.title}</Link>
                  </h3>
                  <p className="small muted">{book.author}</p>
                  <p className="small muted">{book.category}</p>

                  <div className="price" style={{ margin: '0.5rem 0' }}>
                    <Price book={book} />
                    {!inStock && (
                      <span className="badge badge-red" style={{ marginLeft: 8 }}>
                        Out of stock
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                    <button
                      className="btn-amber btn-sm"
                      style={{ flex: 1 }}
                      disabled={!inStock}
                      onClick={() => handleMoveToCart(book)}
                    >
                      {inStock ? 'Move to Cart' : 'Out of Stock'}
                    </button>
                    <button
                      className="btn-ghost btn-sm"
                      title="Remove from wishlist"
                      onClick={() => removeFromWishlist(book._id)}
                      style={{ padding: '0 0.6rem' }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
