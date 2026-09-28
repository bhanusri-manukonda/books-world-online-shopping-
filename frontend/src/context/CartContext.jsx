import { createContext, useContext, useEffect, useState } from 'react';
import { finalPriceOf } from '../utils/price.js';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    const stored = localStorage.getItem('booksWorldCart');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('booksWorldCart', JSON.stringify(items));
  }, [items]);

  // Adding a book that is already in the cart just updates its quantity.
  const addToCart = (book, qty = 1) => {
    setItems((current) => {
      const existing = current.find((i) => i.book === book._id);
      if (existing) {
        return current.map((i) =>
          i.book === book._id ? { ...i, qty: Math.min(i.qty + qty, book.countInStock) } : i
        );
      }
      return [
        ...current,
        {
          book: book._id,
          title: book.title,
          image: book.image,
          originalPrice: book.price,
          discountPercent: book.discountPercent || 0,
          price: finalPriceOf(book), // what the customer pays
          countInStock: book.countInStock,
          qty,
        },
      ];
    });
  };

  const updateQty = (bookId, qty) =>
    setItems((current) => current.map((i) => (i.book === bookId ? { ...i, qty: Number(qty) } : i)));

  const removeFromCart = (bookId) =>
    setItems((current) => current.filter((i) => i.book !== bookId));

  const clearCart = () => setItems([]);

  const itemsPrice = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const savedPrice = items.reduce((sum, i) => sum + (i.originalPrice - i.price) * i.qty, 0);
  const shippingPrice = items.length === 0 || itemsPrice > 500 ? 0 : 40;
  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
        itemsPrice,
        savedPrice,
        shippingPrice,
        totalPrice: itemsPrice + shippingPrice,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
