import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as api from '../api';

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [cart, setCart] = useState({ items: [], total_items: 0, subtotal: 0 });
  const [cartLoading, setCartLoading] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());

  const fetchCart = useCallback(async () => {
    try {
      const { data } = await api.getCart();
      if (data.session_key) localStorage.setItem('session_key', data.session_key);
      setCart(data);
    } catch {
      setCart({ items: [], total_items: 0, subtotal: 0 });
    }
  }, []);

  const fetchWishlist = useCallback(async () => {
    if (!localStorage.getItem('access_token')) {
      setWishlist([]);
      setWishlistIds(new Set());
      return;
    }
    try {
      const { data } = await api.getWishlist();
      setWishlist(data);
      setWishlistIds(new Set(data.map((w) => w.product.id)));
    } catch {
      setWishlist([]);
      setWishlistIds(new Set());
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      api.getProfile()
        .then(({ data }) => setUser(data))
        .catch(() => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        })
        .finally(() => setAuthLoading(false));
    } else {
      setAuthLoading(false);
    }
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    if (!authLoading) fetchWishlist();
  }, [user, authLoading, fetchWishlist]);

  const loginUser = async (username, password) => {
    const { data } = await api.login(username, password);
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    const profile = await api.getProfile();
    setUser(profile.data);
    await fetchCart();
    await fetchWishlist();
    return profile.data;
  };

  const registerUser = async (formData) => {
    await api.register(formData);
    return loginUser(formData.username, formData.password);
  };

  const logout = async () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setWishlist([]);
    setWishlistIds(new Set());
    await fetchCart();
  };

  const addItem = async (productId, quantity = 1) => {
    setCartLoading(true);
    try {
      const { data } = await api.addToCart(productId, quantity);
      if (data.session_key) localStorage.setItem('session_key', data.session_key);
      setCart(data);
      return data;
    } finally {
      setCartLoading(false);
    }
  };

  const updateItem = async (itemId, quantity) => {
    const { data } = await api.updateCartItem(itemId, quantity);
    setCart(data);
  };

  const removeItem = async (itemId) => {
    const { data } = await api.removeFromCart(itemId);
    setCart(data);
  };

  const clearCart = async () => {
    await api.clearCart();
    setCart({ items: [], total_items: 0, subtotal: 0 });
  };

  const toggleWishlistItem = async (productId) => {
    if (!user) return { error: 'login_required' };
    const { data } = await api.toggleWishlist(productId);
    if (data.wishlisted) {
      setWishlistIds((prev) => new Set([...prev, productId]));
    } else {
      setWishlistIds((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
      setWishlist((prev) => prev.filter((w) => w.product.id !== productId));
    }
    await fetchWishlist();
    return data;
  };

  const isWishlisted = (productId) => wishlistIds.has(productId);

  return (
    <StoreContext.Provider
      value={{
        user, authLoading, loginUser, registerUser, logout,
        cart, cartLoading, addItem, updateItem, removeItem, clearCart, fetchCart,
        wishlist, toggleWishlistItem, isWishlisted, fetchWishlist,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);
export const useCart = () => {
  const { cart, cartLoading, addItem, updateItem, removeItem, clearCart, fetchCart } = useStore();
  return { cart, loading: cartLoading, addItem, updateItem, removeItem, clear: clearCart, fetchCart };
};
export const useAuth = () => {
  const { user, authLoading, loginUser, registerUser, logout } = useStore();
  return { user, loading: authLoading, loginUser, registerUser, logout };
};
export const useWishlist = () => {
  const { wishlist, toggleWishlistItem, isWishlisted, fetchWishlist } = useStore();
  return { wishlist, toggle: toggleWishlistItem, isWishlisted, fetchWishlist };
};
