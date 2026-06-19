import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCart, addToCart as addToCartAPI, updateCartItem, removeFromCart as removeAPI, clearCart as clearAPI } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [cartLoading, setCartLoading] = useState(false);
  const { user } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!user) { setCart({ items: [], totalAmount: 0 }); return; }
    try {
      const res = await getCart();
      setCart(res.data.cart || { items: [], totalAmount: 0 });
    } catch {}
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) { toast.error('Please login to add to cart'); return; }
    try {
      setCartLoading(true);
      const res = await addToCartAPI({ productId, quantity });
      setCart(res.data.cart);
      toast.success('Added to cart!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    } finally { setCartLoading(false); }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const res = await updateCartItem({ productId, quantity });
      setCart(res.data.cart);
    } catch (err) {
      toast.error('Failed to update quantity');
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await removeAPI(productId);
      setCart(res.data.cart);
      toast.success('Removed from cart');
    } catch { toast.error('Failed to remove item'); }
  };

  const clearCart = async () => {
    try {
      await clearAPI();
      setCart({ items: [], totalAmount: 0 });
    } catch {}
  };

  const cartCount = cart?.items?.reduce((acc, i) => acc + i.quantity, 0) || 0;
  const cartTotal = cart?.items?.reduce((acc, i) => acc + (i.price * i.quantity), 0) || 0;

  return (
    <CartContext.Provider value={{ cart, cartCount, cartTotal, cartLoading, addToCart, updateQuantity, removeFromCart, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};
