import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api, { getErrorMessage } from '../api/axios.js';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { rupees } from '../utils/price.js';
import Message from '../components/Message.jsx';

// Andhra Pradesh Delivery Locations per requirement
export const AP_DELIVERY_LOCATIONS = [
  'Visakhapatnam',
  'Vijayawada',
  'Guntur',
  'Nellore',
  'Kurnool',
  'Rajahmundry',
  'Kakinada',
  'Tirupati',
  'Kadapa',
  'Anantapur',
  'Vizianagaram',
  'Eluru',
  'Ongole',
  'Nandyal',
  'Machilipatnam',
  'Adoni',
  'Tenali',
  'Proddatur',
  'Chittoor',
  'Hindupur',
  'Bhimavaram',
  'Madanapalle',
  'Guntakal',
  'Srikakulam',
  'Dharmavaram',
  'Gudivada',
  'Narasaraopet',
  'Tadepalligudem',
  'Mangalagiri',
  'Chilakaluripet',
  'Bapatla',
  'Other Andhra Pradesh Town',
];

const NAME_REGEX = /^[a-zA-Z][a-zA-Z0-9 ]*$/;

export default function Checkout() {
  const { items, itemsPrice, savedPrice, shippingPrice, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: user?.name || '',
    address: user?.address || '',
    city: 'Kakinada', // Default select from AP cities
    postalCode: '',
    phone: user?.phone || '',
    paymentMethod: 'Cash on delivery',
  });
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
    if (!form.fullName.trim()) {
      next.fullName = 'Please enter receiver name.';
    } else if (!NAME_REGEX.test(form.fullName.trim())) {
      next.fullName = 'Name must start with a letter and contain no special characters.';
    }

    if (!form.address.trim()) {
      next.address = 'Please enter flat/street/locality address.';
    }

    if (!form.city.trim()) {
      next.city = 'Please select an Andhra Pradesh delivery city.';
    }

    if (!/^\d{6}$/.test(form.postalCode.trim())) {
      next.postalCode = 'Enter a valid 6-digit PIN code.';
    }

    if (!/^\d{10}$/.test(form.phone.trim())) {
      next.phone = 'Enter a valid 10-digit mobile number.';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setLoading(true);
    try {
      const { data } = await api.post('/orders', {
        orderItems: items.map(({ book, qty }) => ({ book, qty })),
        shippingAddress: {
          fullName: form.fullName.trim(),
          address: form.address.trim(),
          city: `${form.city}, Andhra Pradesh`,
          postalCode: form.postalCode.trim(),
          phone: form.phone.trim(),
        },
        paymentMethod: form.paymentMethod,
      });
      clearCart();
      navigate(`/orders/${data._id}`, { replace: true });
    } catch (err) {
      setServerError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container page">
        <div className="panel" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <h2>Your cart is empty</h2>
          <p className="muted" style={{ margin: '0.75rem 0 1.5rem 0' }}>
            Add some books to your cart to proceed with checkout.
          </p>
          <Link to="/" className="btn-amber">Browse Books</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container page">
      <h1>Checkout & Delivery</h1>
      <p className="muted small">Fast doorstep book delivery across Andhra Pradesh.</p>

      <div className="detail" style={{ gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem', marginTop: '1.5rem' }}>
        {/* Delivery Form */}
        <form className="panel" onSubmit={placeOrder} noValidate>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3>Shipping Details</h3>
            <span className="badge badge-green">AP Express Route</span>
          </div>

          <Message variant="error">{serverError}</Message>

          <div className="field">
            <label htmlFor="fullName">Receiver Name</label>
            <input
              id="fullName"
              name="fullName"
              value={form.fullName}
              onChange={change}
              placeholder="e.g. Bhanu Sri"
              className={errors.fullName ? 'input-error' : ''}
            />
            {errors.fullName && <p className="field-error">{errors.fullName}</p>}
          </div>

          <div className="field">
            <label htmlFor="phone">10-Digit Mobile Number</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={change}
              placeholder="e.g. 9876543210"
              className={errors.phone ? 'input-error' : ''}
            />
            {errors.phone && <p className="field-error">{errors.phone}</p>}
          </div>

          <div className="field">
            <label htmlFor="address">Door No., Street, Landmark</label>
            <input
              id="address"
              name="address"
              value={form.address}
              onChange={change}
              placeholder="e.g. Flat 302, Sri Rama Nilayam, Main Road"
              className={errors.address ? 'input-error' : ''}
            />
            {errors.address && <p className="field-error">{errors.address}</p>}
          </div>

          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
            {/* Andhra Pradesh Location Dropdown */}
            <div className="field">
              <label htmlFor="city">Andhra Pradesh City / Town</label>
              <select
                id="city"
                name="city"
                value={form.city}
                onChange={change}
                className={errors.city ? 'input-error' : ''}
              >
                <option value="">-- Select AP City / Town --</option>
                {AP_DELIVERY_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
              {errors.city && <p className="field-error">{errors.city}</p>}
            </div>

            <div className="field">
              <label htmlFor="postalCode">6-Digit PIN Code</label>
              <input
                id="postalCode"
                name="postalCode"
                value={form.postalCode}
                onChange={change}
                placeholder="e.g. 533001"
                maxLength={6}
                className={errors.postalCode ? 'input-error' : ''}
              >
              </input>
              {errors.postalCode && <p className="field-error">{errors.postalCode}</p>}
            </div>
          </div>

          <div className="field" style={{ marginTop: '0.5rem' }}>
            <label htmlFor="paymentMethod">Payment Method</label>
            <select id="paymentMethod" name="paymentMethod" value={form.paymentMethod} onChange={change}>
              <option value="Cash on delivery">Cash on Delivery (Pay upon arrival)</option>
              <option value="UPI on delivery">UPI on Delivery (GPay / PhonePe / Paytm)</option>
              <option value="Online Prepaid">Online Prepaid (NetBanking / Card)</option>
            </select>
          </div>

          <button className="btn-amber btn-block" style={{ marginTop: '1.5rem', padding: '0.85rem' }} disabled={loading}>
            {loading ? 'Confirming Order…' : `Place Order • ${rupees(totalPrice)}`}
          </button>
        </form>

        {/* Order Summary Sidebar */}
        <aside className="panel" style={{ height: 'fit-content' }}>
          <h3>Order Summary</h3>
          <div style={{ maxHeight: 220, overflowY: 'auto', margin: '0.75rem 0' }}>
            {items.map((item) => (
              <div className="summary-row small" key={item.book} style={{ padding: '0.35rem 0' }}>
                <span style={{ maxWidth: '65%', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {item.title} × {item.qty}
                </span>
                <span>{rupees(item.price * item.qty)}</span>
              </div>
            ))}
          </div>

          <hr className="dropdown-divider" />

          <div className="summary-row">
            <span>Items Subtotal</span>
            <span>{rupees(itemsPrice)}</span>
          </div>

          {savedPrice > 0 && (
            <div className="summary-row saving">
              <span>Total Discount Savings</span>
              <span>− {rupees(savedPrice)}</span>
            </div>
          )}

          <div className="summary-row">
            <span>Delivery to {form.city || 'AP'}</span>
            <span>{shippingPrice === 0 ? <strong style={{ color: 'var(--green)' }}>FREE</strong> : rupees(shippingPrice)}</span>
          </div>

          <div className="summary-row summary-total" style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '2px solid var(--line)' }}>
            <span>Final Amount</span>
            <span style={{ color: 'var(--amber)', fontSize: '1.3rem' }}>{rupees(totalPrice)}</span>
          </div>

          <p className="small muted" style={{ marginTop: '0.75rem', textAlign: 'center' }}>
            🎉 Free Andhra Pradesh shipping on all orders above ₹500!
          </p>
        </aside>
      </div>
    </div>
  );
}
