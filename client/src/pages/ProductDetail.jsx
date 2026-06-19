import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, addReview } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/common/ProductCard';
import { FiHeart, FiShoppingCart, FiStar, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    getProductById(id)
      .then(res => { setProduct(res.data.product); setSimilar(res.data.similar); })
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleAddToCart = () => {
    addToCart(product._id, qty);
  };

  const handleBuyNow = async () => {
    await addToCart(product._id, qty);
    navigate('/cart');
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to review'); return; }
    setSubmitting(true);
    try {
      await addReview(id, { rating, comment });
      toast.success('Review submitted!');
      const res = await getProductById(id);
      setProduct(res.data.product);
      setComment('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
    setSubmitting(false);
  };

  const discount = product && product.discountPrice && product.price > product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;

  if (loading) return (
    <div className="container" style={{ padding: '40px 16px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
        <div className="skeleton" style={{ height: 400, borderRadius: 14 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton" style={{ height: 30, borderRadius: 8, width: i % 2 ? '60%' : '100%' }} />)}
        </div>
      </div>
    </div>
  );

  if (!product) return null;

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <span onClick={() => navigate('/')} className="breadcrumb-link">Home</span> /
          <span onClick={() => navigate('/products')} className="breadcrumb-link">Products</span> /
          <span onClick={() => navigate(`/products?category=${product.category}`)} className="breadcrumb-link">{product.category}</span> /
          <span>{product.name}</span>
        </div>

        {/* Main */}
        <div className="product-detail-grid">
          <div className="product-detail-image-wrap">
            {discount > 0 && <span className="discount-badge">{discount}% OFF</span>}
            <img
              src={product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600'}
              alt={product.name}
              className="product-detail-image"
              onError={e => { e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600'; }}
            />
          </div>

          <div className="product-detail-info">
            <span className="tag">{product.category}</span>
            <h1 className="product-detail-name">{product.name}</h1>

            <div className="product-detail-rating">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} className={i < Math.round(product.rating) ? 'star-filled' : 'star-empty'} />
              ))}
              <span>{product.rating?.toFixed(1) || '4.0'}</span>
              <span className="review-count-text">({product.numReviews} reviews)</span>
            </div>

            <div className="product-detail-price">
              <span className="detail-price-current">₹{product.discountPrice || product.price}</span>
              {discount > 0 && <>
                <span className="detail-price-original">₹{product.price}</span>
                <span className="detail-discount-label">Save ₹{product.price - product.discountPrice}</span>
              </>}
            </div>

            <p className="product-detail-desc">{product.description}</p>

            <div className="product-detail-meta">
              <div className="meta-item">
                <span className="meta-label">Unit:</span>
                <span className="meta-value">{product.unit}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Stock:</span>
                <span className={`meta-value ${product.stock > 0 ? 'in-stock' : 'out-stock'}`}>
                  {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                </span>
              </div>
            </div>

            {product.stock > 0 && (
              <div className="qty-selector">
                <span className="meta-label">Quantity:</span>
                <div className="qty-controls">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                  <span>{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}>+</button>
                </div>
              </div>
            )}

            <div className="product-detail-actions">
              <button className="btn btn-primary btn-lg" onClick={handleAddToCart} disabled={product.stock === 0}>
                <FiShoppingCart /> Add to Cart
              </button>
              <button className="btn btn-secondary btn-lg" onClick={handleBuyNow} disabled={product.stock === 0}>
                Buy Now
              </button>
              <button className={`wishlist-circle-btn ${isInWishlist(product._id) ? 'active' : ''}`} onClick={() => toggleWishlist(product._id)}>
                <FiHeart />
              </button>
            </div>

            <div className="product-guarantees">
              <div className="guarantee-item"><FiTruck /><span>Free delivery on orders above ₹499</span></div>
              <div className="guarantee-item"><FiShield /><span>100% genuine products</span></div>
              <div className="guarantee-item"><FiRefreshCw /><span>Easy 7-day return policy</span></div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="reviews-section">
          <h2 className="section-title">Customer Reviews</h2>

          {user && (
            <form className="review-form" onSubmit={handleReview}>
              <h4>Write a Review</h4>
              <div className="star-input">
                {[1, 2, 3, 4, 5].map(s => (
                  <button type="button" key={s} onClick={() => setRating(s)} className={`star-btn ${s <= rating ? 'active' : ''}`}>★</button>
                ))}
              </div>
              <textarea
                placeholder="Share your experience with this product..."
                value={comment}
                onChange={e => setComment(e.target.value)}
                className="form-input review-textarea"
                rows={3}
                required
              />
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )}

          <div className="reviews-list">
            {product.reviews?.length === 0 ? (
              <p className="no-reviews">No reviews yet. Be the first to review!</p>
            ) : product.reviews?.map((r, i) => (
              <div key={i} className="review-card">
                <div className="review-header">
                  <div className="reviewer-avatar">{r.name?.charAt(0).toUpperCase()}</div>
                  <div>
                    <p className="reviewer-name">{r.name}</p>
                    <div className="review-stars">
                      {[...Array(5)].map((_, j) => <span key={j} className={j < r.rating ? 'star-y' : 'star-g'}>★</span>)}
                    </div>
                  </div>
                </div>
                <p className="review-comment">{r.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Similar Products */}
        {similar.length > 0 && (
          <div className="similar-section">
            <h2 className="section-title">Similar Products</h2>
            <div className="products-grid">{similar.map(p => <ProductCard key={p._id} product={p} />)}</div>
          </div>
        )}
      </div>
    </div>
  );
}
