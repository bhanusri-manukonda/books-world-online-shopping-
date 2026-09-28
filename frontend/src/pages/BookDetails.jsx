import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api, { getErrorMessage } from '../api/axios.js';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { generatedCover, handleCoverError } from '../utils/cover.js';
import { rupees, savingOf } from '../utils/price.js';
import Price from '../components/Price.jsx';
import Loader from '../components/Loader.jsx';
import Message from '../components/Message.jsx';

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [book, setBook] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [error, setError] = useState('');
  const [addedToast, setAddedToast] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const loadBook = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get(`/books/${id}`);
        setBook(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    const loadRecommendations = async () => {
      setLoadingRecs(true);
      try {
        const { data } = await api.get(`/books/${id}/recommendations`);
        setRecommendations(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load recommendations:', err);
        setRecommendations([]);
      } finally {
        setLoadingRecs(false);
      }
    };

    loadBook();
    loadRecommendations();
  }, [id]);

  const handleAdd = () => {
    if (!book) return;
    addToCart(book, Number(qty));
    setAddedToast(`Added ${qty} copy of "${book.title}" to cart!`);
    setTimeout(() => setAddedToast(''), 3000);
  };

  const handleRecAddToCart = (recBook) => {
    addToCart(recBook, 1);
    setAddedToast(`Added "${recBook.title}" to cart!`);
    setTimeout(() => setAddedToast(''), 3000);
  };

  if (loading) {
    return (
      <div className="container page">
        <Loader text="Opening book details…" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container page">
        <Message variant="error">{error}</Message>
        <p style={{ marginTop: '1rem' }}>
          <Link to="/" className="btn-ghost">
            ← Return to Bookstore
          </Link>
        </p>
      </div>
    );
  }

  if (!book) return null;

  const saving = savingOf(book);
  const isWishlisted = isInWishlist(book._id);

  return (
    <div className="container page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <p className="small">
          <Link to="/" className="linklike">← Back to all books</Link>
        </p>
        <span className="badge badge-amber">{book.category}</span>
      </div>

      {addedToast && (
        <div className="toast-notification">
          <span>✓ {addedToast}</span>
          <Link to="/cart" className="toast-link">View Cart →</Link>
        </div>
      )}

      {/* Main Book Detail Section */}
      <div className="detail">
        <div className="cover-wrap">
          {book.discountPercent > 0 && <span className="deal-flag">{book.discountPercent}% off</span>}
          <img
            src={book.image || generatedCover(book.title)}
            alt={`Cover of ${book.title}`}
            onError={(e) => handleCoverError(e, book.title)}
            style={{ borderRadius: 10, border: '1px solid var(--line)', width: '100%', maxHeight: 480, objectFit: 'cover' }}
          />
        </div>

        <div>
          <h1>{book.title}</h1>
          <p className="muted" style={{ fontSize: '1.1rem', marginTop: '0.25rem' }}>
            by <strong>{book.author}</strong>
          </p>
          <div style={{ margin: '0.75rem 0', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <span className="badge badge-green">★ {book.rating || 4.5} / 5</span>
            <span className="small muted">Verified Reader Rating</span>
          </div>

          <p style={{ maxWidth: '64ch', lineHeight: 1.7, margin: '1.25rem 0' }}>{book.description}</p>

          <div className="panel" style={{ maxWidth: 400, marginTop: '1.5rem' }}>
            <Price book={book} size="large" />
            {saving > 0 && (
              <p className="small saving" style={{ marginTop: '0.25rem' }}>
                You save {rupees(saving)} ({book.discountPercent}% OFF) on the printed price.
              </p>
            )}

            <div className="summary-row" style={{ marginTop: '0.75rem' }}>
              <span>Availability</span>
              <span>
                {book.countInStock > 0 ? (
                  <span className="badge badge-green">{book.countInStock} copies in stock</span>
                ) : (
                  <span className="badge badge-red">Out of stock</span>
                )}
              </span>
            </div>

            <div className="summary-row" style={{ marginTop: '0.5rem' }}>
              <span>Delivery</span>
              <span className="small muted">Andhra Pradesh Express (2-4 days)</span>
            </div>

            {book.countInStock > 0 && (
              <div className="field" style={{ marginTop: '0.75rem' }}>
                <label htmlFor="qty">Quantity</label>
                <select id="qty" value={qty} onChange={(e) => setQty(e.target.value)}>
                  {Array.from({ length: Math.min(book.countInStock, 10) }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? 'copy' : 'copies'}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button
                className="btn-amber"
                style={{ flex: 1 }}
                disabled={book.countInStock === 0}
                onClick={handleAdd}
              >
                {book.countInStock > 0 ? 'Add to cart' : 'Out of stock'}
              </button>

              <button
                type="button"
                className={`btn-wishlist-toggle ${isWishlisted ? 'active' : ''}`}
                onClick={() => toggleWishlist(book)}
                title={isWishlisted ? 'Saved in wishlist' : 'Add to wishlist'}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill={isWishlisted ? '#ef4444' : 'none'} stroke={isWishlisted ? '#ef4444' : 'currentColor'} strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                <span>{isWishlisted ? 'Wishlisted' : 'Wishlist'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Books Section based on category or author */}
      <section className="recommendations-section" style={{ marginTop: '4rem', paddingTop: '2.5rem', borderTop: '1px solid var(--line)' }}>
        <div className="section-head">
          <div>
            <h2>Recommended Books</h2>
            <p className="muted small">
              Readers who liked this {book.category} book also enjoyed these titles:
            </p>
          </div>
        </div>

        {loadingRecs ? (
          <Loader text="Finding similar recommendations…" />
        ) : recommendations.length === 0 ? (
          <p className="muted small">No specific recommendations found.</p>
        ) : (
          <div className="grid rec-grid">
            {recommendations.map((rec) => {
              const recDiscount = rec.discountPercent || 0;
              const recSaving = savingOf(rec);
              const recInStock = rec.countInStock > 0;
              const recWishlisted = isInWishlist(rec._id);

              return (
                <article key={rec._id} className="book-card rec-card">
                  <div className="cover-wrap">
                    <Link to={`/books/${rec._id}`}>
                      {recDiscount > 0 && <span className="deal-flag">{recDiscount}% off</span>}
                      <img
                        className="cover"
                        src={rec.image || generatedCover(rec.title)}
                        alt={`Cover of ${rec.title}`}
                        loading="lazy"
                        onError={(e) => handleCoverError(e, rec.title)}
                      />
                    </Link>

                    {/* Wishlist button */}
                    <button
                      type="button"
                      className={`wishlist-heart-btn ${recWishlisted ? 'active' : ''}`}
                      onClick={() => toggleWishlist(rec)}
                      title={recWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill={recWishlisted ? '#ef4444' : 'rgba(0, 0, 0, 0.45)'}
                        stroke={recWishlisted ? '#ef4444' : '#ffffff'}
                        strokeWidth="2"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                    </button>
                  </div>

                  <div className="body">
                    <h3>
                      <Link to={`/books/${rec._id}`}>{rec.title}</Link>
                    </h3>
                    <p className="small muted">{rec.author}</p>
                    <p className="small muted">{rec.category}</p>

                    <div className="price" style={{ margin: '0.4rem 0' }}>
                      <Price book={rec} />
                    </div>

                    <div className="rec-actions" style={{ display: 'flex', gap: '0.4rem', marginTop: 'auto' }}>
                      <Link
                        to={`/books/${rec._id}`}
                        className="btn-ghost btn-sm"
                        style={{ flex: 1, textAlign: 'center' }}
                      >
                        View
                      </Link>
                      <button
                        type="button"
                        className="btn-amber btn-sm"
                        style={{ flex: 1.2 }}
                        disabled={!recInStock}
                        onClick={() => handleRecAddToCart(rec)}
                      >
                        {recInStock ? 'Add to Cart' : 'Sold Out'}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
