import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getErrorMessage } from '../api/axios.js';
import Message from '../components/Message.jsx';

export default function Profile() {
  const { user, updateProfile } = useAuth();

  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    address: user.address || '',
    password: '',
    confirm: '',
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ error: '', success: '' });
  const [loading, setLoading] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const next = {};
    const nameRegex = /^[a-zA-Z][a-zA-Z0-9 ]*$/;
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+=-])[A-Za-z\d@$!%*?&#^()_+=-]{8,}$/;

    if (!form.name.trim()) {
      next.name = 'Please enter your name.';
    } else if (!nameRegex.test(form.name.trim())) {
      next.name = 'Name must start with a letter and contain only letters, numbers and spaces.';
    }

    if (!form.email.trim()) {
      next.email = 'Please enter your Gmail address.';
    } else if (!gmailRegex.test(form.email.trim())) {
      next.email = 'Only Gmail addresses (@gmail.com) are accepted.';
    }

    if (form.phone && !/^\d{10}$/.test(form.phone.trim())) {
      next.phone = 'Phone number must be exactly 10 digits.';
    }

    if (form.password) {
      if (form.password.length < 8) {
        next.password = 'Password must be at least 8 characters long.';
      } else if (!passwordRegex.test(form.password)) {
        next.password = 'Password must contain 1 uppercase, 1 lowercase, 1 digit and 1 special character.';
      }
      if (form.password !== form.confirm) {
        next.confirm = 'Both passwords must match.';
      }
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ error: '', success: '' });
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
      };
      if (form.password) payload.password = form.password;

      await updateProfile(payload);
      setForm({ ...form, password: '', confirm: '' });
      setStatus({ error: '', success: 'Profile saved.' });
    } catch (err) {
      setStatus({ error: getErrorMessage(err), success: '' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page">
      <h1>Your profile</h1>
      <p className="muted small">
        Signed in as {user.email}. <Link to="/orders">View your orders</Link>
      </p>

      <form className="panel" style={{ maxWidth: 520 }} onSubmit={submit} noValidate>
        <Message variant="error">{status.error}</Message>
        <Message variant="success">{status.success}</Message>

        <div className="field">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" value={form.name} onChange={change} />
          {errors.name && <p className="field-error">{errors.name}</p>}
        </div>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={form.email} onChange={change} />
          {errors.email && <p className="field-error">{errors.email}</p>}
        </div>

        <div className="field">
          <label htmlFor="phone">Phone</label>
          <input id="phone" name="phone" value={form.phone} onChange={change} />
          {errors.phone && <p className="field-error">{errors.phone}</p>}
        </div>

        <div className="field">
          <label htmlFor="address">Default address</label>
          <textarea id="address" name="address" value={form.address} onChange={change} />
        </div>

        <div className="field">
          <label htmlFor="password">New password (leave blank to keep the current one)</label>
          <input id="password" name="password" type="password" value={form.password} onChange={change} />
          {errors.password && <p className="field-error">{errors.password}</p>}
        </div>

        <div className="field">
          <label htmlFor="confirm">Confirm new password</label>
          <input id="confirm" name="confirm" type="password" value={form.confirm} onChange={change} />
          {errors.confirm && <p className="field-error">{errors.confirm}</p>}
        </div>

        <button style={{ marginTop: '1.2rem' }} disabled={loading}>
          {loading ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </div>
  );
}
