import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import api from '../api/axios.js';
import { useAuth } from './AuthContext.jsx';

const WishlistContext = createContext();

const STORAGE_KEY = 'bw_guest_wishlist';

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sync with backend when user logs in, or fallback to localStorage for guests
  useEffect(() => {
    let isMounted = true;

    const fetchWishlist = async () => {
      if (user) {
        setLoading(true);
        try {
          const { data } = await api.get('/auth/wishlist');
          if (isMounted) setWishlist(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error('Failed to load wishlist:', err);
          if (isMounted) setWishlist([]);
        } finally {
          if (isMounted) setLoading(false);
        }
      } else {
        // Guest mode from localStorage
        try {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (isMounted) setWishlist(saved ? JSON.parse(saved) : []);
        } catch {
          if (isMounted) setWishlist([]);
        }
      }
    };

    fetchWishlist();

    return () => {
      isMounted = false;
    };
  }, [user]);

  // Fast ID lookup set
  const wishlistIds = useMemo(() => {
    return new Set(wishlist.map((item) => (item._id || item.id || item).toString()));
  }, [wishlist]);

  const isInWishlist = (bookId) => {
    if (!bookId) return false;
    return wishlistIds.has(bookId.toString());
  };

  const toggleWishlist = async (book) => {
    if (!book || !book._id) return;
    const bookId = book._id.toString();
    const currentlyIn = isInWishlist(bookId);

    if (user) {
      try {
        const { data } = await api.post(`/auth/wishlist/${bookId}`);
        if (data.wishlist) {
          setWishlist(data.wishlist);
        } else {
          // Fallback optimistic update
          if (currentlyIn) {
            setWishlist((prev) => prev.filter((b) => (b._id || b).toString() !== bookId));
          } else {
            setWishlist((prev) => [...prev, book]);
          }
        }
        return !currentlyIn;
      } catch (err) {
        console.error('Wishlist toggle error:', err);
        return currentlyIn;
      }
    } else {
      // Guest local storage update
      let nextList = [];
      if (currentlyIn) {
        nextList = wishlist.filter((b) => (b._id || b.id || b).toString() !== bookId);
      } else {
        nextList = [...wishlist, book];
      }
      setWishlist(nextList);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextList));
      } catch (e) {
        console.error('Local storage error:', e);
      }
      return !currentlyIn;
    }
  };

  const removeFromWishlist = async (bookId) => {
    if (!bookId) return;
    const idStr = bookId.toString();

    if (user) {
      try {
        const { data } = await api.delete(`/auth/wishlist/${idStr}`);
        if (data.wishlist) {
          setWishlist(data.wishlist);
        } else {
          setWishlist((prev) => prev.filter((b) => (b._id || b).toString() !== idStr));
        }
      } catch (err) {
        console.error('Failed to remove from wishlist:', err);
      }
    } else {
      const nextList = wishlist.filter((b) => (b._id || b.id || b).toString() !== idStr);
      setWishlist(nextList);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextList));
      } catch (e) {
        console.error('Local storage error:', e);
      }
    }
  };

  const clearWishlist = () => {
    setWishlist([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        totalWishlist: wishlist.length,
        loading,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
