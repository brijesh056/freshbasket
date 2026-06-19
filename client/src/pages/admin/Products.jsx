import React, { useState, useEffect } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct, getCategories } from '../../services/api';
import AdminLayout from './AdminLayout';
import { FiEdit, FiTrash2, FiPlus, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const EMPTY = { name: '', description: '', image: '', category: '', price: '', discountPrice: '', stock: '', unit: 'kg', brand: '', isFeatured: false };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const fetchProducts = () => {
    setLoading(true);
    getProducts({ limit: 200 }).then(r => setProducts(r.data.products)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
    getCategories().then(r => setCategories(r.data.categories)).catch(() => {});
  }, []);

  const openAdd = () => { setForm(EMPTY); setEditId(null); setModal(true); };
  const openEdit = (p) => { setForm({ name: p.name, description: p.description, image: p.image, category: p.category, price: p.price, discountPrice: p.discountPrice || '', stock: p.stock, unit: p.unit || 'kg', brand: p.brand || '', isFeatured: p.isFeatured || false }); setEditId(p._id); setModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        await updateProduct(editId, form);
        toast.success('Product updated!');
      } else {
        await createProduct(form);
        toast.success('Product added!');
      }
      fetchProducts();
      setModal(false);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try { await deleteProduct(id); toast.success('Product deleted'); fetchProducts(); }
    catch { toast.error('Failed to delete'); }
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout title="Products">
      <div className="admin-table-wrap">
        <div className="admin-table-header">
          <h3>All Products ({filtered.length})</h3>
          <div style={{ display: 'flex', gap: 10 }}>
            <input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} className="form-input" style={{ width: 220, padding: '8px 14px' }} />
            <button className="btn btn-primary btn-sm" onClick={openAdd}><FiPlus /> Add Product</button>
          </div>
        </div>
        {loading ? <div style={{ padding: 40, textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }} /></div> : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Discount</th><th>Stock</th><th>Featured</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p._id}>
                    <td><img src={p.image} alt={p.name} className="table-product-img" onError={e => { e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100'; }} /></td>
                    <td style={{ maxWidth: 200 }}><strong style={{ fontSize: 13 }}>{p.name}</strong></td>
                    <td><span className="tag" style={{ fontSize: 11 }}>{p.category}</span></td>
                    <td>₹{p.price}</td>
                    <td style={{ color: 'var(--primary)', fontWeight: 600 }}>{p.discountPrice ? `₹${p.discountPrice}` : '—'}</td>
                    <td><span className={`badge badge-${p.stock > 10 ? 'success' : p.stock > 0 ? 'warning' : 'danger'}`}>{p.stock}</span></td>
                    <td>{p.isFeatured ? '⭐' : '—'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-outline btn-sm" onClick={() => openEdit(p)}><FiEdit /></button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}><FiTrash2 /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setModal(false); }}>
          <div className="modal-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 className="modal-title" style={{ margin: 0 }}>{editId ? 'Edit Product' : 'Add Product'}</h3>
              <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#64748b' }}><FiX /></button>
            </div>
            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                {[
                  { label: 'Product Name *', key: 'name', span: true },
                  { label: 'Image URL', key: 'image', span: true },
                  { label: 'Price (₹) *', key: 'price', type: 'number' },
                  { label: 'Discount Price (₹)', key: 'discountPrice', type: 'number' },
                  { label: 'Stock *', key: 'stock', type: 'number' },
                  { label: 'Unit', key: 'unit' },
                  { label: 'Brand', key: 'brand' }
                ].map(f => (
                  <div className="form-group" key={f.key} style={{ gridColumn: f.span ? '1 / -1' : 'auto' }}>
                    <label className="form-label">{f.label}</label>
                    <input type={f.type || 'text'} className="form-input" value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} required={f.label.includes('*')} />
                  </div>
                ))}
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select className="form-input" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} required>
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 26 }}>
                  <input type="checkbox" id="featured" checked={form.isFeatured} onChange={e => setForm(p => ({ ...p, isFeatured: e.target.checked }))} style={{ width: 16, height: 16 }} />
                  <label htmlFor="featured" className="form-label" style={{ margin: 0 }}>Featured Product</label>
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Description</label>
                  <textarea className="form-input" rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} style={{ resize: 'vertical' }} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : editId ? 'Update' : 'Add Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
