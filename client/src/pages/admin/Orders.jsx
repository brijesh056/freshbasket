import React, { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus } from '../../services/api';
import AdminLayout from './AdminLayout';
import { FiChevronDown, FiChevronUp, FiMapPin, FiPhone } from 'react-icons/fi';
import toast from 'react-hot-toast';

const STATUSES = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];
const STATUS_COLORS = { 'Pending': 'warning', 'Confirmed': 'info', 'Packed': 'info', 'Shipped': 'info', 'Out for Delivery': 'info', 'Delivered': 'success', 'Cancelled': 'danger' };

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const fetchOrders = () => {
    setLoading(true);
    getAllOrders().then(r => setOrders(r.data.orders)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (orderId, orderStatus) => {
    try {
      await updateOrderStatus(orderId, { orderStatus });
      toast.success('Order status updated');
      fetchOrders();
    } catch { toast.error('Failed to update status'); }
  };

  const toggleExpand = (id) => setExpandedId(expandedId === id ? null : id);
  const filtered = filter ? orders.filter(o => o.orderStatus === filter) : orders;

  return (
    <AdminLayout title="Orders">
      <div className="admin-table-wrap">
        <div className="admin-table-header">
          <h3>All Orders ({filtered.length})</h3>
          <select value={filter} onChange={e => setFilter(e.target.value)} className="form-input" style={{ width: 180, padding: '8px 14px' }}>
            <option value="">All Statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Update Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => (
                  <React.Fragment key={order._id}>
                    <tr style={{ cursor: 'pointer' }} onClick={() => toggleExpand(order._id)}>
                      <td style={{ width: 30 }}>
                        {expandedId === order._id ? <FiChevronUp /> : <FiChevronDown />}
                      </td>
                      <td><strong style={{ fontSize: 13 }}>#{order._id.slice(-8).toUpperCase()}</strong></td>
                      <td>
                        <p style={{ fontWeight: 600, fontSize: 13 }}>{order.user?.name}</p>
                        <p style={{ fontSize: 12, color: '#64748b' }}>{order.user?.email}</p>
                      </td>
                      <td style={{ fontSize: 13 }}>{order.items?.length} item(s)</td>
                      <td style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{order.totalAmount?.toFixed(2)}</td>
                      <td>
                        <span className={`badge badge-${order.paymentStatus === 'paid' ? 'success' : 'warning'}`}>{order.paymentStatus}</span>
                        <p style={{ fontSize: 11, color: '#64748b', marginTop: 3 }}>{order.paymentMethod === 'cod' ? 'COD' : 'Online'}</p>
                      </td>
                      <td><span className={`badge badge-${STATUS_COLORS[order.orderStatus] || 'info'}`}>{order.orderStatus}</span></td>
                      <td style={{ fontSize: 13, color: '#64748b' }}>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                      <td onClick={e => e.stopPropagation()}>
                        <select
                          value={order.orderStatus}
                          onChange={e => handleStatusChange(order._id, e.target.value)}
                          className="form-input"
                          style={{ padding: '6px 10px', fontSize: 13, width: 160 }}
                        >
                          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                    {expandedId === order._id && (
                      <tr>
                        <td colSpan={9} style={{ background: '#f8fafc', padding: 0 }}>
                          <div style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                            <div>
                              <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                                <FiMapPin /> Delivery Address
                              </h4>
                              <div style={{ background: 'white', borderRadius: 10, padding: 16, fontSize: 13, color: '#475569', lineHeight: 1.8 }}>
                                <p style={{ fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>{order.deliveryAddress?.fullName}</p>
                                <p style={{ display: 'flex', alignItems: 'center', gap: 6 }}><FiPhone size={12} /> {order.deliveryAddress?.phone}</p>
                                <p style={{ marginTop: 6 }}>
                                  {order.deliveryAddress?.street}, {order.deliveryAddress?.city},<br />
                                  {order.deliveryAddress?.state} - {order.deliveryAddress?.pincode}
                                </p>
                              </div>
                            </div>
                            <div>
                              <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>
                                🛒 Items Ordered ({order.items?.length})
                              </h4>
                              <div style={{ background: 'white', borderRadius: 10, padding: 12, maxHeight: 220, overflowY: 'auto' }}>
                                {order.items?.map((item, i) => (
                                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 4px', borderBottom: i < order.items.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }}
                                      onError={e => { e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100'; }}
                                    />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                      <p style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</p>
                                      <p style={{ fontSize: 12, color: '#64748b' }}>Qty: {item.quantity} × ₹{item.price}</p>
                                    </div>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', flexShrink: 0 }}>₹{(item.price * item.quantity).toFixed(0)}</span>
                                  </div>
                                ))}
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, padding: '0 4px', fontSize: 13, color: '#475569' }}>
                                <span>Delivery Charge</span>
                                <span>{order.deliveryCharge === 0 ? 'FREE' : `₹${order.deliveryCharge}`}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}