import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { rupees } from '../utils/price.js';
import { generatedCover, handleCoverError } from '../utils/cover.js';

export default function Cart() {
  const { items, updateQty, removeFromCart, itemsPrice, savedPrice, shippingPrice, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const goToCheckout = () => navigate(user ? '/checkout' : '/login', { state: { from: '/checkout' } });

  if (items.length === 0) {
    return (
      <div className="container page">
        <div className="panel">
          <h1>Your cart is empty</h1>
          <p className="muted">Pick a few books and they will show up here.</p>
          <Link className="btn" to="/">Browse books</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container page">
      <h1>Your cart</h1>

      <div className="detail" style={{ gridTemplateColumns: '1fr 320px' }}>
        <div className="panel">
          {items.map((item) => (
            <div className="cart-line" key={item.book}>
              <img
                src={item.image || generatedCover(item.title)}
                alt={item.title}
                onError={(e) => handleCoverError(e, item.title)}
              />
              <div>
                <Link to={`/books/${item.book}`}>{item.title}</Link>
                <p className="small muted" style={{ margin: 0 }}>
                  {rupees(item.price)} each
                  {item.discountPercent > 0 && (
                    <>
                      {' '}<s>{rupees(item.originalPrice)}</s>{' '}
                      <span className="off">{item.discountPercent}% off</span>
                    </>
                  )}
                </p>
              </div>
              <select
                value={item.qty}
                aria-label={`Quantity for ${item.title}`}
                onChange={(e) => updateQty(item.book, e.target.value)}
                style={{ width: 70 }}
              >
                {Array.from({ length: Math.max(Math.min(item.countInStock || 10, 10), item.qty) }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              <button className="btn-sm btn-ghost" onClick={() => removeFromCart(item.book)}>
                Remove
              </button>
            </div>
          ))}
        </div>

        <aside className="panel">
          <h3>Summary</h3>
          <div className="summary-row"><span>Items</span><span>{rupees(itemsPrice)}</span></div>
          {savedPrice > 0 && (
            <div className="summary-row saving"><span>Discount</span><span>− {rupees(savedPrice)}</span></div>
          )}
          <div className="summary-row"><span>Delivery</span><span>{shippingPrice === 0 ? 'Free' : rupees(shippingPrice)}</span></div>
          <div className="summary-row summary-total"><span>Total</span><span>{rupees(totalPrice)}</span></div>
          <button className="btn-amber btn-block" style={{ marginTop: '1rem' }} onClick={goToCheckout}>
            Continue to checkout
          </button>
        </aside>
      </div>
    </div>
  );
}
