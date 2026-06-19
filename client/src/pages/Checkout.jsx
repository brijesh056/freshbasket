import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createRazorpayOrder, verifyPayment, createOrder } from '../services/api';
import toast from 'react-hot-toast';
import './Checkout.css';

const PAYMENT_METHODS = [
  { id: 'razorpay', label: 'Pay Online', desc: 'UPI, Cards, Net Banking, Wallets', icon: '💳' },
  { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when your order arrives', icon: '💵' }
];

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const items = cart?.items || [];
  const deliveryCharge = cartTotal >= 499 ? 0 : 49;
  const totalPayable = cartTotal + deliveryCharge;

  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || ''
  });
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setAddress(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const validateAddress = () => {
    const required = ['fullName', 'phone', 'street', 'city', 'state', 'pincode'];
    return required.every(f => address[f]?.trim());
  };

  const orderItems = items.map(item => ({
    product: item.product?._id,
    name: item.product?.name,
    image: item.product?.image,
    price: item.price,
    quantity: item.quantity
  }));

  const handlePlaceOrder = async () => {
    if (!validateAddress()) { toast.error('Please fill all delivery address fields'); return; }
    if (items.length === 0) { toast.error('Your cart is empty'); return; }
    setLoading(true);
    try {
      if (paymentMethod === 'cod') {
        const orderRes = await createOrder({
          items: orderItems, deliveryAddress: address, totalAmount: totalPayable,
          deliveryCharge, paymentMethod: 'cod'
        });
        await clearCart();
        navigate('/payment/success', { state: { order: orderRes.data.order, paymentMethod: 'cod' } });
      } else {
        // Razorpay flow
        const rzpRes = await createRazorpayOrder({ amount: totalPayable });
        const { order: rzpOrder, key } = rzpRes.data;

        // Create order in DB first
        const dbOrderRes = await createOrder({
          items: orderItems, deliveryAddress: address, totalAmount: totalPayable,
          deliveryCharge, paymentMethod: 'razorpay', razorpayOrderId: rzpOrder.id
        });
        const dbOrder = dbOrderRes.data.order;

        const options = {
          key,
          amount: rzpOrder.amount,
          currency: 'INR',
          name: 'FreshBasket',
          description: 'Grocery Order Payment',
          order_id: rzpOrder.id,
          handler: async (response) => {
            try {
              await verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: dbOrder._id,
                amount: totalPayable
              });
              await clearCart();
              navigate('/payment/success', { state: { order: dbOrder, paymentMethod: 'razorpay' } });
            } catch {
              navigate('/payment/failed', { state: { order: dbOrder } });
            }
          },
          prefill: { name: address.fullName, contact: address.phone, email: user?.email },
          theme: { color: '#16a34a' },
          modal: { ondismiss: () => { toast.error('Payment cancelled'); setLoading(false); } }
        };

        if (window.Razorpay) {
          const rzp = new window.Razorpay(options);
          rzp.open();
        } else {
          toast.error('Razorpay not loaded. Please refresh.');
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    }
    setLoading(false);
  };

  if (items.length === 0) { navigate('/cart'); return null; }

  return (
    <div className="checkout-page container">
      <h1 className="section-title" style={{ marginBottom: 24 }}>Checkout</h1>
      <div className="checkout-layout">
        {/* Left */}
        <div className="checkout-left">
          {/* Address */}
          <div className="checkout-card">
            <h3 className="checkout-card-title">📍 Delivery Address</h3>
            <div className="address-grid">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input name="fullName" value={address.fullName} onChange={handleChange} className="form-input" placeholder="Enter full name" />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input name="phone" value={address.phone} onChange={handleChange} className="form-input" placeholder="10-digit mobile number" />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Street Address *</label>
                <input name="street" value={address.street} onChange={handleChange} className="form-input" placeholder="House no, Building, Street, Area" />
              </div>
              <div className="form-group">
                <label className="form-label">City *</label>
                <input name="city" value={address.city} onChange={handleChange} className="form-input" placeholder="City" />
              </div>
              <div className="form-group">
                <label className="form-label">State *</label>
                <input name="state" value={address.state} onChange={handleChange} className="form-input" placeholder="State" />
              </div>
              <div className="form-group">
                <label className="form-label">Pincode *</label>
                <input name="pincode" value={address.pincode} onChange={handleChange} className="form-input" placeholder="6-digit pincode" />
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="checkout-card">
            <h3 className="checkout-card-title">💳 Payment Method</h3>
            <div className="payment-options">
              {PAYMENT_METHODS.map(m => (
                <label key={m.id} className={`payment-option ${paymentMethod === m.id ? 'selected' : ''}`}>
                  <input type="radio" name="payment" value={m.id} checked={paymentMethod === m.id} onChange={() => setPaymentMethod(m.id)} />
                  <span className="payment-icon">{m.icon}</span>
                  <div className="payment-label">
                    <span className="payment-name">{m.label}</span>
                    <span className="payment-desc">{m.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Summary */}
        <div className="checkout-summary">
          <h3 className="checkout-card-title">🛒 Order Summary</h3>
          <div className="checkout-items">
            {items.map(item => (
              <div key={item._id} className="checkout-item">
                <img src={item.product?.image} alt={item.product?.name} className="checkout-item-img" onError={e => { e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100'; }} />
                <div className="checkout-item-info">
                  <p className="checkout-item-name">{item.product?.name}</p>
                  <p className="checkout-item-qty">Qty: {item.quantity}</p>
                </div>
                <span className="checkout-item-price">₹{(item.price * item.quantity).toFixed(0)}</span>
              </div>
            ))}
          </div>
          <div className="checkout-summary-rows">
            <div className="summary-row"><span>Subtotal</span><span>₹{cartTotal.toFixed(2)}</span></div>
            <div className="summary-row"><span>Delivery</span><span className={deliveryCharge === 0 ? 'free-text' : ''}>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span></div>
          </div>
          <div className="checkout-total"><span>Total</span><span>₹{totalPayable.toFixed(2)}</span></div>
          <button className="btn btn-primary btn-lg place-order-btn" onClick={handlePlaceOrder} disabled={loading}>
            {loading ? 'Processing...' : paymentMethod === 'cod' ? '📦 Place Order (COD)' : '💳 Pay ₹' + totalPayable.toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
}
