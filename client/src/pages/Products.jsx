import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts, getCategories } from '../services/api';
import ProductCard from '../components/common/ProductCard';
import { FiFilter, FiX, FiChevronDown } from 'react-icons/fi';
import './Products.css';

const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Top Rated', value: 'rating' }
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const selectedCategory = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';
  const sortBy = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getProducts({ category: selectedCategory, search: searchQuery, sort: sortBy, page, limit: 12 });
      setProducts(res.data.products);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch {}
    setLoading(false);
  }, [selectedCategory, searchQuery, sortBy, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { getCategories().then(r => setCategories(r.data.categories)).catch(() => {}); }, []);

  const updateParam = (key, val) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set(key, val); else p.delete(key);
    p.delete('page');
    setSearchParams(p);
  };

  const clearFilters = () => setSearchParams({});

  const CATEGORY_ICONS = {
    'Fruits': '🍎', 'Vegetables': '🥦', 'Dairy & Milk': '🥛', 'Bread & Bakery': '🍞',
    'Rice & Grains': '🌾', 'Pulses & Dal': '🫘', 'Oil & Ghee': '🫙', 'Beverages': '🥤',
    'Tea & Coffee': '☕', 'Snacks': '🍿', 'Biscuits': '🍪', 'Instant Food': '🍜',
    'Frozen Food': '🧊', 'Spices': '🌶️', 'Dry Fruits': '🥜', 'Personal Care': '🧴',
    'Baby Care': '👶', 'Household Items': '🏠', 'Cleaning Products': '🧹', 'Pet Food': '🐾'
  };

  return (
    <div className="products-page">
      <div className="container">
        {/* Header */}
        <div className="products-header">
          <div>
            <h1 className="section-title">
              {searchQuery ? `Search: "${searchQuery}"` : selectedCategory || 'All Products'}
            </h1>
            <p className="section-subtitle">{total} products found</p>
          </div>
          <div className="products-controls">
            <div className="sort-select-wrap">
              <select value={sortBy} onChange={(e) => updateParam('sort', e.target.value)} className="sort-select">
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <FiChevronDown className="select-arrow" />
            </div>
            <button className="filter-toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <FiFilter /> Filters
            </button>
          </div>
        </div>

        <div className="products-layout">
          {/* Sidebar */}
          <aside className={`filters-sidebar ${sidebarOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
              <h3>Filters</h3>
              {(selectedCategory || searchQuery) && (
                <button onClick={clearFilters} className="clear-btn"><FiX /> Clear All</button>
              )}
              <button className="close-sidebar" onClick={() => setSidebarOpen(false)}><FiX /></button>
            </div>

            <div className="filter-group">
              <h4>Categories</h4>
              <div className="category-list">
                <button
                  className={`cat-filter-btn ${!selectedCategory ? 'active' : ''}`}
                  onClick={() => updateParam('category', '')}
                >
                  🛒 All Categories
                </button>
                {categories.map(cat => (
                  <button
                    key={cat._id}
                    className={`cat-filter-btn ${selectedCategory === cat.name ? 'active' : ''}`}
                    onClick={() => updateParam('category', cat.name)}
                  >
                    {CATEGORY_ICONS[cat.name] || '🛒'} {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Products */}
          <div className="products-content">
            {loading ? (
              <div className="products-grid">{[...Array(12)].map((_, i) => <div key={i} className="skeleton" style={{ height: 320, borderRadius: 14 }} />)}</div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🔍</div>
                <p className="empty-state-title">No products found</p>
                <p className="empty-state-text">Try adjusting your filters or search term</p>
                <button onClick={clearFilters} className="btn btn-primary">Clear Filters</button>
              </div>
            ) : (
              <>
                <div className="products-grid">{products.map(p => <ProductCard key={p._id} product={p} />)}</div>
                {pages > 1 && (
                  <div className="pagination">
                    {[...Array(pages)].map((_, i) => (
                      <button
                        key={i}
                        className={`page-btn ${page === i + 1 ? 'active' : ''}`}
                        onClick={() => updateParam('page', String(i + 1))}
                      >{i + 1}</button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
