import React, { useState, useEffect } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/api';
import AdminLayout from './AdminLayout';
import { FiEdit, FiTrash2, FiPlus, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const EMPTY = { name: '', icon: '🛒' };

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const fetchCategories = () => {
    setLoading(true);
    getCategories().then(r => setCategories(r.data.categories)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchCategories(); }, []);

  const openAdd = () => { setForm(EMPTY); setEditId(null); setModal(true); };
  const openEdit = (c) => { setForm({ name: c.name, icon: c.icon }); setEditId(c._id); setModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) { await updateCategory(editId, form); toast.success('Category updated!'); }
      else { await createCategory(form); toast.success('Category added!'); }
      fetchCategories();
      setModal(false);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try { await deleteCategory(id); toast.success('Deleted'); fetchCategories(); }
    catch { toast.error('Failed to delete'); }
  };

  return (
    <AdminLayout title="Categories">
      <div className="admin-table-wrap">
        <div className="admin-table-header">
          <h3>All Categories ({categories.length})</h3>
          <button className="btn btn-primary btn-sm" onClick={openAdd}><FiPlus /> Add Category</button>
        </div>
        {loading ? <div style={{ padding: 40, textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }} /></div> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, padding: 20 }}>
            {categories.map(cat => (
              <div key={cat._id} style={{ background: '#f8fafc', borderRadius: 12, padding: 20, textAlign: 'center', position: 'relative' }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>{cat.icon}</div>
                <p style={{ fontWeight: 700, fontSize: 15 }}>{cat.name}</p>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 12 }}>
                  <button className="btn btn-outline btn-sm" onClick={() => openEdit(cat)}><FiEdit /></button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(cat._id)}><FiTrash2 /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setModal(false); }}>
          <div className="modal-box" style={{ maxWidth: 360 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 className="modal-title" style={{ margin: 0 }}>{editId ? 'Edit Category' : 'Add Category'}</h3>
              <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#64748b' }}><FiX /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Category Name *</label>
                <input className="form-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required placeholder="e.g. Fruits" />
              </div>
              <div className="form-group">
                <label className="form-label">Icon (Emoji)</label>
                <input className="form-input" value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} placeholder="🛒" />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : editId ? 'Update' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
