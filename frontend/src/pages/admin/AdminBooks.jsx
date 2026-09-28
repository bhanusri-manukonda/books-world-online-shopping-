import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getErrorMessage } from '../../api/axios.js';
import { rupees, finalPriceOf } from '../../utils/price.js';
import AdminTabs from '../../components/AdminTabs.jsx';
import Loader from '../../components/Loader.jsx';
import Message from '../../components/Message.jsx';

export default function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ error: '', success: '' });

  // the row currently being price-edited
  const [editing, setEditing] = useState(null); // { id, price, discountPercent }
  const [bulk, setBulk] = useState({ category: '', discountPercent: '' });

  const load = async (pageNumber = page) => {
    setLoading(true);
    try {
      const { data } = await api.get('/books', { params: { page: pageNumber, limit: 12 } });
      setBooks(data.books);
      setPages(data.pages);
      setPage(data.page);
    } catch (err) {
      setStatus({ error: getErrorMessage(err), success: '' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1);
    api.get('/books/filters').then(({ data }) => setCategories(data.categories)).catch(() => {});
  }, []);

  const savePricing = async () => {
    const price = Number(editing.price);
    const discountPercent = Number(editing.discountPercent);

    if (Number.isNaN(price) || price < 0) {
      return setStatus({ error: 'Price must be 0 or more.', success: '' });
    }
    if (Number.isNaN(discountPercent) || discountPercent < 0 || discountPercent > 90) {
      return setStatus({ error: 'Discount must be between 0 and 90 percent.', success: '' });
    }

    try {
      await api.patch(`/books/${editing.id}/pricing`, { price, discountPercent });
      setStatus({ error: '', success: 'Price updated.' });
      setEditing(null);
      load(page);
    } catch (err) {
      setStatus({ error: getErrorMessage(err), success: '' });
    }
  };

  const applyBulk = async (e) => {
    e.preventDefault();
    const value = Number(bulk.discountPercent);
    if (Number.isNaN(value) || value < 0 || value > 90) {
      return setStatus({ error: 'Discount must be between 0 and 90 percent.', success: '' });
    }

    const where = bulk.category || 'every category';
    if (!window.confirm(`Set a ${value}% discount on ${where}?`)) return;

    try {
      const { data } = await api.post('/books/discounts/bulk', {
        category: bulk.category,
        discountPercent: value,
      });
      setStatus({ error: '', success: data.message });
      load(page);
    } catch (err) {
      setStatus({ error: getErrorMessage(err), success: '' });
    }
  };

  const remove = async (book) => {
    if (!window.confirm(`Delete "${book.title}" from the catalogue?`)) return;
    try {
      await api.delete(`/books/${book._id}`);
      setStatus({ error: '', success: `"${book.title}" deleted.` });
      load(page);
    } catch (err) {
      setStatus({ error: getErrorMessage(err), success: '' });
    }
  };

  return (
    <div className="container page">
      <div className="row between">
        <h1>Books</h1>
        <Link className="btn" to="/admin/books/new">Add a book</Link>
      </div>
      <AdminTabs />

      <Message variant="error">{status.error}</Message>
      <Message variant="success">{status.success}</Message>

      <form className="panel" onSubmit={applyBulk} style={{ marginBottom: '1.25rem' }}>
        <h3>Run a sale</h3>
        <p className="muted small">
          Sets the same discount on every book in one category. Leave the category empty to
          apply it to the whole store.
        </p>
        <div className="row">
          <select
            value={bulk.category}
            aria-label="Category for the sale"
            onChange={(e) => setBulk({ ...bulk, category: e.target.value })}
            style={{ width: 200 }}
          >
            <option value="">Every category</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input
            type="number"
            min="0"
            max="90"
            placeholder="Discount %"
            aria-label="Discount percentage"
            value={bulk.discountPercent}
            onChange={(e) => setBulk({ ...bulk, discountPercent: e.target.value })}
            style={{ width: 140 }}
          />
          <button type="submit">Apply discount</button>
        </div>
      </form>

      {loading ? (
        <Loader />
      ) : (
        <div className="panel table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th><th>Author</th><th>Category</th>
                <th>Price</th><th>Discount</th><th>Selling at</th><th>Stock</th><th></th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => {
                const isEditing = editing?.id === book._id;
                return (
                  <tr key={book._id}>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.category}</td>

                    <td>
                      {isEditing ? (
                        <input
                          type="number"
                          min="0"
                          value={editing.price}
                          aria-label="Price"
                          onChange={(e) => setEditing({ ...editing, price: e.target.value })}
                          style={{ width: 90 }}
                        />
                      ) : (
                        rupees(book.price)
                      )}
                    </td>

                    <td>
                      {isEditing ? (
                        <input
                          type="number"
                          min="0"
                          max="90"
                          value={editing.discountPercent}
                          aria-label="Discount percentage"
                          onChange={(e) => setEditing({ ...editing, discountPercent: e.target.value })}
                          style={{ width: 80 }}
                        />
                      ) : book.discountPercent > 0 ? (
                        <span className="badge badge-amber">{book.discountPercent}% off</span>
                      ) : (
                        <span className="muted">—</span>
                      )}
                    </td>

                    <td><strong>{rupees(finalPriceOf(book))}</strong></td>
                    <td>{book.countInStock}</td>

                    <td className="row" style={{ gap: '0.5rem' }}>
                      {isEditing ? (
                        <>
                          <button className="btn-sm" onClick={savePricing}>Save</button>
                          <button className="btn-sm btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <button
                            className="btn-sm btn-ghost"
                            onClick={() =>
                              setEditing({
                                id: book._id,
                                price: book.price,
                                discountPercent: book.discountPercent,
                              })
                            }
                          >
                            Price
                          </button>
                          <Link className="btn btn-sm btn-ghost" to={`/admin/books/${book._id}/edit`}>Edit</Link>
                          <button className="btn-sm btn-danger" onClick={() => remove(book)}>Delete</button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {pages > 1 && (
        <div className="pagination">
          {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
            <button key={n} className={n === page ? 'btn-sm' : 'btn-sm btn-ghost'} onClick={() => load(n)}>
              {n}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
