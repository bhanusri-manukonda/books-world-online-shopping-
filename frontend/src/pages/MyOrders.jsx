import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getErrorMessage } from '../api/axios.js';
import Loader from '../components/Loader.jsx';
import Message from '../components/Message.jsx';
import { rupees } from '../utils/price.js';

const badgeFor = (status) =>
  status === 'Delivered' ? 'badge badge-green' : status === 'Cancelled' ? 'badge badge-red' : 'badge badge-amber';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/orders/myorders')
      .then(({ data }) => setOrders(data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container page"><Loader /></div>;

  return (
    <div className="container page">
      <h1>Your orders</h1>
      <Message variant="error">{error}</Message>

      {orders.length === 0 ? (
        <div className="panel">
          <h3>No orders yet</h3>
          <p className="muted">When you place an order it will appear here.</p>
          <Link className="btn" to="/">Browse books</Link>
        </div>
      ) : (
        <div className="panel table-wrap">
          <table>
            <thead>
              <tr>
                <th>Placed</th><th>Items</th><th>You saved</th><th>Total</th><th>Status</th><th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>{order.orderItems.reduce((sum, i) => sum + i.qty, 0)}</td>
                  <td className="saving">{order.savedPrice > 0 ? rupees(order.savedPrice) : '—'}</td>
                  <td>{rupees(order.totalPrice)}</td>
                  <td><span className={badgeFor(order.status)}>{order.status}</span></td>
                  <td><Link to={`/orders/${order._id}`}>Details</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
