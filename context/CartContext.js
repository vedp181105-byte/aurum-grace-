// context/CartContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

async function api(method, url, body) {
  try {
    const opts = {
      method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(`http://localhost:3000${url}`, opts);
    return res.json();
  } catch(e) {
    return { success: false, message: 'Network error' };
  }
}

export function CartProvider({ children }) {
  const [cartCount,  setCartCount]  = useState(0);
  const [cartItems,  setCartItems]  = useState([]);
  const [cartTotals, setCartTotals] = useState({ subtotal: 0, tax: 0, total: 0 });
  const [wishlist,   setWishlist]   = useState([]);
  const [cartOpen,   setCartOpen]   = useState(false);

  useEffect(() => {
    refreshCart();
    refreshWishlist();
  }, []);

  async function refreshCart() {
    const data = await api('GET', '/api/cart');
    if (data) {
      setCartItems(data.cart   || []);
      setCartCount(data.count  || 0);
      setCartTotals({
        subtotal: data.subtotal || 0,
        tax:      data.tax      || 0,
        total:    data.total    || 0,
      });
    }
  }

  async function refreshWishlist() {
    const data = await api('GET', '/api/wishlist');
    if (data?.wishlist) setWishlist(data.wishlist);
  }

  async function addToCart(id, qty = 1) {
    const data = await api('POST', '/api/cart', { id, qty });
    if (data?.success) {
      setCartCount(data.count);
      await refreshCart();
      return true;
    }
    return false;
  }

  async function removeFromCart(id) {
    const data = await api('DELETE', `/api/cart/${id}`);
    if (data?.success) {
      setCartCount(data.count);
      await refreshCart();
    }
  }

  async function updateQty(id, qty) {
    if (qty < 1) { await removeFromCart(id); return; }
    await api('PUT', `/api/cart/${id}`, { qty });
    await refreshCart();
  }

  async function clearCart() {
    await api('DELETE', '/api/cart');
    setCartCount(0);
    setCartItems([]);
    setCartTotals({ subtotal: 0, tax: 0, total: 0 });
  }

  async function toggleWishlist(id) {
    const data = await api('POST', `/api/wishlist/${id}`);
    if (data?.success) {
      if (data.action === 'added') setWishlist(prev => [...prev, id]);
      else setWishlist(prev => prev.filter(x => x !== id));
      return data;
    }
    return null;
  }

  return (
    <CartContext.Provider value={{
      cartCount, cartItems, cartTotals, cartOpen, wishlist,
      setCartOpen, addToCart, removeFromCart, updateQty,
      clearCart, toggleWishlist, refreshCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
