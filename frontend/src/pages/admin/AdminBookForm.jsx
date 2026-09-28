import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api, { getErrorMessage } from '../../api/axios.js';
import { rupees } from '../../utils/price.js';
import AdminTabs from '../../components/AdminTabs.jsx';
import Loader from '../../components/Loader.jsx';
import Message from '../../components/Message.jsx';

// Used for both "Add a book" and "Edit book" — the URL decides which.
export default function AdminBookForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '', author: '', category: '', price: '', discountPercent: 0,
    countInStock: '', image: '', description: '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    api
      .get(`/books/${id}`)
      .then(({ data }) =>
        setForm({
          title: data.title,
          author: data.author,
          category: data.category,
          price: data.price,
          discountPercent: data.discountPercent,
          countInStock: data.countInStock,
          image: data.image,
          description: data.description,
        })
      )
      .catch((err) => setServerError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = 'Enter the book title.';
    if (!form.author.trim()) next.author = 'Enter the author name.';
    if (!form.category.trim()) next.category = 'Enter a category.';
    if (form.price === '' || Number(form.price) < 0) next.price = 'Price must be 0 or more.';
    if (Number(form.discountPercent) < 0 || Number(form.discountPercent) > 90)
      next.discountPercent = 'Discount must be between 0 and 90 percent.';
    if (form.countInStock === '' || Number(form.countInStock) < 0)
      next.countInStock = 'Stock must be 0 or more.';
    if (!form.description.trim()) next.description = 'Enter a short description.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    const payload = {
      ...form,
      price: Number(form.price),
      discountPercent: Number(form.discountPercent),
      countInStock: Number(form.countInStock),
    };

    setSaving(true);
    try {
      if (isEdit) await api.put(`/books/${id}`, payload);
      else await api.post('/books', payload);
      navigate('/admin/books');
    } catch (err) {
      setServerError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  // live preview of what the customer will see
  const price = Number(form.price) || 0;
  const discount = Number(form.discountPercent) || 0;
  const finalPrice = Math.round((price * (100 - discount)) / 100);

  if (loading) return <div className="container page"><Loader /></div>;

  return (
    <div className="container page">
      <h1>{isEdit ? 'Edit book' : 'Add a book'}</h1>
      <AdminTabs />

      <form className="panel" style={{ maxWidth: 560 }} onSubmit={submit} noValidate>
        <Message variant="error">{serverError}</Message>

        <div className="field">
          <label htmlFor="title">Title</label>
          <input id="title" name="title" value={form.title} onChange={change} />
          {errors.title && <p className="field-error">{errors.title}</p>}
        </div>

        <div className="field">
          <label htmlFor="author">Author</label>
          <input id="author" name="author" value={form.author} onChange={change} />
          {errors.author && <p className="field-error">{errors.author}</p>}
        </div>

        <div className="field">
          <label htmlFor="category">Category</label>
          <input id="category" name="category" value={form.category} onChange={change} placeholder="Fiction, Science, Technology…" />
          {errors.category && <p className="field-error">{errors.category}</p>}
        </div>

        <div className="field">
          <label htmlFor="price">Printed price (₹)</label>
          <input id="price" name="price" type="number" min="0" value={form.price} onChange={change} />
          {errors.price && <p className="field-error">{errors.price}</p>}
        </div>

        <div className="field">
          <label htmlFor="discountPercent">Discount (%)</label>
          <input
            id="discountPercent"
            name="discountPercent"
            type="number"
            min="0"
            max="90"
            value={form.discountPercent}
            onChange={change}
          />
          {errors.discountPercent && <p className="field-error">{errors.discountPercent}</p>}
        </div>

        <div className="alert alert-info">
          Customers will see <strong>{rupees(finalPrice)}</strong>
          {discount > 0 && <> instead of {rupees(price)} — they save {rupees(price - finalPrice)}.</>}
          {discount === 0 && <> with no discount label.</>}
        </div>

        <div className="field">
          <label htmlFor="countInStock">Copies in stock</label>
          <input id="countInStock" name="countInStock" type="number" min="0" value={form.countInStock} onChange={change} />
          {errors.countInStock && <p className="field-error">{errors.countInStock}</p>}
        </div>

        <div className="field">
          <label htmlFor="image">Cover image URL</label>
          <input id="image" name="image" value={form.image} onChange={change} placeholder="https://…" />
          <p className="small muted" style={{ marginTop: '0.3rem' }}>
            Leave blank and run <code>npm run covers</code> in the backend to fetch one automatically.
          </p>
        </div>

        <div className="field">
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" value={form.description} onChange={change} />
          {errors.description && <p className="field-error">{errors.description}</p>}
        </div>

        <div className="row" style={{ marginTop: '1.2rem' }}>
          <button disabled={saving}>{saving ? 'Saving…' : isEdit ? 'Save changes' : 'Add book'}</button>
          <button type="button" className="btn-ghost" onClick={() => navigate('/admin/books')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
