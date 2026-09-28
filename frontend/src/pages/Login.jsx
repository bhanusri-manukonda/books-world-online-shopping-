import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getErrorMessage } from '../api/axios.js';
import Message from '../components/Message.jsx';

const GMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const next = {};
    if (!form.email.trim()) {
      next.email = 'Please enter your Gmail address.';
    } else if (!GMAIL_REGEX.test(form.email.trim())) {
      next.email = 'Only Gmail addresses are accepted (e.g. example@gmail.com).';
    }
    if (!form.password) {
      next.password = 'Please enter your password.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setLoading(true);
    try {
      const user = await login(form.email.trim(), form.password);
      navigate(location.state?.from || (user.isAdmin ? '/admin' : '/'), { replace: true });
    } catch (err) {
      setServerError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    if (role === 'admin') {
      setForm({ email: 'admin@gmail.com', password: 'Admin@123' });
    } else {
      setForm({ email: 'customer@gmail.com', password: 'Customer@123' });
    }
    setErrors({});
    setServerError('');
  };

  return (
    <div className="container page">
      <div className="panel form-card">
        <h1>Welcome Back</h1>
        <p className="muted small">Log in to Books World with your Gmail account.</p>

        {/* Demo Credentials Box */}
        <div className="demo-credentials-box">
          <p className="demo-title">💡 Quick Test Credentials</p>
          <div className="demo-buttons">
            <button
              type="button"
              className="btn-ghost btn-sm"
              onClick={() => fillDemo('admin')}
              title="admin@gmail.com / Admin@123"
            >
              Fill Admin (admin@gmail.com)
            </button>
            <button
              type="button"
              className="btn-ghost btn-sm"
              onClick={() => fillDemo('customer')}
              title="customer@gmail.com / Customer@123"
            >
              Fill Customer (customer@gmail.com)
            </button>
          </div>
        </div>

        <Message variant="error">{serverError}</Message>

        <form onSubmit={submit} noValidate style={{ marginTop: '1rem' }}>
          <div className="field">
            <label htmlFor="email">Gmail Address</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="e.g. example@gmail.com"
              value={form.email}
              onChange={change}
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <p className="field-error">{errors.email}</p>}
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={change}
              className={errors.password ? 'input-error' : ''}
            />
            {errors.password && <p className="field-error">{errors.password}</p>}
          </div>

          <button className="btn-amber btn-block" style={{ marginTop: '1.25rem' }} disabled={loading}>
            {loading ? 'Logging in…' : 'Log In'}
          </button>
        </form>

        <p className="small muted" style={{ marginTop: '1.25rem', textAlign: 'center' }}>
          Don't have an account? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
