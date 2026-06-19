import React, { useState, useEffect } from 'react';
import { getDashboard } from '../../services/api';
import AdminLayout from './AdminLayout';

const STATUS_COLORS = {
  'Pending': 'warning', 'Confirmed': 'info', 'Packed': 'info',
  'Shipped': 'info', 'Out for Delivery': 'info', 'Delivered': 'success', 'Cancelled': 'danger'
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard().then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <AdminLayout title="Dashboard"><div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" /></div></AdminLayout>;

  return (
    <AdminLayout title="Dashboard">
      <div className="admin-stats">
        {[
          { icon: '👥', color: 'blue', label: 'Total Users', value: data?.totalUsers || 0 },
          { icon: '📦', color: 'green', label: 'Total Products', value: data?.totalProducts || 0 },
          { icon: '🛒', color: 'orange', label: 'Total Orders', value: data?.totalOrders || 0 },
          { icon: '💰', color: 'purple', label: 'Total Revenue', value: `₹${(data?.totalRevenue || 0).toLocaleString('en-IN')}` }
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className={`stat-icon ${s.color}`}>{s.icon}</div>
            <div>
              <p className="stat-label">{s.label}</p>
              <p className="stat-value">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-table-wrap">
        <div className="admin-table-header">
          <h3>Recent Orders</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {data?.recentOrders?.map(order => (
                <tr key={order._id}>
                  <td><strong>#{order._id.slice(-8).toUpperCase()}</strong></td>
                  <td>
                    <div>
                      <p style={{ fontWeight: 600 }}>{order.user?.name}</p>
                      <p style={{ fontSize: 12, color: '#64748b' }}>{order.user?.email}</p>
                    </div>
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{order.totalAmount?.toFixed(2)}</td>
                  <td><span className={`badge badge-${order.paymentStatus === 'paid' ? 'success' : 'warning'}`}>{order.paymentStatus}</span></td>
                  <td><span className={`badge badge-${STATUS_COLORS[order.orderStatus] || 'info'}`}>{order.orderStatus}</span></td>
                  <td style={{ color: '#64748b', fontSize: 13 }}>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
