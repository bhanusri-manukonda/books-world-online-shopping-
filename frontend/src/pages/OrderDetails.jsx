import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api, { getErrorMessage } from '../api/axios.js';
import Loader from '../components/Loader.jsx';
import Message from '../components/Message.jsx';
import { rupees } from '../utils/price.js';
import { generatedCover, handleCoverError } from '../utils/cover.js';

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/orders/${id}`)
      .then(({ data }) => setOrder(data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container page"><Loader /></div>;
  if (error) return <div className="container page"><Message variant="error">{error}</Message></div>;
  if (!order) return null;

  const { shippingAddress: address } = order;

  return (
    <div className="container page">
      <p className="small"><Link to="/orders">← All orders</Link></p>
      <h1>Order {order._id.slice(-6).toUpperCase()}</h1>
      <p className="muted small">Placed on {new Date(order.createdAt).toLocaleString()}</p>

      <div className="detail" style={{ gridTemplateColumns: '1fr 320px' }}>
        <div className="panel">
          <h3>Books in this order</h3>
          {order.orderItems.map((item) => (
            <div className="cart-line" key={item.book}>
              <img
                src={item.image || generatedCover(item.title)}
                alt={item.title}
                onError={(e) => handleCoverError(e, item.title)}
              />
              <div>
                <Link to={`/books/${item.book}`}>{item.title}</Link>
                <p className="small muted" style={{ margin: 0 }}>
                  {rupees(item.price)} × {item.qty}
                  {item.discountPercent > 0 && (
                    <>
                      {' '}<s>{rupees(item.originalPrice)}</s>{' '}
                      <span className="off">{item.discountPercent}% off</span>
                    </>
                  )}
                </p>
              </div>
              <strong>{rupees(item.price * item.qty)}</strong>
            </div>
          ))}

          <h3 style={{ marginTop: '1.5rem' }}>Delivering to</h3>
          <p className="small" style={{ margin: 0 }}>
            {address.fullName}<br />
            {address.address}, {address.city} {address.postalCode}<br />
            Phone: {address.phone}
          </p>
        </div>

        <aside className="panel">
          <h3>Summary</h3>
          <div className="summary-row"><span>Items</span><span>{rupees(order.itemsPrice)}</span></div>
          {order.savedPrice > 0 && (
            <div className="summary-row saving"><span>You saved</span><span>{rupees(order.savedPrice)}</span></div>
          )}
          <div className="summary-row"><span>Delivery</span><span>{order.shippingPrice === 0 ? 'Free' : rupees(order.shippingPrice)}</span></div>
          <div className="summary-row summary-total"><span>Total</span><span>{rupees(order.totalPrice)}</span></div>
          <div className="summary-row"><span>Payment</span><span>{order.paymentMethod}</span></div>
          <div className="summary-row"><span>Paid</span><span>{order.isPaid ? 'Yes' : 'Not yet'}</span></div>
          <div className="summary-row"><span>Status</span><span className="badge">{order.status}</span></div>
        </aside>
      </div>
    </div>
  );
}
