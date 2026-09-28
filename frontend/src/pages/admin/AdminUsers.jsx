import { useEffect, useState } from 'react';
import api, { getErrorMessage } from '../../api/axios.js';
import { useAuth } from '../../context/AuthContext.jsx';
import AdminTabs from '../../components/AdminTabs.jsx';
import Loader from '../../components/Loader.jsx';
import Message from '../../components/Message.jsx';

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ error: '', success: '' });

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } catch (err) {
      setStatus({ error: getErrorMessage(err), success: '' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleAdmin = async (user) => {
    try {
      await api.put(`/users/${user._id}`, { isAdmin: !user.isAdmin });
      setStatus({ error: '', success: `${user.name} is now ${user.isAdmin ? 'a customer' : 'an admin'}.` });
      load();
    } catch (err) {
      setStatus({ error: getErrorMessage(err), success: '' });
    }
  };

  const remove = async (user) => {
    if (!window.confirm(`Delete ${user.name} and their orders?`)) return;
    try {
      await api.delete(`/users/${user._id}`);
      setStatus({ error: '', success: `${user.name} deleted.` });
      load();
    } catch (err) {
      setStatus({ error: getErrorMessage(err), success: '' });
    }
  };

  return (
    <div className="container page">
      <h1>Users</h1>
      <AdminTabs />

      <Message variant="error">{status.error}</Message>
      <Message variant="success">{status.success}</Message>

      {loading ? (
        <Loader />
      ) : (
        <div className="panel table-wrap">
          <table>
            <thead>
              <tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th></th></tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={user.isAdmin ? 'badge badge-green' : 'badge'}>
                      {user.isAdmin ? 'Admin' : 'Customer'}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="row" style={{ gap: '0.5rem' }}>
                    <button className="btn-sm btn-ghost" onClick={() => toggleAdmin(user)}>
                      {user.isAdmin ? 'Make customer' : 'Make admin'}
                    </button>
                    <button
                      className="btn-sm btn-danger"
                      disabled={user._id === currentUser._id}
                      onClick={() => remove(user)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
