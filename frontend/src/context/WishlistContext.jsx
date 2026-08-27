import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

const WishlistContext = createContext(null);
const STORAGE_KEY = 'filatoco_wishlist';

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [ids, setIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (!user) localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }, [ids, user]);

  useEffect(() => {
    if (user) {
      api.get('/users/wishlist').then(({ data }) => setIds(data.wishlist.map((p) => p._id || p)));
    }
  }, [user]);

  const toggle = async (productId) => {
    if (user) {
      const { data } = await api.post(`/users/wishlist/${productId}`);
      setIds(data.wishlist.map((p) => p._id || p));
    } else {
      setIds((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]));
    }
  };

  const isWishlisted = (productId) => ids.includes(productId);

  return <WishlistContext.Provider value={{ ids, toggle, isWishlisted }}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => useContext(WishlistContext);
