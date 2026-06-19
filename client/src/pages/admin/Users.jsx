import React, { useState, useEffect } from 'react';
import { getAllUsers, toggleBlockUser } from '../../services/api';
import AdminLayout from './AdminLayout';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = () => {
    setLoading(true);
    getAllUsers().then(r => setUsers(r.data.users)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleBlock = async (id) => {
    try {
      const res = await toggleBlockUser(id);
      toast.success(res.data.message);
      fetchUsers();
    } catch { toast.error('Failed to update user'); }
  };

  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout title="Users">
      <div className="admin-table-wrap">
        <div className="admin-table-header">
          <h3>All Users ({filtered.length})</h3>
          <input placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} className="form-input" style={{ width: 260, padding: '8px 14px' }} />
        </div>
        {loading ? <div style={{ padding: 40, textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }} /></div> : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Avatar</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Joined</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u._id}>
                    <td>
                      <div style={{ width: 36, height: 36, background: u.isBlocked ? '#fee2e2' : 'var(--primary-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15, color: u.isBlocked ? '#ef4444' : 'var(--primary)' }}>
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                    </td>
                    <td style={{ fontWeight: 600 }}>{u.name}</td>
                    <td style={{ color: '#475569', fontSize: 13 }}>{u.email}</td>
                    <td style={{ color: '#475569', fontSize: 13 }}>{u.phone || '—'}</td>
                    <td style={{ color: '#64748b', fontSize: 13 }}>{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                    <td>
                      <span className={`badge badge-${u.isBlocked ? 'danger' : 'success'}`}>
                        {u.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`btn btn-sm ${u.isBlocked ? 'btn-primary' : 'btn-danger'}`}
                        onClick={() => handleBlock(u._id)}
                      >
                        {u.isBlocked ? 'Unblock' : 'Block'}
                      </button>
                    </td>
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
