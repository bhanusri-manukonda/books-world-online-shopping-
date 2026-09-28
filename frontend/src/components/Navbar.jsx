import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const { totalWishlist } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync search input if URL has keyword
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const kw = params.get('keyword');
    if (kw !== null) {
      setSearchQuery(kw);
    }
  }, [location.search]);

  // Close dropdown on route change
  useEffect(() => {
    setDropdownOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      navigate(`/?keyword=${encodeURIComponent(query)}`);
    } else {
      navigate('/');
    }
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/login');
  };

  const userInitial = user?.name ? user.name.trim().charAt(0).toUpperCase() : 'U';

  return (
    <header className="header">
      <div className="container nav-container">
        {/* Brand Logo */}
        <Link to="/" className="brand">
          <span className="brand-icon">📚</span>
          <span>Books<span className="brand-accent">World</span></span>
        </Link>

        {/* Header Search Bar */}
        <form className="header-search" onSubmit={handleSearchSubmit}>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search 50+ books by title, author, category…"
            aria-label="Search books"
          />
          <button type="submit" title="Search books">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </form>

        {/* Navigation & Action Links */}
        <nav className="nav">
          <Link to="/" className="nav-link">
            Explore
          </Link>

          {/* Wishlist Icon */}
          <Link to="/wishlist" className="nav-icon-link" title="My Wishlist">
            <span className="nav-svg-wrap">
              <svg width="20" height="20" viewBox="0 0 24 24" fill={totalWishlist > 0 ? '#ef4444' : 'none'} stroke={totalWishlist > 0 ? '#ef4444' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              {totalWishlist > 0 && <span className="badge-count wishlist-count">{totalWishlist}</span>}
            </span>
            <span className="nav-text-mobile">Wishlist</span>
          </Link>

          {/* Cart Icon */}
          <Link to="/cart" className="nav-icon-link" title="Shopping Cart">
            <span className="nav-svg-wrap">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              {totalItems > 0 && <span className="badge-count cart-count">{totalItems}</span>}
            </span>
            <span className="nav-text-mobile">Cart</span>
          </Link>

          {/* User Account Dropdown or Login/Register */}
          {user ? (
            <div className="user-dropdown-wrapper" ref={dropdownRef}>
              <button
                type="button"
                className="user-profile-btn"
                onClick={() => setDropdownOpen((prev) => !prev)}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                <div className="user-avatar">{userInitial}</div>
                <span className="user-firstname">{user.name.split(' ')[0]}</span>
                <svg className={`chevron ${dropdownOpen ? 'open' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              {dropdownOpen && (
                <div className="profile-dropdown-menu">
                  <div className="dropdown-user-info">
                    <p className="dropdown-user-name">{user.name}</p>
                    <p className="dropdown-user-email">{user.email}</p>
                    {user.isAdmin && <span className="badge badge-amber admin-badge">Administrator</span>}
                  </div>

                  <hr className="dropdown-divider" />

                  <Link to="/profile" className="dropdown-item">
                    <span>👤</span> My Profile
                  </Link>

                  <Link to="/orders" className="dropdown-item">
                    <span>📦</span> My Orders
                  </Link>

                  <Link to="/wishlist" className="dropdown-item">
                    <span>❤️</span> My Wishlist {totalWishlist > 0 && `(${totalWishlist})`}
                  </Link>

                  {user.isAdmin && (
                    <>
                      <hr className="dropdown-divider" />
                      <Link to="/admin" className="dropdown-item dropdown-admin-link">
                        <span>⚙️</span> Admin Dashboard
                      </Link>
                      <Link to="/admin/books" className="dropdown-item dropdown-sub-link">
                        Manage Books & Discounts
                      </Link>
                      <Link to="/admin/orders" className="dropdown-item dropdown-sub-link">
                        Manage Orders
                      </Link>
                      <Link to="/admin/users" className="dropdown-item dropdown-sub-link">
                        Manage Users
                      </Link>
                    </>
                  )}

                  <hr className="dropdown-divider" />

                  <button type="button" className="dropdown-item logout-btn" onClick={handleLogout}>
                    <span>🚪</span> Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-ghost btn-sm">
                Log in
              </Link>
              <Link to="/register" className="btn-amber btn-sm">
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
