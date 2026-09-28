import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api, { getErrorMessage } from '../api/axios.js';
import BookCard from '../components/BookCard.jsx';
import BannerSlider from '../components/BannerSlider.jsx';
import Loader from '../components/Loader.jsx';
import Message from '../components/Message.jsx';

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') || '';
  const author = searchParams.get('author') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = Number(searchParams.get('page')) || 1;

  const [term, setTerm] = useState(keyword);
  const [books, setBooks] = useState([]);
  const [filters, setFilters] = useState({ categories: [], authors: [] });
  const [pages, setPages] = useState(1);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Sync internal search state when URL keyword changes
  useEffect(() => {
    setTerm(keyword);
  }, [keyword]);

  // Dropdown values are loaded once
  useEffect(() => {
    api.get('/books/filters').then(({ data }) => setFilters(data)).catch(() => {});
  }, []);

  // Books reload whenever any filter in the URL changes
  useEffect(() => {
    const loadBooks = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get('/books', {
          params: { keyword, author, category, sort, page },
        });
        setBooks(data.books);
        setPages(data.pages);
        setCount(data.count);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    loadBooks();
  }, [keyword, author, category, sort, page]);

  // Keeps the other filters intact when one of them changes
  const setFilter = (changes) =>
    setSearchParams({ keyword, author, category, sort, page: 1, ...changes });

  const applySearch = (event) => {
    event.preventDefault();
    setFilter({ keyword: term });
  };

  const clearAll = () => {
    setTerm('');
    setSearchParams({});
  };

  const filtersActive = keyword || author || category || sort !== 'newest';

  return (
    <>
      {/* Homepage Banner Slider with Deals, New Arrivals & AP Delivery */}
      <BannerSlider />

      <div className="container page" id="books-section">
        {/* Section Title & Search */}
        <div className="section-head">
          <div>
            <h2>Browse Book Catalogue</h2>
            <p className="muted small">
              Explore 60+ hand-picked books with discounts, real covers & fast AP delivery.
            </p>
          </div>
          <form className="catalog-search" onSubmit={applySearch}>
            <input
              type="search"
              value={term}
              placeholder="Search title or author…"
              aria-label="Filter catalog"
              onChange={(e) => setTerm(e.target.value)}
            />
            <button type="submit">Filter</button>
          </form>
        </div>

        {/* Filter Controls Bar */}
        <div className="filter-bar">
          <div>
            <label htmlFor="category">Category</label>
            <select id="category" value={category} onChange={(e) => setFilter({ category: e.target.value })}>
              <option value="">All categories ({filters.categories.length})</option>
              {filters.categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="author">Author</label>
            <select id="author" value={author} onChange={(e) => setFilter({ author: e.target.value })}>
              <option value="">All authors ({filters.authors.length})</option>
              {filters.authors.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="sort">Sort by</label>
            <select id="sort" value={sort} onChange={(e) => setFilter({ sort: e.target.value })}>
              <option value="newest">Newest first</option>
              <option value="title">Title A–Z</option>
              <option value="author">Author A–Z</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
              <option value="discount">Biggest discount</option>
            </select>
          </div>

          {filtersActive && (
            <button className="btn-ghost btn-sm" onClick={clearAll}>Clear filters</button>
          )}
        </div>

        <p className="muted small">
          {loading ? 'Searching…' : `${count} book${count === 1 ? '' : 's'} available`}
          {keyword && ` matching "${keyword}"`}
        </p>

        <Message variant="error">{error}</Message>

        {loading ? (
          <Loader text="Pulling books off the shelf…" />
        ) : books.length === 0 ? (
          <div className="panel" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
            <h3>No books match that search</h3>
            <p className="muted">Try a different title, author or category, or clear your filters.</p>
            <button className="btn-ghost" onClick={clearAll} style={{ marginTop: '1rem' }}>Clear all filters</button>
          </div>
        ) : (
          <div className="grid">
            {books.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        )}

        {pages > 1 && (
          <div className="pagination">
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                className={n === page ? 'btn-sm' : 'btn-sm btn-ghost'}
                onClick={() => setSearchParams({ keyword, author, category, sort, page: n })}
              >
                {n}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
