import React, { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus } from '../../services/api';
import AdminLayout from './AdminLayout';
import toast from 'react-hot-toast';

const STATUSES = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];
const STATUS_COLORS = { 'Pending': 'warning', 'Confirmed': 'info', 'Packed': 'info', 'Shipped': 'info', 'Out for Delivery': 'info', 'Delivered': 'success', 'Cancelled': 'danger' };

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

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
        {loading ? <div style={{ padding: 40, textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }} /></div> : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Date</th>
                  <th>Update Status</th>
                  <th>Current Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => (
                  <tr key={order._id}>
                    <td><strong style={{ fontSize: 13 }}>#{order._id.slice(-8).toUpperCase()}</strong></td>
                    <td>
                      <p style={{ fontWeight: 600, fontSize: 13 }}>{order.user?.name}</p>
                      <p style={{ fontSize: 12, color: '#64748b' }}>{order.user?.email}</p>
                    </td>
                    <td style={{ fontSize: 13 }}>{order.items?.length} item(s)</td>
                    <td style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{order.totalAmount?.toFixed(2)}</td>
                    <td>
                      <span className={`badge badge-${order.paymentStatus === 'paid' ? 'success' : 'warning'}`}>{order.paymentStatus}</span>
                      <p style={{ fontSize: 11, color: '#64748b', marginTop: 3 }}>{order.paymentMethod}</p>
                    </td>
                    <td style={{ fontSize: 13, color: '#64748b' }}>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                    <td>
                      <select
                        value={order.orderStatus}
                        onChange={e => handleStatusChange(order._id, e.target.value)}
                        className="form-input"
                        style={{ padding: '6px 10px', fontSize: 13, width: 160 }}
                      >
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td><span className={`badge badge-${STATUS_COLORS[order.orderStatus] || 'info'}`}>{order.orderStatus}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
