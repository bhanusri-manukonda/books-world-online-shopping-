import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getErrorMessage } from '../../api/axios.js';
import AdminTabs from '../../components/AdminTabs.jsx';
import Loader from '../../components/Loader.jsx';
import Message from '../../components/Message.jsx';
import { rupees } from '../../utils/price.js';

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ error: '', success: '' });

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch (err) {
      setStatus({ error: getErrorMessage(err), success: '' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const changeStatus = async (order, newStatus) => {
    try {
      await api.put(`/orders/${order._id}/status`, { status: newStatus });
      setStatus({ error: '', success: 'Order status updated.' });
      load();
    } catch (err) {
      setStatus({ error: getErrorMessage(err), success: '' });
    }
  };

  const markPaid = async (order) => {
    try {
      await api.put(`/orders/${order._id}/status`, { isPaid: !order.isPaid });
      load();
    } catch (err) {
      setStatus({ error: getErrorMessage(err), success: '' });
    }
  };

  const remove = async (order) => {
    if (!window.confirm('Delete this order?')) return;
    try {
      await api.delete(`/orders/${order._id}`);
      setStatus({ error: '', success: 'Order deleted.' });
      load();
    } catch (err) {
      setStatus({ error: getErrorMessage(err), success: '' });
    }
  };

  return (
    <div className="container page">
      <h1>Orders</h1>
      <AdminTabs />

      <Message variant="error">{status.error}</Message>
      <Message variant="success">{status.success}</Message>

      {loading ? (
        <Loader />
      ) : orders.length === 0 ? (
        <div className="panel"><h3>No orders yet</h3><p className="muted">Customer orders will show up here.</p></div>
      ) : (
        <div className="panel table-wrap">
          <table>
            <thead>
              <tr><th>Order</th><th>Customer</th><th>Date</th><th>Total</th><th>Paid</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td><Link to={`/orders/${order._id}`}>{order._id.slice(-6).toUpperCase()}</Link></td>
                  <td>{order.user ? order.user.name : 'Deleted user'}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>{rupees(order.totalPrice)}</td>
                  <td>
                    <button className="btn-sm btn-ghost" onClick={() => markPaid(order)}>
                      {order.isPaid ? 'Paid' : 'Mark paid'}
                    </button>
                  </td>
                  <td>
                    <select value={order.status} onChange={(e) => changeStatus(order, e.target.value)}>
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td><button className="btn-sm btn-danger" onClick={() => remove(order)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
