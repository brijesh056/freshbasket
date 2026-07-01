import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../services/api';
const STATUS_COLORS = {
  'Pending': 'warning', 'Confirmed': 'info', 'Packed': 'info',
  'Shipped': 'info', 'Out for Delivery': 'info', 'Delivered': 'success', 'Cancelled': 'danger'
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders().then(r => setOrders(r.data.orders)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" /></div>;

  return (
    <div className="container page-wrapper">
      <h1 className="section-title" style={{ marginBottom: 24 }}>My Orders</h1>
      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <p className="empty-state-title">No orders yet</p>
          <p className="empty-state-text">Your order history will appear here</p>
          <Link to="/products" className="btn btn-primary btn-lg">Start Shopping</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {orders.map(order => (
            <div key={order._id} style={{ background: 'white', borderRadius: 14, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
                <div>
                  <p style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}>Order ID: <strong style={{ color: '#1e293b' }}>#{order._id.slice(-8).toUpperCase()}</strong></p>
                  <p style={{ fontSize: 13, color: '#64748b' }}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span className={`badge badge-${STATUS_COLORS[order.orderStatus] || 'info'}`}>{order.orderStatus}</span>
                  <Link to={`/orders/${order._id}`} className="btn btn-outline btn-sm">View Details</Link>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8 }}>
                {order.items?.slice(0, 4).map((item, i) => (
                  <div key={i} style={{ flexShrink: 0, textAlign: 'center' }}>
                    <img src={item.image} alt={item.name} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }} onError={e => { e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100'; }} />
                    <p style={{ fontSize: 11, color: '#64748b', marginTop: 4, width: 64, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                  </div>
                ))}
                {order.items?.length > 4 && <div style={{ flexShrink: 0, width: 60, height: 60, background: '#f1f5f9', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#64748b' }}>+{order.items.length - 4}</div>}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTop: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: 14, color: '#64748b' }}>{order.paymentMethod === 'cod' ? '💵 Cash on Delivery' : '💳 Online Payment'}</span>
                <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--primary)' }}>₹{order.totalAmount?.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}