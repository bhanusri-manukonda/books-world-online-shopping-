import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getErrorMessage } from '../api/axios.js';
import Message from '../components/Message.jsx';

// Strict validation patterns per requirement:
// 1. Name: must start with a letter; allow only letters, numbers and spaces; reject numbers at the beginning and special characters
const NAME_REGEX = /^[a-zA-Z][a-zA-Z0-9 ]*$/;

// 2. Email: accept Gmail addresses only, such as example@gmail.com
const GMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;

// 3. Password: minimum 8 characters with at least 1 uppercase, 1 lowercase, 1 number and 1 special character
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+=-])[A-Za-z\d@$!%*?&#^()_+=-]{8,}$/;

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear specific field error when typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const next = {};

    // Name validation
    if (!form.name.trim()) {
      next.name = 'Please enter your name.';
    } else if (!NAME_REGEX.test(form.name.trim())) {
      next.name =
        'Name must start with a letter and contain only letters, numbers, and spaces (no special characters).';
    }

    // Email validation (Gmail only)
    if (!form.email.trim()) {
      next.email = 'Please enter your email.';
    } else if (!GMAIL_REGEX.test(form.email.trim())) {
      next.email = 'Only Gmail addresses are accepted (e.g., example@gmail.com).';
    }

    // Password validation
    if (!form.password) {
      next.password = 'Please create a password.';
    } else if (form.password.length < 8) {
      next.password = 'Password must be at least 8 characters long.';
    } else if (!PASSWORD_REGEX.test(form.password)) {
      next.password =
        'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@$!%*?&#^()_+=-).';
    }

    // Confirm password
    if (form.password !== form.confirm) {
      next.confirm = 'Both passwords must match.';
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
      await register(form.name.trim(), form.email.trim(), form.password);
      navigate('/', { replace: true });
    } catch (err) {
      setServerError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Password criteria indicators
  const hasLength = form.password.length >= 8;
  const hasUpper = /[A-Z]/.test(form.password);
  const hasLower = /[a-z]/.test(form.password);
  const hasNum = /\d/.test(form.password);
  const hasSpecial = /[@$!%*?&#^()_+=-]/.test(form.password);

  return (
    <div className="container page">
      <div className="panel form-card">
        <h1>Create Your Account</h1>
        <p className="muted small">Join Books World for personalized recommendations, wishlists and express delivery.</p>

        <Message variant="error">{serverError}</Message>

        <form onSubmit={submit} noValidate style={{ marginTop: '1.25rem' }}>
          {/* Name Field */}
          <div className="field">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="e.g. Bhanu Sri"
              value={form.name}
              onChange={change}
              className={errors.name ? 'input-error' : ''}
            />
            {errors.name ? (
              <p className="field-error">{errors.name}</p>
            ) : (
              <p className="small muted">Must start with a letter; letters, numbers and spaces only.</p>
            )}
          </div>

          {/* Email Field (Gmail Only) */}
          <div className="field">
            <label htmlFor="email">Gmail Address</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="e.g. yourname@gmail.com"
              value={form.email}
              onChange={change}
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email ? (
              <p className="field-error">{errors.email}</p>
            ) : (
              <p className="small muted">Only Gmail accounts (@gmail.com) are accepted.</p>
            )}
          </div>

          {/* Password Field */}
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="At least 8 characters with upper, lower, number, special"
              value={form.password}
              onChange={change}
              className={errors.password ? 'input-error' : ''}
            />
            {errors.password && <p className="field-error">{errors.password}</p>}

            {/* Visual criteria checklist */}
            <div className="password-checklist">
              <span className={`check-item ${hasLength ? 'valid' : ''}`}>
                {hasLength ? '✓' : '○'} 8+ chars
              </span>
              <span className={`check-item ${hasUpper ? 'valid' : ''}`}>
                {hasUpper ? '✓' : '○'} 1 uppercase
              </span>
              <span className={`check-item ${hasLower ? 'valid' : ''}`}>
                {hasLower ? '✓' : '○'} 1 lowercase
              </span>
              <span className={`check-item ${hasNum ? 'valid' : ''}`}>
                {hasNum ? '✓' : '○'} 1 number
              </span>
              <span className={`check-item ${hasSpecial ? 'valid' : ''}`}>
                {hasSpecial ? '✓' : '○'} 1 special char
              </span>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="field">
            <label htmlFor="confirm">Confirm Password</label>
            <input
              id="confirm"
              name="confirm"
              type="password"
              placeholder="Re-enter your password"
              value={form.confirm}
              onChange={change}
              className={errors.confirm ? 'input-error' : ''}
            />
            {errors.confirm && <p className="field-error">{errors.confirm}</p>}
          </div>

          <button className="btn-amber btn-block" style={{ marginTop: '1.5rem' }} disabled={loading}>
            {loading ? 'Creating Account…' : 'Register Account'}
          </button>
        </form>

        <p className="small muted" style={{ marginTop: '1.25rem', textAlign: 'center' }}>
          Already have an account? <Link to="/login">Log in here</Link>
        </p>
      </div>
    </div>
  );
}
