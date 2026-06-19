import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById, cancelOrder } from '../services/api';
import toast from 'react-hot-toast';

const STEPS = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    getOrderById(id).then(r => setOrder(r.data.order)).catch(() => navigate('/orders')).finally(() => setLoading(false));
  }, [id, navigate]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(true);
    try {
      const res = await cancelOrder(id, { reason: 'Cancelled by user' });
      setOrder(res.data.order);
      toast.success('Order cancelled');
    } catch (err) { toast.error(err.response?.data?.message || 'Cannot cancel this order'); }
    setCancelling(false);
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" /></div>;
  if (!order) return null;

  const currentStep = order.orderStatus === 'Cancelled' ? -1 : STEPS.indexOf(order.orderStatus);
  const canCancel = !['Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'].includes(order.orderStatus);

  return (
    <div className="container" style={{ padding: '24px 0 60px' }}>
      <button onClick={() => navigate('/orders')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', marginBottom: 20, fontSize: 14 }}>
        ← Back to Orders
      </button>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <div>
          <h1 className="section-title">Order Details</h1>
          <p style={{ color: '#64748b', fontSize: 14 }}>#{order._id.slice(-8).toUpperCase()} · {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        {canCancel && <button onClick={handleCancel} className="btn btn-danger btn-sm" disabled={cancelling}>{cancelling ? 'Cancelling...' : 'Cancel Order'}</button>}
      </div>

      {/* Tracker */}
      {order.orderStatus !== 'Cancelled' && (
        <div style={{ background: 'white', borderRadius: 14, padding: 28, marginBottom: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h3 style={{ marginBottom: 24, fontWeight: 700 }}>Order Tracking</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto' }}>
            {STEPS.map((step, i) => (
              <React.Fragment key={step}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 80 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: i <= currentStep ? 'var(--primary)' : '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: i <= currentStep ? 'white' : '#94a3b8', fontWeight: 700, transition: 'all 0.3s' }}>{i < currentStep ? '✓' : i + 1}</div>
                  <p style={{ fontSize: 11, fontWeight: i === currentStep ? 700 : 500, color: i <= currentStep ? 'var(--primary)' : '#94a3b8', textAlign: 'center', marginTop: 6, whiteSpace: 'nowrap' }}>{step}</p>
                </div>
                {i < STEPS.length - 1 && <div style={{ flex: 1, height: 3, background: i < currentStep ? 'var(--primary)' : '#e2e8f0', minWidth: 20 }} />}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
      {order.orderStatus === 'Cancelled' && (
        <div style={{ background: '#fef2f2', border: '2px solid #fecaca', borderRadius: 12, padding: 16, marginBottom: 20, color: '#dc2626', fontWeight: 600 }}>
          ❌ This order has been cancelled. {order.cancelReason && `Reason: ${order.cancelReason}`}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Items */}
          <div style={{ background: 'white', borderRadius: 14, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h3 style={{ marginBottom: 16, fontWeight: 700 }}>Order Items</h3>
            {order.items?.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '12px 0', borderBottom: i < order.items.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                <img src={item.image} alt={item.name} style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8 }} onError={e => { e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100'; }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: 14 }}>{item.name}</p>
                  <p style={{ fontSize: 13, color: '#64748b' }}>Qty: {item.quantity} × ₹{item.price}</p>
                </div>
                <span style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          {/* Address */}
          <div style={{ background: 'white', borderRadius: 14, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h3 style={{ marginBottom: 12, fontWeight: 700 }}>📍 Delivery Address</h3>
            <p style={{ fontWeight: 700, fontSize: 15 }}>{order.deliveryAddress?.fullName}</p>
            <p style={{ color: '#475569', fontSize: 14 }}>{order.deliveryAddress?.phone}</p>
            <p style={{ color: '#475569', fontSize: 14 }}>{order.deliveryAddress?.street}, {order.deliveryAddress?.city}, {order.deliveryAddress?.state} - {order.deliveryAddress?.pincode}</p>
          </div>
        </div>
        {/* Summary */}
        <div style={{ background: 'white', borderRadius: 14, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h3 style={{ marginBottom: 16, fontWeight: 700 }}>Payment Summary</h3>
          {[
            ['Items Total', `₹${(order.totalAmount - order.deliveryCharge).toFixed(2)}`],
            ['Delivery Charge', order.deliveryCharge === 0 ? 'FREE' : `₹${order.deliveryCharge}`],
            ['Total Paid', `₹${order.totalAmount?.toFixed(2)}`]
          ].map(([k, v], i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 2 ? '1px solid #f1f5f9' : 'none', fontWeight: i === 2 ? 800 : 400, fontSize: i === 2 ? 16 : 14, color: i === 2 ? '#0f172a' : '#475569' }}>
              <span>{k}</span><span style={{ color: i === 2 ? 'var(--primary)' : 'inherit' }}>{v}</span>
            </div>
          ))}
          <div style={{ marginTop: 16, padding: 14, background: '#f8fafc', borderRadius: 10 }}>
            <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Payment Method</p>
            <p style={{ fontSize: 14, color: '#475569' }}>{order.paymentMethod === 'cod' ? '💵 Cash on Delivery' : '💳 Online (Razorpay)'}</p>
            <p style={{ fontSize: 13, marginTop: 8, fontWeight: 600 }}>Payment Status</p>
            <span className={`badge badge-${order.paymentStatus === 'paid' ? 'success' : order.paymentStatus === 'failed' ? 'danger' : 'warning'}`}>{order.paymentStatus}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
