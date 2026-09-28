import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getErrorMessage } from '../../api/axios.js';
import AdminTabs from '../../components/AdminTabs.jsx';
import Loader from '../../components/Loader.jsx';
import Message from '../../components/Message.jsx';
import { rupees } from '../../utils/price.js';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/users/stats/summary')
      .then(({ data }) => setStats(data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container page">
      <h1>Admin</h1>
      <AdminTabs />
      <Message variant="error">{error}</Message>

      {loading ? (
        <Loader />
      ) : (
        stats && (
          <>
            <div className="stats">
              <div className="panel"><p className="muted small">Books in catalogue</p><p className="stat-value">{stats.books}</p></div>
              <div className="panel"><p className="muted small">Registered users</p><p className="stat-value">{stats.users}</p></div>
              <div className="panel"><p className="muted small">Orders placed</p><p className="stat-value">{stats.orders}</p></div>
              <div className="panel"><p className="muted small">Orders awaiting action</p><p className="stat-value">{stats.pending}</p></div>
              <div className="panel"><p className="muted small">Total sales</p><p className="stat-value">{rupees(stats.revenue)}</p></div>
              <div className="panel"><p className="muted small">Discount given</p><p className="stat-value saving">{rupees(stats.saved)}</p></div>
            </div>

            <div className="row" style={{ marginTop: '1.5rem' }}>
              <Link className="btn" to="/admin/books/new">Add a book</Link>
              <Link className="btn btn-ghost" to="/admin/orders">Review orders</Link>
              <Link className="btn btn-ghost" to="/admin/books">Prices and discounts</Link>
            </div>
          </>
        )
      )}
    </div>
  );
}
