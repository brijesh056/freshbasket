import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiStar } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const discount = product.discountPrice && product.price > product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className="product-card">
      {discount > 0 && <span className="discount-badge">{discount}% OFF</span>}
      <button
        className={`wishlist-btn ${isInWishlist(product._id) ? 'active' : ''}`}
        onClick={(e) => { e.preventDefault(); toggleWishlist(product._id); }}
      >
        <FiHeart />
      </button>

      <Link to={`/products/${product._id}`} className="product-image-link">
        <img
          src={product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400'}
          alt={product.name}
          className="product-image"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400'; }}
        />
      </Link>

      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <Link to={`/products/${product._id}`}>
          <h3 className="product-name">{product.name}</h3>
        </Link>
        <div className="product-rating">
          <FiStar className="star-icon" />
          <span>{product.rating?.toFixed(1) || '4.0'}</span>
          <span className="review-count">({product.numReviews || 0})</span>
        </div>
        <div className="product-price">
          <span className="price-current">₹{product.discountPrice || product.price}</span>
          {discount > 0 && <span className="price-original">₹{product.price}</span>}
        </div>
        {product.stock === 0 ? (
          <button className="add-cart-btn out-of-stock" disabled>Out of Stock</button>
        ) : (
          <button className="add-cart-btn" onClick={() => addToCart(product._id)}>
            <FiShoppingCart /> Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}
