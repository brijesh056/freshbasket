import React from 'react';
import { Link } from 'react-router-dom';

export default function PaymentFailed() {
  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ textAlign: 'center', maxWidth: 440, background: 'white', borderRadius: 20, padding: 48, boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}>
        <div style={{ fontSize: 72, marginBottom: 16 }}>❌</div>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Payment Failed</h2>
        <p style={{ color: '#64748b', marginBottom: 28, fontSize: 15 }}>Your payment could not be processed. Please try again or use a different payment method.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/checkout" className="btn btn-primary btn-lg">Try Again</Link>
          <Link to="/cart" className="btn btn-outline btn-lg">Back to Cart</Link>
        </div>
      </div>
    </div>
  );
}
