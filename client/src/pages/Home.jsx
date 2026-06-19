import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProducts, getCategories } from '../services/api';
import ProductCard from '../components/common/ProductCard';
import './Home.css';

const CATEGORY_ICONS = {
  'Fruits': '🍎', 'Vegetables': '🥦', 'Dairy & Milk': '🥛', 'Bread & Bakery': '🍞',
  'Rice & Grains': '🌾', 'Pulses & Dal': '🫘', 'Oil & Ghee': '🫙', 'Beverages': '🥤',
  'Tea & Coffee': '☕', 'Snacks': '🍿', 'Biscuits': '🍪', 'Instant Food': '🍜',
  'Frozen Food': '🧊', 'Spices': '🌶️', 'Dry Fruits': '🥜', 'Personal Care': '🧴',
  'Baby Care': '👶', 'Household Items': '🏠', 'Cleaning Products': '🧹', 'Pet Food': '🐾'
};

export default function Home() {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);
  const [topSelling, setTopSelling] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, topRes, catRes] = await Promise.all([
          getProducts({ featured: true, limit: 8 }),
          getProducts({ sort: 'rating', limit: 8 }),
          getCategories()
        ]);
        setFeatured(featuredRes.data.products);
        setTopSelling(topRes.data.products);
        setCategories(catRes.data.categories);
      } catch {}
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero-section">
        <div className="hero-content container">
          <div className="hero-text animate-fadeIn">
            <span className="hero-tag">🚀 Express Delivery in 2 Hours</span>
            <h1>Fresh Groceries<br /><span>Delivered to Your Door</span></h1>
            <p>Shop from 500+ fresh products — fruits, veggies, dairy, snacks & more at the best prices. Get it delivered fresh, fast!</p>
            <div className="hero-buttons">
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/products')}>Shop Now →</button>
              <Link to="/products?category=Fruits" className="btn btn-outline btn-lg">Fresh Fruits 🍎</Link>
            </div>
            <div className="hero-stats">
              <div className="stat"><strong>500+</strong><span>Products</span></div>
              <div className="stat-divider" />
              <div className="stat"><strong>2 Hrs</strong><span>Delivery</span></div>
              <div className="stat-divider" />
              <div className="stat"><strong>4.8★</strong><span>Rating</span></div>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-image-circle">
              <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600" alt="Fresh groceries" />
            </div>
            <div className="hero-floating-badge badge1">🍅 Organic</div>
            <div className="hero-floating-badge badge2">🚚 Free Delivery ₹499+</div>
            <div className="hero-floating-badge badge3">💯 Fresh</div>
          </div>
        </div>
      </section>

      {/* Promo Banners */}
      <section className="promo-section container">
        <div className="promo-grid">
          <div className="promo-card green" onClick={() => navigate('/products?category=Fruits')}>
            <div className="promo-text">
              <p className="promo-subtitle">Fresh & Organic</p>
              <h3>Fruits & Vegetables</h3>
              <p className="promo-discount">Up to 30% OFF</p>
              <button className="btn btn-sm" style={{ background: 'white', color: '#16a34a' }}>Shop Now →</button>
            </div>
            <span className="promo-emoji">🍎</span>
          </div>
          <div className="promo-card orange" onClick={() => navigate('/products?category=Dairy & Milk')}>
            <div className="promo-text">
              <p className="promo-subtitle">Farm Fresh</p>
              <h3>Dairy & Milk</h3>
              <p className="promo-discount">Starting ₹40</p>
              <button className="btn btn-sm" style={{ background: 'white', color: '#ea580c' }}>Shop Now →</button>
            </div>
            <span className="promo-emoji">🥛</span>
          </div>
          <div className="promo-card purple" onClick={() => navigate('/products?category=Dry Fruits')}>
            <div className="promo-text">
              <p className="promo-subtitle">Premium Quality</p>
              <h3>Dry Fruits & Nuts</h3>
              <p className="promo-discount">Up to 25% OFF</p>
              <button className="btn btn-sm" style={{ background: 'white', color: '#7c3aed' }}>Shop Now →</button>
            </div>
            <span className="promo-emoji">🥜</span>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">20+ categories of fresh groceries</p>
          </div>
          <Link to="/products" className="btn btn-outline btn-sm">View All →</Link>
        </div>
        <div className="categories-grid">
          {categories.map((cat) => (
            <Link to={`/products?category=${cat.name}`} key={cat._id} className="category-card">
              <span className="cat-icon">{CATEGORY_ICONS[cat.name] || cat.icon || '🛒'}</span>
              <p className="cat-name">{cat.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="container features-grid">
          {[
            { icon: '🚚', title: 'Free Delivery', desc: 'On orders above ₹499' },
            { icon: '🌿', title: '100% Fresh', desc: 'Farm to your doorstep' },
            { icon: '💰', title: 'Best Prices', desc: 'Lowest prices guaranteed' },
            { icon: '🔒', title: 'Secure Payment', desc: 'Razorpay encrypted checkout' }
          ].map((f, i) => (
            <div className="feature-card" key={i}>
              <span className="feature-icon">{f.icon}</span>
              <div><h4>{f.title}</h4><p>{f.desc}</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="products-section container">
        <div className="section-header">
          <div>
            <h2 className="section-title">⭐ Featured Products</h2>
            <p className="section-subtitle">Hand-picked best deals for you</p>
          </div>
          <Link to="/products?featured=true" className="btn btn-outline btn-sm">View All →</Link>
        </div>
        {loading ? (
          <div className="products-grid">{[...Array(8)].map((_, i) => <div key={i} className="skeleton" style={{ height: 320, borderRadius: 14 }} />)}</div>
        ) : (
          <div className="products-grid">{featured.map(p => <ProductCard key={p._id} product={p} />)}</div>
        )}
      </section>

      {/* Top Selling */}
      <section className="products-section container">
        <div className="section-header">
          <div>
            <h2 className="section-title">🔥 Top Selling</h2>
            <p className="section-subtitle">Most loved by our customers</p>
          </div>
          <Link to="/products?sort=rating" className="btn btn-outline btn-sm">View All →</Link>
        </div>
        {loading ? (
          <div className="products-grid">{[...Array(8)].map((_, i) => <div key={i} className="skeleton" style={{ height: 320, borderRadius: 14 }} />)}</div>
        ) : (
          <div className="products-grid">{topSelling.map(p => <ProductCard key={p._id} product={p} />)}</div>
        )}
      </section>

      {/* App Banner */}
      <section className="app-banner container">
        <div className="app-banner-inner">
          <div className="app-banner-text">
            <h2>Get ₹100 OFF on Your First Order! 🎉</h2>
            <p>Use code <strong>FRESH100</strong> at checkout. Valid for new users only.</p>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/products')}>Start Shopping →</button>
          </div>
          <div className="app-banner-emoji">🛒</div>
        </div>
      </section>
    </div>
  );
}
