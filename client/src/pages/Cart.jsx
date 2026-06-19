import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiTrash2, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import './Cart.css';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();
  const navigate = useNavigate();
  const items = cart?.items || [];
  const deliveryCharge = cartTotal >= 499 ? 0 : 49;
  const totalPayable = cartTotal + deliveryCharge;

  if (items.length === 0) return (
    <div className="container page-wrapper">
      <div className="empty-state">
        <div className="empty-state-icon">🛒</div>
        <p className="empty-state-title">Your cart is empty</p>
        <p className="empty-state-text">Add some fresh groceries to get started!</p>
        <Link to="/products" className="btn btn-primary btn-lg">Start Shopping</Link>
      </div>
    </div>
  );

  return (
    <div className="cart-page container">
      <div className="cart-header">
        <h1 className="section-title">Shopping Cart</h1>
        <button onClick={clearCart} className="clear-cart-btn"><FiTrash2 /> Clear Cart</button>
      </div>

      <div className="cart-layout">
        {/* Items */}
        <div className="cart-items">
          {items.map((item) => {
            const product = item.product;
            if (!product) return null;
            return (
              <div key={item._id} className="cart-item animate-fadeIn">
                <img
                  src={product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200'}
                  alt={product.name}
                  className="cart-item-image"
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200'; }}
                />
                <div className="cart-item-info">
                  <Link to={`/products/${product._id}`} className="cart-item-name">{product.name}</Link>
                  <p className="cart-item-category">{product.category}</p>
                  <p className="cart-item-price">₹{item.price} / {product.unit || 'unit'}</p>
                </div>
                <div className="cart-item-controls">
                  <div className="qty-controls">
                    <button onClick={() => updateQuantity(product._id, item.quantity - 1)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(product._id, item.quantity + 1)}>+</button>
                  </div>
                  <p className="cart-item-total">₹{(item.price * item.quantity).toFixed(2)}</p>
                  <button className="remove-btn" onClick={() => removeFromCart(product._id)}><FiTrash2 /></button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="cart-summary">
          <h3 className="summary-title">Order Summary</h3>
          <div className="summary-rows">
            <div className="summary-row"><span>Subtotal ({items.length} items)</span><span>₹{cartTotal.toFixed(2)}</span></div>
            <div className="summary-row"><span>Delivery Charge</span><span className={deliveryCharge === 0 ? 'free-text' : ''}>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span></div>
            {deliveryCharge > 0 && <p className="delivery-hint">Add ₹{(499 - cartTotal).toFixed(0)} more for free delivery</p>}
          </div>
          <div className="summary-divider" />
          <div className="summary-total"><span>Total Payable</span><span>₹{totalPayable.toFixed(2)}</span></div>
          <button className="btn btn-primary btn-lg checkout-btn" onClick={() => navigate('/checkout')}>
            Proceed to Checkout <FiArrowRight />
          </button>
          <Link to="/products" className="continue-shopping"><FiShoppingBag /> Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
