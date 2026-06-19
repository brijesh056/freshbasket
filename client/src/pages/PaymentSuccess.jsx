import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function PaymentSuccess() {
  const { state } = useLocation();
  const order = state?.order;
  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)' }}>
      <div style={{ textAlign: 'center', maxWidth: 480, background: 'white', borderRadius: 20, padding: 48, boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}>
        <div style={{ fontSize: 72, marginBottom: 16 }}>✅</div>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Order Placed!</h2>
        <p style={{ color: '#64748b', marginBottom: 24, fontSize: 15 }}>
          {state?.paymentMethod === 'cod'
            ? 'Your order has been placed successfully. Pay when it arrives!'
            : 'Payment successful! Your order is confirmed.'}
        </p>
        {order && (
          <div style={{ background: '#f0fdf4', borderRadius: 12, padding: 20, marginBottom: 28, textAlign: 'left', border: '1px solid #bbf7d0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 13, color: '#64748b' }}>Order ID</span>
              <span style={{ fontWeight: 700, color: '#0f172a', fontSize: 14 }}>#{order._id?.slice(-8).toUpperCase()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, color: '#64748b' }}>Amount Paid</span>
              <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: 20 }}>₹{order.totalAmount?.toFixed(2)}</span>
            </div>
          </div>
        )}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/orders" className="btn btn-primary btn-lg">📦 Track Order</Link>
          <Link to="/products" className="btn btn-outline btn-lg">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
