import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getWishlist, toggleWishlist as toggleAPI } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const WishlistContext = createContext();
export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const { user } = useAuth();

  const fetchWishlist = useCallback(async () => {
    if (!user) { setWishlist([]); return; }
    try {
      const res = await getWishlist();
      setWishlist(res.data.products || []);
    } catch {}
  }, [user]);

  useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

  const toggleWishlist = async (productId) => {
    if (!user) { toast.error('Please login first'); return; }
    try {
      const res = await toggleAPI({ productId });
      await fetchWishlist();
      toast.success(res.data.message);
    } catch { toast.error('Failed to update wishlist'); }
  };

  const isInWishlist = (productId) => wishlist.some(p => p._id === productId || p === productId);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, wishlistCount: wishlist.length }}>
      {children}
    </WishlistContext.Provider>
  );
};
